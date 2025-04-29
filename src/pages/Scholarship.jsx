import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import ScholarshipHeader from '../components/Scholarship/ScholarshipHeader'
import ScholarshipDashboard from '../components/Scholarship/ScholarshipDashboard'

const Scholarship = () => {

    return (
        <div id="main-wrapper" className=" flex">
            <Aside/>

            <div className=" w-full page-wrapper overflow-hidden">
                <ScholarshipHeader/>
                <ScholarshipDashboard/>
            </div>
        </div>
    )
}

export default Scholarship