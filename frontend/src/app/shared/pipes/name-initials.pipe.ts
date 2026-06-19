import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'nameInitials', standalone: true })
export class NameInitialsPipe implements PipeTransform {
  transform(name: string): string {
    if (!name?.trim()) return '?';
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word[0]?.toUpperCase() ?? '')
      .join('');
  }
}
