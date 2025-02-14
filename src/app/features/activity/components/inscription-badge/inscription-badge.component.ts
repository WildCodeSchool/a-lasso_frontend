import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-inscription-badge',
  standalone: true,
  imports: [],
  templateUrl: './inscription-badge.component.html',
  styleUrl: './inscription-badge.component.scss',
})
export class InscriptionBadgeComponent {
  @Input() participants!: { current: number; max: number };
}
