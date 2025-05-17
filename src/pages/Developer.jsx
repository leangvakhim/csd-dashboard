import React, {useEffect, useState} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import DeveloperHeader from '../components/Developer/DeveloperHeader'
import DeveloperDashboard from '../components/Developer/DeveloperDashboard'

const Developer = () => {

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
                <DeveloperHeader/>
                <DeveloperDashboard/>
            </div>
        </div>
    )
}

export default Developer