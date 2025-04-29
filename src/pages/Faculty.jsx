import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import FacultyHeader from '../components/Faculty/FacultyHeader'
import FacultyDashboard from '../components/Faculty/FacultyDashboard'

const Faculty = () => {

  return (
    <div id="main-wrapper" class=" flex">
        <Aside/>

        <div class=" w-full page-wrapper overflow-hidden">
            <FacultyHeader/>
            <FacultyDashboard/>
        </div>
    </div>
  )
}

export default Faculty