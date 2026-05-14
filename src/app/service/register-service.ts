import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  url = environment.apiUrl;


  saveUser(user: any) {
    return fetch(this.url + 'register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    }).then((response) => response.json());
  }
}
