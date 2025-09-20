import { memo, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale} from 'chart.js';
import type { InsightLog } from '../../types';

Chart.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

function LogChart({ logs }: { logs: InsightLog[] }) {

  const { labels, successData, failedData, yMax } = useMemo(() => {
    const now = new Date();
    const labels: string[] = [];
    const successData = Array(24).fill(0);
    const failedData = Array(24).fill(0);

    for (let i = 0; i < 24; i++) {
      const date = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
      labels.push(`${date.getHours().toString().padStart(2, '0')}:00`);
    }

    logs.forEach(({ _id, counts }) => {
      const logTime = new Date(_id).getTime();
      const diffMs = logTime - (now.getTime() - 24 * 60 * 60 * 1000);
      const diffHour = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHour >= 0 && diffHour < 24) {
        counts.forEach(({ status, count }) => {
          if (status === 'success') successData[diffHour] = count;
          if (status === 'failed') failedData[diffHour] = count;
        });
      }
    });

    const yMax = Math.ceil(Math.max(...successData, ...failedData) * 1.2);
    return { labels, successData, failedData, yMax };
  }, [logs]);

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Success',
        data: successData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.1)',
        tension: 0.4,
      },
      {
        label: 'Failed',
        data: failedData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.1)',
        tension: 0.4,
      },
    ],
  }), [labels, successData, failedData]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const } },
    scales: {
      y: { beginAtZero: true, precision: 0, ticks: { stepSize: 1 }, suggestedMax: yMax },
    },
  }), [yMax]);

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6 w-full">
      <h2 className="text-md font-semibold text-gray-700 mb-2">Job Executions (Last 24 Hours)</h2>
      <div className="w-full h-64 relative">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default memo(LogChart);