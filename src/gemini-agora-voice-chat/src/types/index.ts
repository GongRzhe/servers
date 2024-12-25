import { GenerativeModel, SafetySetting } from '@google/generative-ai';

export interface AgoraConfig {
  appId: string;
  primaryCertificate: string;
  channelProfile: 'live' | 'communication';
  clientRole: 'host' | 'audience';
}

export interface AudioData {
  data: Buffer;
  sampleRate: number;
  channels: number;
}

export interface AudioStream {
  id: string;
  data: AudioData;
}

export interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxOutputTokens: number;
  safetySettings: SafetySetting[];
}

export interface SystemConfig {
  port: number;
  wsPort: number;
}

export interface SessionConfig {
  channelName: string;
  uid: number;
  role: 'publisher' | 'subscriber';
}

export interface ErrorHandling {
  code: number;
  message: string;
  details?: any;
}

export interface ResourceManagement {
  maxSessions: number;
  maxUsersPerChannel: number;
  channelTimeout: number;
}

export interface WebSocketMessage {
  type: 'join' | 'leave' | 'audio' | 'token' | 'error';
  channelName?: string;
  uid?: number;
  data?: any;
  message?: string;
}

export interface TokenResponse {
  token: string;
  appId: string;
}

export interface VoiceChatSession {
  channelName: string;
  uid: number;
  chat: any; // Gemini chat instance
  active: boolean;
  createdAt: number;
  lastActivity: number;
} 