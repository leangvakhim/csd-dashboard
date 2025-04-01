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
import PageField from './components/Page/PageField';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/menu"/>}/>
        <Route path='/menu' element={<Menu/>} />
        <Route path='/page' element={<Page/>} />
        <Route path='/page/page-detail' element={<PageField/>} />
        <Route path='/faculty' element={<Faculty/>} />
        <Route path='/faculty/faculty-detail' element={<FacultyField/>} />
        <Route path='/event' element={<Event/>} />
        <Route path='/event/event-detail' element={<EventsField/>} />
        <Route path='/news' element={<New/>} />
        <Route path='//news/news-details' element={<NewsField />} />
        <Route path='/career' element={<Career/>} />
        <Route path='/career/career-details' element={<CareerField />} />
        <Route path='/scholarship' element={<Scholarship/>} />
        <Route path='/scholarship/scholarship-details' element={<ScholarshipField />} />
        <Route path='/research' element={<Research/>} />
        <Route path='/research/research-detail' element={<ResearchField/>} />
        <Route path='/lab' element={<Researchlab/>} />
        <Route path='/lab/researchlab-details' element={<ResearchlabField/>} />
        <Route path='/feedback' element={<Feedback/>} />
        <Route path='/feedback/feedback-details' element={<FeedBackField/>} />
        <Route path='/partnership' element={<Partnership/>} />
        <Route path='/image' element={<Image/>} />
        <Route path='/login' element={<Login/>} />
      </Routes>
    </Router>
  )
}

export default App
