const express = require('express')
const app = express()

// var bodyParser = require('body-parser')

const PORT = process.env.PORT || 3000;

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

let server = app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

const path = require('path');

var io = require('socket.io')(server);

// Tells node.js to use static front end assets
app.use(express.static('public'));

// Root url returns index.html
app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

let allTrees = [];

app.post('/addTrees', function(req,res){
    // Save data
    console.log(req.body);
    allTrees = allTrees.concat(req.body);
    res.send('Got POST request')
})

app.get('/getTrees', function(req, res){
    res.send(allTrees)
})
