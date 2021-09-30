const express = require('express');
const router = express.Router();


const Chat = require('../../models/Chat');
const User = require('../../models/User');

const isLoggedIn = require('../../middleware/isLoggedIn');

router.get('/', isLoggedIn, (req, res) => {
    Chat.find({ members: { $elemMatch: { user: req.user._id } } }, (err, chats) => {
        res.send(chats);
    }).sort({ "lastUpdate": -1 });
});


router.get('/default', isLoggedIn, (req, res) => {
    Chat.find({ $where: "this.members.length === 2" }, (err, chats) => {
        res.send(chats);
    });
});


router.get('/group', isLoggedIn, (req, res) => {
    Chat.find({ $where: "this.members.length > 2" }, (err, chats) => {
        res.send(chats);
    });
});

router.get('/:id', isLoggedIn, (req, res) => {
    Chat.findById(req.params.id, (err, chat) => {
        if (err) res.send('Chat not found.');
        res.send(chat);
    });
});


router.post('/', isLoggedIn, async (req, res) => {
    let chatMembers = [];
    let membersList = req.body.members;

    try {
        for (const member of membersList) {
            await User.findOne({ "username": member })
                .then(user => { 
                    chatMembers.push({
                        username: user.username,
                        user: user._id
                    });
                })
                .catch(err => console.log(err));
        }

           const newChat = new Chat({
            author: {
                id: req.user._id,
                username: req.user.username
            }, 
            members: chatMembers,
            messages: []
        });

        newChat.save();
        res.status(200).send(newChat);
    } catch (err) {
       
        res.status(500)
            .send("Chat could not be created.");
    }
});

router.post('/:id', isLoggedIn, (req, res) => {
    try {
        Chat.findByIdAndRemove({ _id: req.params.id }, (err) => {
            if (err) console.log(err);
            res.send('Chat has been deleted!');
        });
    } catch (err) {
        res.send('Chat could not be deleted. Try again.');
    }
});

router.get('/last-ten', isLoggedIn, (req, res) => {
    Chat.find({ "members": { $elemMatch: { "user": req.user.id } } }).sort({ "lastUpdate": -1 }).limit(10).exec((err, lastChats) => {
        if (err) {
            console.log(err);
        } else {
            res.send(lastChats);
        }
    });
});


router.get('/searching/:username', isLoggedIn, (req, res) => {
    if (req.params.username) {
      
        const regex = new RegExp(escapeRegex(req.params.username), 'gi');
      
        Chat.find({ $and: [{ members: { $elemMatch: { username: regex }} }, { members: { $elemMatch: { username: req.user.username } }}] }, function (err, chats) {
            if (err) {
                console.log(err);
            } else {
                
                chats.forEach((chat) => {
                    chat.members.forEach((member) => {
                        if (member.user.id !== req.user.id) {
                            chat.title = member.user.username;
                        }
                    });
                });
                res.send(chats);
            }
        });
    } else {
        chats.forEach((chat) => {
            chat.members.forEach((member) => {
                if (member.username !== req.user.username) {
                    chat.title = member.username;
                }
            });
        });
        res.send(chats);
    }
});


router.get('/clear-chat/:id', isLoggedIn, (req, res) => {
    Chat.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            messages: []
        }
    },
    { new: true }, 
    (err, chat) => {
        if (err) { res.send('Could not update this chat.'); }
    })
    .then((response) => {
        res.send(response);
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;