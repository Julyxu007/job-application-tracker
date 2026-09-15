import { useState, useEffect } from "react";
interface job {
  id: number;
  company: string;
  title: string;
  applicationStatus: string;
}
function App() {
  const [jobs, setJobs] = useState<job[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);
  const [newJob, setNewJob] = useState({
    company: "",
    title: "",
    applicationStatus: "",
  });
  const addNewJob = () => {
    fetch("http://localhost:3000/api/addJob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newJob),
    })
      .then((response) => response.json())
      .then((newJob) => setJobs([...jobs, newJob]))
      .then(() => setNewJob({ company: "", title: "", applicationStatus: "" }));
  };
  const deleteJob = (id: number) => {
    fetch(`http://localhost:3000/api/deleteJob/${id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then(() => setJobs(jobs.filter((job) => job.id !== id)));
  };

  const updateStatus = (id: number, newStatus: string) => {
    fetch(`http://localhost:3000/api/updateStatus/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicationStatus: newStatus,
      }),
    })
      .then((response) => response.json())
      .then((updatedJob) =>
        setJobs(jobs.map((job) => (job.id === id ? updatedJob : job))),
      );
  };
  return (
    <div>
      <h1>Jobs</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            {job.company}
            {job.title}
            <select
              value={job.applicationStatus}
              onChange={(e) => updateStatus(job.id, e.target.value)}
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
            <button type="button" onClick={() => deleteJob(job.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <h2>Add New Job</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addNewJob();
        }}
      >
        <div>
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={newJob.company}
            onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="applicationStatus">Application Status</label>
          <input
            type="text"
            id="applicationStatus"
            name="applicationStatus"
            value={newJob.applicationStatus}
            onChange={(e) =>
              setNewJob({ ...newJob, applicationStatus: e.target.value })
            }
          />
        </div>
        <button type="submit">Add Job</button>
      </form>
    </div>
  );
}
export default App;
