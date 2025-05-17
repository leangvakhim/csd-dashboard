import React, {useEffect, useState} from 'react'
import Aside from '../components/Aside'
import EmailDashboard from '../components/Email/EmailDashboard'

const Email = () => {
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
                <EmailDashboard/>
            </div>
        </div>
    )
}

export default Email