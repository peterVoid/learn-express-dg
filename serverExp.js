import express from "express";
import path from "path";
import cors from "cors";
import { logger } from "./middleware/logEvents.js";
import rootRoute from "./routes/root.js";
import rootEmployees from "./routes/api/employees.js";
import rootRegister from "./routes/register.js";
import rootAuth from "./routes/auth.js";
import rootRefresh from "./routes/refresh.js";
import { corsOptions } from "./config/corsOptions.js";
import { __dirname } from "./lib/routeFs.js";
import { verifyJWT } from "./middleware/verifyJWT.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 8000;
const app = express();

// custom middleware logger
app.use(logger);

// THIRD PARTY MIDDLEWARE
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookie
app.use(cookieParser());

// serve static files -> such as css file
app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", rootRoute);
app.use("/register", rootRegister);
app.use("/auth", rootAuth);
app.use("/refresh", rootRefresh);

app.use(verifyJWT);
app.use("/employee", rootEmployees);

// app.all("*", (req, res) => {
//   res.status(404);
//   if (req.accepts("html")) {
//     res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
//   } else if (req.accepts("json")) {
//     res.json({ error: "404 Not Found" });
//   } else {
//     res.type("txt").send("404 Not Found");
//   }
// });

// app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
