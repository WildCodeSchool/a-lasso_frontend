import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFr',
  standalone: true,
})
export class DateFrPipe implements PipeTransform {
  transform(date: string | Date | null | undefined): string {
    if (!date) return '';

    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    }

    if (date instanceof Date) {
      return date.toLocaleDateString('fr-FR');
    }

    try {
      return new Date(date).toLocaleDateString('fr-FR');
    } catch {
      return '';
    }
  }
}
