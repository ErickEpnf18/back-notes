const http = require("http");
const express = require("express");
const initData = require("./data/index.js")
const cors = require('cors')


let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

// automatically express puts contect-type to text/application or text/plain

const app = express();
app.use(cors()) // same origin policy
app.use(express.json()); // json is (json-parser) for access data from body (useful to post wihtout this don't catch request.body because don't parse to javascript obj and also verified the content-type

const generateId = () =>
  (notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0) + 1;

app.post("/api/notes", (request, response) => {
  const { body } = request;
  if (!body.content)
    response.status(400).json({
      error: "content missing",
    });

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});



app.get("/", (request, response, next) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => {
    // console.log(note.id, typeof note.id, id, typeof id, note.id === id);
    return note.id === id;
  });
  console.log(id, note);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});


// middlewares
const requestLogger = (request, response, next) => {
  // console.log("Method:", request.method);
  // console.log("Path:  ", request.path);
  // console.log("Body:  ", request.body);
  // console.log("---");
  next();
  //response.send("<h1>Hello World!</h1>");
};
app.use(requestLogger);


// PERSONS API

app.get("/api/persons", (request, response) => {
  const { persons } = initData;
  response.json({ msg: "successful for now", data: persons });
});



// ends up here is when don't have enpoint recognized
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

