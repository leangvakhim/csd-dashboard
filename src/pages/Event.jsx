import React, {useEffect, useState} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import EventHeader from '../components/Event/EventHeader'
import EventDashboard from '../components/Event/EventDashboard'

const Event = () => {
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
                <EventHeader/>
                <EventDashboard />
            </div>
        </div>
    )
}

export default Event