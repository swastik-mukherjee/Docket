const { urlencoded } = require("express");
const express = require("express");
const mongodb = require("mongodb");


const app = express();
let db

let connectionString = 'mongodb+srv://docketer:1144@cluster0.ett0z.mongodb.net/DocketApp?retryWrites=true&w=majority';
mongodb.connect(connectionString, { useNewUrlParser: true }, (err, client) => {
  db = client.db();
  app.listen(5000, () => {
    console.log("The server is listenig at port 5000")
  });
});



app.use(urlencoded({ extended: true }));

app.get('/', (req, res) => {
  db.collection('items').find().toArray((err, items) => {
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Happy Docketing</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">Docket App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input name = "item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul class="list-group pb-5">
          ${items.map((item) => {
      return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
      <span class="item-text">${item.text}</span>
      <div>
        <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
        <button class="delete-me btn btn-danger btn-sm">Delete</button>
      </div>
    </li>`;
    }).join('')}
        </ul>
        
      </div>
      
    </body>
    </html>`);
  });

});

app.post('/create-item', (req, res) => {
  db.collection('items').insertOne({ text: req.body.item }, () => {
    res.redirect('/');
  });
});



