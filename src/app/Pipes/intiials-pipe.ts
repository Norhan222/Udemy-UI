import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'intiials',
})
export class IntiialsPipe implements PipeTransform {

  transform(value: string|null|undefined): string {
     if (!value) return '';

    const words = value.trim().split(' ').filter(w => w.length > 0);

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    const first = words[0][0];
    const last = words[words.length - 1][0];

    return (first + last).toUpperCase();
  }

}
