// Cross Origin Resource Sharing
const whiteList = ["http://localhost:8000", "https://www.google.com"];

export const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (whiteList.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};
