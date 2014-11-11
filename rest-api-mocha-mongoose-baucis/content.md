Crearemos una REST API en Express con MongoDB, para ello vamos a utilizar Mongoose y Baucis. Usaremos Mocha para hacer pruebas unitarias y tener más claridad de lo que queremos obtener. Los archivos que creamos son los siguientes:

```
.
  ├─ node_modules
  ├─ package.json
  ├─ server
  │  ├─ lib
  │     └─ mongoose.js
  │  └─ models
  │     └─ todo.js
  ├─ server.js
  └─ test
     └─ api.js
```

## Instalando dependencias

Estas son las dependencias que instalaremos:

* mocha
* supertest
* express
* body-parser
* mongoose
* baucis

Instalaremos la librería `mocha` a nivel global para poder ejecutarla en la línea de comandos. Con `supertest` haremos solicitudes HTTP y junto con `mocha` realizaremos pruebas unitarias de nuestra API. Con `express` podremos crear un server y administrar rutas. Con `body-parser`, que es un middleware para `express`, permitiremos el envío de datos a través de POST y PUT. Con `mongoose` crearemos nuestros esquemas de modelos para MongoDB y con `baucis` crearemos fácilmente una API con los métodos que necesitemos: HEAD, POST, GET, PUT, DELETE.

Primero, es necesario iniciar un proyecto previamente con *npm init* o crear manualmente el archivo `package.json` con datos como los siguientes:

```
{
  "name": "rest-api-express",
  "main": "server.js"
}
```

Después debemos instalar las dependencias que necesitamos.

```bash
$ npm install -g mocha
$ npm install --save-dev supertest
$ npm install --save express body-parser mongoose baucis
```

No olvides añadir los argumentos. `-g` instalará una librería a nivel global, `--save` y `--save-dev` guardará las dependencias en modo producción y desarrollo, respectivamente, dentro de `package.json`.

## Probando el funcionamiento de la API

Estas son las rutas que queremos de nuestra API, con los métodos que necesitamos:

```
GET     /api/todos          Obtiene todas las tareas
POST    /api/todos          Crea una tarea
GET     /api/todos/:id      Obtiene una tarea
PUT     /api/todos/:id      Actualiza una tarea
DELETE  /api/todos/:id      Elimina una tarea
```

Primero haremos pruebas unitarias de nuestros esquemas de `mongoose`, comprobando si tienen las propiedades que queremos y si están declaradas correctamente; podemos verificar si están definidas, el tipo (*String*, *Object*, *Date*, *Boolean*), si es requerida, si tiene un valor por defecto, si tiene índices, etcétera.

```js
var assert   = require('assert'),
    mongoose = require('mongoose'),
    Todo     = require('../server/models/todo');

describe('modelo `Todo`', function () {
  before(function () {
    this.schema = Todo.schema.paths;
  });

  it('debe tener la propiedad `title` correctamente', function () {
    // La propiedad `title` debe ser diferente de "undefined"
    assert.notEqual(this.schema.title, undefined);
    // La propiedad `title` debe ser del tipo String
    assert.equal(this.schema.title.options.type, String);
    // La propiedad `title` es requerida
    assert.equal(this.schema.title.options.required, true);
  });

  it('debe tener la propiedad `author` correctamente', function () {
    // La propiedad `author` debe ser diferente de "undefined"
    assert.notEqual(this.schema.author, undefined);
    // La propiedad `author` debe ser del tipo ObjectId
    assert.equal(this.schema.author.options.type, mongoose.Schema.ObjectId);
    // La propiedad `author` debe tener Author como referencia de modelo
    assert.equal(this.schema.author.options.ref, 'Author');
  });

  it('debe tener la propiedad `completed` correctamente', function () {
    // La propiedad `completed` debe ser diferente de "undefined"
    assert.notEqual(this.schema.completed, undefined);
    // La propiedad `completed` debe ser del tipo Boolean
    assert.equal(this.schema.completed.options.type, Boolean);
    // La propiedad `completed` debe ser "false" por defecto
    assert.equal(this.schema.completed.options.default, false);
  });

  it('debe tener la propiedad `created_at` correctamente', function () {
    // La propiedad `created_at` debe ser diferente de "undefined"
    assert.notEqual(this.schema.created_at, undefined);
    // La propiedad `created_at` debe ser del tipo Date
    assert.equal(this.schema.created_at.options.type, Date);
  });
});
```

