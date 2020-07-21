import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import * as moment from 'moment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  socket: any;
  notifications = [];
  user: any;

  constructor(private usersService: UsersService,  private tokenService: TokenService) { 
    this.socket = io('http://localhost:3000'); // connect to server
  }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.getUser();

    //refresh the people component
    this.socket.on('refreshPage', () => {
      this.getUser();
    });

  }
  //get all notifications of currently logged in user
  getUser(){

    this.usersService.getUserById(this.user._id).subscribe(
      data => {
        this.notifications = data.result.notifications.reverse();
      },
    );

  }

   //return the time from creating post  upto now
   TimeFromNow(time){
    return moment(time).fromNow();
  }

  markNotification(notification) {
      this.usersService.markNotification(notification._id).subscribe(data => {
        this.socket.emit('refresh', {}); //send a refresh event to server
      });
  }

  deleteNotification(notification) {
        this.usersService.markNotification(notification._id, true).subscribe(data => {
          this.socket.emit('refresh', {}); //send a refresh event to server
        });
  }

}
