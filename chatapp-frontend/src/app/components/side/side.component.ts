import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';


@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit {

  socket: any;
  user: any;
  userData: any;


  constructor(private usersService: UsersService,  private tokenService: TokenService) {
        this.socket = io('http://localhost:3000');// connect to server
   }

  ngOnInit(): void {

    this.user = this.tokenService.GetPayload(); //store the logged in user

    this.getUserById();

    //refresh the people component
    this.socket.on('refreshPage', () => {
      this.getUserById();
    });
    
  }

    //get the current logged in user's information
    getUserById(){
      this.usersService.getUserById(this.user._id).subscribe(data => {
          //console.log(data);
          this.userData = data.result; //obtain all users that the logged in user is currently  following 
      });
    }

}
