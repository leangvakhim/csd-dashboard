import React, {useEffect, useState} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import FeedbackHeader from '../components/Feedback/FeedbackHeader'
import FeedbackDashboard from '../components/Feedback/FeedbackDashboard'

const Feedback = () => {

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

            <div className=" w-full page-wrapper overflow-hidden">
                <FeedbackHeader/>
                <FeedbackDashboard/>
            </div>
        </div>
    )
}

export default Feedback