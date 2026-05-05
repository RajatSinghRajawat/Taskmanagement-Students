import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
   MdSearch, MdRefresh, MdAssignment,
   MdDoneAll, MdPendingActions, MdErrorOutline, MdListAlt,
   MdFilterList, MdClearAll, MdCheckCircleOutline,
   MdArrowBack, MdCloudUpload, MdClose, MdInfoOutline,
   MdOutlineDescription, MdAttachFile, MdQuestionAnswer, MdArrowForward,
   MdRocketLaunch, MdLayers, MdShortText, MdFormatAlignLeft, MdRadioButtonChecked,
   MdEditNote, MdInsertDriveFile, MdFactCheck, MdAutoStories, MdSchool, MdTimer,
   MdExplore, MdVerified
} from 'react-icons/md';
import TaskCard from '../../components/TaskCard';

const API_BASE = 'http://localhost:7001/api';
const COURSES = [
   "Software-Development", "Data-Science", "Cyber-Security", "Cloud-Computing",
   "Artificial-Intelligence", "Digital-Marketing", "UI-UX-Design",
   "Business-Analytics", "Project-Management", "DevOps"
];

const Tasks = () => {
   const navigate = useNavigate();
   const [viewMode, setViewMode] = useState('list'); // 'list', 'details', 'submit'
   const [selectedTask, setSelectedTask] = useState(null);
   const [tasks, setTasks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);
   const [search, setSearch] = useState('');
   const [filters, setFilters] = useState({ course: 'All', priority: 'All', status: 'All' });

   // Submit states
   const [files, setFiles] = useState([]);
   const [comments, setComments] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitted, setSubmitted] = useState(false);
   const [answers, setAnswers] = useState({}); 
   const [existingSubmission, setExistingSubmission] = useState(null);

   const fetchData = useCallback(async (isSilent = false) => {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);
      try {
         const token = localStorage.getItem('studentToken');
         const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
         const course = studentData.courses || studentData.course || localStorage.getItem('studentCourse') || 'General';
         const batch = studentData.batch || localStorage.getItem('studentBatch') || '2024';

         const res = await axios.get(`${API_BASE}/tasks/tasks-by-course?course=${encodeURIComponent(course)}&batch=${encodeURIComponent(batch)}`, { 
            headers: { Authorization: `Bearer ${token}` } 
         });
         setTasks(res.data.tasks || []);
      } catch { 
         toast.error('Telemetry Sync Fault'); 
      } finally { 
         setLoading(false); 
         setRefreshing(false); 
      }
   }, []);

   useEffect(() => { 
      fetchData(); 
      const pollId = setInterval(() => fetchData(true), 15000);
      return () => clearInterval(pollId);
   }, [fetchData]);

   const filteredTasks = useMemo(() => tasks.filter(t => {
      const s = search.toLowerCase();
      const matchesSearch = t.Title?.toLowerCase().includes(s) || t.Description?.toLowerCase().includes(s);
      const matchesCourse = filters.course === 'All' || t.course === filters.course;
      const matchesPriority = filters.priority === 'All' || t.Priority === filters.priority;
      const matchesStatus = filters.status === 'All' || (filters.status === 'Completed' ? (t.Status === 'Completed' || t.status === 'completed') : (t.Status !== 'Completed' && t.status !== 'completed'));
      return matchesSearch && matchesCourse && matchesPriority && matchesStatus;
   }), [tasks, search, filters]);

   const stats = useMemo(() => [
      { label: 'Assigned Tasks', val: filteredTasks.length, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <MdListAlt size={26} /> },
      { label: 'Pending Missions', val: filteredTasks.filter(t => t.Status !== 'Completed').length, color: 'text-purple-600', bg: 'bg-purple-50', icon: <MdPendingActions size={26} /> },
      { label: 'Success Deployments', val: filteredTasks.filter(t => t.Status === 'Completed').length, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <MdCheckCircleOutline size={26} /> },
      { label: 'Critical Alerts', val: filteredTasks.filter(t => new Date(t.Deadline) < new Date() && t.Status !== 'Completed').length, color: 'text-rose-600', bg: 'bg-rose-50', icon: <MdErrorOutline size={26} /> },
   ], [filteredTasks]);

   const handleViewTask = async (task) => {
      setSelectedTask(task);
      setViewMode('details');
      setExistingSubmission(null);
      
      try {
         const token = localStorage.getItem('studentToken');
         const res = await axios.get(`${API_BASE}/tasks/my-submission/${task._id}`, {
            headers: { Authorization: `Bearer ${token}` }
         });
         if (res.data) setExistingSubmission(res.data);
      } catch (err) {}
   };

   const handleStartSubmit = () => {
      setViewMode('submit');
      setSubmitted(false);
      setFiles([]);
      
      if (existingSubmission) {
         setComments(existingSubmission.feedback || '');
         const prevAnswers = {};
         existingSubmission.answers?.forEach(a => {
            prevAnswers[a.questionId] = a.answer;
         });
         setAnswers(prevAnswers);
      } else {
         setComments('');
         setAnswers({});
      }
   };

   const handleBackToList = () => {
      setViewMode('list');
      setSelectedTask(null);
      setExistingSubmission(null);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
         const token = localStorage.getItem('studentToken');
         const formData = new FormData();
         formData.append('taskId', selectedTask._id);
         formData.append('comments', comments);
         
         const formattedAnswers = (selectedTask.questions || []).map(q => ({
            questionId: q._id,
            questionText: q.questionText,
            answer: answers[q._id] || ''
         }));
         formData.append('answers', JSON.stringify(formattedAnswers));
         
         files.forEach(file => formData.append('files', file));

         const res = await fetch(`${API_BASE}/tasks/submit`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
         });

         if (!res.ok) throw new Error('Submission failed');

         setSubmitted(true);
         toast.success(existingSubmission ? 'Intelligence Updated!' : 'Mission Accomplished!');
         setTimeout(() => {
            handleBackToList();
            fetchData(true);
         }, 2500);
      } catch (err) {
         toast.error(err.message);
      } finally {
         setIsSubmitting(false);
      }
   };

   // Shared Form Classes
   const inpClass = "w-full px-6 py-4 bg-white/60 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all shadow-sm";
   const lblClass = "block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1";

   if (viewMode === 'list') {
      return (
         <div className="relative w-full space-y-10 animate-in fade-in duration-700 pb-20 overflow-hidden">
            <Toaster position="top-right" />

            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
               <div>
                  <h1 className="text-4xl font-black text-slate-800 tracking-tight font-display mb-1">Learning Task Wall</h1>
                  <p className="text-slate-400 font-bold text-[10px] tracking-[0.15em] uppercase flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                     Live Academic Mission Deployment Management
                  </p>
               </div>
               <div className="flex items-center gap-3 bg-white/50 backdrop-blur-xl p-2 rounded-3xl border border-white shadow-sm">
                  <button onClick={() => fetchData(true)} className={`p-4 bg-white rounded-2xl text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 shadow-sm ${refreshing ? 'animate-spin' : ''}`}>
                     <MdRefresh size={22} />
                  </button>
                  <div className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-100 flex items-center gap-3">
                     <MdAssignment size={22} /> Sector Active
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
               {stats.map(s => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} className="bg-white p-8 rounded-[40px] border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-6 group transition-all hover:shadow-2xl hover:shadow-indigo-500/5">
                     <div className={`w-16 h-16 rounded-[24px] ${s.bg} ${s.color} flex items-center justify-center text-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-inner`}>
                        {s.icon}
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1 opacity-60">{s.label}</p>
                        <div className="flex items-baseline gap-1.5">
                           <p className="text-4xl font-black text-slate-800 leading-tight tabular-nums font-display">{s.val}</p>
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>

            <div className="bg-white/80 backdrop-blur-2xl p-4 rounded-[32px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col lg:flex-row items-center gap-4 relative z-10">
               <div className="flex-1 w-full relative group">
                  <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={24} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search missions, curriculum objectives, or intel data..." className="w-full pl-16 pr-8 py-5 bg-slate-50/50 border-none rounded-2xl text-sm font-bold text-slate-600 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-300" />
               </div>
               <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
                  <select value={filters.course} onChange={e => setFilters({ ...filters, course: e.target.value })} className="px-6 py-5 bg-slate-50/50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all cursor-pointer border-none focus:ring-0 min-w-[200px]">
                     <option value="All">All Sectors</option>
                     {COURSES.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>)}
                  </select>
                  <button onClick={() => { setSearch(''); setFilters({ course: 'All', priority: 'All', status: 'All' }); }} className="p-5 bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-sm"><MdClearAll size={24} /></button>
               </div>
            </div>

            {loading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-white rounded-[48px] border border-slate-50 animate-pulse" />)}
               </div>
            ) : filteredTasks.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
                  <AnimatePresence mode="popLayout">
                     {filteredTasks.map(t => (
                        <TaskCard key={t._id} task={t} onView={handleViewTask} />
                     ))}
                  </AnimatePresence>
               </div>
            ) : (
               <div className="py-40 text-center bg-white/80 backdrop-blur-xl rounded-[64px] border border-white shadow-sm relative overflow-hidden z-10">
                  <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600 opacity-20" />
                  <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                     <MdListAlt className="text-slate-200" size={56} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight font-display">No Deployments Found</h3>
                  <p className="text-slate-400 font-bold text-sm mt-3 tracking-wide">Sync parameters or update filters to view task wall missions.</p>
               </div>
            )}
         </div>
      );
   }

   // ----------------------------------------------------
   // 🖼️ SAMPLE BENTO DETAILS VIEW
   // ----------------------------------------------------
   if (viewMode === 'details' && selectedTask) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-10 pb-24 overflow-hidden relative">
        <Toaster position="top-right" />
        
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-[150px] -z-10" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 rounded-full blur-[120px] -z-10" />

        {/* Back Button */}
        <button onClick={handleBackToList} className="group flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-md border border-slate-100 rounded-[24px] text-slate-500 hover:text-indigo-600 transition-all shadow-sm">
           <MdArrowBack size={20} className="group-hover:-translate-x-1 transition-transform" />
           <span className="text-[11px] font-black uppercase tracking-widest">Back to Mission Hub</span>
        </button>

        <div className="flex flex-col xl:flex-row gap-10 items-start">
           
           {/* 🟦 LEFT COLUMN: BRIEFING & ASSETS */}
           <div className="w-full xl:w-[65%] space-y-8">
              
              {/* Header Bento Card */}
              <div className="bg-white/80 backdrop-blur-2xl p-10 lg:p-14 rounded-[48px] border border-slate-200/50 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 rounded-bl-[100px] -z-10" />
                 
                 <div className="space-y-8">
                    <div className="flex flex-wrap items-center gap-4">
                       <div className="px-4 py-2 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-indigo-100">{selectedTask.course}</div>
                       <div className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl border-2 ${selectedTask.Priority === 'High' ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-amber-200 bg-amber-50 text-amber-600'}`}>{selectedTask.Priority} Priority</div>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-black text-slate-800 tracking-tighter leading-none font-display">{selectedTask.Title}</h1>
                    
                    <div className="flex flex-wrap items-center gap-10 pt-6">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xl shadow-xl"><MdSchool /></div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lead Instructor</p>
                             <p className="text-lg font-black text-slate-700">{selectedTask.teacher || 'Primary Professor'}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl border border-indigo-100 shadow-inner"><MdTimer /></div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Remaining</p>
                             <p className="text-lg font-black text-slate-700">{new Date(selectedTask.Deadline).toLocaleDateString()}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Description & Intel Card */}
              <div className="bg-white/80 backdrop-blur-2xl p-10 lg:p-14 rounded-[48px] border border-slate-200/50 shadow-sm">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner"><MdOutlineDescription /></div>
                    <h2 className="text-2xl font-black text-slate-800 font-display uppercase tracking-tight">Intelligence Briefing</h2>
                 </div>
                 <div className="prose prose-slate max-w-none text-slate-500 font-medium leading-[2] text-lg whitespace-pre-wrap">
                    {selectedTask.Description}
                 </div>
              </div>

              {/* Materials Bento Grid */}
              <div className="bg-slate-900 p-10 lg:p-14 rounded-[48px] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-0" />
                 
                 <div className="relative z-10 space-y-10">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center text-2xl backdrop-blur-xl border border-white/20"><MdInsertDriveFile /></div>
                          <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">Operational Assets</h2>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {selectedTask.Attachments?.length > 0 ? selectedTask.Attachments.map((file, idx) => (
                          <a key={idx} href={`${API_BASE.replace('/api', '')}/${file.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" className="group flex items-center p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-indigo-400 hover:bg-white/10 transition-all backdrop-blur-xl">
                             <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform"><MdFactCheck /></div>
                             <div className="flex-1 overflow-hidden">
                                <p className="text-[11px] font-black text-white/90 truncate uppercase tracking-widest">{file.split(/[\\/]/).pop()}</p>
                                <p className="text-[9px] font-bold text-indigo-400 mt-1 uppercase tracking-[0.2em]">DOWNLOAD PDF</p>
                             </div>
                          </a>
                       )) : (
                          <div className="col-span-full py-10 text-center border-2 border-dashed border-white/10 rounded-3xl opacity-40">
                             <p className="text-white text-xs font-black uppercase tracking-widest">No encrypted assets attached</p>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>

           {/* 🟧 RIGHT COLUMN: MISSION CONTROL & QUESTIONS */}
           <div className="w-full xl:w-[35%] space-y-8">
              
              {/* Mission Control Center */}
              <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[48px] border border-slate-200/50 shadow-sm text-center relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600" />
                 
                 <div className="space-y-8 py-4">
                    <div className="flex flex-col items-center gap-4">
                       {existingSubmission ? (
                          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-4xl shadow-inner border border-emerald-100"><MdVerified /></div>
                       ) : (
                          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-4xl shadow-inner border border-indigo-100"><MdExplore /></div>
                       )}
                       <div>
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Operational Status</p>
                          <h3 className="text-2xl font-black text-slate-800 font-display uppercase tracking-tight">{existingSubmission ? 'Mission Submitted' : 'Awaiting Deployment'}</h3>
                       </div>
                    </div>

                    <div className="space-y-4">
                       {existingSubmission ? (
                          <button onClick={handleStartSubmit} className="w-full py-6 bg-slate-900 text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-[28px] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-3">
                             UPDATE MISSION <MdEditNote size={24} />
                          </button>
                       ) : (
                          <button onClick={handleStartSubmit} className="w-full py-6 bg-indigo-600 text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-[28px] shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3">
                             INITIALIZE TASK <MdRocketLaunch size={24} />
                          </button>
                       )}
                       <p className="text-slate-400 text-[10px] font-bold leading-relaxed px-4">
                          Verify the technical briefing and assets before initializing the final deployment phase.
                       </p>
                    </div>
                 </div>
              </div>

              {/* Questions Bento List */}
              <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[48px] border border-slate-200/50 shadow-sm space-y-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner"><MdQuestionAnswer /></div>
                    <h2 className="text-xl font-black text-slate-800 font-display uppercase tracking-tight">Intelligence Checks</h2>
                 </div>

                 <div className="space-y-6">
                    {selectedTask.questions?.length > 0 ? selectedTask.questions.map((q, idx) => (
                       <div key={idx} className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 relative group hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all">
                          <div className="absolute top-6 left-6 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black font-display shadow-lg">{idx + 1}</div>
                          <div className="mt-8 space-y-4">
                             <p className="text-sm font-bold text-slate-700 leading-relaxed">{q.questionText}</p>
                             <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-white border border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest rounded-lg">{q.type} Mode</span>
                             </div>
                          </div>
                       </div>
                    )) : (
                       <div className="text-center py-10 opacity-30">
                          <MdQuestionAnswer size={40} className="mx-auto mb-3" />
                          <p className="text-[10px] font-black uppercase tracking-widest">No inquiry wall detected</p>
                       </div>
                    )}
                 </div>
              </div>

           </div>
        </div>
      </motion.div>
    );
   }

   // ----------------------------------------------------
   // 📝 SUBMISSION FORM VIEW
   // ----------------------------------------------------
   if (viewMode === 'submit' && selectedTask) {
      if (submitted) {
         return (
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl mx-auto mt-20 p-10">
             <div className="bg-white/40 backdrop-blur-[40px] p-20 rounded-[56px] border border-white/60 shadow-2xl text-center">
               <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl border border-emerald-100"><MdCheckCircleOutline size={48} /></div>
               <h2 className="text-4xl font-black text-slate-800 mb-4 font-display tracking-tight">Mission Success!</h2>
               <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-10">Your intelligence has been synchronized.</p>
             </div>
           </motion.div>
         );
      }

      return (
         <div className="w-full space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
           <Toaster position="top-right" />
           
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="flex items-center gap-4">
               <button onClick={() => setViewMode('details')} className="p-3 bg-white rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm border border-slate-200/50 transition-all active:scale-95">
                 <MdArrowBack size={24} />
               </button>
               <div>
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight font-display">{existingSubmission ? 'Intelligence Update' : 'Operational Deployment'}</h1>
                 <p className="text-slate-400 font-medium text-sm mt-1">Synchronizing intelligence for: <span className="text-indigo-600 font-bold">{selectedTask.Title}</span></p>
               </div>
             </div>
           </div>

           <div className="flex flex-col xl:flex-row gap-10 items-start">
             <div className="w-full xl:flex-1 space-y-6">
               <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[40px] border border-slate-200/50 shadow-sm relative overflow-hidden flex flex-col">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600 opacity-[0.03] rounded-bl-full" />
                 
                 <div className="flex items-center gap-4 mb-10">
                   <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-100">
                     {existingSubmission ? <MdEditNote /> : <MdRocketLaunch />}
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-slate-800 font-display uppercase tracking-tight">{existingSubmission ? 'Update Mission' : 'Mission Submission'}</h2>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                       Active Link Established
                     </p>
                   </div>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-10">
                   {selectedTask.questions?.length > 0 && (
                     <div className="space-y-6">
                       <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] pb-4 border-b border-slate-100 flex items-center gap-3">
                          <MdQuestionAnswer size={18} /> Required Intel Response
                       </h3>
                       
                       <div className="space-y-6">
                         {selectedTask.questions.map((q, idx) => (
                           <motion.div key={q._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 relative group">
                             <div className="absolute top-6 left-6 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black font-display shadow-lg">
                               {idx + 1}
                             </div>
                             <div className="ml-10 space-y-6">
                               <label className="block text-sm font-black text-slate-800 tracking-tight leading-relaxed">{q.questionText}</label>
                               {q.type === 'Short Answer' && (
                                 <input type="text" required className={inpClass} placeholder="Enter concise response..." value={answers[q._id] || ''} onChange={(e) => setAnswers({...answers, [q._id]: e.target.value})} />
                               )}
                               {q.type === 'Paragraph' && (
                                 <textarea required rows="4" className={`${inpClass} py-5 resize-none`} placeholder="Detailed intelligence report..." value={answers[q._id] || ''} onChange={(e) => setAnswers({...answers, [q._id]: e.target.value})} />
                               )}
                               {q.type === 'MCQ' && (
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   {q.options.map((opt) => (
                                     <div key={opt} onClick={() => setAnswers({...answers, [q._id]: opt})} className={`p-5 rounded-[24px] border cursor-pointer transition-all flex items-center gap-4 ${answers[q._id] === opt ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-300 shadow-sm'}`}>
                                       <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${answers[q._id] === opt ? 'bg-white border-white text-indigo-600' : 'border-slate-200'}`}>
                                          {answers[q._id] === opt && <MdDoneAll size={14} />}
                                       </div>
                                       <span className="text-[11px] font-black uppercase tracking-widest">{opt}</span>
                                     </div>
                                   ))}
                                 </div>
                               )}
                             </div>
                           </motion.div>
                         ))}
                       </div>
                     </div>
                   )}

                   <div className="space-y-6">
                     <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] pb-4 border-b border-slate-100 flex items-center gap-3">
                        <MdCloudUpload size={18} /> Asset Synchronization
                     </h3>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <div className="relative group cursor-pointer">
                         <input type="file" multiple onChange={(e) => setFiles(prev => [...prev, ...Array.from(e.target.files)])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                         <div className="bg-slate-50/50 border-4 border-dashed border-slate-100 rounded-[40px] p-12 text-center group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                               <MdCloudUpload size={32} />
                            </div>
                            <p className="text-slate-800 font-black text-lg tracking-tight mb-1">Local Asset Vault</p>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{existingSubmission ? 'Overwrite Previous Assets' : 'Click or Drag to Upload'}</p>
                         </div>
                       </div>
                       <div className="space-y-4">
                          <label className={lblClass}>Operational Comments</label>
                          <textarea className={`${inpClass} min-h-[160px] resize-none`} value={comments} onChange={e => setComments(e.target.value)} placeholder="Optional mission notes..." />
                       </div>
                     </div>
                     <AnimatePresence>
                        {files.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                            {files.map((file, idx) => (
                              <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center justify-between p-5 bg-white rounded-[24px] border border-slate-100 shadow-sm group">
                                <div className="flex items-center gap-4 overflow-hidden">
                                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-indigo-600 flex items-center justify-center border border-slate-100 shrink-0"><MdAssignment size={20} /></div>
                                  <div className="overflow-hidden"><p className="text-[10px] font-black text-slate-800 truncate uppercase tracking-widest">{file.name}</p></div>
                                </div>
                                <button type="button" onClick={() => setFiles(files.filter((_, i) => i !== idx))} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><MdClose size={20} /></button>
                              </motion.div>
                            ))}
                          </div>
                        )}
                     </AnimatePresence>
                   </div>

                   <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                     <div className="flex items-center gap-3 text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] bg-amber-50 px-6 py-4 rounded-2xl border border-amber-100">
                       <MdInfoOutline size={18} /> {existingSubmission ? 'Updating will overwrite your previous submission.' : 'Verify all intel fields before final confirmation.'}
                     </div>
                     <button type="submit" disabled={isSubmitting} className={`w-full md:w-auto md:min-w-[300px] px-10 py-6 bg-slate-900 text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-[28px] shadow-2xl hover:bg-indigo-600 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 ${isSubmitting ? 'opacity-50' : ''}`}>
                        {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>{existingSubmission ? 'CONFIRM UPDATE' : 'CONFIRM DEPLOYMENT'} <MdArrowForward size={20} /></>}
                     </button>
                   </div>
                 </form>
               </div>
             </div>
           </div>
         </div>
      );
   }

   return null;
};

export default Tasks;
