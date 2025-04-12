import React from 'react'
import Aside from '../Aside'
import AnnouncementFieldHeader from './AnnouncementFieldHeader'

const AnnouncementField = () => {
    return (
        <div id="main-wrapper" class=" flex">
            <Aside />

            <div class=" w-full page-wrapper overflow-hidden">
                <AnnouncementFieldHeader />
                {/* <CareerFieldBody/> */}
            </div>
        </div>
    )
}

export default AnnouncementField