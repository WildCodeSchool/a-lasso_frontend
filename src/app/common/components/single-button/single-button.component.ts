import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ButtonClicked, ButtonStyleClass } from '../../models/button';

@Component({
  selector: 'app-single-button',
  imports: [ButtonModule],
  templateUrl: './single-button.component.html',
  styleUrl: './single-button.component.scss',
})
export class SingleButtonComponent {
  @Output() buttonClicked: EventEmitter<ButtonClicked> = new EventEmitter<ButtonClicked>();
  @Input({ required: true }) id!: number | string;
  @Input() label!: string;
  @Input() icon?: string;
  @Input() ariaLabel?: string;
  @Input() size?: 'small' | 'large' | undefined;
  @Input() styleClass?: ButtonStyleClass;
  @Input() backgroundColor?: string;
  @Input() disabled: boolean = false;
  @Input() type?: 'submit' | 'button';

  onClick(event: MouseEvent): void {
    this.buttonClicked.emit({ id: this.id, label: this.label, event });
  }
}
