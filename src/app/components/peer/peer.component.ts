import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Peer from 'peerjs';

@Component({
  selector: 'app-peer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './peer.component.html',
  styleUrls: ['./peer.component.scss'],
})
export class PeerComponent {
  peer: Peer = new Peer();
  peerIdShare!: string;
  peerId!: string;
  lazyStream: any;
  currentPeer: any;
  peerList: any;
  ngOnInit() {
    this.getPeerId();
  }
  getPeerId(): void {
    //Generate unique Peer Id for establishing connection
    this.peer.on('open', (id) => {
      this.peerId = id;
      this.createURLToConnect(id);
    });
    // Peer event to accept incoming calls
    this.peer.on('call', (call) => {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          this.lazyStream = stream;
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            if (!this.peerList.includes(call.peer)) {
              this.streamRemoteVideo(remoteStream);
              this.currentPeer = call.peerConnection;
              this.peerList.push(call.peer);
            }
          });
        })
        .catch((err) => {
          console.log(err + 'Unable to get media');
        });
    });
  }
  connectWithPeer() {
    this.callPeer(this.peerIdShare);
  }
  createURLToConnect(id: any) {
    console.log('id :>> ', id);
  }
  private callPeer(id: string): void {
    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: true,
      })
      .then((stream) => {
        console.log('stream :>> ', stream);
        this.lazyStream = stream;
        const call = this.peer.call(id, stream);
        call.on('stream', (remoteStream) => {
          console.log('remoteStream :>> ', remoteStream);
          if (!this.peerList.includes(call.peer)) {
            this.streamRemoteVideo(remoteStream);
            this.currentPeer = call.peerConnection;
            this.peerList.push(call.peer);
          }
        });
      })
      .catch((err) => {
        console.log(err + 'Unable to connect');
      });
  }
  private streamRemoteVideo(stream: any) {
    console.log('stream :>> ', stream);
    const video = document.createElement('video');
    video.classList.add('video');
    video.srcObject = stream;
    video.play();
    document.getElementById('remote-video')?.append(video);
  }
  screenShare() {
    this.shareScreen();
  }
  private shareScreen() {
    // @ts-ignore
    navigator.mediaDevices
      .getDisplayMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
      .then((stream) => {
        const videoTrack = stream.getVideoTracks()[0];
        videoTrack.onended = () => {
          this.stopScreenShare();
        };
        const sender = this.currentPeer
          .getSenders()
          .find((s: any) => s.track.kind === videoTrack.kind);
        sender.replaceTrack(videoTrack);
      })
      .catch((err) => {
        console.log('Unable to get display media ' + err);
      });
  }
  private stopScreenShare() {
    const videoTrack = this.lazyStream.getVideoTracks()[0];
    const sender = this.currentPeer
      .getSenders()
      .find((s: any) => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);
  }
}
