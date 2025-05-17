import React, {useEffect, useState} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import PartnershipHeader from '../components/Partnership/PartnershipHeader'
import PartnershipDashboard from '../components/Partnership/PartnershipDashboard'

const Partnership = () => {

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
                <PartnershipHeader/>
                <PartnershipDashboard/>
            </div>
        </div>
    )
}

export default Partnership