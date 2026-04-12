import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['../login/login.css'] // Reusing login animations
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = signal('');
  email = signal('');
  password = signal('');
  error = signal('');
  isLoading = signal(false);

  onSubmit() {
    if (!this.name() || !this.email() || !this.password()) {
      this.error.set('All fields are required');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    setTimeout(() => {
      const success = this.authService.register(this.name(), this.email());
      this.isLoading.set(false);

      if (success) {
        this.router.navigate(['/']);
      } else {
        this.error.set('Email already registered');
      }
    }, 800);
  }
}
