import React, {useEffect, useState} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import AnnouncementHeader from '../components/Announcement/AnnouncementHeader'
import AnnouncementDashboard from '../components/Announcement/AnnouncementDashboard'

const Announcement = () => {

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
                <AnnouncementHeader/>
                <AnnouncementDashboard/>
            </div>
        </div>
    )
}

export default Announcement