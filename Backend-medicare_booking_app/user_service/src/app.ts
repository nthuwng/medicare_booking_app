import express from "express";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 8081;

app.get("/", (req, res) => {
  res.send("Hello World! hungDev 123");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
