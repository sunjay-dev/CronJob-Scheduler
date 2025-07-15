import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { JobInterface } from '../types';

interface JobState {
  jobs: JobInterface[];
}

const initialState: JobState = {
  jobs: []
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs(state, action: PayloadAction<JobInterface[]>) {
      state.jobs = action.payload;
    },
    addJob(state, action: PayloadAction<JobInterface>) {
      state.jobs.push(action.payload);
    },
    removeJob(state, action: PayloadAction<string>) {
      state.jobs = state.jobs.filter(job => job._id !== action.payload);
    },
    updateJobStatus(state, action: PayloadAction<{ jobId: string; disabled: boolean }>) {
      const job = state.jobs.find(job => job._id === action.payload.jobId);
      if (job) {
        job.disabled = action.payload.disabled;
      }
    },
    clearJobs(state) {
      state.jobs = [];
    },
  },
});

export const { setJobs, addJob, removeJob, updateJobStatus, clearJobs } = jobSlice.actions;
export default jobSlice.reducer;