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

// const users = {
//     users_list: [
//         {
//         id: "xyz789",
//         name: "Charlie",
//         job: "Janitor"
//         },
//         {
//         id: "abc123",
//         name: "Mac",
//         job: "Bouncer"
//         },
//         {
//         id: "ppp222",
//         name: "Mac",
//         job: "Professor"
//         },
//         {
//         id: "yat999",
//         name: "Dee",
//         job: "Aspring actress"
//         },
//         {
//         id: "zap555",
//         name: "Dennis",
//         job: "Bartender"
//         }
//       ]
// }


// const findUserByName = (name) => {
//   return users["users_list"].filter(
//     (user) => user["name"] === name
//   );
// };


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


// app.get("/users", (req, res) => {
//   const name = req.query.name;
//   const job = req.query.job
//   let result = users.users_list;

//   if (name !== undefined && job !== undefined) {
//     result = findUserByNameAndJob(name, job);
//   } else if (name !== undefined) {
//     result = findUserByName(name);
//   }
//   res.send({ users_list: result });
// });

// const addUser = (user) => {
//   users["users_list"].push(user);
//   return user;
// };

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  const new_user = {
    id: Math.floor(Math.random() * 1000),
    name: userToAdd["name"],
    job: userToAdd["job"]
  }

  addUser(new_user).then(() =>
  res.status(201).send(new_user))
  .catch((error) => {console.log(error), res.status(400).send("Invalid user data");})
});

// const findUserById = (id) =>
//   users["users_list"].find((user) => user["id"] === id);

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

const deleteUser = (id) => {
  const index = users["users_list"].findIndex( (user) => String(user.id) === String(id));

  if (index === -1) {
    return 404;
  }

  users.users_list.splice(index, 1);
  return 204;
};

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const status = deleteUser(id)
  res.status(status).send();
  })

// const findUserByNameAndJob = (name, job) => {
//   return users["users_list"].filter(
//     (user) => user["name"] === name && user["job"] === job
//   );
// };