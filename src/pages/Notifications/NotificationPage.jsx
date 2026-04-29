import React from 'react';
import { Bell, CheckCircle2, AlertCircle, FileText, Calendar, Check, MoreVertical } from 'lucide-react';

const NotificationPage = () => {
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Task Due Soon',
      message: 'Your Mathematics Chapter 5 Exercise is due in 2 hours.',
      time: '1 hour ago',
      read: false,
      icon: AlertCircle,
      iconColor: 'text-amber-500',
      bg: 'bg-amber-50'
    },
    {
      id: 2,
      type: 'assignment',
      title: 'New Assignment Posted',
      message: 'Mr. Davis posted a new task: Science Project: Solar System.',
      time: '3 hours ago',
      read: false,
      icon: FileText,
      iconColor: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      id: 3,
      type: 'grade',
      title: 'Task Graded',
      message: 'Mrs. Smith graded your History Essay. You scored 95/100.',
      time: '1 day ago',
      read: true,
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      id: 4,
      type: 'event',
      title: 'Upcoming Quiz Reminder',
      message: 'Don\'t forget your Biology Quiz tomorrow at 10:00 AM.',
      time: '1 day ago',
      read: true,
      icon: Calendar,
      iconColor: 'text-indigo-500',
      bg: 'bg-indigo-50'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-8 bg-slate-50 min-h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-500" />
            Notifications
          </h1>
          <p className="text-slate-500 mt-1">Stay updated with your latest alerts and messages</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
          <Check className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-4 sm:p-6 flex items-start gap-4 transition-colors hover:bg-slate-50 group ${
              !notification.read ? 'bg-blue-50/30' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notification.bg}`}>
              <notification.icon className={`w-6 h-6 ${notification.iconColor}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-semibold truncate ${!notification.read ? 'text-slate-900' : 'text-slate-800'}`}>
                  {notification.title}
                </h3>
                <span className="text-xs text-slate-400 whitespace-nowrap shrink-0 mt-1">
                  {notification.time}
                </span>
              </div>
              <p className={`text-sm mt-1 line-clamp-2 ${!notification.read ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                {notification.message}
              </p>
              
              {!notification.read && (
                <div className="mt-3">
                  <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {!notification.read && (
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
              )}
              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
