import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
const PORT = 3000;
app.get("/hello", (req, res) => {
  res.json({ message: "hello world" });
});
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
