import React, {useEffect, useState} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import ScholarshipHeader from '../components/Scholarship/ScholarshipHeader'
import ScholarshipDashboard from '../components/Scholarship/ScholarshipDashboard'

const Scholarship = () => {

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
                <ScholarshipHeader/>
                <ScholarshipDashboard/>
            </div>
        </div>
    )
}

export default Scholarship