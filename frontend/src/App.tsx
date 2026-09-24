import { useState, useEffect } from "react";
import "./App.css";
const API_BASE = "http://localhost:3000";
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
    fetch(`${API_BASE}/api/jobs`)
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);
  useEffect(() => {
    fetch(`${API_BASE}/api/interviews`)
      .then((res) => res.json())
      .then((data) => setInterview(data));
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
      const response = await fetch(`${API_BASE}/api/addApplication`, {
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
    const response = await fetch(`${API_BASE}/api/deleteApplication/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    console.log(result.message);
    setJobs(jobs.filter((job) => job.id !== id));
  };
  const updateApplicationStatus = async (id: number, status: string) => {
    const response = await fetch(
      `${API_BASE}/api/updateApplicationStatus/${id}`,
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

  interface Interview {
    id: number;
    job_id: number;
    round: number;
    date: string;
    note: string;
  }

  const [interview, setInterview] = useState<Interview[]>([]);
  // const getInterviews = async (jobId: number) => {
  //   const response = await fetch(`${API_BASE}/api/job/${jobId}/interviews`);
  //   const data = await response.json();
  //   setInterview([...interview, ...data]);
  // };

  const [newInterview, setNewInterview] = useState<{
    [jobId: number]: {
      round: number;
      date: string;
      note: string;
    };
  }>({});
  const addNewInterview = async (jobId: number) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/job/${jobId}/addNewInterview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newInterview[jobId]),
        },
      );
      const data = await response.json();
      setInterview([...interview, data]);
      setNewInterview({
        ...newInterview,
        [jobId]: {
          round: 0,
          date: "",
          note: "",
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleInterviewInputChange = (
    jobId: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setNewInterview({
      ...newInterview,
      [jobId]: {
        ...newInterview[jobId],
        [name]: value,
      },
    });
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

            {job.status === "Interviewing" && (
              <div>
                <h2>Interview records</h2>
                <ul>
                  {interview
                    .filter((iv) => iv.job_id === job.id)
                    .map((iv) => (
                      <li key={iv.id}>
                        <span>round:{iv.round}</span>
                        <span>date:{iv.date}</span>
                        <span>note:{iv.note}</span>
                      </li>
                    ))}
                </ul>
                <div>
                  <label htmlFor="round">Interview Round</label>
                  <input
                    type="number"
                    id="round"
                    name="round"
                    value={newInterview[job.id]?.round ?? ""}
                    onChange={(e) => handleInterviewInputChange(job.id, e)}
                  />
                  <label htmlFor="date">Interview Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newInterview[job.id]?.date ?? ""}
                    onChange={(e) => handleInterviewInputChange(job.id, e)}
                  />

                  <label htmlFor="note">Note</label>
                  <input
                    type="text"
                    id="note"
                    name="note"
                    value={newInterview[job.id]?.note ?? ""}
                    onChange={(e) => handleInterviewInputChange(job.id, e)}
                  />
                  <button onClick={() => addNewInterview(job.id)}>
                    Add new Interview
                  </button>
                </div>
              </div>
            )}
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
