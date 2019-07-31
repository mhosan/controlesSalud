import { Injectable } from '@angular/core';
// import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import 'rxjs/add/operator/map';
/*
Ojo, aclaración importante para que funcione el metodo "map":   <------------------------
  1) cargar la libreria: npm install rxjs-compat
  2) importar: import import 'rxjs/add/operator/map';
*/

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth ) { }

  registerUser(email: string, pass: string){      // <-------------------------------todo esto viene de la doc. de firebase authentication
    return new Promise((resolve, reject)=>{
      this.afAuth.auth.createUserWithEmailAndPassword(email, pass)
      .then (userData => resolve(userData),
      err => reject(err));
    });
  }

  logout(){
    return this.afAuth.auth.signOut();
  }

  loginEmail(email: string, pass: string){      // <-------------------------------todo esto viene de la doc. de firebase authentication
    return new Promise((resolve, reject)=>{
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
      .then (userData => resolve(userData),
      err => reject(err));
    });
  }

  getAuth(){
    return this.afAuth.authState.map (auth => auth);
  }
}
