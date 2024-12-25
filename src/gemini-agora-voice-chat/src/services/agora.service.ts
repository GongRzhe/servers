import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import AgoraRTC from 'agora-rtc-sdk';

export interface AgoraConfig {
  appId: string;
  appCertificate: string;
  channelName: string;
  uid: number;
}

export class AgoraService {
  private config: AgoraConfig;
  private client: any;

  constructor(config: AgoraConfig) {
    this.config = config;
    this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  }

  generateToken(role: number = RtcRole.PUBLISHER): string {
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    return RtcTokenBuilder.buildTokenWithUid(
      this.config.appId,
      this.config.appCertificate,
      this.config.channelName,
      this.config.uid,
      role,
      privilegeExpiredTs
    );
  }

  async join() {
    try {
      await this.client.join(
        this.config.appId,
        this.config.channelName,
        this.generateToken(),
        this.config.uid
      );
      console.log('Joined channel successfully');
    } catch (error) {
      console.error('Error joining channel:', error);
      throw error;
    }
  }

  async leave() {
    try {
      await this.client.leave();
      console.log('Left channel successfully');
    } catch (error) {
      console.error('Error leaving channel:', error);
      throw error;
    }
  }

  // Add methods for managing channel state
  getChannelInfo() {
    return {
      appId: this.config.appId,
      channelName: this.config.channelName,
      uid: this.config.uid
    };
  }

  // Add methods for managing user roles and permissions
  updateUserRole(uid: number, role: number) {
    // TODO: Implement role management logic
    return {
      uid,
      role,
      channelName: this.config.channelName
    };
  }
} 