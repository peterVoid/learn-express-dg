import usersModel from "../model/users.json" assert { type: "json" };
import fsPromises from "fs/promises";
import path from "path";

import { __dirname } from "../lib/routeFs.js";

const usersDB = {
  user: usersModel,
  setUser: function (data) {
    this.user = data;
  },
};

export const handleLogout = async (req, res) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No Content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = usersDB.user.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }
  //   Delete refreshToken in db
  const otherUser = usersDB.user.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };
  usersDB.setUser([...otherUser, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.user)
  );

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //secure: true - only servers on https
  res.sendStatus(204);
};
