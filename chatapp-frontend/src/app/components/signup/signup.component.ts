import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {Router} from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  errorMessage: string; //store error message sent from server
  signupForm: FormGroup;
  showSpinner = false;
  constructor(
    private authService: AuthService, 
    private fb: FormBuilder, 
    private router: Router,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', , Validators.required]
    });
  }

  signupUser() {
    this.showSpinner=true;
    console.log(this.signupForm.value);
    this.authService.registerUser(this.signupForm.value).subscribe(data => {
        console.log(data);
        this.tokenService.SetToken(data.token);
        this.signupForm.reset();
        setTimeout(() => {
          this.router.navigate(['streams']); //if sign up successfully, will go to '.../streams' path after 2s
        }, 2000)
         
    }, err => {
      this.showSpinner=false;
      console.log(err);
      //if the error come from Joi
      if(err.error.msg){
        this.errorMessage=err.error.msg[0].message;
      }
      //if the error caused dabase data repeat conflict 
      if(err.error.message){
        this.errorMessage = err.error.message;
      }  
    });
  }

}
