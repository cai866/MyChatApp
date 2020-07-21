import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  sendMessage(senderId, receiverId, receiverName, message): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/chat-message/${senderId}/${receiverId}', {
      receiverId, 
      receiverName, 
      message
    });
  }

  getAllMessage(senderId, receiverId): Observable<any> {
    return this.http.get('http://localhost:3000/api/chatapp/chat-message/${senderId}/${receiverId}');
  }

  markReceiverMessage(sender, receiver): Observable<any> {
    return this.http.get('http://localhost:3000/api/chatapp/receiver-messages/${sender}/${receiver}');
  }

  markAllMessages(): Observable<any> {
    return this.http.get('http://localhost:3000/api/chatapp/mark-all-messages');
  }
  
}

