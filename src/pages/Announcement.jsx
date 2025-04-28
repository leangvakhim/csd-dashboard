import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import AnnouncementHeader from '../components/Announcement/AnnouncementHeader'
import AnnouncementDashboard from '../components/Announcement/AnnouncementDashboard'

const Announcement = () => {
    const { loading, setLoading } = useLoading();

    useEffect(() => {
        if (loading) {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);
        return () => clearTimeout(timer);
        }
    }, [loading]);

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