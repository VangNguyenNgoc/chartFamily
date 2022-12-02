import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/services/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class FormLoginComponent implements OnInit {
  formLogin = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  token: string;
  errorMsg: string;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {}

  login() {
    if (this.formLogin.valid) {
      const username = this.formLogin.value.username || '';
      const password = this.formLogin.value.password || '';
      this.loginService.login(username, password).subscribe(
        (result) => {
          localStorage.setItem('token', result.token);
          localStorage.setItem('idAccount', result.idAccount);
          this.router.navigate(['/'], { relativeTo: this.route }).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          console.log(error);
          this.errorMsg = error.error.message;
        }
      );
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/'], { relativeTo: this.route }).then(() => {
      window.location.reload();
    });
  }
}
