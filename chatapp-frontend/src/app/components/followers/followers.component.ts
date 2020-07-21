import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {

  followers = [];
  user: any;
  socket: any;

  constructor(private usersService: UsersService,  private tokenService: TokenService) {
    
      this.socket = io('http://localhost:3000');// connect to server
   }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.getFollowers();

     //refresh the people component
     this.socket.on('refreshPage', () => {
        this.getFollowers();
    });


  }

  getFollowers(){
    this.usersService.getUserById(this.user._id).subscribe(
      data => {
        this.followers = data.result.followers
        console.log(this.followers);
      },
      err => console.log(err)
    );
  }

}
