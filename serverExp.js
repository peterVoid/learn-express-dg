import express from "express";
import path from "path";
import cors from "cors";
import url from "url";
import { logger } from "./middleware/logEvents.js";
import subDirRoute from "./routes/subDir.js";
import rootRoute from "./routes/root.js";
import rootEmployees from "./routes/api/employees.js";
import { corsOptions } from "./config/corsOptions.js";

const PORT = process.env.PORT || 8000;
const app = express();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// custom middleware logger
app.use(logger);

// THIRD PARTY MIDDLEWARE
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// serve static files -> such as css file
app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", rootRoute);
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
