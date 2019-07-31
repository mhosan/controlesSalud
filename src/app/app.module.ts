import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterPageComponent } from './login/register-page/register-page.component';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { NotFoundPageComponent } from './login/not-found-page/not-found-page.component';
import { AuthService } from './login/servicios/auth.service'
import { FormsModule } from '@angular/forms'
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from './../environments/environment';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { FlashMessagesService } from 'angular2-flash-messages';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { TodoListComponent } from './registros/todo-list/todo-list.component';
import { TodoFormComponent } from './registros/todo-form/todo-form.component';
import { LineasFechasComponent } from './graficos/lineasFechas/lineas.component';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { HomePageComponent } from './login/home-page/home-page.component';


@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoFormComponent,
    LineasFechasComponent,
    EncabezadoComponent,
    RegisterPageComponent,
    LoginPageComponent,
    NotFoundPageComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, environment.firebaseConfig),
    AngularFirestoreModule,
    NgbModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    AngularFireAuthModule,
    FlashMessagesModule
  ],
  providers: [AuthService, FlashMessagesService],
  bootstrap: [AppComponent],
  entryComponents: [TodoFormComponent]
})
export class AppModule { }
