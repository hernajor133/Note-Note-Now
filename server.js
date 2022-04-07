const express = require("express");
const path = require("path");
const fs = require("fs");

const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const noteLog = require("./db/db.json");


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.json(noteLog);
});

app.post("/api/notes", (req, res) => {
  let jsonFilePath = path.join(__dirname, "/db/db.json");
  newNote = req.body;

  newNote.id = uuidv4();

  noteLog.push(newNote);

  fs.writeFile(jsonFilePath, JSON.stringify(noteLog), (err) => {
    if (err) {
      return console.log(err);
    } else {
      console.log("Note Saved 💾 ");
    }
  });

  res.json(newNote);
});

app.delete("/api/notes/:id", function (req, res) {
  let id = req.params.id.toString();

  for (i = 0; i < noteLog.length; i++) {
    if (noteLog[i].id == id) {
      res.send(noteLog[i]);

      noteLog.splice(i, 1);
      break;
    }
  }

  let jsonFilePath = path.join(__dirname, "/db/db.json");

  fs.writeFile(jsonFilePath, JSON.stringify(noteLog), (err) => {
    if (err) {
      return console.log(err);
    } else {
      console.log("Note Trashed 🗑️ ");
    }
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
