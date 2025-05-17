import React, {useEffect, useState} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import ResearchHeader from '../components/Research/ResearchHeader'
import ResearchDashboard from '../components/Research/ResearchDashboard'

const Research = () => {

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
                <ResearchHeader/>
                <ResearchDashboard/>
            </div>
        </div>
    )
}

export default Research