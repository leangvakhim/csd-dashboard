import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import AnnouncementHeader from '../components/Announcement/AnnouncementHeader'
import AnnouncementDashboard from '../components/Announcement/AnnouncementDashboard'

const Announcement = () => {

    return (
        <div id="main-wrapper" className=" flex">
            <Aside/>

            <div className=" w-full page-wrapper overflow-hidden">
                <AnnouncementHeader/>
                <AnnouncementDashboard/>
            </div>
        </div>
    )
}

export default Announcement