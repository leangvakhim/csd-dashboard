import React, {useEffect, useState} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import CareerHeader from '../components/Career/CareerHeader'
import CareerDashboard from '../components/Career/CareerDashboard'

const Career = () => {

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
                <CareerHeader/>
                <CareerDashboard/>
            </div>
        </div>
    )
}

export default Career