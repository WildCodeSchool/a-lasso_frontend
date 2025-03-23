import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './features/header/header.component';
import { FooterComponent } from './features/footer/footer.component';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, RouterOutlet, HeaderComponent, FooterComponent, Toast],
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
