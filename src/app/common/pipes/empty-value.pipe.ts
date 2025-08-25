import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyValue',
})
export class EmptyValuePipe implements PipeTransform {
  transform(value: string | null | undefined, placeholder = 'Non renseigné'): string {
    return value?.trim() ? value : placeholder;
  }
}
