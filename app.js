const express = require('express')
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()

app.listen(8080, () =>{
  console.log("NODE JS API IS RUNNING ON PORT 8080!")
})

function getSQL(){
  return mysql.createConnection({
    host: 'chabanvpn.ovh',
    port: '3306',
    user: 'workshop',
    password: 'workshop',
    database: 'users'
  })
}

app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('short'))

app.get("/", (req, res) => {
  console.log("Responding to ping request")
  res.send("NODE.JS SERVER UP AND RUNNING")
})

app.get("/api/user/:id", (req, res) => {

  const connection = getSQL()

  var queryString = "SELECT * FROM users WHERE ID = ?"
  connection.query(queryString, [req.params.id], (err, rows, fields) => {
    if(err){
      console.log("Erreur: " + err)
      res.sendStatus(500)
      return
    }
    console.log("User ID: "+req.params.id+" found")
    res.json(rows)
  })

})

app.get("/api/users", (req, res) => {

  const connection = getSQL()

  var queryString = "SELECT * FROM users"
  connection.query(queryString, (err, rows, fields) => {
    if(err){
      console.log("Erreur: " + err)
      res.sendStatus(500)
      return
    }
    console.log("User list published")
    res.json(rows)
  })
})


//POST API
app.post("/api/user", (req , res) => {

    const connection = getSQL()

    var queryString = "INSERT INTO users (Firstname, Surname, Username, password, Email, Localization) VALUES (?,?,?,?,?,?)"
    connection.query(queryString, [req.body.Firstname, req.body.Surname, req.body.Username, req.body.password, req.body.Email, req.body.Localization], (err, results) => {
      if(err){
        console.log("Echec de l'insertion")
        res.sendStatus(500)
        return
      }
      console.log("Success with inserting with ID: ", results.insertId)
      res.send("Success")
      //res.end()
    })
})

// DELETE API
 app.delete("/api/user/:id", function(req , res){

      const connection = getSQL()

      var queryString = "DELETE FROM users WHERE ID = ?";
      connection.query(queryString, [req.params.id], (err, rows, fields) => {
        if(err){
          console.log("Erreur: " + err)
          res.sendStatus(500)
          return
        }
        console.log("Success with deleting ID: ", req.params.id)
        res.send("Success")
        //res.end()
      })
})

//PUT API
 app.put("/api/user/:id", function(req , res){

        const connection = getSQL()

        var queryString = "UPDATE users SET Firstname = ? , Surname = ? , Username = ? , password = ? , Email = ? , Localization = ? WHERE (ID = ?)"
        connection.query(queryString, [req.body.Firstname, req.body.Surname, req.body.Username, req.body.password, req.body.Email, req.body.Localization, req.params.id], (err, results) => {
          if(err){
            console.log("Echec de la modification")
            res.sendStatus(500)
            return
          }
          console.log("Success with modifying ID: ", req.params.id)
          res.send("Success")
          //res.end()
          })
});
