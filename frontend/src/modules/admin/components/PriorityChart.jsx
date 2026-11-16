
import { useState, useEffect } from 'react';
import axiosInstance from '../../../shared/api/axiosInstance';
import { API_PATHS } from '../../../shared/api/apipaths';

const BAR_COLORS = {
  Low: 'bg-emerald-500',
  Medium: 'bg-orange-500',
  High: 'bg-rose-500',
};

export default function PriorityChart() {

  const [dashboardData, setDashboardData] = useState([]);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_ALL_TASKS
      );

      setDashboardData(
        Array.isArray(response.data)
          ? response.data
          : response.data.tasks || []
      );

    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  // Calculate priority distribution
  const data = [
    {
      label: 'Low',
      value: dashboardData.filter(
        (task) => task.priority === 'Low'
      ).length,
    },
    {
      label: 'Medium',
      value: dashboardData.filter(
        (task) => task.priority === 'Medium'
      ).length,
    },
    {
      label: 'High',
      value: dashboardData.filter(
        (task) => task.priority === 'High'
      ).length,
    },
  ];

  // Calculate chart scale
  const max = Math.max(
    Math.ceil(Math.max(...data.map((d) => d.value), 1) / 2) * 2,
    2
  );

  const ticks = Array.from(
    { length: max / 2 + 1 },
    (_, i) => max - i * 2
  );

  return (
    <div className="flex h-64 gap-3">

      {/* Y axis */}
      <div className="flex flex-col justify-between pb-6 text-xs text-slate-400">
        {ticks.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>

      {/* Bars */}
      <div className="grid flex-1 grid-cols-3 gap-4 sm:gap-8">

        {data.map((d) => (
          <div key={d.label} className="flex flex-col">

            <div className="flex flex-1 items-end border-b border-slate-100">

              <div
                className={`w-full rounded-t-lg ${BAR_COLORS[d.label]}`}
                style={{
                  height: `${(d.value / max) * 100}%`
                }}
                title={`${d.label}: ${d.value}`}
              />

            </div>

            <span className="mt-2 text-center text-xs text-slate-500">
              {d.label} ({d.value})
            </span>

          </div>
        ))}

      </div>
    </div>
  );
}
