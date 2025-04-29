import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import FeedbackHeader from '../components/Feedback/FeedbackHeader'
import FeedbackDashboard from '../components/Feedback/FeedbackDashboard'

const Feedback = () => {

    return (
        <div id="main-wrapper" className=" flex">
            <Aside/>

            <div className=" w-full page-wrapper overflow-hidden">
                <FeedbackHeader/>
                <FeedbackDashboard/>
            </div>
        </div>
    )
}

export default Feedback