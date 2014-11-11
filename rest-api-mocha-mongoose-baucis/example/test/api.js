var assert   = require('assert'),
    mongoose = require('mongoose'),
    server   = require('../server'),
    request  = require('supertest'),
    Todo     = require('../server/models/todo');

var user = request(server);

describe('modelo `Todo`', function () {
  before(function () {
    this.schema = Todo.schema.paths;
  });

  it('debe tener la propiedad `title` correctamente', function () {
    assert.notEqual(this.schema.title, undefined);
    assert.equal(this.schema.title.options.type, String);
    assert.equal(this.schema.title.options.required, true);
  });

  it('debe tener la propiedad `author` correctamente', function () {
    assert.notEqual(this.schema.author, undefined);
    assert.equal(this.schema.author.options.type, String);
    assert.equal(this.schema.author.options.required, true);
  });

  it('debe tener la propiedad `completed` correctamente', function () {
    assert.notEqual(this.schema.completed, undefined);
    assert.equal(this.schema.completed.options.type, Boolean);
    assert.equal(this.schema.completed.options.default, false);
  });

  it('debe tener la propiedad `created_at` correctamente', function () {
    assert.notEqual(this.schema.created_at, undefined);
    assert.equal(this.schema.created_at.options.type, Date);
  });
});

describe('/api/todos', function (done) {
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

        todo.id = res.body._id;

        done();
      });
  });

  it('usuario debe poder obtener una tarea', function (done) {
    user
      .get('/api/todos/' + todo.id)
      .expect(200, function (err, res) {
        if (err) done(err);

        assert.equal(res.body.title, todo.title);
        assert.equal(res.body.author, todo.author);
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
