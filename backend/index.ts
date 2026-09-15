import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;
app.get("/api/hello", (req, res) => {
  res.json({ message: "hello world" });
});
const jobs = [
  {
    id: 1,
    company: "Google",
    title: "Software Engineer",
    applicationStatus: "Applied",
  },
  {
    id: 2,
    company: "Facebook",
    title: "Data Scientist",
    applicationStatus: "Applied",
  },
];

app.get("/api/jobs", (req, res) => {
  res.json(jobs);
});
app.post("/api/addJob", (req, res) => {
  const job = req.body;
  jobs.push(job);
  res.status(201).json(job);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
