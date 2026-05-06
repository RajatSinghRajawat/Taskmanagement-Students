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
import html2pdf from 'html2pdf.js';

const API = 'http://localhost:7001/api/reports/my-reports';

const MyReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleDownload = () => {
    const element = document.getElementById('final-pdf-content');
    if (!element) return;

    const opt = {
      margin: 10,
      filename: `Report_${student.fullName || 'Student'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    toast.loading('Generating Official PDF...', { id: 'pdf-toast' });
    
    // Set colors directly before capture
    element.style.display = 'block';

    html2pdf().set(opt).from(element).save().then(() => {
      element.style.display = 'none';
      toast.success('Downloaded!', { id: 'pdf-toast' });
    }).catch(err => {
      element.style.display = 'none';
      toast.error('Error! Use Print button.');
    });
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#F8FAFC]">
      <Toaster position="top-right" />

      {/* 🛑 PDF DESIGN (BLUE & BLACK THEME) */}
      <style>
        {`
          @media screen {
            #final-pdf-content { display: none; }
          }
          @media print {
            body * { visibility: hidden; }
            #final-pdf-content, #final-pdf-content * { visibility: visible !important; }
            #final-pdf-content { position: absolute; left: 0; top: 0; width: 100%; display: block !important; }
          }
        `}
      </style>

      {/* 🖼️ THE MARKSHEET (BLUE & BLACK DESIGN) */}
      <div id="final-pdf-content" style={{ padding: '40px', background: 'white', color: 'black', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ border: '12px double #1e3a8a', padding: '30px', minHeight: '900px' }}>
          
          <div style={{ textAlign: 'center', borderBottom: '4px solid #1e3a8a', paddingBottom: '20px', marginBottom: '30px' }}>
            <div style={{ fontSize: '50px', fontWeight: '900', background: '#1e3a8a', color: 'white', width: '80px', height: '80px', lineHeight: '80px', display: 'inline-block', borderRadius: '15px' }}>T</div>
            <h1 style={{ fontSize: '42px', margin: '10px 0', color: '#1e3a8a', fontWeight: '900' }}>TIPS-G ALWAR</h1>
            <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', color: '#000' }}>OFFICIAL ACADEMIC RECORD | 2024-25</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', background: '#eff6ff', padding: '20px', borderRadius: '15px', border: '1px solid #bfdbfe' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#1e40af', fontWeight: 'bold' }}>STUDENT NAME</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#000' }}>{student.fullName || 'STUDENT'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: '#1e40af', fontWeight: 'bold' }}>REGISTRATION ID</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#000' }}>ID-{student.studentId || 'N/A'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            <div style={{ flex: 1, border: '2px solid #1e3a8a', padding: '15px', textAlign: 'center', borderRadius: '15px' }}>
              <div style={{ fontSize: '10px', color: '#1e3a8a', fontWeight: 'bold' }}>AVERAGE SCORE</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#000' }}>{Math.round(report.averageTestMarks || 0)}%</div>
            </div>
            <div style={{ flex: 1, background: '#1e3a8a', padding: '15px', textAlign: 'center', borderRadius: '15px', color: 'white' }}>
              <div style={{ fontSize: '10px', color: '#bfdbfe' }}>FINAL GRADE</div>
              <div style={{ fontSize: '28px', fontWeight: '900' }}>{report.grade || 'A'}</div>
            </div>
            <div style={{ flex: 1, border: '2px solid #1e3a8a', padding: '15px', textAlign: 'center', borderRadius: '15px' }}>
              <div style={{ fontSize: '10px', color: '#1e3a8a', fontWeight: 'bold' }}>ATTENDANCE</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#000' }}>{Math.round(report.attendancePercentage || 0)}%</div>
            </div>
          </div>

          {report.behavior && (
            <div style={{ marginBottom: '30px', padding: '20px', border: '2px dashed #1e3a8a', borderRadius: '15px', background: '#f8fafc' }}>
              <div style={{ fontSize: '10px', color: '#1e3a8a', fontWeight: 'bold', marginBottom: '5px' }}>STUDENT CONDUCT (BEHAVIOR)</div>
              <div style={{ fontSize: '16px', fontStyle: 'italic', color: '#000', fontWeight: 'bold' }}>"{report.behavior}"</div>
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ background: '#1e3a8a', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px' }}>EXAM DATE</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px' }}>MODULE NAME</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>OBTAINED</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>TOTAL</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px' }}>RESULT</th>
              </tr>
            </thead>
            <tbody>
              {report.tests?.map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1e3a8a' }}>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#000' }}>{new Date(t.date || Date.now()).toLocaleDateString('en-GB')}</td>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold', color: '#1e3a8a' }}>{t.testName}</td>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', color: '#000' }}>{t.marksObtained}</td>
                  <td style={{ padding: '12px', fontSize: '14px', textAlign: 'center', color: '#666' }}>{t.totalMarks}</td>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold', textAlign: 'right', color: '#000' }}>{Math.round((t.marksObtained/t.totalMarks)*100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '60px', textAlign: 'center', borderTop: '2px solid #1e3a8a', paddingTop: '20px' }}>
            <p style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Digitally Verified Academic Record - Tips-G Alwar</p>
          </div>
        </div>
      </div>

      {/* WEB UI */}
      <div className="p-10 space-y-8">
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div>
               <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-1">Performance Wall</h1>
               <p className="text-slate-400 font-bold text-[10px] tracking-[0.15em] uppercase">Verified Academic Analytics</p>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={handleDownload} className="px-8 py-4 bg-blue-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center gap-3 hover:bg-blue-800 transition-all">
                  <Download size={22} /> Download PDF
               </button>
               <button onClick={() => window.print()} className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-sm flex items-center gap-3 hover:bg-slate-50 transition-all">
                  <Printer size={22} /> Print PDF
               </button>
            </div>
         </div>

         {/* Dashboard View */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-6 mb-12">
                     <div className="w-16 h-16 rounded-[24px] bg-blue-700 text-white flex items-center justify-center text-3xl shadow-xl"><GraduationCap /></div>
                     <div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{report.reportTitle}</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Student: {student.fullName}</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                     <div className="text-center p-8 bg-blue-50/30 rounded-[32px] border border-blue-100">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Aggregate</p>
                        <p className="text-5xl font-black text-blue-700">{Math.round(report.averageTestMarks || 0)}%</p>
                     </div>
                     <div className="text-center p-8 bg-emerald-50/30 rounded-[32px] border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Attendance</p>
                        <p className="text-5xl font-black text-emerald-600">{Math.round(report.attendancePercentage || 0)}%</p>
                     </div>
                     <div className="text-center p-8 bg-slate-900 rounded-[32px] text-white">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Grade</p>
                        <p className="text-5xl font-black">{report.grade || 'A'}</p>
                     </div>
                  </div>
               </div>

               <div className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-black text-slate-800 mb-10 uppercase tracking-tight flex items-center gap-4"><FileText className="text-blue-700" /> Exam Results</h3>
                  <div className="space-y-6">
                     {report.tests?.map((test, idx) => (
                        <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center group hover:bg-blue-50 transition-all">
                           <div className="flex items-center gap-5">
                              <div className="w-10 h-10 rounded-xl bg-white text-slate-400 flex items-center justify-center border border-slate-100 group-hover:text-blue-600"><ShieldCheck size={20} /></div>
                              <div>
                                 <p className="text-sm font-black text-slate-800 uppercase">{test.testName}</p>
                                 <p className="text-[9px] font-black text-slate-400 uppercase">{new Date(test.date || Date.now()).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-lg font-black text-slate-900">{test.marksObtained} <span className="text-slate-300">/</span> {test.totalMarks}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="bg-blue-900 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 space-y-10">
                     <h3 className="text-white text-2xl font-black uppercase tracking-tight">Academic Vault</h3>
                     <button onClick={handleDownload} className="w-full py-6 bg-white text-blue-900 text-[12px] font-black uppercase tracking-[0.3em] rounded-[28px] shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3">
                        <Download size={22} /> DOWNLOAD PDF
                     </button>
                     <p className="text-blue-300 text-[9px] font-bold uppercase tracking-widest leading-relaxed">Official verified record from Tips-G Alwar.</p>
                  </div>
               </div>

               {report.behavior && (
                 <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Student Behavior</h4>
                    <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100">
                       <p className="text-sm font-bold text-blue-900 italic leading-relaxed">"{report.behavior}"</p>
                    </div>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default MyReport;
