import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  findUserByNameAndJob,
  deleteUser
} from "./services/user-service.js";


dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  getUsers(name, job)
    .then((users) => {
      res.send({ users_list: users });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Server error.");
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  addUser(userToAdd)
    .then((savedUser) => {
      res.status(201).send(savedUser);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("Invalid user data");
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  findUserById(id).then( (result) => {
    if (result === null) {
      res.status(404).send("Resource not found.");
    } else {
      res.send(result);
    }
  }).catch( (error) => {
    console.log(error), res.status(500).send("Server error.");
  });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  deleteUser(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).send("Not found");
      }
      res.status(204).send();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Server error.");
    });

});