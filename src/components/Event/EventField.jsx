import React from 'react'
import Aside from '../Aside'
import EventsFieldHeader from './EventsFieldHeader'
import EventsFieldBody from './EventsFieldBody'

const EventsField = () => {
    return (
        <div id="main-wrapper" class=" flex">
            <Aside/>

            <div class=" w-full page-wrapper overflow-hidden">
               <EventsFieldHeader/>
               <EventsFieldBody/>
            </div>
        </div>
    )
}

export default EventsField