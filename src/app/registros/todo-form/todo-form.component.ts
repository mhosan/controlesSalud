import { TodoService } from '../../services/todo.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TodoViewModel } from '../models/todo-view-model';
import { Todo } from '../models/todo';
import { DocumentReference } from '@angular/fire/firestore';
import { AuthService } from 'src/app/login/servicios/auth.service';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnInit {
  isLogin: boolean;
  nombreUser: string;
  emailUser: string;
  //----------------------------------------------------------------------------------------
  todoForm: FormGroup;  //es el grupo del formulario. Es un conjunto de FormControls.
  // Es estado de un FormControl depende del resto, si uno es invalido todos son invalidos.
  //----------------------------------------------------------------------------------------

  // tslint:disable-next-line:no-inferrable-types
  createMode: boolean = true;   //para ver si el usuario esta editando o creando
  todo: TodoViewModel;          //el objeto que el usuario va a editar

  constructor(private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,   // NgbActiveModal servicio permite trabajar con el             
    private todoService: TodoService,     // ...formulario activo en este momento. Es para que la
    private authService: AuthService) { } // ...'x' de cerrar el form funcione

  ngOnInit() {
    //---------------------------------------------------------------------------------------
    // Se utiliza el formBuilder para armar un grupo con los campos del form: formGroup.
    // El formGroup tiene un objeto con una propiedad por cada elemento del html marcado con
    // "formControlName", estas prop tienen un arreglo con dos valores: el primero es el 
    // valor por default y el segundo un conjunto de validadores
    //---------------------------------------------------------------------------------------
    this.todoForm = this.formBuilder.group({
      valorMinima: ['', Validators.required],
      valorMaxima: ['', Validators.required],
      fecha: ['', Validators.required],
      descripcion: '',
      usuario: this.emailUser
    });

    //Estoy en modo edición...
    if (!this.createMode) {
      this.loadTodo(this.todo);
    }

    this.buscarUsuario();
  }

  buscarUsuario(){
    this.authService.getAuth().subscribe(auth =>{
      if(auth){
        this.isLogin=true;
        this.nombreUser=auth.displayName;
        this.emailUser= auth.email;
        this.todoForm.get('usuario').setValue(auth.email);
      } else {
        this.isLogin = false;
      }
    });
  }

  //
  // en el formgroup ejecutamos patchValue pasandole el 'todo'. Con patchvalue podemos editar los
  // valores de un formulario con un objeto
  //
  loadTodo(todo) {
    this.todoForm.patchValue(todo);
  }

  //-----------------------------------------------------------------------------------------
  // guardar todo el formulario. Se usa una promesa que retorna el metodo saveTodo del servicio
  // y con la respuesta se llama una funcion (handelSuccessfulSaveTodo) pasandole el document
  // reference y el objeto 'todo' y en la funcion lo que se hace es pasarle el todo creado 
  // al componente que llamó al todo, el que abrió el modal, y el id del todo que se creó
  // 
  //-----------------------------------------------------------------------------------------
  saveTodo() {
    if (this.todoForm.invalid) {
      return;
    }
    if (this.createMode) {
      const todo: Todo = this.todoForm.value;
      todo.lastModifiedDate = new Date();
      // todo.fecha = new Date();
      this.todoService.saveTodo(todo)
      .then(response => this.handleSuccessfulSaveTodo(response, todo))
      .catch(err => console.error(err));
    } else {
      const todo: TodoViewModel = this.todoForm.value;
      todo.id = this.todo.id;
      todo.lastModifiedDate = new Date();
      this.todoService.editTodo(todo)
        .then(() => this.handleSuccessfulEditTodo(todo))
        .catch(err => console.error(err));
    }
  }

  //estamos pasando por medio del dismiss la informacion a quien llamó al form
  //y estamos indicando si el createMode es verdadero o falso
  handleSuccessfulSaveTodo(Response: DocumentReference, todo: Todo) {
    this.activeModal.dismiss({ todo: todo, id: Response.id, createMode: true });
  }

  //estamos pasando por medio del dismiss la informacion a quien llamó al form
  //y estamos indicando si el createMode es verdadero o falso
  handleSuccessfulEditTodo(todo: TodoViewModel) {
    this.activeModal.dismiss({ todo: todo, id: todo.id, createMode: false });
  }
}


