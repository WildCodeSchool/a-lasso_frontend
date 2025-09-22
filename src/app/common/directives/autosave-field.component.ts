import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, fromEvent } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { SaveStatus } from '../models/status';

@Directive()
export abstract class AutosaveFieldComponent<T> implements OnInit, OnDestroy {
  @Input() autosave = false;

  isMobile = false;
  saveStatus: SaveStatus = 'idle';

  protected valueChanges$ = new Subject<T>();
  private _autosaveSub?: Subscription;
  private _resizeSub?: Subscription;

  ngOnInit(): void {
    this._initializeResizeListener();
    this._initializeAutosave();
  }

  ngOnDestroy(): void {
    this._autosaveSub?.unsubscribe();
    this._resizeSub?.unsubscribe();
  }

  protected startSaving(): void {
    this.saveStatus = 'saving';
  }

  public markSaved(): void {
    this.saveStatus = 'saved';
    setTimeout(() => (this.saveStatus = 'idle'), 2000);
  }

  public markError(): void {
    this.saveStatus = 'idle';
  }

  protected abstract onSave(value: T): void;

  private _initializeResizeListener(): void {
    this._resizeSub = fromEvent(window, 'resize')
      .pipe(
        startWith(null),
        map(() => window.innerWidth <= 900)
      )
      .subscribe(isMobile => {
        this.isMobile = isMobile;
      });
  }

  private _initializeAutosave(): void {
    if (this.autosave) {
      this._autosaveSub = this.valueChanges$.pipe(debounceTime(750)).subscribe(value => {
        if (this.isMobile) {
          this.startSaving();
          this.onSave(value);
        }
      });
    }
  }
}
