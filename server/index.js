const express = require("express");
const morgan = require("morgan");
const monk = require("monk");
const cors = require("cors");

const connectionUrl = process.env.DB_URL || 'localhost/postyman';
const connection = monk(connectionUrl);
connection.then(x => console.log("connected to database at : " + connectionUrl))
    .catch(x => console.log("failed to connect to db at: " + connectionUrl));
const db = connection.get("posts");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/api/posts", async (req, res) =>
{
    res.json(await db.find());
})

app.post("/api/posts", (req, res) =>
{
    db.insert(req.body);
    console.log(req.body);

    res.status(201).end();
})

app.delete("/api/posts/:id", (req, res) =>
{
    db.remove({ _id: req.params.id });
    res.status(200).end();

})

const portNumber = process.env.PORT || 333;
app.listen(portNumber, () => { console.log("listening to: " + portNumber) });