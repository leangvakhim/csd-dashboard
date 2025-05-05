import React from 'react'
import Aside from '../components/Aside'
import EmailDashboard from '../components/Email/EmailDashboard'

const Email = () => {
    return (
        <div id="main-wrapper" className=" flex">
            <Aside/>

            <div className=" w-full page-wrapper overflow-hidden">
                <EmailDashboard/>
            </div>
        </div>
    )
}

export default Email