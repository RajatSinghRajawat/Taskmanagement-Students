import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StudentLayout from './components/layout/StudentLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks/Tasks';
import Materials from './pages/Materials/Materials';
import MyReport from './pages/Reports/MyReport';
import NotificationPage from './pages/Notifications/NotificationPage';
import ProfileView from './pages/Profile/ProfileView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="materials" element={<Materials />} />
          <Route path="report" element={<MyReport />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="profile" element={<ProfileView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
