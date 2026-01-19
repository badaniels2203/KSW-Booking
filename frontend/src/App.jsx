import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CheckInPage from './pages/CheckInPage';
import StudentsPage from './pages/StudentsPage';
import ClassesPage from './pages/ClassesPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="logo">Martial Arts School</h1>
            <ul className="nav-menu">
              <li><Link to="/">Check-In</Link></li>
              <li><Link to="/students">Students</Link></li>
              <li><Link to="/classes">Classes</Link></li>
              <li><Link to="/reports">Reports</Link></li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<CheckInPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2026 Martial Arts School Attendance System</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
