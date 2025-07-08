import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tab, TabList, Tabs } from 'primeng/tabs';
import { NavigationItems } from '../../models/toggle-menu';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-toggle-menu',
  imports: [Tabs, TabList, Tab, BadgeComponent],
  templateUrl: './toggle-menu.component.html',
  styleUrl: './toggle-menu.component.scss',
})
export class ToggleMenuComponent {
  @Output() chosenTab: EventEmitter<string> = new EventEmitter<string>();
  @Input() tabs!: NavigationItems[];
  @Input() activeTabValue!: number;

  updateNavigation(tabIndex: number): void {
    this.activeTabValue = tabIndex;
    this.chosenTab.emit(this.tabs[tabIndex].name);
  }
}
