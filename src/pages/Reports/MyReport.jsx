import React from 'react';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  Award
} from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color, bg }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mb-2">{value}</h3>
        <p className={`text-sm font-medium ${color}`}>{subtitle}</p>
      </div>
      <div className={`p-3 rounded-xl ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </div>
);

const MyReport = () => {
  const performanceData = [
    { subject: "Mathematics", score: 92, total: 100, completed: 15, pending: 1, color: "bg-blue-500" },
    { subject: "Science", score: 88, total: 100, completed: 12, pending: 2, color: "bg-emerald-500" },
    { subject: "History", score: 95, total: 100, completed: 10, pending: 0, color: "bg-amber-500" },
    { subject: "English", score: 85, total: 100, completed: 14, pending: 3, color: "bg-indigo-500" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-8 bg-slate-50 min-h-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Performance Report</h1>
        <p className="text-slate-500 mt-1">Track your academic progress and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Overall Average" 
          value="90%" 
          subtitle="+2.5% from last month"
          icon={Trophy}
          color="text-amber-500"
          bg="bg-amber-50"
        />
        <StatCard 
          title="Tasks Completed" 
          value="51" 
          subtitle="Out of 57 total tasks"
          icon={CheckCircle2}
          color="text-emerald-500"
          bg="bg-emerald-50"
        />
        <StatCard 
          title="On-Time Rate" 
          value="98%" 
          subtitle="Excellent time management"
          icon={Clock}
          color="text-blue-500"
          bg="bg-blue-50"
        />
        <StatCard 
          title="Current Rank" 
          value="Top 5%" 
          subtitle="In your class"
          icon={TrendingUp}
          color="text-indigo-500"
          bg="bg-indigo-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Subject Breakdown</h2>
          
          <div className="space-y-8">
            {performanceData.map((data, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-800">{data.subject}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {data.completed} tasks done
                    </span>
                  </div>
                  <span className="font-bold text-slate-800">{data.score}%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
                  <div 
                    className={`${data.color} h-3 rounded-full transition-all duration-1000 relative`}
                    style={{ width: `${data.score}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full rounded-full"></div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 text-right">
                  {data.pending > 0 ? `${data.pending} task(s) pending` : 'All caught up!'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Recent Achievements
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Perfect Score</h4>
                <p className="text-sm text-slate-500 mt-1">Got 100/100 in Math Midterm Task</p>
                <span className="text-xs text-slate-400 mt-1 block">2 days ago</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Task Master</h4>
                <p className="text-sm text-slate-500 mt-1">Completed 10 tasks in a row on time</p>
                <span className="text-xs text-slate-400 mt-1 block">1 week ago</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Early Bird</h4>
                <p className="text-sm text-slate-500 mt-1">Submitted 5 assignments a day early</p>
                <span className="text-xs text-slate-400 mt-1 block">2 weeks ago</span>
              </div>
            </div>
          </div>

          <button className="w-full mt-8 py-2.5 bg-slate-50 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors text-sm">
            View All Achievements
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyReport;
