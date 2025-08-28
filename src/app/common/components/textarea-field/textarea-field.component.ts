import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TextareaModule } from 'primeng/textarea';
import { Subject, Subscription, fromEvent } from 'rxjs';
import { debounceTime, startWith, map } from 'rxjs/operators';
import { FormField } from 'src/app/features/authentication/models/form.model';
import { InputFieldErrorComponent } from '../input-field-error/input-field-error.component';

const DEFAULT_ROWS: number = 5;
const DEFAULT_COLS: number = 30;
type SaveStatus = 'idle' | 'saving' | 'saved';

@Component({
  selector: 'app-textarea-field',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IftaLabelModule, TextareaModule, InputFieldErrorComponent],
  templateUrl: './textarea-field.component.html',
  styleUrls: ['./textarea-field.component.scss'],
})
export class TextareaFieldComponent implements OnInit, OnDestroy {
  @Output() save = new EventEmitter<string>();

  @Input() submitted!: boolean;
  @Input() showSaveButton = false;
  @Input() disabled = false;
  @Input() rows: number = DEFAULT_ROWS;
  @Input() cols: number = DEFAULT_COLS;
  @Input() id: string = 'textarea-field';
  @Input() autosave = false;
  @Input({ required: true }) maxlength!: number;
  @Input({ required: true }) fieldConfig!: FormField;
  @Input({ required: true }) formGroup!: FormGroup;

  isMobile = false;
  saveStatus: SaveStatus = 'idle';

  private _valueChanges$ = new Subject<string>();
  private _sub!: Subscription;
  private _resizeSub!: Subscription;

  ngOnInit(): void {
    this._resizeSub = fromEvent(window, 'resize')
      .pipe(
        startWith(null),
        map(() => window.innerWidth <= 768)
      )
      .subscribe(isMobile => {
        this.isMobile = isMobile;
      });

    if (this.autosave) {
      this._sub = this._valueChanges$.pipe(debounceTime(750)).subscribe(value => {
        if (this.isMobile) {
          this._triggerSave(value);
        }
      });

      const control = this.formGroup.get(this.fieldConfig.name);
      control?.valueChanges.subscribe(val => {
        this._valueChanges$.next(val);
      });
    }
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
    this._resizeSub?.unsubscribe();
  }

  manualSave(): void {
    if (!this.isMobile && this.autosave) {
      const value = this.formGroup.get(this.fieldConfig.name)?.value;
      this._triggerSave(value);
    }
  }

  private _triggerSave(value: string): void {
    this.saveStatus = 'saving';
    this.save.emit(value);

    setTimeout(() => {
      this.saveStatus = 'saved';
      setTimeout(() => (this.saveStatus = 'idle'), 2000);
    }, 500);
  }

  get fieldContentLength(): number {
    const control = this.formGroup.get(this.fieldConfig.name);
    return control?.value?.length || 0;
  }
}
