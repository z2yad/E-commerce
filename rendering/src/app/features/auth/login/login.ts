import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '@/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  showPassword = signal(false);
  error = signal('');
  isLoading = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    const { email, password } = this.loginForm.value;

    this.authService.loginWithApi(email!, password!).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.success('Welcome back!');
        const user = this.authService.currentUser();
        this.router.navigate([user?.role === 'admin' ? '/admin' : '/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Invalid email or password.';
        this.error.set(msg);
        this.toastService.error('Authentication failed');
      },
    });
  }
}
