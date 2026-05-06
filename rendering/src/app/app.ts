import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { Header } from "./shared/components/header/header";
import { ZardToastComponent } from './shared/components/toast';
import { AdminSidebar } from './features/admin/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, ZardToastComponent, AdminSidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);

  isAdminRoute = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => e.url.startsWith('/admin')),
      startWith(this.router.url.startsWith('/admin'))
    ),
    { initialValue: false }
  );
}
