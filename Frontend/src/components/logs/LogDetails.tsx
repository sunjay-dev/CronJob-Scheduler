import React from 'react';
import type { UserLogInterface } from '../../types';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    type TooltipItem,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
    details: UserLogInterface;
    setOpenDetailsMenu: React.Dispatch<React.SetStateAction<boolean>>;
    timeFormat24?: boolean
}

export default function LogDetails({ details, setOpenDetailsMenu, timeFormat24 }: Props) {

    const closeDetails = () => setOpenDetailsMenu(false);

    const chartData = details?.responseTime ? {
        labels: [''],
        datasets: [
            {
                label: 'DNS',
                data: [details.responseTime.DNS],
                backgroundColor: '#60a5fa',
                stack: 'timing',
            },
            {
                label: 'Connect',
                data: [details.responseTime.Connect],
                backgroundColor: '#34d399',
                stack: 'timing',
            },
            {
                label: 'SSL',
                data: [details.responseTime.SSL],
                backgroundColor: '#fbbf24',
                stack: 'timing',
            },
            {
                label: 'Send',
                data: [details.responseTime.Send],
                backgroundColor: '#f87171',
                stack: 'timing',
            },
            {
                label: 'Wait',
                data: [details.responseTime.Wait],
                backgroundColor: '#a78bfa',
                stack: 'timing',
            },
            {
                label: 'Receive',
                data: [details.responseTime.Receive],
                backgroundColor: '#38bdf8',
                stack: 'timing',
            },
        ],
    } : null;

    const chartOptions = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: TooltipItem<'bar'>) {
                        return `${context.dataset.label}: ${context.parsed.x} ms`;
                    },
                },
            },
        },
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Time (ms)',
                },
                min: 0,
                max: details?.responseTime?.Total
            },
            y: {
                stacked: true,
                grid: {
                    display: false,
                },
            },
        },
    };


    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <div className="bg-white max-w-4xl w-full px-6 py-5 rounded-sm relative tracking-wide">
                <h2 className="text-lg font-semibold mb-6">Execution Details ({new Date(details.createdAt).toLocaleTimeString('en-US', {
                    hour12: !timeFormat24,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                })})</h2>

                <div className="mb-3 space-y-1">
                    <p>FETCHED URL:</p>
                    <p className="break-words font-medium">{details.url}</p>
                </div>

                <div className="mb-3 space-y-1">
                    <p>STATUS:</p>
                    <p className='capitalize font-medium'>{details.statusCode}  {details.response || details.status}</p>
                </div>

                {chartData && (
                    <div className="mt-4 sm:hidden md:block">
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Timing</h3>
                        <div className="w-full h-36 relative">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>
                )}
                <div className='text-end'>
                    <button onClick={closeDetails} className="text-gray-500 hover:bg-gray-50 p-2 hover:text-gray-700 rounded">
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    )
}
