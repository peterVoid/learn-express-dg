import usersModel from "../model/users.json" assert { type: "json" };
import jwt from "jsonwebtoken";

import { __dirname } from "../lib/routeFs.js";

const usersDB = {
  user: usersModel,
  setUser: function (data) {
    this.user = data;
  },
};

export const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;
  const foundUser = usersDB.user.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) return res.sendStatus(403); //Forbidden
  //   evaluate jwt

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "50s" }
    );
    res.json({ accessToken });
  });
};
