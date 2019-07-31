Instalar:
npm install bootstrap popper.js jquery font-awesome bootswatch

"styles": [
             "node_modules/bootswatch/dist/simplex/bootstrap.min.css",
             "node_modules/font-awesome/css/font-awesome.css",
             "src/styles.css"
           ],
           "scripts": [
             "node_modules/jquery/dist/jquery.js",
             "node_modules/popper.js/dist/umd/popper.js",
             "node_modules/bootstrap/dist/js/bootstrap.js"
           ],

npm install firebase @angular/fire
en firebase.google.com
		console
			añadir proyecto
2) database
	crear database publica sin restricciones
		habilitar
3) Project overview
	hacer clic en el icon “</>”
		credenciales: copiar y pegar en Angular en el archivo environment.ts. Este archivo tiene un objeto “environment” al que se le agrega un campo con los datos de las credenciales de firebase:

En el servicio:
Import { Observable } from 'rxjs';

Angular Flash: (alerts)
npm install angular2-flash-messages --save

Ojo, aclaración importante para que funcione el metodo "map" de observable:   <------------------------
  1) cargar la libreria: npm install rxjs-compat
  2) importar: import import 'rxjs/add/operator/map';