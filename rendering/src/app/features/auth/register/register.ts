import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '@/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['../login/login.css']
})
export class Register {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  name = signal('');
  email = signal('');
  password = signal('');
  showPassword = signal(false);
  error = signal('');
  isLoading = signal(false);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (!this.name() || !this.email() || !this.password()) {
      this.error.set('All fields are required');
      return;
    }

    if (this.password().length < 6) {
      this.error.set('Password must be at least 6 characters');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    this.authService.register(this.name(), this.email(), this.password()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.success('Account created successfully! Welcome to Lumina 🎉');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Registration failed. Please try again.';
        this.error.set(msg);
        this.toastService.error(msg);
      },
    });
  }
}
