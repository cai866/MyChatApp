import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { TokenService } from './services/token.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private router: Router, private tokenService: TokenService) {}
  ngOnInit() {
    //if user have token, will login automatically
    const token = this.tokenService.GetToken();
    if(token!=null) { //?????????
      this.router.navigate(['streams']);
    }
    //else cannot login
    else{
      this.router.navigate(['']);
    }
  }

} 
