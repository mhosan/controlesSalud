import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/servicios/auth.service';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent implements OnInit {
  isLogin: boolean;
  nombreUser: string;
  emailUser: string;
  avatar: string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth =>{
      if(auth){
        this.isLogin=true;
        this.nombreUser=auth.displayName;
        this.emailUser= auth.email;
        this.avatar=auth.email + 'k';
      } else {
        this.isLogin = false;
        this.avatar= 'nadie';
      }
    })
  }

  onClickLogout(){
    this.authService.logout();
  }

}
