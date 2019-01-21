const express = require('express')
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('short'))

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'workshop',
  password: 'workshop',
  database: 'users'
})

app.get("/", (req, res) =>{
  console.log("Responding to route")
  res.send("Hello from route")
})

app.get("api/user/:id", (req, res) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'workshop',
    password: 'workshop',
    database: 'users'
  })

  const queryString = "SELECT * FROM users WHERE id = ?"
  connection.query(queryString, [req.params.id], (err, rows, fields) => {
    if(err){
      console.log("Erreur")
      res.sendStatus(500)
      return
    }
    console.log("OK SQL")
    res.json(rows)
  })

})

app.get("/api/users", (req, res) =>{


  const queryString = "SELECT * FROM users"
  connection.query(queryString, (err, rows, fields) => {
    if(err){
      console.log("Erreur: " + err)
      res.sendStatus(500)
      return
    }
    console.log("OK SQL")
    res.json(rows)
  })
})


//POST API
  app.post("/api/user", (req , res) => {
    var query = "INSERT INTO users VALUES (" +req.body.Firstname+ ","+req.body.Surname+","+req.body.Username+","+req.body.password+","+req.body.Email+","+req.body.Localization+")";
    connection.query(query);
});

//PUT API
 app.put("/api/user/:id", function(req , res){
                var query = "UPDATE [user] SET Name= " + req.body.Name  +  " , Email=  " + req.body.Email + "  WHERE Id= " + req.params.id;
                executeQuery (res, query);
});

// DELETE API
 app.delete("/api/user /:id", function(req , res){
                var query = "DELETE FROM [user] WHERE Id=" + req.params.id;
                executeQuery (res, query);
});

app.listen(8080, () => {
  console.log("OK: port 8080")
})
