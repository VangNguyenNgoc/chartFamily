import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
const SOCKET_ENDPOINT = 'localhost:3000';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: any;
  //   message!: string;
  setupSocketConnection() {
    this.socket = io.io(SOCKET_ENDPOINT);
    this.socket.emit('message', 'abc');
  }

  // receiveSocket() {
  //   this.socket = io.io(SOCKET_ENDPOINT);
  //   this.socket.on('messageReceive', (data: string) => {
  //     console.log('abc');
  //   });
  // }

  sendMessage(userSend: string, userReceive: string) {
    console.log('userSend', userSend);
    console.log('userReceive', userReceive);

    this.socket.emit('sendMessage', {
      userSend: userSend,
      userReceive: userReceive,
    });
  }

  messageReceived() {
    this.socket.on('messageReceived', function (data: any) {
      console.log('data.message', data.messageReceived);
    });
  }
}
