import { Component, inject, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { FooterComponent } from './common/components/footer/footer.component';
import { HeaderComponent } from './common/components/header/header.component';
import { ProgressBar } from 'primeng/progressbar';
import { AuthFacade } from './features/authentication/services/auth-facade.service';
import { filter } from 'rxjs/operators';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, RouterOutlet, HeaderComponent, FooterComponent, Toast, ProgressBar, ConfirmDialog],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private _router: Router = inject(Router);
  private _authFacade = inject(AuthFacade);
  loading = false;

  ngOnInit(): void {
    this._authFacade.getUserByToken();
    this._handleRouterEvents();
    this._applySavedTheme();
  }

  private _applySavedTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  private _handleRouterEvents(): void {
    this._router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError
        )
      )
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.loading = true;
        } else {
          this.loading = false;
        }

        if (event instanceof NavigationEnd) {
          if (event.urlAfterRedirects.startsWith('/activity/create') || event.urlAfterRedirects.startsWith('/activity/edit')) {
            document.body.classList.add('allow-scroll');
          } else {
            document.body.classList.remove('allow-scroll');
          }
        }
      });
  }

  toggleDarkMode(): void {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
