import React, { useState } from 'react';
import { 
  Search, 
  Book, 
  Video, 
  FileText, 
  Download, 
  Play, 
  Eye,
  ArrowLeft,
  Clock,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

const Materials = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'details'
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const subjects = ['All', 'Science', 'Mathematics', 'History', 'English'];

  const materialsData = [
    {
      id: 1,
      title: "Algebra Basics: Linear Equations",
      subject: "Mathematics",
      teacher: "Mrs. Smith",
      type: "PDF",
      size: "2.4 MB",
      date: "Oct 15, 2023",
      icon: FileText,
      color: "text-red-500",
      bg: "bg-red-50",
      description: "This comprehensive guide covers the fundamentals of linear equations, including solving one-step and two-step equations, graphing on a coordinate plane, and understanding slope-intercept form.",
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      title: "Introduction to Cell Biology",
      subject: "Science",
      teacher: "Mr. Davis",
      type: "Video",
      duration: "15:30",
      date: "Oct 14, 2023",
      icon: Video,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
      description: "A detailed visual walkthrough of animal and plant cells, their organelles, and their primary functions. Great for upcoming quiz preparation.",
      likes: 56,
      comments: 12
    },
    {
      id: 3,
      title: "World War II Timeline",
      subject: "History",
      teacher: "Mr. Johnson",
      type: "Doc",
      size: "1.1 MB",
      date: "Oct 10, 2023",
      icon: Book,
      color: "text-blue-500",
      bg: "bg-blue-50",
      description: "A chronological overview of the major events, battles, and treaties from 1939 to 1945.",
      likes: 18,
      comments: 2
    }
  ];

  const filteredMaterials = activeTab === 'All' 
    ? materialsData 
    : materialsData.filter(m => m.subject === activeTab);

  const handleViewMaterial = (material) => {
    setSelectedMaterial(material);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedMaterial(null);
  };

  // ----------------------------------------------------
  // LIST VIEW
  // ----------------------------------------------------
  if (viewMode === 'list') {
    return (
      <div className="space-y-6 p-4 sm:p-8 bg-slate-50 min-h-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Study Materials</h1>
            <p className="text-slate-500 mt-1 font-medium">Access notes, videos, and resources</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="flex overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 gap-2 hide-scrollbar">
            {subjects.map(subject => (
              <button
                key={subject}
                onClick={() => setActiveTab(subject)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === subject 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search materials..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map(material => (
            <div 
              key={material.id} 
              onClick={() => handleViewMaterial(material)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${material.bg}`}>
                  <material.icon className={`w-6 h-6 ${material.color}`} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                  {material.subject}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                {material.title}
              </h3>
              
              <p className="text-sm text-slate-500 mb-4">By {material.teacher}</p>
              
              <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                <span>{material.type === 'Video' ? material.duration : material.size}</span>
                <span>{material.date}</span>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button 
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 font-medium rounded-xl hover:bg-blue-100 transition-colors"
                >
                  {material.type === 'Video' ? <Play className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  View
                </button>
                {material.type !== 'Video' && (
                  <button 
                    onClick={(e) => e.stopPropagation()} // Prevent card click
                    className="p-2 text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // DETAILS VIEW
  // ----------------------------------------------------
  if (viewMode === 'details' && selectedMaterial) {
    const Icon = selectedMaterial.type === 'Video' ? Video : selectedMaterial.type === 'PDF' ? FileText : Book;

    return (
      <div className="max-w-5xl mx-auto space-y-6 p-4 sm:p-8 bg-slate-50 min-h-full">
        <button onClick={handleBackToList} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Materials
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Material Viewer Placeholder */}
            <div className="bg-slate-900 rounded-2xl aspect-video flex flex-col items-center justify-center text-white relative overflow-hidden shadow-sm border border-slate-200">
              {selectedMaterial.type === 'Video' ? (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <Video className="w-16 h-16 text-slate-600 mb-4" />
                  <p className="absolute bottom-6 text-slate-400 font-medium">Video Player Placeholder</p>
                </div>
              ) : (
                <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 m-4 rounded-xl text-slate-500">
                  <Icon className="w-16 h-16 mb-4 text-slate-400" />
                  <p className="font-medium text-lg text-slate-600 mb-2">Document Preview</p>
                  <p className="text-sm">{selectedMaterial.title}.{selectedMaterial.type.toLowerCase()}</p>
                  <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download File
                  </button>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
                      {selectedMaterial.subject}
                    </span>
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {selectedMaterial.date}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-800">{selectedMaterial.title}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
                    <ThumbsUp className="w-4 h-4" />
                    {selectedMaterial.likes}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 py-4 border-y border-slate-100 mb-6">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedMaterial.teacher}`} alt={selectedMaterial.teacher} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{selectedMaterial.teacher}</p>
                  <p className="text-xs text-slate-500">Subject Teacher</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">About this material</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {selectedMaterial.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4">File Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                  <span className="text-slate-500 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Type
                  </span>
                  <span className="font-medium text-slate-800">{selectedMaterial.type}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Download className="w-4 h-4" /> Size
                  </span>
                  <span className="font-medium text-slate-800">{selectedMaterial.size || selectedMaterial.duration}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Comments
                  </span>
                  <span className="font-medium text-slate-800">{selectedMaterial.comments}</span>
                </div>
              </div>
              
              <button className="w-full mt-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download {selectedMaterial.type}
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4">Related Materials</h3>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3 group cursor-pointer">
                    <div className="w-16 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                      <Video className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                        Understanding Quadratic Equations
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">Video • 12:45</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Materials;
