import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './features/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  // TODO: à supprimer quand le dark mode sera fonctionnel
  // darkMode: boolean = false;
  //
  // changeMode(): void {
  //   this.darkMode = !this.darkMode;
  // }
}
