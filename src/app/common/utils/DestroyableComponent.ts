import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MonoTypeOperatorFunction } from 'rxjs';

export abstract class DestroyableComponent {
  protected readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected untilDestroyed<T>(): MonoTypeOperatorFunction<T> {
    return takeUntilDestroyed<T>(this.destroyRef);
  }
}
