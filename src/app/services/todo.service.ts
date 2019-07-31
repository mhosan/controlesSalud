import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Todo } from '../registros/models/todo';
import { TodoViewModel } from '../registros/models/todo-view-model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(private db: AngularFirestore) { }

  private todoCollectionName = 'todos';  //campo o prop que guarda la coleccion donde se van a guardar los documentos con los datos

  getTodos(usuario: string): Observable<firebase.firestore.QuerySnapshot> {
    //return this.db.collection<Todo>(this.todoCollectionName, ref => ref.orderBy('lastModifiedDate', 'desc')).get();
    //return this.db.collection<Todo>(this.todoCollectionName, ref => ref.orderBy('fecha', 'desc')).get();
    return this.db.collection<Todo>(this.todoCollectionName, ref => ref.where('usuario','==', usuario).orderBy('fecha', 'desc')).get();
  }

  // ----------------------------------------------------------------------------------------------------------------
  // guardar todo, recibe como parametro un objeto que implementa la interfaz 'todo', y devuelve una promesa.
  // En este caso this.db es la base de firestore y se hace referencia a las colecciones pasandole una coleccion
  // propia (this.todoCollectionName) y se la agrega a la coleccion 'todo' en la base de datos con el metodo .add
  // o se que se agregó un documento a la coleccion 'todo'
  // ----------------------------------------------------------------------------------------------------------------
  saveTodo(todo: Todo): Promise<DocumentReference> {
    return this.db.collection(this.todoCollectionName).add(todo);
  }

  //hubo cambios. Guardar
  editTodo(todo: TodoViewModel): Promise<void> {
    return this.db.collection(this.todoCollectionName).doc(todo.id).update(todo);
  }
  
  editTodoPartial(id: string, obj: Object): Promise<void> {
    return this.db.collection(this.todoCollectionName).doc(id).update(obj);
  }
  
  deleteTodo(idTodo: string): Promise<void> {
    return this.db.collection(this.todoCollectionName).doc(idTodo).delete();
  }
}
