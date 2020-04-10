const path = require("path");
const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/public/assets")));
app.use(express.static(path.join(__dirname, "/public/assets/js")));
app.use(express.static(path.join(__dirname, "/public/assets/css")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let holder = [];

let lastID = 2;

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    holder = JSON.parse(data);
    return res.json(holder);
  });
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;

  lastID += 1;

  newNote["id"] = lastID;

  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    holder = JSON.parse(data);

    holder.push(newNote);

    const stringHolder = JSON.stringify(holder);

    fs.writeFile(
      path.join(__dirname, "/db/db.json"),
      stringHolder,
      "UTF8",
      function (err) {
        if (err) return console.log(err);
        return res.json(stringHolder);
      }
    );
  });
});

app.delete("/api/notes/:id", (req, res) => {
  noteID = parseInt(req.params.id);

  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    holder = JSON.parse(data);

    const idIndex = holder.findIndex((n) => n.id === noteID);

    if (idIndex === -1) {
      return res.sendStatus(404);
    }

    holder.splice(idIndex, 1);
    const stringDB = JSON.stringify(holder);

    fs.writeFile(
      path.join(__dirname, "/db/db.json"),
      stringDB,
      "UTF8",
      function (err) {
        if (err) return console.log(err);
        return res.sendStatus(200);
      }
    );
  });
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
