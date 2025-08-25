import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToggleMenuComponent } from 'src/app/common/components/toggle-menu/toggle-menu.component';
import { NavigationItems } from 'src/app/common/models/toggle-menu';

@Component({
  selector: 'app-activity-menu',
  imports: [CommonModule, ToggleMenuComponent],
  templateUrl: './activity-menu.component.html',
  styleUrl: './activity-menu.component.scss',
  standalone: true,
})
export class ActivityMenuComponent {
  @Input() title = '';
  @Input() navigationItems: NavigationItems[] = [];
  @Input() activeTab: number = 0;
  @Output() tabChange = new EventEmitter<string>();

  onTabChange(tab: string): void {
    this.tabChange.emit(tab);
  }
}
