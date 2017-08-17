const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const fs = require('fs');
const bodyParser = require('body-parser');

// Then these two lines after you initialise your express app 
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// The extensions 'html' allows us to serve file without adding .html at the end 
// i.e /my-cv will server /my-cv.html
app.use(express.static("public", {'extensions': ['html']}));

app.get('/', function (req, res) {
    const filePath = __dirname + '/data/posts.json';
    const callbackFunction = function(error, file) {
        // we call .toString() to turn the file buffer to a String
        const fileData = file.toString();
        // we use JSON.parse to get an object out the String
        const postsJson = JSON.parse(fileData);
        // send the json to the Template to render
        res.render('index', {
          title: "Michael's profile",
          subheading: "A modern Website built in Node with Handlebars",
          posts: postsJson
        });
    };
    fs.readFile(filePath, callbackFunction);
});

app.get('/api/posts', function (req, res) {
    const filePath = __dirname + '/data/posts.json';
    
    var options = {
      dotfiles: 'deny',
      headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
      }
    };

    res.sendFile(filePath, options, function (err) {
      if (err) {
        next(err);
      } else {
        console.log('Sent:', filePath);
      }
    });
});

app.get('/my-cv', function (req, res) {
    res.render('my-cv');
});

app.get('/admin', function (req, res) {
    res.render('admin');
});

app.post('/admin', function (req, res) {
    
    const filePath = __dirname + '/data/posts.json';

    const cb = function(error, file) {
        // we call .toString() to turn the file buffer to a String
        const fileData = file.toString();
        // we use JSON.parse to get an object out the String
        const postsJson = JSON.parse(fileData);
        // add new post to the file
        postsJson.push(req.body);

        // write back to file
        fs.writeFile(filePath, JSON.stringify(postsJson), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        
        res.end("Success.");
    };

    fs.readFile(filePath, cb);

});

app.get('/contact', function (req, res) {
    res.render('contact');
});

// what does this line mean: process.env.PORT || 3000
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});