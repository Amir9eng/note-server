const http = require("http");

const app = http.createServer((request, response) => {
response.writeHead(200, { "Content-Type": "application/json" });
response.end(JSON.stringify(notes));
});

const app = http.createServer((request, response) => {
response.writeHead(200, { "Content-Type": "text/plain" });
response.end("Hello Nigeria");
});

app.get("/api/notes/:id", (request, response) => {
const id = request.params.id;
console.log(id);
const note = notes.find((note) => note.id === id);
console.log(note);
response.json(notes);
});

const generateId = () => {
const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
return maxId + 1;
};

app.post("/api/notes", (request, response) => {
const body = request.body;
if (!body) {
return response.status(400).json({
error: "content missing",
});
}

const note = {
content: body.content,
important: body.important || false,
date: new Date(),
id: generateId(),
};
notes = notes.concat(note);

response.json(notes);
});

# GET http://localhost:3002/api/notes

#

# POST http://localhost:3002/api/notes

# Content-Type: application/json
