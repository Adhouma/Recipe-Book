import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginMode = true;
  isLoading = false;
  error = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }

  onSubmit(authForm: NgForm) {
    const email = authForm.value.email;
    const password = authForm.value.password;

    this.isLoading = true;

    if (this.loginMode) {
      // Login mode
      this.authService.login(email, password).subscribe(
        responseData => {
          this.isLoading = false;
          this.router.navigate(['/recipes']);
        },errorMessage => {
          this.error = errorMessage;
          this.isLoading = false;
        }
      )
    } else {
      // SignUp mode
      this.authService.signUp(email, password).subscribe(
        responseData => {
          this.isLoading = false;
          this.router.navigate(['/recipes']);
        }, errorMessage => {
          this.error = errorMessage;
          this.isLoading = false;
        }
      );
    }
    authForm.reset();
  }

}
