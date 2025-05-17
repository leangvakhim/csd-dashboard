import React, {useEffect, useState} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import ResearchlabHeader from '../components/Researchlab/ResearchlabHeader'
import ResearchlabDashboard from '../components/Researchlab/ResearchlabDashboard'

const Researchlab = () => {

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
                <ResearchlabHeader/>
                <ResearchlabDashboard/>
            </div>
        </div>
    )
}

export default Researchlab