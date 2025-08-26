import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, ToggleSwitch],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  isEmailChecked: boolean = false;
  isThemeChecked: boolean = false;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isThemeChecked = savedTheme === 'dark';
  }

  toggleTheme(): void {
    if (this.isThemeChecked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }
}
