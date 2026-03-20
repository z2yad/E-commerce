import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./shared/components/header/header";
import { ZardToastComponent } from './shared/components/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header,ZardToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('rendering');
}
