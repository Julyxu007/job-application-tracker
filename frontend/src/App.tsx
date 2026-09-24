import { useState, useEffect } from "react";
import "./App.css";
interface job {
  id: number;
  company: string;
  title: string;
  location: string;
  status: string;
  applied_date: string;
  created_at: string;
  updated_at: string;
}
function App() {
  const [jobs, setJobs] = useState<job[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  const [newApplication, setNewApplication] = useState({
    company: "",
    title: "",
    location: "",
    status: "",
    applied_date: "",
  });
  const addNewApplication = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/addApplication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newApplication),
      });
      const data = await response.json();
      setJobs([...jobs, data]);
      setNewApplication({
        company: "",
        title: "",
        location: "",
        status: "",
        applied_date: "",
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addNewApplication();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewApplication({
      ...newApplication,
      [name]: value,
    });
  };

  const deleteApplication = async (id: number) => {
    const response = await fetch(
      `http://localhost:3000/api/deleteApplication/${id}`,
      {
        method: "DELETE",
      },
    );
    const result = await response.json();
    console.log(result.message);
    setJobs(jobs.filter((job) => job.id !== id));
  };
  const updateApplicationStatus = async (id: number, status: string) => {
    const response = await fetch(
      `http://localhost:3000/api/updateApplicationStatus/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      },
    );
    const data = await response.json();
    setJobs(jobs.map((job) => (job.id === id ? data : job)));
  };
  return (
    <div>
      <h1>Jobs</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <span>{job.company}</span>
            <span>{job.title}</span>
            <span>{job.location}</span>
            <select
              value={job.status}
              onChange={(e) => updateApplicationStatus(job.id, e.target.value)}
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
            <span>{job.applied_date}</span>
            <span>{job.created_at}</span>
            <span>{job.updated_at}</span>
            <button onClick={async () => await deleteApplication(job.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <h2>Add New Job</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="company">Company</label>
        <input
          type="text"
          id="company"
          name="company"
          value={newApplication.company}
          onChange={handleInputChange}
        />
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={newApplication.title}
          onChange={handleInputChange}
        />
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={newApplication.location}
          onChange={handleInputChange}
        />
        <label htmlFor="status">Status</label>
        <input
          type="text"
          id="status"
          name="status"
          value={newApplication.status}
          onChange={handleInputChange}
        />
        <label htmlFor="applied_date">Applied Date</label>
        <input
          type="date"
          id="applied_date"
          name="applied_date"
          value={newApplication.applied_date}
          onChange={handleInputChange}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
export default App;
