import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { AgoraService } from './services/agora.service';
import { GeminiService } from './services/gemini.service';
import { AudioProcessor } from './services/audio.service';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const wsPort = process.env.WS_PORT || 8080;

// Initialize services
const agoraService = new AgoraService({
  appId: process.env.AGORA_APP_ID!,
  appCertificate: process.env.AGORA_PRIMARY_CERTIFICATE!,
  channelName: 'default-channel',
  uid: 0
});

const geminiService = new GeminiService({
  apiKey: process.env.GEMINI_API_KEY!,
  projectId: process.env.GEMINI_PROJECT_ID!
});

const audioProcessor = new AudioProcessor();

// Express routes
app.use(express.json());

app.post('/session/create', async (req, res) => {
  try {
    const token = agoraService.generateToken();
    const channelInfo = agoraService.getChannelInfo();
    res.json({ token, channelInfo });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// WebSocket server
const wss = new WebSocketServer({ port: Number(wsPort) });

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  ws.on('message', async (message: string) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'audio':
          // Process audio data
          const audioText = await audioProcessor.processAudio(data.audio);
          const response = await geminiService.generateResponse(audioText);
          const audioResponse = await audioProcessor.textToSpeech(response);
          
          ws.send(JSON.stringify({
            type: 'audio_response',
            audio: audioResponse
          }));
          break;
          
        case 'join':
          // Handle join request
          await agoraService.join();
          ws.send(JSON.stringify({
            type: 'joined',
            channelInfo: agoraService.getChannelInfo()
          }));
          break;
          
        case 'leave':
          // Handle leave request
          await agoraService.leave();
          ws.send(JSON.stringify({
            type: 'left'
          }));
          break;
          
        default:
          console.warn('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        error: 'Failed to process message'
      }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start server
app.listen(port, () => {
  console.log(`HTTP server listening on port ${port}`);
  console.log(`WebSocket server listening on port ${wsPort}`);
}); 