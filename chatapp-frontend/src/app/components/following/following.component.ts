import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';
import _ from 'lodash';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {

  followings = [];
  user: any;
  socket: any;

  constructor(private usersService: UsersService,  private tokenService: TokenService) { 
      this.socket = io('http://localhost:3000');// connect to server
  }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.getUser();

    //refresh the people component
    this.socket.on('refreshPage', () => {
      this.getUser();
    });

  }

  //get user by id
  getUser() {
      this.usersService.getUserById(this.user._id).subscribe(data => {
        console.log(data);
          this.followings = data.result.following; //get the followed users that is followed by currently logged in user
      },
      err => console.log(err)
    );
  }

  //unfollow the user
  unFollow(user) {
    this.usersService.unFollowUser(user._id).subscribe(data => {
        console.log(data);
        this.socket.emit('refresh', {}); //send a refresh event to server
    });
  }

}
