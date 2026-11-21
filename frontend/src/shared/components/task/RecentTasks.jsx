import { ArrowRight } from 'lucide-react';
import moment from 'moment';
import { PRIORITY_STYLES, STATUS_STYLES } from './taskStyles';

const Badge = ({ className, children }) => (
  <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-medium ${className}`}>{children}</span>
);

export default function RecentTasks({ tasks = [], onSeeAll, onTaskClick }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Recent Tasks</h2>
        <button
          type="button"
          onClick={onSeeAll}
          className="flex items-center gap-2 rounded-lg bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          See All <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">No tasks yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="py-3 font-medium">Name</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium">Priority</th>
                <th className="py-3 font-medium">Due date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr
                  key={t._id}
                  onClick={() => onTaskClick?.(t)}
                  className={`border-b border-slate-50 last:border-0 ${onTaskClick ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                >
                  <td className="py-3.5 pr-4 font-medium text-slate-800">{t.title}</td>
                  <td className="py-3.5 pr-4">
                    <Badge className={STATUS_STYLES[t.status]}>{t.status}</Badge>
                  </td>
                  <td className="py-3.5 pr-4">
                    <Badge className={PRIORITY_STYLES[t.priority]}>{t.priority}</Badge>
                  </td>
                  <td className="py-3.5 text-slate-500">{moment(t.dueDate).format('DD MMM YYYY')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
