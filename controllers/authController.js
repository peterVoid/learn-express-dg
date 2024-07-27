import usersModel from "../model/users.json" assert { type: "json" };
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import { __dirname } from "../lib/routeFs.js";

const usersDB = {
  user: usersModel,
  setUser: function (data) {
    this.user = data;
  },
};

export const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !user)
    return res
      .status(400)
      .json({ message: "Username and password is invalid " });
  const foundUser = usersDB.user.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  //   evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // create JWT
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "50s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // Saving refreshToken with current user
    const otherUsers = usersDB.user.filter(
      (person) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUser([...otherUsers, currentUser]);
    await fs.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.user)
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};
