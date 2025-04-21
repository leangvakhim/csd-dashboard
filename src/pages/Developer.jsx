import React from 'react'
import Aside from '../components/Aside'
import DeveloperHeader from '../components/Developer/DeveloperHeader'
import DeveloperDashboard from '../components/Developer/DeveloperDashboard'

const Developer = () => {
    return (
        <div id="main-wrapper" class=" flex">
            <Aside/>

            <div class=" w-full page-wrapper overflow-hidden">
                <DeveloperHeader/>
                <DeveloperDashboard/>
            </div>
        </div>
    )
}

export default Developer