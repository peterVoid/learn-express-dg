import usersModel from "../model/users.json" assert { type: "json" };
import fsPromises from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import { __dirname } from "../lib/routeFs.js";

const usersDB = {
  user: usersModel,
  setUser: function (data) {
    this.user = data;
  },
};

export const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res.status(400).json({ msg: "Username and password are required" });
  //   check for duplicate usernames in the db
  const duplicate = usersDB.user.find((person) => person.username === user);
  if (duplicate) return res.sendStatus(409); //conflict

  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // store the new user
    const newUser = { username: user, password: hashedPwd };
    usersDB.setUser([...usersDB.user, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.user)
    );
    console.log(usersDB.user);
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
