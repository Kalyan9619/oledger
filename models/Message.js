
var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
    content: String,
  
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
   
    created: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model("Message", messageSchema);