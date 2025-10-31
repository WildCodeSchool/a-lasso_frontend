import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'isoDate' })
export class IsoDatePipe implements PipeTransform {
  transform(value: string | Date | null): string {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    return date.toISOString().split('T')[0]; // format yyyy-MM-dd
  }
}
