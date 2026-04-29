import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Shield, 
  BookOpen, 
  Award,
  Save
} from 'lucide-react';

const ProfileView = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.j@student.edu',
    phone: '+1 (555) 123-4567',
    address: '123 Education Lane, Learning City',
    bio: 'Passionate about science and technology. Always eager to learn new things!'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add save logic here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-8 bg-slate-50 min-h-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your personal information and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            
            <div className="relative mt-8 mb-4">
              <div className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-md bg-white overflow-hidden relative group">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                <button className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-800">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-sm font-medium text-blue-600 bg-blue-50 py-1 px-3 rounded-full inline-block mt-2">
              Grade 10 Student
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-around">
              <div className="text-center">
                <div className="flex justify-center items-center w-10 h-10 mx-auto bg-amber-50 text-amber-500 rounded-xl mb-2">
                  <Award className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-500">Top 5%</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center items-center w-10 h-10 mx-auto bg-emerald-50 text-emerald-500 rounded-xl mb-2">
                  <BookOpen className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-500">51 Tasks</p>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-500" />
              Security
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm font-medium text-slate-700">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm font-medium text-slate-700">
                Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Details Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Personal Information
            </h3>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            )}
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:bg-slate-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:bg-slate-100 text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:bg-slate-100 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:bg-slate-100 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:bg-slate-100 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                <textarea 
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-70 disabled:bg-slate-100 text-sm resize-none"
                ></textarea>
              </div>
            </div>
            
            {isEditing && (
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
