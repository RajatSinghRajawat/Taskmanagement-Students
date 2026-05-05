import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Shield, 
  BookOpen, 
  Award,
  Save,
  Lock,
  Edit3,
  CheckCircle2,
  X,
  UploadCloud,
  RefreshCcw,
  UserCheck,
  ArrowRight
} from 'lucide-react';

const API_BASE = 'http://localhost:7001/api/students';

const ProfileView = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [student, setStudent] = useState(JSON.parse(localStorage.getItem('studentData') || '{}'));
  const [formData, setFormData] = useState({
    name: student.name || '',
    email: student.email || '',
    mobile: student.mobile || '',
    location: student.location || '',
    course: student.courses || '',
    batch: student.batch || ''
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
     const fetchLatest = async () => {
        try {
           const token = localStorage.getItem('studentToken');
           if (!token) return;
           const res = await axios.get(`${API_BASE}/profile`, {
              headers: { Authorization: `Bearer ${token}` }
           });
           setStudent(res.data);
           setFormData({
              name: res.data.name,
              email: res.data.email,
              mobile: res.data.mobile || '',
              location: res.data.location || '',
              course: res.data.courses,
              batch: res.data.batch
           });
           localStorage.setItem('studentData', JSON.stringify(res.data));
        } catch (err) {
           console.error("Fetch profile error", err);
        }
     };
     fetchLatest();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => {
     if (isEditing) fileInputRef.current?.click();
     else toast.error("Please enter 'Edit Mode' to change your identity image.");
  };

  const handleFileChange = async (e) => {
     const file = e.target.files[0];
     if (!file) return;

     setLoading(true);
     const token = localStorage.getItem('studentToken');
     const uploadData = new FormData();
     uploadData.append('profileImage', file);

     try {
        const res = await axios.put(`${API_BASE}/update-profile`, uploadData, {
           headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
           }
        });
        setStudent(res.data.user);
        localStorage.setItem('studentData', JSON.stringify(res.data.user));
        toast.success("Identity synchronized successfully!");
        window.dispatchEvent(new Event('storage'));
     } catch (err) {
        toast.error("Cloud synchronization failed");
     } finally {
        setLoading(false);
     }
  };

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem('studentToken');
    try {
      const res = await axios.put(`${API_BASE}/update-profile`, {
         mobile: formData.mobile,
         location: formData.location
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStudent(res.data.user);
      localStorage.setItem('studentData', JSON.stringify(res.data.user));
      setIsEditing(false);
      toast.success('Profile credentials updated!');
    } catch (err) {
      toast.error('Update operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
     e.preventDefault();
     if (passwords.newPassword !== passwords.confirmPassword) {
        return toast.error("New passwords do not match!");
     }

     setLoading(true);
     const token = localStorage.getItem('studentToken');
     try {
        await axios.put(`${API_BASE}/change-password`, {
           currentPassword: passwords.currentPassword,
           newPassword: passwords.newPassword
        }, {
           headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Security protocols updated!");
        setShowPasswordModal(false);
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
     } catch (err) {
        toast.error(err.response?.data?.message || "Password update failed");
     } finally {
        setLoading(false);
     }
  };

  const profileImageUrl = student.profileImage 
     ? `http://localhost:7001/${student.profileImage.replace(/\\/g, '/')}`
     : `https://ui-avatars.com/api/?name=${student.name}&background=6366f1&color=fff&size=128`;

  return (
    <div className="relative w-full space-y-10 animate-in fade-in duration-700 pb-20 overflow-hidden bg-[#F8FAFC]">
      <Toaster position="top-right" />

      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
         <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight font-display mb-1">Scholar Profile</h1>
            <p className="text-slate-400 font-bold text-[10px] tracking-[0.15em] uppercase flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               Manage Authorized Identity & Security Credentials
            </p>
         </div>
         <div className="flex items-center gap-3 bg-white/50 backdrop-blur-xl p-2 rounded-3xl border border-white shadow-sm">
            <button onClick={() => window.location.reload()} className="p-4 bg-white rounded-2xl text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 shadow-sm">
               <RefreshCcw size={22} />
            </button>
            <div className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-100 flex items-center gap-3">
               <UserCheck size={22} /> Account Verified
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start relative z-10">
         <div className="xl:col-span-4 space-y-8">
            <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[48px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-600 to-purple-600 -z-10 opacity-10 group-hover:opacity-20 transition-opacity" />
               <div className="relative mt-4 mb-8">
                  <div 
                     onClick={handleImageClick}
                     className={`w-32 h-32 mx-auto rounded-[36px] border-4 border-white shadow-2xl bg-white overflow-hidden relative group/img cursor-pointer ${isEditing ? 'ring-4 ring-indigo-500/20' : ''}`}
                  >
                     <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover transition-transform group-hover/img:scale-110" />
                     {isEditing && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all">
                           <Camera className="w-8 h-8 text-white mb-2" />
                           <span className="text-[8px] font-black text-white uppercase tracking-widest">Update Photo</span>
                        </div>
                     )}
                     {loading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                           <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                     )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
               </div>
               <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight font-display">{student.name}</h2>
                  <p className="text-[10px] font-black text-indigo-600 bg-indigo-50 py-2 px-4 rounded-xl inline-block uppercase tracking-widest">{student.courses || 'Professional Scholar'}</p>
               </div>
               <div className="grid grid-cols-2 gap-4 mt-10">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                     <BookOpen className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Batch</p>
                     <p className="text-sm font-black text-slate-700">{student.batch || '2024'}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                     <Award className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Standing</p>
                     <p className="text-sm font-black text-slate-700">Level 1</p>
                  </div>
               </div>
            </div>
            <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl" />
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-xl border border-white/10">
                        <Shield size={24} />
                     </div>
                     <h3 className="text-xl font-black text-white font-display uppercase tracking-tight">Security</h3>
                  </div>
                  <div className="space-y-4">
                     <button 
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-3xl text-white hover:bg-white/10 transition-all group"
                     >
                        <div className="flex items-center gap-3">
                           <Lock size={18} className="text-indigo-400" />
                           <span className="text-[11px] font-black uppercase tracking-widest">Rotate Password</span>
                        </div>
                        <ArrowRight size={18} className="text-white/20 group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
               </div>
            </div>
         </div>
         <div className="xl:col-span-8">
            <div className="bg-white/80 backdrop-blur-2xl p-10 lg:p-14 rounded-[56px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative">
               <div className="flex items-center justify-between mb-12 pb-8 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <User size={24} />
                     </div>
                     <h2 className="text-2xl font-black text-slate-800 font-display uppercase tracking-tight">Authorized Credentials</h2>
                  </div>
                  {!isEditing ? (
                     <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm">
                        <Edit3 size={18} /> Edit Profile
                     </button>
                  ) : (
                     <div className="flex gap-3">
                        <button onClick={() => setIsEditing(false)} className="px-6 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all">Cancel</button>
                        <button onClick={handleSave} disabled={loading} className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                           {loading ? <RefreshCcw className="animate-spin" size={18} /> : <><Save size={18} /> Synchronize Data</>}
                        </button>
                     </div>
                  )}
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><User size={14} className="text-indigo-400" /> Full Identity Name</label>
                        <input type="text" value={formData.name} disabled className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-400 cursor-not-allowed uppercase tracking-wider" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Mail size={14} className="text-indigo-400" /> Authorized Email</label>
                        <input type="email" value={formData.email} disabled className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-400 cursor-not-allowed tracking-wider" />
                     </div>
                  </div>
                  <div className="space-y-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Phone size={14} className="text-indigo-400" /> Mobile Protocol</label>
                        <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} disabled={!isEditing} placeholder="+91 XXXXX XXXXX" className={`w-full px-8 py-5 rounded-2xl text-sm font-bold transition-all ${isEditing ? 'bg-white border-2 border-indigo-100 focus:border-indigo-500 shadow-lg shadow-indigo-50 text-slate-800' : 'bg-slate-50 border border-slate-100 text-slate-500 cursor-not-allowed'}`} />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><MapPin size={14} className="text-indigo-400" /> Operational Sector (Location)</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} disabled={!isEditing} placeholder="Location" className={`w-full px-8 py-5 rounded-2xl text-sm font-bold transition-all ${isEditing ? 'bg-white border-2 border-indigo-100 focus:border-indigo-500 shadow-lg shadow-indigo-50 text-slate-800' : 'bg-slate-50 border border-slate-100 text-slate-500 cursor-not-allowed'}`} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <AnimatePresence>
         {showPasswordModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPasswordModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-md p-10 rounded-[48px] shadow-2xl border border-white">
                  <button onClick={() => setShowPasswordModal(false)} className="absolute right-8 top-8 p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors"><X size={20} /></button>
                  <div className="text-center space-y-6">
                     <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[28px] flex items-center justify-center mx-auto shadow-inner"><Lock size={36} /></div>
                     <h3 className="text-2xl font-black text-slate-800 font-display uppercase tracking-tight">Rotate Credentials</h3>
                  </div>
                  <form onSubmit={handlePasswordChange} className="mt-10 space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                        <input type="password" required className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Key</label>
                        <input type="password" required className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Key</label>
                        <input type="password" required className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} />
                     </div>
                     <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3">
                        {loading ? <RefreshCcw className="animate-spin" size={18} /> : <>UPDATE SECURITY KEY <Save size={18} /></>}
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileView;
