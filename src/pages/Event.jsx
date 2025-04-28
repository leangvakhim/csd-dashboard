import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import EventHeader from '../components/Event/EventHeader'
import EventDashboard from '../components/Event/EventDashboard'

const Event = () => {
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
                <EventHeader/>
                <EventDashboard />
            </div>
        </div>
    )
}

export default Event