import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { LoginResponseDto } from 'src/app/Models/LoginResponseDto';
import { UserForLoginDto } from 'src/app/Models/UserForLoginDto';
import { AuthenticationService } from 'src/app/Services/authentication.service';
@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.css']
})
export class LoginCardComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  showError: boolean;
  
  constructor(private authService: AuthenticationService, private router: Router,private dialogRef: MatDialogRef<LoginCardComponent>) { }
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      nickname: new FormControl(''),
      password: new FormControl(''),
    });
  }
  /**
   *
   */

  loginUser(userLogin:any){
    this.showError = false;
    const formValues = { ...userLogin };
    const user: UserForLoginDto = {
      nickname: formValues.nickname,
      password: formValues.password,
    };
    this.authService.loginUser(user)
    .subscribe({
      next: (res: LoginResponseDto) =>{
        localStorage.setItem("token", res.token);
        this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
        console.log("Successful login");
        
        this.closeModal()
      } ,
      error: (err: HttpErrorResponse) => {   
        console.log(err);  
        this.errorMessage = err.message;
        this.showError = true;}
    })
  }

  closeModal(): void {
    this.dialogRef.close({success: true}); // Closes the modal
  }
}
