import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  // TODO: à supprimer quand le dark mode sera fonctionnel
  // darkMode: boolean = false;
  // changeMode(): void {
  //   this.darkMode = !this.darkMode;
  // }
}
