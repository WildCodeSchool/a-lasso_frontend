import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ButtonClicked } from '../../models/buttonClicked';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-single-button',
  imports: [ButtonModule, NgStyle],
  templateUrl: './single-button.component.html',
  styleUrl: './single-button.component.scss',
})
export class SingleButtonComponent {
  @Input({ required: true }) id!: number;
  @Input() label!: string;
  @Output() buttonClicked: EventEmitter<ButtonClicked> = new EventEmitter<ButtonClicked>();
  @Input() icon?: string;
  @Input() ariaLabel?: string;
  @Input() size?: 'small' | 'large' | undefined;
  @Input() styleClass?: string;
  @Input() backgroundColor?: string;

  onClick(event: MouseEvent): void {
    this.buttonClicked.emit({ id: this.id, label: this.label, event });
  }
}
