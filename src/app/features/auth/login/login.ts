import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  showPassword = signal(false);
  error = signal('');
  isLoading = signal(false);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (!this.email() || !this.password()) {
      this.error.set('Please fill in all fields');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    // Simulate network delay
    setTimeout(() => {
      const success = this.authService.login(this.email(), this.password());
      this.isLoading.set(false);

      if (success) {
        this.router.navigate(['/']);
      } else {
        this.error.set('Invalid credentials. Hint: admin@luxury.com / admin123');
      }
    }, 800);
  }
}
