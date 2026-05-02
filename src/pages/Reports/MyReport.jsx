import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  Award,
  FileText,
  Calendar,
  User,
  ArrowRight,
  Download,
  AlertCircle,
  RefreshCcw,
  Printer,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

const API = 'http://localhost:7001/api/reports/my-reports';
const LOGO_URL = "/logo.png"; // Placeholder for the school logo

const MyReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const printRef = useRef(null);

  const fetchReports = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    
    const token = localStorage.getItem('studentToken');
    if (!token) return;

    try {
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to load reports");
      
      setReports(data.reports || []);
      if (data.reports?.length > 0) {
        setSelectedReport(data.reports[0]);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse bg-slate-50 min-h-screen">
        <div className="h-10 bg-slate-200 w-1/4 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white rounded-3xl" />)}
        </div>
        <div className="h-96 bg-white rounded-3xl" />
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-xl mb-8 text-slate-200">
           <FileText size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">No Reports Published</h2>
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-3">Your academic record is awaiting validation.</p>
      </div>
    );
  }

  const report = selectedReport || reports[0];
  const student = JSON.parse(localStorage.getItem('studentData') || '{}');

  return (
    <div className="relative w-full space-y-10 animate-in fade-in duration-700 pb-20 overflow-hidden bg-[#F8FAFC]">
      <Toaster position="top-right" />

      {/* 🖨️ CSS FOR PRINTING (MARKSHEET STYLE) */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; background: white !important; }
            #printable-report, #printable-report * { visibility: visible; }
            #printable-report { 
              position: absolute; 
              left: 0; 
              top: 0; 
              width: 100%; 
              padding: 40px;
              color: black !important;
            }
            .no-print { display: none !important; }
            .marksheet-border { border: 4px double #1e293b !important; padding: 30px !important; border-radius: 0 !important; }
          }
        `}
      </style>

      {/* Header (No-Print) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10 no-print">
         <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight font-display mb-1">Performance Wall</h1>
            <p className="text-slate-400 font-bold text-[10px] tracking-[0.15em] uppercase flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               Verified Academic Records & Growth Analytics
            </p>
         </div>
         <div className="flex items-center gap-3 bg-white/50 backdrop-blur-xl p-2 rounded-3xl border border-white shadow-sm">
            <button onClick={() => fetchReports(true)} className={`p-4 bg-white rounded-2xl text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 shadow-sm ${refreshing ? 'animate-spin' : ''}`}>
               <RefreshCcw size={22} />
            </button>
            <button onClick={handlePrint} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-100 flex items-center gap-3 hover:bg-indigo-600 transition-all">
               <Printer size={22} /> Download Report
            </button>
         </div>
      </div>

      {/* Report Selector (No-Print) */}
      {reports.length > 1 && (
        <div className="bg-white/80 backdrop-blur-2xl p-4 rounded-[28px] border border-white shadow-sm flex items-center gap-4 relative z-10 no-print">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Switch Report:</span>
           <div className="flex gap-2">
              {reports.map(r => (
                <button 
                  key={r._id}
                  onClick={() => setSelectedReport(r)}
                  className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedReport?._id === r._id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                  {r.reportTitle}
                </button>
              ))}
           </div>
        </div>
      )}

      {/* 🖼️ THE PRINTABLE MARKSHEET (HIDDEN ON WEB, VISIBLE ON PRINT) */}
      <div id="printable-report" className="hidden print:block bg-white marksheet-border">
         {/* Marksheet Header */}
         <div className="text-center space-y-4 mb-10 border-b-2 border-slate-200 pb-8">
            <div className="flex justify-center mb-4">
               {/* Using Artifact Logo Path or Placeholder */}
               <img src="/logo.png" alt="Tips-G Alwar" className="h-20 object-contain" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Tips-G Alwar</h1>
            <p className="text-[10px] font-bold tracking-[0.4em] text-slate-500 uppercase">Authorized Academic Progress Report</p>
            <div className="flex justify-center gap-10 pt-4">
               <div className="text-center"><p className="text-[9px] font-black text-slate-400 uppercase">Session</p><p className="font-black text-slate-800">2024-25</p></div>
               <div className="text-center"><p className="text-[9px] font-black text-slate-400 uppercase">Report ID</p><p className="font-black text-slate-800">#{report._id.slice(-6).toUpperCase()}</p></div>
            </div>
         </div>

         {/* Student Information */}
         <div className="grid grid-cols-2 gap-8 mb-10 p-6 bg-slate-50 rounded-2xl">
            <div className="space-y-4">
               <div><p className="text-[9px] font-black text-slate-400 uppercase">Student Name</p><p className="text-xl font-black text-slate-900 uppercase">{student.fullName || report.student?.fullName || 'N/A'}</p></div>
               <div><p className="text-[9px] font-black text-slate-400 uppercase">Course / Sector</p><p className="text-sm font-bold text-slate-700">{student.course || report.student?.course || 'N/A'}</p></div>
            </div>
            <div className="space-y-4 text-right">
               <div><p className="text-[9px] font-black text-slate-400 uppercase">Registration ID</p><p className="text-xl font-black text-slate-900">#{student.studentId || 'N/A'}</p></div>
               <div><p className="text-[9px] font-black text-slate-400 uppercase">Batch Year</p><p className="text-sm font-bold text-slate-700">{student.batch || report.student?.batch || 'N/A'}</p></div>
            </div>
         </div>

         {/* Summary Grid */}
         <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="p-6 border-2 border-slate-100 rounded-3xl text-center">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Aggregate Score</p>
               <p className="text-4xl font-black text-indigo-600">{Math.round(report.averageTestMarks || 0)}%</p>
            </div>
            <div className="p-6 border-2 border-slate-100 rounded-3xl text-center">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Final Grade</p>
               <p className="text-4xl font-black text-slate-900">{report.grade || 'A'}</p>
            </div>
            <div className="p-6 border-2 border-slate-100 rounded-3xl text-center">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Attendance</p>
               <p className="text-4xl font-black text-emerald-600">{Math.round(report.attendancePercentage || 0)}%</p>
            </div>
         </div>

         {/* Detailed Transcript */}
         <div className="mb-10">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 border-b pb-2">Academic Transcript</h3>
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b-2 border-slate-900">
                     <th className="py-4 text-[10px] font-black uppercase">Subject / Assessment</th>
                     <th className="py-4 text-[10px] font-black uppercase text-center">Date</th>
                     <th className="py-4 text-[10px] font-black uppercase text-center">Total</th>
                     <th className="py-4 text-[10px] font-black uppercase text-right">Obtained</th>
                  </tr>
               </thead>
               <tbody>
                  {report.tests?.map((test, idx) => (
                     <tr key={idx} className="border-b border-slate-100">
                        <td className="py-4 font-bold text-slate-800">{test.testName}</td>
                        <td className="py-4 text-center text-slate-500 font-medium">{new Date(test.date || Date.now()).toLocaleDateString()}</td>
                        <td className="py-4 text-center font-black text-slate-400">{test.totalMarks}</td>
                        <td className="py-4 text-right font-black text-slate-900">{test.marksObtained}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Feedback & Signature */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t-2 border-slate-900 mt-20">
            <div className="space-y-4">
               <p className="text-[9px] font-black text-slate-400 uppercase">Instructor Remarks</p>
               <p className="text-sm font-bold text-slate-700 italic leading-relaxed">
                  "{report.remarks || 'Excellent progress in technical modules. Maintain consistency.'}"
               </p>
            </div>
            <div className="flex flex-col items-center justify-end">
               <div className="w-48 h-px bg-slate-900 mb-2"></div>
               <p className="text-[9px] font-black text-slate-400 uppercase">Authorized Signature</p>
               <p className="text-xs font-black text-slate-900 mt-1">Academic Controller - Tips-G Alwar</p>
            </div>
         </div>
      </div>

      {/* 🖥️ WEB VIEW (ELITE BENTO STYLE) - SIMPLIFIED AS REQUESTED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 no-print">
         
         {/* Main Record Card */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/80 backdrop-blur-2xl p-12 rounded-[48px] border border-slate-200/50 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full -mr-20 -mt-20" />
               
               <div className="flex items-center gap-6 mb-12 relative z-10">
                  <div className="w-16 h-16 rounded-[24px] bg-indigo-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-indigo-100">
                     <GraduationCap />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black text-slate-800 font-display uppercase tracking-tight">{report.reportTitle}</h2>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Period: {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
                  <div className="text-center p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Aggregate Score</p>
                     <p className="text-5xl font-black text-indigo-600 font-display tabular-nums">{Math.round(report.averageTestMarks || 0)}%</p>
                  </div>
                  <div className="text-center p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Attendance</p>
                     <p className="text-5xl font-black text-emerald-600 font-display tabular-nums">{Math.round(report.attendancePercentage || 0)}%</p>
                  </div>
                  <div className="text-center p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Overall Grade</p>
                     <p className="text-5xl font-black text-slate-800 font-display uppercase">{report.grade || 'A'}</p>
                  </div>
               </div>
            </div>

            {/* Transcript Card */}
            <div className="bg-white/80 backdrop-blur-2xl p-12 rounded-[48px] border border-slate-200/50 shadow-sm">
               <h3 className="text-xl font-black text-slate-800 mb-10 font-display uppercase tracking-tight flex items-center gap-4">
                  <FileText className="text-indigo-600" /> Assessment Transcript
               </h3>
               <div className="space-y-6">
                  {report.tests?.map((test, idx) => (
                     <div key={idx} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:bg-white transition-all">
                        <div className="flex items-center gap-5">
                           <div className="w-10 h-10 rounded-xl bg-white text-slate-400 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                              <ShieldCheck size={20} />
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{test.testName}</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(test.date || Date.now()).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="text-right">
                              <p className="text-lg font-black text-slate-900">{test.marksObtained} <span className="text-slate-300 font-bold">/</span> {test.totalMarks}</p>
                              <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                 <div className="h-full bg-indigo-500" style={{ width: `${(test.marksObtained/test.totalMarks)*100}%` }}></div>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar Control */}
         <div className="space-y-8 no-print">
            <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
               <div className="relative z-10 space-y-10">
                  <div className="space-y-2">
                     <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Document Sync</p>
                     <h3 className="text-white text-2xl font-black font-display uppercase tracking-tight">Report Vault</h3>
                  </div>
                  <button onClick={handlePrint} className="w-full py-6 bg-white text-slate-900 text-[12px] font-black uppercase tracking-[0.3em] rounded-[28px] shadow-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 active:scale-95">
                     <Download size={22} /> DOWNLOAD PDF
                  </button>
                  <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                     Generated reports are verified by Tips-G Alwar administrative office.
                  </p>
               </div>
            </div>

            <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[48px] border border-slate-200/50 shadow-sm">
               <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8">Faculty Remarks</h4>
               <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                  <p className="text-sm font-bold text-indigo-900 italic leading-relaxed">
                     "{report.remarks || "Steady progress noted. Focus on consistency."}"
                  </p>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default MyReport;
