import usersModel from "../model/users.json" assert { type: "json" };
import bcrypt from "bcrypt";

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
    // create JWTs
    res.json({ success: `User ${user} is logged in!` });
  } else {
    res.sendStatus(401);
  }
};
