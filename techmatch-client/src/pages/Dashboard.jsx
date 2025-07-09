// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('/jobs/match');
        setJobs(res.data);
      } catch (err) {
        toast.error('Failed to load matched jobs');
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Matched Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job, idx) => (
          <div key={idx} className="border p-4 rounded shadow bg-white">
            <h3 className="font-bold text-lg">{job.title}</h3>
            <p>{job.company} • {job.location}</p>
            <p className="text-sm text-gray-600">Skills: {job.skillsRequired}</p>
            <p className="mt-1 text-green-600 font-medium">Match: {job.matchPercentage}%</p>
            <div className="mt-2 space-x-2">
              <button className="btn-primary px-3">Apply</button>
              <button className="btn-secondary px-3">Save</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
