import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tab, TabList, Tabs } from 'primeng/tabs';

@Component({
  selector: 'app-toggle-menu',
  imports: [Tabs, TabList, Tab],
  templateUrl: './toggle-menu.component.html',
  styleUrl: './toggle-menu.component.scss',
})
export class ToggleMenuComponent {
  @Input() tabs!: string[];
  @Input() activeTabValue!: number;
  @Output() chosenTab: EventEmitter<string> = new EventEmitter<string>();

  updateNavigation(tabIndex: number): void {
    this.activeTabValue = tabIndex;
    this.chosenTab.emit(this.tabs[tabIndex]);
  }
}
