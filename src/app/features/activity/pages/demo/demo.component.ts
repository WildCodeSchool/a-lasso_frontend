import { Component } from '@angular/core';
import { InputFieldComponent } from 'src/app/common/components/input-field/input-field.component';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [InputFieldComponent],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss',
})
export class DemoComponent {}
