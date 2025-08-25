import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EmptyValuePipe } from 'src/app/common/pipes/empty-value.pipe';

@Component({
  selector: 'app-editable-field',
  templateUrl: './editable-field.component.html',
  styleUrls: ['./editable-field.component.scss'],
  standalone: true,
  imports: [EmptyValuePipe],
})
export class EditableFieldComponent {
  @Input() label!: string;
  @Input() value: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() editMode: boolean = false;

  @Output() valueChange = new EventEmitter<string>();

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
}
