import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorformatterService {

    buildMessageDetails(errors?: Record<string, string[]>): string {
    if (!errors || Object.keys(errors).length === 0) {
      return 'Intenta nuevamente en unos segundos.';
    }
     return Object.entries(errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('\n');
  }

}
