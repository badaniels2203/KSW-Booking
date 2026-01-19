# Martial Arts School - Attendance Tracking System

A comprehensive web-based attendance tracking and class booking system designed specifically for martial arts schools. This system allows students to check in to classes, administrators to manage students and class schedules, and generate monthly billing reports based on attendance.

## Features

### Student Check-In Interface
- **Quick Check-In**: Students can check in by typing their name
- **Smart Class Detection**: Automatically shows current or upcoming class based on time of day
- **Pre-filtered Student List**: Shows students enrolled in the current class for faster check-in
- **NFC Support Ready**: Database schema includes NFC token field for future NFC check-in implementation

### Student Management
- Add, edit, and delete student records
- Track student name, age, and optional NFC token
- Search and filter students
- View complete student roster

### Class Schedule Management
- Create and manage class schedules with day of week and time slots
- Activate/deactivate classes
- Enroll and remove students from specific classes
- View all students enrolled in each class
- Track which classes are currently active

### Attendance Tracking
- Automatic attendance logging with date and time
- Prevents duplicate check-ins for the same class on the same day
- View attendance history by date range
- Filter attendance by student or class

### Billing Reports
- **Monthly Billing Report**: Shows total attendance per student for any given month
- **Attendance Summary**: Displays which classes each student attended
- **CSV Export**: Export reports to CSV for billing and record-keeping
- **Summary Statistics**: View total students, sessions, and average attendance

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **SQLite** database for data persistence
- RESTful API architecture
- CORS enabled for cross-origin requests

### Frontend
- **React 18** with hooks
- **Vite** for fast development and building
- **React Router** for navigation
- **Axios** for API communication
- Responsive CSS design

## Project Structure

```
martial-arts-booking/
├── backend/
│   ├── database/
│   │   └── martial_arts.db (created after initialization)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── initDatabase.js
│   │   ├── controllers/
│   │   │   ├── attendanceController.js
│   │   │   ├── classController.js
│   │   │   └── studentController.js
│   │   ├── models/
│   │   │   ├── Attendance.js
│   │   │   ├── Class.js
│   │   │   └── Student.js
│   │   ├── routes/
│   │   │   ├── attendance.js
│   │   │   ├── classes.js
│   │   │   └── students.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── CheckInPage.jsx
│   │   │   ├── ClassesPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── StudentsPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd Hello-Git
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Initialize the Database**
```bash
npm run init-db
```

This will create the SQLite database with all necessary tables:
- `students` - Student information
- `classes` - Class schedules
- `class_students` - Many-to-many relationship between classes and students
- `attendance` - Attendance records

4. **Start the Backend Server**
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

The backend API will be available at `http://localhost:3001`

5. **Install Frontend Dependencies** (in a new terminal)
```bash
cd frontend
npm install
```

6. **Start the Frontend Development Server**
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage Guide

### Initial Setup

1. **Add Students**
   - Navigate to the "Students" page
   - Click "Add New Student"
   - Enter student name, age, and optional NFC token
   - Click "Create"

2. **Create Class Schedule**
   - Navigate to the "Classes" page
   - Click "Add New Class"
   - Enter class name (e.g., "Kids Karate", "Adult Jiu-Jitsu")
   - Select day of week (0 = Sunday, 6 = Saturday)
   - Enter start and end times (24-hour format, e.g., 17:00 for 5:00 PM)
   - Ensure "Active" is checked
   - Click "Create"

3. **Enroll Students in Classes**
   - On the "Classes" page, click "Manage Students" for a class
   - Click "Enroll" next to each student you want to add to the class
   - Students will now appear in the pre-filtered list during check-in times

### Daily Operations

**Student Check-In**
1. Students navigate to the check-in page (default home page)
2. The system automatically detects the current or upcoming class
3. Students can either:
   - Type their name to search and click their name to check in
   - Select from the pre-filtered list of students enrolled in the current class
