
var mongoose = require('mongoose');


var chatSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        }
    ],
   
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ],
    lastUpdate: Date,
    
    created: {
        type: Date,
        default: Date.now()
    }
});

//Export our schema, this reference will be used in other models
module.exports = mongoose.model('Chat', chatSchema);