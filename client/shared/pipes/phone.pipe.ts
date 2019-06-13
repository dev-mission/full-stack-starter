import { Pipe, PipeTransform } from '@angular/core';

/**
 * Returns a formatted phone number
 */
@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {
  transform(value: string): string {
    return `${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6)}`;
  }
}
