import { Component } from '@angular/core';
import Peer from 'peerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  peer!: Peer;
  call: any;
  remoteStream: MediaStream | null = null;
  ngOnInit(): void {
    this.peer = new Peer();
    this.peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });
    this.peer.on('call', (incomingCall) => {
      this.call = incomingCall;
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.call.answer(stream);
          this.setupRemoteStream();
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
        });
    });
  }
  private setupRemoteStream() {
    this.call.on('stream', (remoteStream: MediaStream) => {
      this.remoteStream = remoteStream;
      this.playRemoteAudio();
    });
  }
  playRemoteAudio() {
    if (this.remoteStream) {
      const audio = new Audio();
      audio.srcObject = this.remoteStream;
      audio.play();
    }
  }
  makeCall() {
    const remotePeerId = ''; // Peer ID of the caller
    const localStream: any = null; // Your local media stream (optional)
    this.call = this.peer.call(remotePeerId, localStream);
    this.setupRemoteStream();
  }
}
