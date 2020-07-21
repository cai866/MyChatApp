import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import { _ParseAST } from '@angular/compiler';
import io from 'socket.io-client';
import _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  users = [];
  loggedInUser: any; 
  userArr = []; //store the followed users by current logged in user
  socket: any;
  onlineusers: [];

  constructor(private usersService: UsersService,  private tokenService: TokenService, private router: Router) { 
      this.socket = io('http://localhost:3000');// connect to server
  }

  ngOnInit(): void {
    this.getUsers();
    this.getUserById();
    this.loggedInUser = this.tokenService.GetPayload(); //store the logged in user

    //refresh the people component
    this.socket.on('refreshPage', () => {
      this.getUsers();
      this.getUserById();
    });

  }

  viewUser(user) {

    this.router.navigate([user.username]);
    if(this.loggedInUser.username !== user.username) {
      this.usersService.profileNotifications(user._id).subscribe(
        data => {
          this.socket.emit('refresh', {});
        },
        err => console.log(err)
      );
    }

  }

  getUsers() {
      this.usersService.getAllUsers().subscribe(data => {
        _.remove(data.result, {username: this.loggedInUser.username}); //remove the logged in user from all users
        this.users = data.result; //store all users into user array
      });
  }

  //get the current logged in user's information
  getUserById(){
    this.usersService.getUserById(this.loggedInUser._id).subscribe(data => {
        //console.log(data);
        this.userArr = data.result.following; //obtain all users that the logged in user is currently  following 
    });
  }

  followUser(user){
      this.usersService.followUser(user._id).subscribe(data => {
        console.log(data);
        this.socket.emit('refresh', {}); //send a refresh event to server
      });
  }
  
  //check if the id exist in the arr
  checkInArray(arr, id){
      const result = _.find(arr,['userFollowed._id', id]);
      if(result) {
        return true;
      } else {
        return false;
      }
  }

  online(event) {
    this.onlineusers = event;
  }

  checkIfOnline(name) {
    
      const result = _.indexOf(this.onlineusers, name);
      if(result != -1){
         return true;
      }else{
          return false;
      }
     
  }


}
