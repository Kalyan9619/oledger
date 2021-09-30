if(process.env.NODE_ENV === 'production') {
    module.exports = { mongoURI: 'mongodb+srv://oledger:chatapp@cluster0.csivb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' };
} else {
    module.exports = { mongoURI: 'mongodb+srv://oledger:chatapp@cluster0.csivb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' }; 
}