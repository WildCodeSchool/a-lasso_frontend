import { Component, Input } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { BadgeSize } from '../../models/badge-size-enum';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-badge',
  imports: [BadgeModule, NgClass],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  @Input() badgeValue!: number;
  @Input() badgeSize: BadgeSize = BadgeSize.Small;
  @Input() isWhite: boolean = false;
}
