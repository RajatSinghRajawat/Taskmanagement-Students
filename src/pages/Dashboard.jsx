import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, bg, trend }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      {trend && (
        <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <TrendingUp className="w-4 h-4 mr-1" />
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const recentTasks = [
    {
      id: 1,
      title: "Science Project: Solar System",
      subject: "Science",
      dueDate: "Today, 11:59 PM",
      status: "pending",
      priority: "high"
    },
    {
      id: 2,
      title: "Math Chapter 5 Exercise",
      subject: "Mathematics",
      dueDate: "Tomorrow, 5:00 PM",
      status: "in-progress",
      priority: "medium"
    },
    {
      id: 3,
      title: "History Essay: World War II",
      subject: "History",
      dueDate: "Completed",
      status: "completed",
      priority: "low"
    }
  ];

  const upcomingMaterials = [
    { title: "Algebra Basics Notes", type: "PDF", time: "2 hours ago" },
    { title: "Biology: Cells Video", type: "Video", time: "5 hours ago" }
  ];

  return (
    <div className="space-y-6 p-4 sm:p-8 bg-slate-50 min-h-full">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Ready to learn, Alex? 🚀</h2>
          <p className="text-blue-100 max-w-lg mb-6">
            You have 3 pending tasks for today. Let's finish them and keep your streak going!
          </p>
          <Link to="/tasks" className="inline-flex items-center px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
            View Tasks
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute right-40 bottom-0 w-40 h-40 bg-indigo-500/30 rounded-full blur-2xl -mb-10"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Tasks" 
          value="24" 
          icon={FileText} 
          color="text-blue-600" 
          bg="bg-blue-50" 
        />
        <StatCard 
          title="Completed" 
          value="18" 
          icon={CheckCircle2} 
          color="text-emerald-600" 
          bg="bg-emerald-50"
          trend="+2 this week"
        />
        <StatCard 
          title="Pending" 
          value="5" 
          icon={Clock} 
          color="text-amber-600" 
          bg="bg-amber-50" 
        />
        <StatCard 
          title="Overdue" 
          value="1" 
          icon={AlertCircle} 
          color="text-red-600" 
          bg="bg-red-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Your Tasks</h3>
            <Link to="/tasks" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors gap-4">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    task.status === 'completed' ? 'bg-emerald-500' : 
                    task.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                  <div>
                    <h4 className="font-semibold text-slate-800">{task.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{task.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:ml-auto w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-sm text-slate-500 flex items-center bg-slate-50 px-3 py-1 rounded-lg">
                    <Clock className="w-4 h-4 mr-1.5" />
                    {task.dueDate}
                  </div>
                  {task.status !== 'completed' ? (
                    <Link to="/tasks" className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Start
                    </Link>
                  ) : (
                    <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg">
                      Done
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Materials */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">New Materials</h3>
          <div className="space-y-5">
            {upcomingMaterials.map((mat, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${
                  mat.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 line-clamp-1">{mat.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{mat.type} • {mat.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/materials" className="mt-6 block w-full py-2.5 px-4 text-center text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
            Browse Library
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
