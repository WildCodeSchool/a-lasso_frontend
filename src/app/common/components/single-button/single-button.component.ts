import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ButtonClicked } from '../../models/buttonClicked';

@Component({
  selector: 'app-single-button',
  imports: [ButtonModule],
  templateUrl: './single-button.component.html',
  styleUrl: './single-button.component.scss',
})
export class SingleButtonComponent {
  @Output() buttonClicked: EventEmitter<ButtonClicked> = new EventEmitter<ButtonClicked>();
  @Input({ required: true }) id!: number;
  @Input() label!: string;
  @Input() icon?: string;
  @Input() ariaLabel?: string;
  @Input() size?: 'small' | 'large' | undefined;
  @Input() styleClass?: string;
  @Input() backgroundColor?: string;
  @Input() disabled: boolean = false;
  @Input() type?: 'submit' | 'button';

  onClick(event: MouseEvent): void {
    this.buttonClicked.emit({ id: this.id, label: this.label, event });
  }
}
