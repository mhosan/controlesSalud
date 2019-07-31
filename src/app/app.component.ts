import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Presión arterial';

  constructor() {
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
  }

}
