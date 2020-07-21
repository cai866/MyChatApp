import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { TokenService } from 'src/app/services/token.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import { CaretEvent, EmojiEvent } from 'ng2-emoji-picker';
import _ from 'lodash';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit, OnChanges{
  @Input('all') users;
  receiver: any;
  receiverData: any;
  message: string;
  user: any;
  messagesArray = [];
  socket: any;
  typingMessage;
  typing = false;
  usersArray = [];
  isOnline = false;

  //from ng2-emoji
  public eventMock;
  public eventPosMock;

  public direction = Math.random() > 0.5 ? (Math.random() > 0.5 ? 'top' : 'bottom') : (Math.random() > 0.5 ? 'right' : 'left');
  public toggled = false;
  public content = ' ';

  private _lastCaretEvent: CaretEvent;


  constructor(
    private messageService: MessageService,  
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private userService: UsersService
    ) {
      this.socket = io('http://localhost:3000');// connect to server
     }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.route.params.subscribe(params => {
        this.receiver = params.name;
        this.getUserByUsername(this.receiver);

       //refresh the people component
        this.socket.on('refreshPage', () => {
          this.getUserByUsername(this.receiver);
        });
      });

      this.usersArray = this.usersArray;
      console.log(this.usersArray);

      this.socket.on('is_typing', data => {
        if(data.sender === this. receiver){
          this.typing = true;
        }
      });

      this.socket.on('has_stopped_typing', data => {
        if(data.sender === this. receiver){
          this.typing = false;
        }
      });

  }

  ngAfterViewInit() {
    const params = {
      room1: this.user.username,
      room2: this.receiver
    };

    this.socket.emit('join chat', params);
  }

  ngOnChanges(changes: SimpleChanges) {
    const title = document.querySelector('.nameCol');

    if(changes.users.currentValue.length > 0){
     const result = _.indexOf(changes.users.currentValue, this.receiver);
     if(result != -1){
        this.isOnline = true;
        (title as HTMLElement).style.marginTop = '10px';
     }else{
        this.isOnline = false;
        (title as HTMLElement).style.marginTop = '20px';
     }
    }
  }

  getUserByUsername(name) {
    this.userService.getUserByUsername(name).subscribe(data => {
      this.receiverData = data.result;
      this.getAllMessages(this.user._id, data.result._id);
    });
  }

  sendMessage() {
    this.messageService.sendMessage(this.user._id,this.receiverData._id,this.receiverData.username,this.message)
    .subscribe(data => {
      this.message = "";
      this.socket.emit('refresh', {}); //send a refresh event to server
    });
  }

  getAllMessages(senderId, receiverId) {
    this.messageService.getAllMessage(senderId, receiverId).subscribe(data => {
      this.messagesArray = data.message.result;
    });
  }
  
  //from ng2-emoji
  handleSelection(event: EmojiEvent) {
    this.content = this.content.slice(0, this._lastCaretEvent.caretOffset) + event.char + this.content.slice(this._lastCaretEvent.caretOffset);
    this.eventMock = JSON.stringify(event);

    this.message = this.content;
    this.toggled = !this.toggled;
    this.content = '';
  }

  handleCurrentCaret(event: CaretEvent) {
    this._lastCaretEvent = event;
    this.eventPosMock = `{ caretOffset : ${event.caretOffset}, caretRange: Range{...}, textContent: ${event.textContent} }`;
  }

  Toggled() {
    this.toggled = !this.toggled;
  }

  isTyping() {
      this.socket.emit('start_typing', {
        sender: this.user.username,
        receiver: this.receiver
      });

      if(this.typingMessage) {
        clearTimeout(this.typingMessage);
      }

      this.typingMessage = setTimeout(() => {
        this.socket.emit('stop_typing', {
          sender: this.user.username,
          receiver: this.receiver
        });
      }, 500);
  }

}
