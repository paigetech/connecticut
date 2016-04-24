// thing mongoose model - needs to be populated or removed
var mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
  send: {
    type: String
  },
  message: {
    type: String,
  },
  recieve: {
    type: String,
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Chat', chatSchema);
