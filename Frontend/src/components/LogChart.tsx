import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';
import { useMemo } from 'react';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

interface Log {
  createdAt: string;
  status: 'success' | 'failed';
}

interface Props {
  logs: Log[];
}

export default function LogLineChart({ logs }: Props) {
  const { labels, successData, failedData } = useMemo(() => {
    const labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    const successData = Array(24).fill(0);
    const failedData = Array(24).fill(0);

    logs.forEach(log => {
      const hour = new Date(log.createdAt).getHours();
      if (log.status === 'success') successData[hour]++;
      else failedData[hour]++;
    });

    return { labels, successData, failedData };
  }, [logs]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Success',
        data: successData,
        borderColor: '#10b981', // green-500
        backgroundColor: 'rgba(16,185,129,0.1)',
        tension: 0.4,
      },
      {
        label: 'Failed',
        data: failedData,
        borderColor: '#ef4444', // red-500
        backgroundColor: 'rgba(239,68,68,0.1)',
        tension: 0.4,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
        ticks: {
          stepSize: 1,
        },
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6 w-full">
      <h2 className="text-md font-semibold text-gray-700 mb-2">Job Executions (Last 24 Hours)</h2>
      <div className="w-full h-64 relative">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
