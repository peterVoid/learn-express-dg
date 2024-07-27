import express from "express";
import path from "path";
import cors from "cors";
import url from "url";
import { logger } from "./middleware/logEvents.js";
import { errorHandler } from "./middleware/errorHandler.js";
import subDirRoute from "./routes/subDir.js";
import rootRoute from "./routes/root.js";
import rootEmployees from "./routes/api/employees.js";

const PORT = process.env.PORT || 8000;
const app = express();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
const whiteList = ["http://localhost:8000", "https://www.google.com"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other word, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// serve static files -> such as css file
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

app.use("/", rootRoute);
app.use("/subdir", subDirRoute);
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
