const path = require("path");
const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/assets')));
app.use(express.static(path.join(__dirname, '/public/assets/js')));
app.use(express.static(path.join(__dirname, '/public/assets/css')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let holder = "";

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
    if (err) throw err;
    let parsedData = JSON.parse(data)
    holder = parsedData;
    res.json(parsedData);
  });
});

app.post("/api/notes", (req, res) => {

  const newNote = req.body;

  newNote["id"] = holder.length++;
  newNote.append()

  holder.push(newNote)

  const stringHolder = JSON.stringify(holder)
  
  fs.writeFileSync(path.join(__dirname, "/db/db.json"), stringHolder, "UTF8", function (err) {
    if (err) return console.log(err);
  });

  fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
    if (err) throw err;
    const parsedData = JSON.parse(data)
    holder = parsedData;
    res.json(parsedData);
  });
});

app.delete("/api/notes/:id", (req, res) => {

});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});