import React, {useEffect, useState} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import FacultyHeader from '../components/Faculty/FacultyHeader'
import FacultyDashboard from '../components/Faculty/FacultyDashboard'

const Faculty = () => {
  const [username, setUsername] = useState('');

    useEffect(() => {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }, []);

    return (
      <div id="main-wrapper" className=" flex">
          <Aside username={username}/>

        <div class=" w-full page-wrapper overflow-hidden">
            <FacultyHeader/>
            <FacultyDashboard/>
        </div>
    </div>
  )
}

export default Faculty