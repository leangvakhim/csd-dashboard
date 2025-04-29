import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import ResearchlabHeader from '../components/Researchlab/ResearchlabHeader'
import ResearchlabDashboard from '../components/Researchlab/ResearchlabDashboard'

const Researchlab = () => {

    return (
        <div id="main-wrapper" className=" flex">
            <Aside/>

            <div className=" w-full page-wrapper overflow-hidden">
                <ResearchlabHeader/>
                <ResearchlabDashboard/>
            </div>
        </div>
    )
}

export default Researchlab