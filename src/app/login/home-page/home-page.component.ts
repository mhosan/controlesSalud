import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/login/servicios/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  emailUser: string;
  hayUsuario: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.logout();
  }

}
