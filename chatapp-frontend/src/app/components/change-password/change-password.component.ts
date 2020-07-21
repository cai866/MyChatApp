import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UsersService) { }

  ngOnInit(): void {
    this.Init();
  }

  Init() {
    this.passwordForm = this.fb.group({
      cpassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },{
      validators: this.Validate.bind(this)
    });
  }

  changePassword() {
    this.userService.changePassword(this.passwordForm.value).subscribe(
      data => {
        //this.passwordForm.reset();
        console.log(data);
      },
      err => console.log(err)
    );
  }

  Validate(passwordFormGroup: FormGroup) {
    const new_password = passwordFormGroup.controls.newPassword.value;
    const confirm_password = passwordFormGroup.controls.confirmPassword.value;

    if(confirm_password.length <= 0) {
      return null;
    }

    if(confirm_password !== new_password) {
      return {
        doesNotMatch: true
      };
    }

    return null;
  }

}
