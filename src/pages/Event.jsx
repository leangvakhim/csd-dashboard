import React, {useState} from 'react'
import Aside from '../components/Aside'
import EventHeader from '../components/Event/EventHeader'
import EventDashboard from '../components/Event/EventDashboard'

const Event = () => {
    return (
        <div id="main-wrapper" className=" flex">
            <Aside/>

            <div className=" w-full page-wrapper overflow-hidden">
                <EventHeader/>
                <EventDashboard />
            </div>
        </div>
    )
}

export default Event