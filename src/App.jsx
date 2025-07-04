import './App.css'
import Menu from './pages/Menu';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Image from './pages/Image';
import Page from './pages/Page';
import Faculty from './pages/Faculty';
import FacultyField from './components/Faculty/FacultyField';
import Event from './pages/Event';
import EventsField from './components/Event/EventField';
import New from './pages/New';
import NewsField from './components/New/NewsField';
import Career from './pages/Career';
import CareerField from './components/Career/CareerField';
import Scholarship from './pages/Scholarship';
import ScholarshipField from './components/Scholarship/ScholarshipField';
import Research from './pages/Research';
import ResearchField from './components/Research/ResearchField';
import Researchlab from './pages/Researchlab';
import ResearchlabField from './components/Researchlab/ResearchlabField';
import Feedback from './pages/Feedback';
import FeedBackField from './components/Feedback/FeedbackField';
import Partnership from './pages/Partnership';
import PartnershipField from './components/Partnership/PartnershipField';
import PageField from './components/Page/PageField';
import Announcement from './pages/Announcement';
import AnnouncementField from './components/Announcement/AnnouncementField';
import Setting from './pages/Setting';
import SettingFieldBody from './components/Setting/SettingFieldBody';
import Developer from './pages/Developer';
import DeveloperField from './components/Developer/DeveloperField';
import GlobalLoading from './components/GlobalLoading';
import { LoadingProvider } from './components/Context/LoadingContext';
import Email from './pages/Email';
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <LoadingProvider>
      <Router>
        <GlobalLoading />
        <Routes>
          <Route path="/dashboard/login" element={<Login />} />
          <Route path='/dashboard' element={<Navigate to="/dashboard/menu"/>}/>
          <Route path='/dashboard/menu' element={<PrivateRoute><Menu username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/page' element={<PrivateRoute><Page username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/page/page-detail' element={<PrivateRoute><PageField username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/faculty' element={<PrivateRoute><Faculty username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/faculty/faculty-detail' element={<PrivateRoute><FacultyField username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/event' element={<PrivateRoute><Event username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/event/event-detail' element={<PrivateRoute><EventsField username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/news' element={<PrivateRoute><New username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/news/news-details' element={<PrivateRoute><NewsField username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/announcement' element={<PrivateRoute><Announcement username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/announcement/announcement-details' element={<PrivateRoute><AnnouncementField username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/career' element={<PrivateRoute><Career username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/career/career-details' element={<PrivateRoute><CareerField username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/scholarship' element={<PrivateRoute><Scholarship username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/scholarship/scholarship-details' element={<PrivateRoute><ScholarshipField username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/research' element={<PrivateRoute><Research username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/research/research-detail' element={<PrivateRoute><ResearchField username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/lab' element={<PrivateRoute><Researchlab username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/lab/researchlab-details' element={<PrivateRoute><ResearchlabField username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/feedback' element={<PrivateRoute><Feedback username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/feedback/feedback-details' element={<PrivateRoute><FeedBackField username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/partnership' element={<PrivateRoute><Partnership username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/partnership/partnership-details' element={<PrivateRoute><PartnershipField username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/image' element={<PrivateRoute><Image username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/email' element={<PrivateRoute><Email username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/developer' element={<PrivateRoute><Developer username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/developer/developer-details' element={<PrivateRoute><DeveloperField username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/setting' element={<PrivateRoute><Setting username={localStorage.getItem("username")} /></PrivateRoute>} />
          <Route path='/dashboard/setting/setting-details' element={<PrivateRoute><SettingFieldBody username={localStorage.getItem("username")} /></PrivateRoute>} />
        </Routes>
      </Router>
    </LoadingProvider>
  );
}

export default App
