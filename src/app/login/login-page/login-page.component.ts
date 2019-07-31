import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  email: string ='';
  password: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private flashMensaje: FlashMessagesService 
    ) { }

  ngOnInit() {
  }
  onSubmitLogin(){
    this.authService.loginEmail(this.email, this.password)
    .then((res)=>{
      this.flashMensaje.show('Usuario conectado correctamente.', {cssClass: 'alert-success', timeout: 4000});
      this.router.navigate(['/datos']);
    }).catch((err)=>{
      this.flashMensaje.show(err.message, {cssClass: 'alert-danger', timeout: 4000});
      console.log(err);
      this.router.navigate(['/login']);
    });
  }

}
