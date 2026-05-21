import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegisterService } from 'src/app/service/register-service';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {

  registerService = inject(RegisterService);
  

  saveUser(){
    this.registerService.saveUser([]).subscribe(response => {
      console.log('User saved successfully', response);
    },
    error => {
      console.error('Error saving user', error);
    });
  }
}
