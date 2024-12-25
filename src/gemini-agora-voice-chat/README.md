# Gemini-Agora Voice Chat MCP Server

A Model Context Protocol (MCP) server that enables real-time voice chat interactions between users and Google's Gemini AI using Agora's real-time communication platform.

## Features

- Real-time voice chat using Agora RTC
- AI-powered conversations using Google's Gemini
- Audio processing with noise removal and volume normalization
- WebSocket support for real-time updates
- REST API for session management
- Configurable audio settings and AI parameters

## Prerequisites

- Node.js >= 16
- Agora account and App ID
- Google Cloud account with Gemini API access
- FFmpeg >= 4.0 (for audio processing)

## Installation

```bash
npm install @modelcontextprotocol/server-gemini-agora-voice-chat
```

## Configuration

Create a `.env` file in your project root:

```env
# Agora Configuration
AGORA_APP_ID=your_app_id
AGORA_APP_CERTIFICATE=your_certificate
AGORA_PRIMARY_CERTIFICATE=your_primary_cert

# Gemini Configuration
GEMINI_API_KEY=your_api_key
GEMINI_PROJECT_ID=your_project_id

# Audio Configuration
AUDIO_SAMPLE_RATE=16000
AUDIO_CHANNELS=1
MAX_AUDIO_LENGTH=60
```

## Usage

### Starting the Server

```typescript
import GeminiAgoraVoiceChat from '@modelcontextprotocol/server-gemini-agora-voice-chat';

const config = {
  agora: {
    appId: process.env.AGORA_APP_ID,
    certificate: process.env.AGORA_APP_CERTIFICATE,
    channelProfile: 'live',
    clientRole: 'host'
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.0-flash-exp',
    temperature: 0.7,
    maxOutputTokens: 1024,
    safetySettings: []
  },
  audio: {
    sampleRate: 48000,
    channels: 1,
    codec: 'opus',
    bitrate: 48000
  }
};

const server = new GeminiAgoraVoiceChat(config);
server.start(3000);
```

### REST API Endpoints

#### Create Session
```http
POST /session/create
Content-Type: application/json

{
  "channelName": "test-channel",
  "userId": "123"
}
```

#### End Session
```http
DELETE /session/:sessionId
```

#### Start Voice Recording
```http
POST /voice/start
```

#### Stop Voice Recording
```http
POST /voice/stop
```

### WebSocket Events

Connect to the WebSocket server at `ws://localhost:8080`

#### Send Audio Data
```javascript
ws.send(JSON.stringify({
  type: 'audio',
  audio: audioData
}));
```

#### Send Text Message
```javascript
ws.send(JSON.stringify({
  type: 'text',
  text: 'Hello, Gemini!'
}));
```

#### Receive Response
```javascript
ws.onmessage = (event) => {
  const response = JSON.parse(event.data);
  console.log(response.text);
};
```

## Development

### Building from Source

```bash
git clone https://github.com/your-username/mcp-server-gemini-agora-voice-chat.git
cd mcp-server-gemini-agora-voice-chat
npm install
npm run build
```

### Running Tests

```bash
npm test
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

See [SECURITY.md](SECURITY.md) for reporting security vulnerabilities. 