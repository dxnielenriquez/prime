import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ShareModule} from "../../share.module";
import {AuthService} from "../../services/auth.service";
import {ToastModule} from "primeng/toast";
import {PrimeModule} from "../../prime/prime.module";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PrimeModule, ShareModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(["/administracion/listado-registros"]).then();
    }
    this.loginForm = this.fb.group({
      email: ['reclutamiento@informaticaelectoral.com', [Validators.required, Validators.email]],
      password: ['J355IC4C0V4RRUBI05**', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  submit() {
    let controls = this.loginForm.controls;
    if (this.loginForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        controls[controlName].markAsDirty();
      })

      return;
    }
    this.loading = true;
    const loginData = this.loginForm.value;
    this.authService.login(loginData)
      .subscribe({
        next: () => {
          window.location.reload()
        }
      })
  }


  isControlHasError(controlName: string, validationType: string): boolean {
    let control = this.loginForm.controls[controlName];
    if (!control) {
      return false;
    }
    return control.hasError(validationType) && (control.dirty);
  }
}