4. Success message confirms check-in
5. System prevents duplicate check-ins for the same class on the same day

### Monthly Billing

1. Navigate to the "Reports" page
2. Select "Monthly Billing Report" tab
3. Choose the year and month
4. View attendance counts for each student
5. Click "Export to CSV" to download for billing purposes

### Attendance History

1. Navigate to the "Reports" page
2. Select "Attendance History" tab
3. Choose start and end dates
4. Click "Generate Report"
5. View detailed attendance records with check-in times
6. Export to CSV for record-keeping

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `GET /api/students/search?name=<name>` - Search students by name
- `GET /api/students/nfc/:token` - Get student by NFC token
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Classes
- `GET /api/classes` - Get all classes
- `GET /api/classes/active` - Get active classes
- `GET /api/classes/current` - Get current classes (based on day/time)
- `GET /api/classes/upcoming` - Get next upcoming class
- `GET /api/classes/:id` - Get class by ID
- `GET /api/classes/:id/students` - Get students enrolled in class
- `POST /api/classes` - Create new class
- `POST /api/classes/:id/students` - Enroll student in class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class
- `DELETE /api/classes/:id/students` - Remove student from class

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/:id` - Get attendance by ID
- `GET /api/attendance/daterange?start_date=<date>&end_date=<date>` - Get attendance by date range
- `GET /api/attendance/student/:student_id` - Get attendance by student
- `GET /api/attendance/class/:class_id` - Get attendance by class
- `GET /api/attendance/report/monthly?year=<year>&month=<month>` - Get monthly billing report
- `GET /api/attendance/student/:student_id/monthly?year=<year>&month=<month>` - Get student monthly attendance
- `POST /api/attendance/checkin` - Check in student
- `DELETE /api/attendance/:id` - Delete attendance record

## Database Schema

### students
- `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- `name` (TEXT, NOT NULL)
- `age` (INTEGER, NOT NULL)
- `nfc_token` (TEXT, UNIQUE)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### classes
- `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- `name` (TEXT, NOT NULL)
- `day_of_week` (INTEGER, 0-6, NOT NULL)
- `start_time` (TEXT, NOT NULL)
- `end_time` (TEXT, NOT NULL)
- `active` (INTEGER, DEFAULT 1)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### class_students
- `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- `class_id` (INTEGER, FOREIGN KEY)
- `student_id` (INTEGER, FOREIGN KEY)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- UNIQUE constraint on (class_id, student_id)

### attendance
- `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- `student_id` (INTEGER, FOREIGN KEY)
- `class_id` (INTEGER, FOREIGN KEY)
- `date` (DATE, NOT NULL)
- `check_in_time` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

## Future Enhancements

- **NFC Integration**: Implement Web NFC API for tap-to-check-in functionality
- **Authentication**: Add user authentication for admin functions
- **Multi-Location Support**: Support for multiple school locations
- **Email Reports**: Automated email delivery of monthly billing reports
- **Student Portal**: Allow parents to view their child's attendance history
- **Payment Integration**: Connect billing reports with payment processing
- **Mobile App**: Native mobile applications for iOS and Android
- **Advanced Analytics**: Visualizations and trends for attendance patterns

## Development

### Running in Development Mode

Backend (with auto-reload):
```bash
cd backend
npm run dev
```

Frontend (with hot module replacement):
```bash
cd frontend
npm run dev
```

### Building for Production

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting

### Database Issues
If you encounter database errors:
1. Stop both servers
2. Delete `backend/database/martial_arts.db`
3. Run `npm run init-db` in the backend directory
4. Restart servers

### Port Conflicts
- Backend runs on port 3001 (change in backend/.env)
- Frontend runs on port 3000 (change in frontend/vite.config.js)

### CORS Issues
Ensure the backend CORS configuration allows requests from your frontend URL.

## License

MIT License

## Support

For issues, questions, or contributions, please create an issue in the repository.
