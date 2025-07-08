import { Component, inject, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../features/authentication/services/auth.service';
import { BadgeComponent } from '../badge/badge.component';
import { ReportFacadeService } from '../../../features/report/services/report-facade.service';

@Component({
  selector: 'app-header-menu-reports',
  imports: [AsyncPipe, BadgeComponent],
  templateUrl: './header-menu-reports.component.html',
  styleUrl: './header-menu-reports.component.scss',
})
export class HeaderMenuReportsComponent {
  private _authService: AuthService = inject(AuthService);
  private _reportFacade: ReportFacadeService = inject(ReportFacadeService);
  router: Router = inject(Router);

  @Input() isOpenMenu!: boolean;
  isAdmin$: Observable<boolean> = this._authService.isAdminUser();

  countGlobalReportsNotifications$: Observable<number> = this._reportFacade.getCountGlobalReportsNotifications();
}
