import { HomePageComponent } from './login/home-page/home-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent} from './login/login-page/login-page.component';
import { RegisterPageComponent} from './login/register-page/register-page.component';
import { NotFoundPageComponent} from './login/not-found-page/not-found-page.component';
import { TodoListComponent } from './registros/todo-list/todo-list.component';
import { LineasFechasComponent } from './graficos/lineasFechas/lineas.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'datos', component: TodoListComponent },
  {path: 'graficos', component: LineasFechasComponent },
  {path: '**', component: NotFoundPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
