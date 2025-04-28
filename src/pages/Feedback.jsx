import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import FeedbackHeader from '../components/Feedback/FeedbackHeader'
import FeedbackDashboard from '../components/Feedback/FeedbackDashboard'

const Feedback = () => {

    const { loading, setLoading } = useLoading();

    useEffect(() => {
        if (loading) {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);
        return () => clearTimeout(timer);
        }
    }, [loading]);

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