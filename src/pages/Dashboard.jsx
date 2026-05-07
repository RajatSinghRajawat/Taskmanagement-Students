import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdBook, MdAssignment, MdCheckCircle, MdShowChart,
  MdNotificationsActive, MdAccessTime, MdAutorenew,
  MdKeyboardArrowRight, MdBarChart, MdSchool,
  MdPlayArrow, MdTimeline, MdOutlineEmojiEvents
} from 'react-icons/md';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE = 'http://localhost:7001/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState(null);
  const [data, setData] = useState({
    tasks: [],
    notifications: [],
    profile: null
  });

  const fetchAll = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const token = localStorage.getItem('studentToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [profileRes, notesRes] = await Promise.all([
        axios.get(`${API_BASE}/students/me`, config).catch(() => ({ data: { student: null } })),
        axios.get(`${API_BASE}/notifications/my-notifications`, config).catch(() => ({ data: { data: [] } }))
      ]);

      const student = profileRes.data.student;
      const course = student?.courses || student?.course || localStorage.getItem('studentCourse') || 'General';
      const batch = student?.batch || localStorage.getItem('studentBatch') || '2024';

      const tasksRes = await axios.get(`${API_BASE}/tasks/tasks-by-course?course=${encodeURIComponent(course)}&batch=${encodeURIComponent(batch)}`, config)
        .catch(() => ({ data: { tasks: [] } }));

      setData({
        profile: student,
        tasks: tasksRes.data.tasks || [],
        notifications: notesRes.data.data || []
      });

      if (student) {
        localStorage.setItem('studentData', JSON.stringify(student));
      }
    } catch (err) {
      console.error("Dashboard Sync Fault:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('studentData');
    if (userData) setUser(JSON.parse(userData));

    fetchAll();
    const pollId = setInterval(() => fetchAll(true), 10000); // Sync every 10s
    const clockId = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(pollId);
      clearInterval(clockId);
    };
  }, [fetchAll]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    const name = data.profile?.fullName ? data.profile.fullName.split(' ')[0] : (user?.name ? user.name.split(' ')[0] : 'Student');
    const timeGreeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    return `${timeGreeting}, ${name}`;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Loading Portal Data...</p>
    </div>
  );

  const pendingCount = data.tasks.filter(t => (t.Status || 'Pending').toLowerCase() !== 'completed').length;
  const completedCount = data.tasks.filter(t => (t.Status || 'Pending').toLowerCase() === 'completed').length;

  const stats = [
    {
      label: 'Academic Course',
      val: data.profile?.course || 'General',
      icon: <MdSchool size={26} />,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      path: '/profile',
      desc: 'Active learning track'
    },
    {
      label: 'Pending Tasks',
      val: pendingCount,
      icon: <MdAssignment size={26} />,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      path: '/tasks',
      desc: 'Tasks to be completed'
    },
    {
      label: 'Completed Tasks',
      val: completedCount,
      icon: <MdCheckCircle size={26} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      path: '/tasks',
      desc: 'Successfully completed'
    },
    {
      label: 'Learning Streak',
      val: '94%',
      icon: <MdTimeline size={26} />,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      path: '/report',
      desc: 'Performance consistency'
    },
  ];

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700 pb-20">

      {/* 🚀 ELITE HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-10">
          <img src="/logo.png" alt="TIPS-G Logo" className="h-28 w-auto hidden sm:block border-r-4 border-indigo-600 pr-10" />
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight font-display mb-1">
              {getGreeting()}
            </h1>
            <p className="text-slate-400 font-bold text-xs tracking-[0.1em] uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Student Management System • Connection Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
          <div className="px-6 py-3 bg-slate-50 rounded-2xl flex items-center gap-4">
            <MdAccessTime size={20} className="text-indigo-600" />
            <span className="text-sm font-black text-slate-800 tabular-nums">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <button
            onClick={() => fetchAll(true)}
            className={`p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 ${refreshing ? 'animate-spin' : ''}`}
          >
            <MdAutorenew size={22} />
          </button>
        </div>
      </div>

      {/* 📊 LIVE METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            whileHover={{ y: -5 }}
            key={i}
            onClick={() => navigate(s.path)}
            className="bg-white/80 backdrop-blur-xl p-6 rounded-[32px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 opacity-0 group-hover:opacity-100 rounded-bl-full transition-opacity" />
            <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 relative z-10 shadow-inner`}>
              {s.icon}
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 relative z-10 opacity-70">{s.label}</p>
            <div className="flex items-end justify-between relative z-10">
              <div className="flex items-baseline gap-1.5">
                <p className="text-3xl font-black text-slate-800 tracking-tight font-display tabular-nums truncate max-w-[150px]">{s.val}</p>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <MdKeyboardArrowRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 🛠️ LEARNING COMMAND CENTER */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-2xl p-10 rounded-[56px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/5 rounded-full blur-[80px]" />

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                  <MdPlayArrow size={24} />
                </div>
                <h3 className="text-3xl font-black text-slate-800 font-display tracking-tight">Learning Hub</h3>
              </div>
              <p className="text-slate-400 text-sm font-bold max-w-md leading-relaxed">
                Access your active course assignments, track progress, and communicate with your teachers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
              <button onClick={() => navigate('/tasks')} className="p-6 bg-indigo-600 text-white rounded-[28px] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
                <MdAssignment size={22} /> View Assignments
              </button>
              <button onClick={() => navigate('/materials')} className="p-6 bg-white border border-slate-100 text-slate-600 rounded-[28px] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                <MdBook size={22} /> View Resources
              </button>
              <button onClick={() => navigate('/report')} className="p-6 bg-white border border-slate-100 text-slate-600 rounded-[28px] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                <MdBarChart size={22} /> Analytics
              </button>
            </div>
          </div>
        </div>

        {/* 🔔 LIVE INTEL FEED */}
        <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-800 font-display tracking-tight">Recent Notifications</h3>
            <button onClick={() => navigate('/notifications')} className="p-2.5 bg-slate-50 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all">
              <MdNotificationsActive size={20} />
            </button>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar">
            {data.notifications.slice(0, 5).map((n, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-[28px] hover:bg-slate-50 transition-all group cursor-default border border-transparent hover:border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MdNotificationsActive size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-slate-700 leading-snug mb-1 line-clamp-2">{n.message}</p>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {data.notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <MdNotificationsActive size={32} />
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No New Intel</p>
              </div>
            )}
          </div>

          <button onClick={() => navigate('/notifications')} className="w-full py-5 mt-6 bg-slate-50 text-slate-400 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-all">
            View All Notifications
          </button>
        </div>
      </div>

      {/* 🏆 RECENT ACHIEVEMENTS / TASKS */}
      <div className="bg-white/40 backdrop-blur-xl p-10 rounded-[56px] border border-white/60 shadow-sm">
        <div className="flex items-center justify-between mb-10 px-4">
          <div>
            <h3 className="text-2xl font-black text-slate-800 font-display tracking-tight flex items-center gap-3">
              <MdOutlineEmojiEvents size={28} className="text-amber-500" /> Recent Deployments
            </h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Latest assignments in your sector</p>
          </div>
          <Link to="/tasks" className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-indigo-600 transition-all">
            <MdKeyboardArrowRight size={24} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.tasks.slice(0, 3).map((task) => (
            <div key={task._id} onClick={() => navigate('/tasks')} className="bg-white p-6 rounded-[32px] border border-slate-100 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <MdAssignment size={20} />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-black text-slate-700 truncate">{task.Title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.course}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${task.Status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {task.Status}
                </span>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  Due {new Date(task.Deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            </div>
          ))}
          {data.tasks.length === 0 && (
            <div className="col-span-full py-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-[32px]">
              No assignments found
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
