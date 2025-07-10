import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const hours = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, '0')}:00`
);

// Dummy 24-hour data
const successData = [
  0, 1, 0, 2, 3, 5, 4, 6, 7, 5, 6, 4, 3, 4, 6, 5, 4, 3, 2, 2, 1, 1, 0, 0,
];
const failedData = [
  0, 0, 0, 1, 0, 1, 1, 0, 1, 2, 1, 0, 1, 2, 1, 1, 2, 1, 0, 0, 1, 1, 0, 0,
];

const data = {
  labels: hours,
  datasets: [
    {
      label: 'Success',
      data: successData,
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      fill: true,
      tension: 0.3,
    },
    {
      label: 'Failed',
      data: failedData,
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      fill: true,
      tension: 0.3,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    x: {
      ticks: {
        maxRotation: 90,
        minRotation: 45,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
};

export default function LogLineChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6 w-full">
      <h2 className="text-md font-semibold text-gray-700 mb-2">Job Executions (Last 24 Hours)</h2>
      <div className='w-full h-64 relative'>
      <Line data={data} options={options} />
      </div>
    </div>
  );
}
