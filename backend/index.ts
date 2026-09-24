import express from "express";
import cors from "cors";
import pool from "./db.js";
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;

app.get("/api/jobs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jobs ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: "internal server error",
    });
  }
});
app.post("/api/addApplication", async (req, res) => {
  const { company, title, location, status, applied_date } = req.body;
  const result = await pool.query(
    "INSERT INTO jobs(company, title,location, status,applied_date) VALUES($1,$2,$3,$4,$5)RETURNING *",
    [company, title, location, status, applied_date],
  );
  res.status(201).json(result.rows[0]);
});

app.delete("/api/deleteApplication/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await pool.query("Delete from jobs where id = $1", [id]);
    res.status(200).json({
      message: "application deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "internal server error",
    });
  }
});

app.put("/api/updateApplicationStatus/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const result = await pool.query(
      `Update jobs set status = $1 where id = $2
      RETURNING *`,
      [status, id],
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      message: "internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
