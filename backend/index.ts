import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;
app.get("/api/hello", (req, res) => {
  res.json({ message: "hello world" });
});
let jobs = [
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
app.delete("/api/deleteJob/:id", (req, res) => {
  const id = Number(req.params.id);
  jobs = jobs.filter((job) => job.id !== id);
  res.status(200).json({ message: "job deleted", id });
});

app.put("/api/updateStatus/:id", (req, res) => {
  const id = Number(req.params.id);
  const { applicationStatus } = req.body;
  const job = jobs.find((job) => job.id === id);
  if (!job) {
    return res.status(404).json({ message: "job not found" });
  }
  job.applicationStatus = applicationStatus;
  res.status(200).json(job);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
