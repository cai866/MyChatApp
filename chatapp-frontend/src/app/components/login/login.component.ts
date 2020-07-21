import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string;
  showSpinner = false;

  constructor(
    private fb: FormBuilder,  
    private router: Router, 
    private authService: AuthService,
    private tokenService: TokenService
    ) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    //init loginForm variable
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', , Validators.required]
    });
  }

  loginUser(){
    this.showSpinner=true;
    console.log(this.loginForm.value);
    this.authService.loginUser(this.loginForm.value).subscribe(data => {
      //login successfully
        console.log(data);
        //store the token of login user into tokenService
        this.tokenService.SetToken(data.token);
        //reset login form
        this.loginForm.reset();
        //if login successfully, will go to '.../streams' path after 2s
        setTimeout(() => {
          this.router.navigate(['streams']); 
        }, 2000)
         
    }, err => {
      //if login failed 
      this.showSpinner=false;
      //if the error caused dabase data repeat conflict 
      if(err.error.message){
        this.errorMessage = err.error.message;
      }  
    });
  }

}
