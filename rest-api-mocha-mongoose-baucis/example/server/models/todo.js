var mongoose = require('../lib/mongoose');

var schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  created_at: Date
});

var Todo = mongoose.model('Todo', schema);

module.exports = Todo;
