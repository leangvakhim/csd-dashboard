import React, {useEffect, useState} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import NewHeader from '../components/New/NewHeader'
import NewDashboard from '../components/New/NewDashboard'

const New = () => {

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
                <NewHeader/>
                <NewDashboard/>
            </div>
        </div>
    )
}

export default New