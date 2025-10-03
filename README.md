# TalentFlow - Frontend-Only Recruitment Management Platform

A comprehensive, frontend-only recruitment management platform built with React, TypeScript, and modern web technologies.

## 🚀 Features

### For Recruiters
- **Job Management**: Create, edit, and manage job postings with detailed requirements
- **Candidate Pipeline**: Track candidates through different stages (Applied, Screening, Interview, Assessment, Offer, Hired, Rejected)
- **Assessment Builder**: Create custom assessments with multiple question types
- **Analytics Dashboard**: View hiring metrics, pipeline statistics, and performance insights
- **Candidate Profiles**: Detailed candidate information with notes and timeline tracking

### For Candidates
- **Job Portal**: Browse and apply to available positions
- **Assessment Taking**: Complete assigned assessments with real-time progress tracking
- **Application Analytics**: Track application status and performance metrics
- **Profile Management**: Update personal information and preferences

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query + React Hooks
- **Database**: IndexedDB (Dexie.js) for local storage
- **Authentication**: Frontend-only authentication system
- **Routing**: React Router DOM
- **Charts**: Recharts for analytics visualization
- **Drag & Drop**: @dnd-kit for interactive components

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd talentflow-app-sim-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Demo Accounts

The application includes demo accounts for testing:

### Recruiter Account
- **Email**: recruiter@demo.com
- **Password**: demo123

### Candidate Account
- **Email**: candidate@demo.com
- **Password**: demo123

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── assessments/     # Assessment-related components
│   ├── candidates/      # Candidate management components
│   ├── jobs/           # Job management components
│   ├── layout/         # Layout components (Header, Navigation, etc.)
│   └── ui/             # Base UI components (shadcn/ui)
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and database setup
├── pages/              # Page components
│   └── candidate/      # Candidate-specific pages
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

## 🗄️ Data Storage

This application uses **IndexedDB** for local data storage:

- **Jobs**: Job postings and requirements
- **Candidates**: Candidate information and pipeline data
- **Assessments**: Assessment templates and responses
- **Users**: Authentication and profile data

All data is stored locally in the browser and persists between sessions.

## 🎨 Key Components

### Assessment Builder
- Drag-and-drop question reordering
- Multiple question types (Single Choice, Multiple Choice, Text, Numeric, File Upload)
- Conditional logic and validation rules
- Real-time preview functionality

### Candidate Pipeline
- Visual pipeline management
- Bulk candidate operations
- Advanced filtering and search
- Timeline and notes tracking

### Analytics Dashboard
- Interactive charts and graphs
- Hiring funnel visualization
- Performance metrics
- Export capabilities

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔄 Database Management

The application uses IndexedDB for local storage. To reset the database with fresh mock data:

1. **Via Browser Console**: Open browser developer tools and run:
   ```javascript
   resetDatabase()
   ```

2. **Via Application**: The database will automatically seed with:
   - **100 mock candidates** with realistic data, notes, and timeline events
   - **26 job postings** across various departments
   - **3 comprehensive assessments** for different roles (Frontend Developer, Backend Developer, Product Manager)

### Mock Data Features

**Candidates (100 total):**
- Diverse names and contact information
- Random distribution across all job positions
- Various pipeline stages (Applied, Screening, Interview, Assessment, Offer, Hired, Rejected)
- Realistic timeline events and notes
- Resume links and phone numbers

**Assessments (3 total):**
- **Frontend Developer Assessment**: JavaScript frameworks, CSS skills, responsive design
- **Backend Developer Assessment**: Programming languages, databases, API development, system design
- **Product Manager Assessment**: Strategy frameworks, user research, analytics tools

Each assessment includes multiple question types:
- Single choice questions
- Multiple choice questions
- Numeric input with validation
- Short and long text responses
- Required and optional fields

## 🌟 Features Highlights

### Frontend-Only Architecture
- No backend server required
- Complete offline functionality
- Fast and responsive user experience
- Easy deployment to static hosting

### Modern UI/UX
- Clean, professional design
- Responsive layout for all devices
- Dark/light theme support
- Accessibility compliant

### Advanced Functionality
- Real-time data synchronization
- Drag-and-drop interfaces
- Advanced filtering and search
- Export and import capabilities

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- Real-time collaboration features
- Advanced reporting and analytics
- Integration with external job boards
- Mobile app development
- Advanced assessment features

---

**Built with ❤️ using modern web technologies**