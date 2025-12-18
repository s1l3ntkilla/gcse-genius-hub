import { supabase } from '@/integrations/supabase/client';

export interface PeerConnection {
  peerId: string;
  peerName: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

type SignalHandler = (peerId: string, peerName: string, stream: MediaStream | null) => void;

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
];

export class WebRTCManager {
  private lessonId: string;
  private userId: string;
  private userName: string;
  private localStream: MediaStream | null = null;
  private peerConnections: Map<string, PeerConnection> = new Map();
  private onRemoteStream: SignalHandler;
  private onPeerDisconnected: (peerId: string) => void;
  private signalChannel: ReturnType<typeof supabase.channel> | null = null;

  constructor(
    lessonId: string,
    userId: string,
    userName: string,
    onRemoteStream: SignalHandler,
    onPeerDisconnected: (peerId: string) => void
  ) {
    this.lessonId = lessonId;
    this.userId = userId;
    this.userName = userName;
    this.onRemoteStream = onRemoteStream;
    this.onPeerDisconnected = onPeerDisconnected;
  }

  async initialize(): Promise<MediaStream | null> {
    console.log('[WebRTC] Initializing...');
    
    // Set up realtime subscription for signals
    await this.setupSignaling();
    
    // Get local media stream
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      console.log('[WebRTC] Got local stream:', this.localStream.id);
      return this.localStream;
    } catch (error) {
      console.error('[WebRTC] Error getting media devices:', error);
      return null;
    }
  }

  private async setupSignaling() {
    console.log('[WebRTC] Setting up signaling channel...');
    
    // Subscribe to signals directed at this user
    this.signalChannel = supabase
      .channel(`webrtc-signals-${this.lessonId}-${this.userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'webrtc_signals',
          filter: `to_user_id=eq.${this.userId}`
        },
        async (payload) => {
          const signal = payload.new as any;
          if (signal.lesson_id !== this.lessonId) return;
          
          console.log('[WebRTC] Received signal:', signal.signal_type, 'from:', signal.from_user_id);
          await this.handleSignal(signal);
        }
      )
      .subscribe();

    // Process any pending signals
    const { data: pendingSignals } = await supabase
      .from('webrtc_signals')
      .select('*')
      .eq('lesson_id', this.lessonId)
      .eq('to_user_id', this.userId)
      .order('created_at', { ascending: true });

    if (pendingSignals) {
      for (const signal of pendingSignals) {
        await this.handleSignal(signal);
      }
    }
  }

  private async handleSignal(signal: any) {
    const { from_user_id, signal_type, signal_data } = signal;
    
    switch (signal_type) {
      case 'offer':
        await this.handleOffer(from_user_id, signal_data.peerName, signal_data.sdp);
        break;
      case 'answer':
        await this.handleAnswer(from_user_id, signal_data.sdp);
        break;
      case 'ice-candidate':
        await this.handleIceCandidate(from_user_id, signal_data.candidate);
        break;
    }

    // Clean up processed signal
    await supabase
      .from('webrtc_signals')
      .delete()
      .eq('id', signal.id);
  }

  async connectToPeer(peerId: string, peerName: string): Promise<void> {
    if (this.peerConnections.has(peerId) || peerId === this.userId) return;
    
    console.log('[WebRTC] Connecting to peer:', peerId, peerName);
    
    const pc = this.createPeerConnection(peerId, peerName);
    
    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    await this.sendSignal(peerId, 'offer', {
      sdp: pc.localDescription,
      peerName: this.userName
    });
  }

  private createPeerConnection(peerId: string, peerName: string): RTCPeerConnection {
    console.log('[WebRTC] Creating peer connection for:', peerId);
    
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    
    const peerConnection: PeerConnection = {
      peerId,
      peerName,
      connection: pc
    };
    
    this.peerConnections.set(peerId, peerConnection);

    // Add local tracks to the connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log('[WebRTC] Sending ICE candidate to:', peerId);
        await this.sendSignal(peerId, 'ice-candidate', {
          candidate: event.candidate
        });
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('[WebRTC] Received remote track from:', peerId);
      const remoteStream = event.streams[0];
      peerConnection.stream = remoteStream;
      this.onRemoteStream(peerId, peerName, remoteStream);
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('[WebRTC] Connection state with', peerId, ':', pc.connectionState);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this.removePeer(peerId);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC] ICE state with', peerId, ':', pc.iceConnectionState);
    };

    return pc;
  }

  private async handleOffer(peerId: string, peerName: string, sdp: RTCSessionDescriptionInit) {
    console.log('[WebRTC] Handling offer from:', peerId);
    
    let pc: RTCPeerConnection;
    const existing = this.peerConnections.get(peerId);
    
    if (existing) {
      pc = existing.connection;
    } else {
      pc = this.createPeerConnection(peerId, peerName);
    }
    
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    await this.sendSignal(peerId, 'answer', {
      sdp: pc.localDescription
    });
  }

  private async handleAnswer(peerId: string, sdp: RTCSessionDescriptionInit) {
    console.log('[WebRTC] Handling answer from:', peerId);
    
    const peerConnection = this.peerConnections.get(peerId);
    if (!peerConnection) return;
    
    await peerConnection.connection.setRemoteDescription(new RTCSessionDescription(sdp));
  }

  private async handleIceCandidate(peerId: string, candidate: RTCIceCandidateInit) {
    console.log('[WebRTC] Handling ICE candidate from:', peerId);
    
    const peerConnection = this.peerConnections.get(peerId);
    if (!peerConnection) return;
    
    try {
      await peerConnection.connection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('[WebRTC] Error adding ICE candidate:', error);
    }
  }

  private async sendSignal(toUserId: string, signalType: string, signalData: any) {
    try {
      await supabase
        .from('webrtc_signals')
        .insert({
          lesson_id: this.lessonId,
          from_user_id: this.userId,
          to_user_id: toUserId,
          signal_type: signalType,
          signal_data: signalData
        });
    } catch (error) {
      console.error('[WebRTC] Error sending signal:', error);
    }
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  private removePeer(peerId: string) {
    const peer = this.peerConnections.get(peerId);
    if (peer) {
      peer.connection.close();
      this.peerConnections.delete(peerId);
      this.onPeerDisconnected(peerId);
    }
  }

  getRemoteStreams(): Map<string, PeerConnection> {
    return this.peerConnections;
  }

  async cleanup() {
    console.log('[WebRTC] Cleaning up...');
    
    // Close all peer connections
    this.peerConnections.forEach((peer) => {
      peer.connection.close();
    });
    this.peerConnections.clear();

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Unsubscribe from signals
    if (this.signalChannel) {
      await supabase.removeChannel(this.signalChannel);
    }

    // Clean up any remaining signals
    await supabase
      .from('webrtc_signals')
      .delete()
      .eq('from_user_id', this.userId)
      .eq('lesson_id', this.lessonId);
  }
}
