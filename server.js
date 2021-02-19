const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: "1",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "2",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "john@gmail.com",
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

// const passwordCompare = async (hashPassword, userPassword) => {
//   try {
//     const match = await bcrypt.compare(userPassword, hashPassword);
//     if (!match) {
//       throw new Error("Authentication Error");
//     }
//     return match;
//   } catch (error) {
//     throw new Error("Caught an error: ", error);
//   }
// };

////SIGN IN
app.post("/signin", (req, res) => {
  for (let i = 0; i < database.users.length; i++) {
    if (database.users[i].email === req.body.email) {
      bcrypt.compare(
        req.body.password,
        database.users[i].password,
        (error, result) => {
          if (error) {
            console.log(error);
          }
          if (result) {
            res.json(database.users[i]);
          } else {
            res.status(400).json("Incorrect credentials");
          }
        }
      );
    }
  }
});
////****

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  bcrypt.hash(password, null, null, function (err, hash) {
    database.users.push({
      id: Number(database.users[database.users.length - 1].id) + 1,
      name: name,
      email: email,
      password: hash,
      entries: 0,
      joined: new Date(),
    });
    res.json(database.users[database.users.length - 1]);
  });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("User not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json("User not found");
  }
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});

/*
/ --> res = this is working
/signin --POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user


*/