Después necesitamos añadir las pruebas de solicitudes HTTP con `supertest`, esto asegurará el funcionamiento de la API y evitaremos hacer pruebas con `curl` o `postman`.

```js
var assert   = require('assert'),
    mongoose = require('mongoose'),
    request  = require('supertest'),
    server   = require('../server'),
    Todo     = require('../server/models/todo');

// Definimos agente, lo único que necesitamos es pasar como argumento
// el server de express que será exportado en server.js
var user = request(server);

describe('/api/todos', function (done) {
  // Todo de prueba
  var todo = {
    title: 'Foobar',
    author: 'Jeduan Cornejo'
  };

  it('usuario debe poder crear una tarea', function (done) {
    user
      .post('/api/todos')
      .send({
        title: todo.title,
        author: todo.author
      })
      .expect(201, function (err, res) {
        if (err) done(err);

        // Guardamos la _id en el objeto
        todo.id = res.body._id;

        done();
      });
  });

  it('usuario debe poder obtener una tarea', function (done) {
    user
      .get('/api/todos/' + todo.id)
      .expect(200, function (err, res) {
        if (err) done(err);

        // Comprobamos que el título coincida con el devuelto por el servidor
        assert.equal(res.body.title, todo.title);
        // Comprobamos que el autor coincida con el devuelto por el servidor
        assert.equal(res.body.author, todo.author);
        // Comprobamos que completed se encuentre en false
        assert.equal(res.body.completed, false);

        done();
      });
  });

  it('usuario debe poder actualizar una tarea', function (done) {
    user
      .put('/api/todos/' + todo.id)
      .send({ completed: true })
      .expect(200, function (err, res) {
        if (err) done(err);

        // Comprobamos que completed haya cambiado a true
        assert.equal(res.body.completed, true);

        done();
      });
  });

  it('usuario debe poder eliminar una tarea', function (done) {
    user
      .delete('/api/todos/' + todo.id)
      .expect(200, done);
  });
});
```

Ahora necesitas correr las pruebas con `$ mocha api/test`. Una vez que tengamos bien definidas las pruebas, nos daremos cuenta que poco importa si usamos `baucis` o cualquier otra librería, siempre y cuando las pruebas se cumplan. Se pueden añadir pruebas para verificar si el usuario tiene o no permiso de administrar tareas, probar si una propiedad refiere a otro modelo con [population](http://mongoosejs.com/docs/populate.html), etcétera.

## Creando servidor con Express

```js
// Llamamos las dependencias que necesitamos
var express    = require('express'),
    bodyParser = require('body-parser'),
    baucis     = require('baucis'),
    Todo       = require('./server/models/todo');

// Creamos un nuevo servidor
var server = express();

// Incluimos la configuración de bodyParser
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Controlador
var todoController = baucis.rest('Todo');

// Si deseas restringir rutas, puedes hacerlo con middlewares, v.g.:
// todoController.request('post put delete', function (req, res, next) {
//   if (req.isAuthenticated()) return next();
//   return res.send(401);
// });

// Incluimos plugin de baucis a Express con raíz /api
server.use('/api', baucis());

// Iniciamos el servidor en puerto 3000, si no existe la variable de entorno
server.listen(process.env.PORT || 3000);

// Esta línea es muy importante para hacer funcionar Mocha y Supertest
module.exports = server;
```

Con lo anterior crearemos una API rápidamente con pruebas unitarias. De las ventajas que tenemos al usar [Baucis](http://kun.io/baucis) es que podemos controlar y escalar fácilmente nuestra API, podemos añadir *middlewares*, hacer *streaming* para grandes cantidades de información, administrar versiones, extraer datos con solicitudes dinámicas con *query options*, entre otras.

Puedes ver este ejemplo en [Github](https://github.com/markotom/javascriptmx/tree/master/rest-api-mocha-mongoose-baucis/example).
