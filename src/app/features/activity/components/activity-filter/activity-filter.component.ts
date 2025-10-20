import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { ButtonClicked } from 'src/app/common/models/button';
import { SingleButtonComponent } from '../../../../common/components/single-button/single-button.component';
import { Theme, ThemeName } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { ButtonStyleClass } from 'src/app/common/models/button';

@Component({
  selector: 'app-activity-filter',
  standalone: true,
  imports: [AsyncPipe, ButtonModule, SingleButtonComponent],
  templateUrl: './activity-filter.component.html',
  styleUrl: './activity-filter.component.scss',
})
export class ActivityFilterComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() selectedThemes: EventEmitter<ThemeName[]> = new EventEmitter<ThemeName[]>();
  @Input() formGroup?: FormGroup;
  @Input() resetFormTrigger: boolean = false;
  @Input() formThemeField?: string;
  @Input() hasLoadedDraft?: boolean;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  themes$!: Observable<Theme[]>;

  showLeftArrow = false;
  showRightArrow = false;
  selected: ThemeName[] = [];
  ButtonStyleClass = ButtonStyleClass;
  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);

  ngOnInit(): void {
    this.themes$ = this._activityFacadeService.getActivityThemesFromApi();
  }

  ngAfterViewInit(): void {
    const element = this.scrollContainer.nativeElement;

    element.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        if (event.deltaY !== 0) {
          event.preventDefault();
          element.scrollBy({ left: event.deltaY, behavior: 'smooth' });
        }
      },
      { passive: false }
    );

    element.addEventListener('scroll', () => this._updateArrows());

    const resizeObserver = new ResizeObserver(() => this._updateArrows());
    resizeObserver.observe(element);

    this._updateArrows();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hasLoadedDraft'] && this.formGroup) {
      this.loadDraftThemes();
    }

    if (changes['resetFormTrigger']) {
      this.selected = [];
      this.selectedThemes.emit([...this.selected]);
    }
  }

  loadDraftThemes(): void {
    if (this.formGroup?.value?.selectedThemesName) {
      this.selected = [...this.formGroup.value.selectedThemesName];
    }
  }

  updateSelectedThemes(theme: ButtonClicked): void {
    const index: number = this.selected.findIndex(t => t === theme.label);
    if (index > -1) {
      this.selected.splice(index, 1);
    } else {
      this.selected.push(theme.label as ThemeName);
    }

    this.selectedThemes.emit([...this.selected]);
    if (this.formGroup && this.formThemeField) {
      const selectedThemesForm = this.formGroup.get(this.formThemeField);
      selectedThemesForm.setValue(this.selected);
      selectedThemesForm.markAsTouched();
    }
  }

  scrollLeft(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
  }

  private _updateArrows(): void {
    const element = this.scrollContainer.nativeElement;
    const maxScrollLeft = element.scrollWidth - element.clientWidth;

    this.showLeftArrow = element.scrollLeft > 10;
    this.showRightArrow = element.scrollLeft < maxScrollLeft - 10;
  }
}
