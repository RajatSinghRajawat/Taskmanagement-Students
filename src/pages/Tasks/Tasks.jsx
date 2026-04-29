import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  FileText,
  Calendar,
  ArrowLeft,
  Paperclip,
  UploadCloud,
  File,
  X,
  AlertCircle
} from 'lucide-react';

const Tasks = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'details', 'submit'
  const [selectedTask, setSelectedTask] = useState(null);

  // Submit states
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const tasksData = [
    {
      id: 1,
      title: "Science Project: Solar System",
      subject: "Science",
      teacher: "Mr. Davis",
      dueDate: "Today, 11:59 PM",
      postedDate: "2 days ago",
      status: "pending",
      priority: "high",
      description: "Create a detailed presentation about the solar system.\n\nRequirements:\n1. Include all 8 planets with their key characteristics.\n2. Add facts about the Sun and Moon.\n3. Include at least 5 images.\n4. Format it properly with headings and bullet points.\n\nMake sure to review the attached rubric before starting.",
      attachments: [
        { name: "Project_Rubric.pdf", size: "2.4 MB", type: "pdf" },
        { name: "Solar_System_Reference.docx", size: "1.1 MB", type: "doc" }
      ]
    },
    {
      id: 2,
      title: "Math Chapter 5 Exercise",
      subject: "Mathematics",
      teacher: "Mrs. Smith",
      dueDate: "Tomorrow, 5:00 PM",
      postedDate: "1 day ago",
      status: "pending",
      priority: "medium",
      description: "Complete exercises 5.1 to 5.4 from the textbook. Ensure you show all your working steps clearly. Scan and upload your notebook pages as a single PDF.",
      attachments: []
    },
    {
      id: 3,
      title: "History Essay: World War II",
      subject: "History",
      teacher: "Mr. Johnson",
      dueDate: "Completed",
      postedDate: "1 week ago",
      status: "completed",
      priority: "low",
      score: "95/100",
      description: "Write a 1000-word essay on the causes of WWII. Focus on the political and economic conditions in Europe post-WWI.",
      attachments: [
        { name: "Essay_Guidelines.pdf", size: "1.1 MB", type: "pdf" }
      ]
    }
  ];

  const filteredTasks = tasksData.filter(task => task.status === activeTab);

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setViewMode('details');
  };

  const handleStartSubmit = () => {
    setViewMode('submit');
    setSubmitted(false);
    setFiles([]);
    setComments('');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedTask(null);
  };

  const handleBackToDetails = () => {
    setViewMode('details');
  };

  // Submit Handlers
  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        handleBackToList();
      }, 2000);
    }, 1500);
  };

  // ----------------------------------------------------
  // LIST VIEW
  // ----------------------------------------------------
  if (viewMode === 'list') {
    return (
      <div className="space-y-6 p-4 sm:p-8 bg-slate-50 min-h-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Tasks</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage and track your assignments</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'pending' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'completed' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed
            </button>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
            </div>
            <button className="p-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-medium text-slate-800">No tasks found</h3>
              <p className="text-slate-500 mt-1">You're all caught up!</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                onClick={() => handleViewTask(task)}
                key={task.id} 
                className="block cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-xl shrink-0 ${
                      task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <FileText size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {task.subject}
                        </span>
                        {task.priority === 'high' && task.status !== 'completed' && (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-red-50 text-red-600">
                            High Priority
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {task.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-1">{task.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden">
                             <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${task.teacher}`} alt={task.teacher} />
                          </div>
                          {task.teacher}
                        </span>
                        {task.status !== 'completed' ? (
                          <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
                            <Clock size={14} />
                            Due: {task.dueDate}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                            Score: {task.score}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                     {task.status !== 'completed' ? (
                      <button className="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors w-full md:w-auto text-center flex items-center justify-center gap-2">
                        Start Task
                        <ChevronRight size={16} />
                      </button>
                     ) : (
                      <button className="px-5 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors w-full md:w-auto text-center flex items-center justify-center gap-2">
                        View Details
                        <ChevronRight size={16} />
                      </button>
                     )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // DETAILS VIEW
  // ----------------------------------------------------
  if (viewMode === 'details' && selectedTask) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-8 bg-slate-50 min-h-full">
        <button onClick={handleBackToList} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tasks
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-200">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg">
                    {selectedTask.subject}
                  </span>
                  {selectedTask.priority === 'high' && (
                    <span className="px-3 py-1 bg-red-50 text-red-700 text-sm font-semibold rounded-lg">
                      High Priority
                    </span>
                  )}
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                  {selectedTask.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedTask.teacher}`} alt={selectedTask.teacher} />
                    </div>
                    <span className="font-medium text-slate-700">{selectedTask.teacher}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Posted {selectedTask.postedDate}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center md:items-end min-w-[200px]">
                {selectedTask.status !== 'completed' ? (
                  <>
                    <div className="flex items-center gap-2 text-amber-600 font-semibold mb-1">
                      <Clock className="w-5 h-5" />
                      Due {selectedTask.dueDate}
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Status: Pending</p>
                    <button 
                      onClick={handleStartSubmit}
                      className="w-full text-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                    >
                      Submit Task
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-1">
                      <CheckCircle2 className="w-5 h-5" />
                      Completed
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Score: {selectedTask.score}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Instructions
              </h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {selectedTask.description}
                </p>
              </div>
            </div>

            {selectedTask.attachments && selectedTask.attachments.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-slate-400" />
                  Attachments ({selectedTask.attachments.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedTask.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0 mr-4">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{file.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SUBMIT VIEW
  // ----------------------------------------------------
  if (viewMode === 'submit' && selectedTask) {
    if (submitted) {
      return (
        <div className="max-w-2xl mx-auto mt-12 p-4">
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Task Submitted!</h2>
            <p className="text-slate-500 mb-8">Your work has been successfully sent to your teacher.</p>
            <div className="text-sm text-slate-400">Redirecting to tasks...</div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6 p-4 sm:p-8 bg-slate-50 min-h-full">
        <button onClick={handleBackToDetails} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Details
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h1 className="text-xl font-bold text-slate-800">Submit Task</h1>
            <p className="text-slate-500 text-sm mt-1">{selectedTask.title}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Upload Your Work
              </label>
              <div 
                className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="text-slate-700 font-medium mb-1">
                  Drag and drop your files here
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  PDF, Word, Images, ZIP up to 50MB
                </p>
                <label className="inline-block px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-medium cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                  Browse Files
                  <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            </div>

            {files.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Selected Files ({files.length})</h4>
                <div className="space-y-3">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{file.name}</p>
                          <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="comments" className="block text-sm font-semibold text-slate-700 mb-2">
                Private Comments for Teacher (Optional)
              </label>
              <textarea 
                id="comments"
                rows="4"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any notes or questions about your submission..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-sm"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg w-full sm:w-auto">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Make sure to attach all required files.
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  type="button"
                  onClick={handleBackToDetails}
                  className="flex-1 sm:flex-none px-6 py-2.5 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors text-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={files.length === 0 || isSubmitting}
                  className="flex-1 sm:flex-none px-8 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Turn In'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
};

export default Tasks;
