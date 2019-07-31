import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service' 
import { Router } from '@angular/router';
import { FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  email: string;
  password: string;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private flashMensaje: FlashMessagesService
    ) { }

  ngOnInit() {
  }

  onSubmitAddUser(){
    this.authService.registerUser(this.email, this.password)
    .then((res)=>{
      //console.log(res);
      this.flashMensaje.show('Usuario creado correctamente.', {cssClass: 'alert-success', timeout: 4000});
      this.router.navigate(['/datos']);
    }).catch((err)=>{
      this.flashMensaje.show(err.message, {cssClass: 'alert-danger', timeout: 6000});
      console.log(err);
    });
  }
}
