import { Component, OnInit, AfterViewInit, Output } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit{

  socket: any;
  user: any;
  notifications = [];
  count=[];
  chatList=[];
  msgNum = 0;
  imageId: any;
  imageVersion: any;

  @Output() onlineUsers = new EventEmitted();
  constructor(private messageService: MessageService, private tokenServic: TokenService, private router: Router, private usersService: UsersService) { 
      this.socket = io('http://localhost:3000'); // connect to server
  }

  ngOnInit(): void {
    this.user = this.tokenServic.GetPayload();
    console.log(this.user);

    const dropDownElement = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropDownElement, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    const dropDownElementOne = document.querySelectorAll('.dropdown-trigger1');
    M.Dropdown.init(dropDownElementOne, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    this.socket.emit('online', {room: 'global', user: this.user.username});

    this.getUser();

    this.socket.on('refreshPage', () => {
      this.getUser();
    });

  }

  ngAfterViewInit(){
    this.socket.on('usersOnline', data => {
      this.onlineUsers.emit(data);
    });
  }

//if click logout button, delete current token and navigate to other page
  logout(){
    this.tokenServic.DeleteToken();
    this.router.navigate(['']);
  }

  goToChatPage(name){
      this.router.navigate(['chat', name]);
      this.messageService.markReceiverMessage(this.user.username, name).subscribe(data => {
          console.log(data);
          this.socket.emit('refresh', {}); //send a refresh event to server
      });
  }

  goToHome(){
    this.router.navigate(['streams']);
  }

   //return the time from creating post  upto now
   TimeFromNow(time){
    return moment(time).fromNow();
  }

  //get all notifications all currently logged in user
  getUser() {
    this.usersService.getUserById(this.user._id).subscribe(
      data => {
        this.imageId = data.result.picId;
        this.imageVersion = data.result.picVersion;
        this.notifications = data.result.notifications.reverse();
        this.chatList = data.result.chatList;
        const value = _.filter(this.notifications, ['read', false]);
        this.count = value;
        this.checkIfRead(this.chatList);
      },
      err => {
        if (err.console.error.token === null){
          this.tokenServic.DeleteToken();
          this.router.navigate(['']);
        }     
      }
    );
  }

  checkIfRead(arr){
    const checkArr = [];
    for(let i=0; i<arr.length;i++){
        const receiver = arr[i].msgId.message[arr[i].msgId.message.length-1];
        if(this.router.url !== '/chat/${receiver.sendername}'){
          if(receiver.isRead === false && receiver.receivername === this.user.username){
             checkArr.push(1);
             this.msgNum = _.sum(checkArr);
          }
        }
    }
  }

  markAllMessages() {
    this.messageService.markAllMessages().subscribe(data => {
      console.log(data);
      this.socket.emit('refresh', {}); //send a refresh event to server
      this.msgNum = 0;
    });
  }

  markAllNotifications() {
    this.usersService.markAllNotifications().subscribe(
      data => {
        console.log(data);
        this.socket.emit('refresh', {}); //send a refresh event to server
      }
    );
  }

  messageDate(data) {
    return moment(data).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      lastMonth: '',
    })
  }

}
