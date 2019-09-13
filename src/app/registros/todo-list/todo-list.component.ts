import { TodoFormComponent } from './../todo-form/todo-form.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TodoService } from '../../services/todo.service';
import { TodoViewModel } from '../models/todo-view-model';
import { AuthService } from 'src/app/login/servicios/auth.service';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  emailUser: string;

  constructor(
    private modalService: NgbModal,
    private todoService: TodoService,
    private authService: AuthService) { }

  ngOnInit() {
    this.buscarUsuario();
  }
  
  buscarUsuario(){
    this.authService.getAuth().subscribe(auth =>{
      if(auth){
        this.emailUser= auth.email;
        console.log(this.emailUser);
        this.loadTodos();
      } else {
        this.emailUser='nada';
      }
    });
  }
  // tslint:disable-next-line:member-ordering
  todos: TodoViewModel[] = []; //campo para colocar los todos que se van a mostrar por pantalla 

  //--------------------------------------------------------------------------------------------------
  //por cada documento se construye un modelo de datos para mostrar, con la interface todo-view-models
  //y despues se guarda en el arreglo de 'todos'
  //--------------------------------------------------------------------------------------------------
  loadTodos() {
      this.todoService.getTodos(this.emailUser).subscribe(response => {
        this.todos = [];
        response.docs.forEach(value => {
          const data = value.data();
          const id = value.id;
          const todo: TodoViewModel = {
            id: id,
            valorMinima: data.valorMinima,
            valorMaxima: data.valorMaxima,
            descripcion: data.descripcion,
            fecha: data.fecha,
            lastModifiedDate: data.lastModifiedDate.toDate(),
            usuario: data.usuario
          };
          this.todos.push(todo);
        });
      });
    }

  clickAddTodo() {
  //---------------------------------------------------------------------------------------------
  // usamos el modalService para abrir el modal con su contenido que va a ser 'TodoFormComponent'
  //---------------------------------------------------------------------------------------------
  const modal = this.modalService.open(TodoFormComponent);
    modal.result.then(
      this.handleModalTodoFormClose.bind(this),
      this.handleModalTodoFormClose.bind(this)
    );
  }

  handleEditClick(todo: TodoViewModel) {
    const modal = this.modalService.open(TodoFormComponent);
    modal.result.then(
      this.handleModalTodoFormClose.bind(this),
      this.handleModalTodoFormClose.bind(this)
    );
    modal.componentInstance.createMode = false;
    modal.componentInstance.todo = todo;
  }

  //----------------------------------------------------------------------------------------------
  //cuando el modal se cierra se ejecuta esta funcion. Se le pasa un objeto como parametro
  //----------------------------------------------------------------------------------------------
  handleModalTodoFormClose(response) {
    // response es un objeto?
    if (response === Object(response)) {
      if (response.createMode) {
        response.todo.id = response.id;
        this.todos.unshift(response.todo);  //<---colocar el objeto en el arreglo de objetos 'todos'. Se
      } else {                              //usó unshift para colocarlo al ppio. Con push va al final.
        const index = this.todos.findIndex(value => value.id == response.id);
        this.todos[index] = response.todo;
      }
    }
  }

  //
  // usar el metodo deleteTodo pasandole el id para ir al servicio, el cual retorna una promesa
  // (splice cambia el contenido de un array agregando o sacando) 
  handleDeleteClick(todoId: string, index: number) {
    this.todoService.deleteTodo(todoId)
      .then(() => {
        this.todos.splice(index, 1);
      })
      .catch(err => console.error(err));
  }

}
