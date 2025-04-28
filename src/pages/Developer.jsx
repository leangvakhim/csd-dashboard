import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import DeveloperHeader from '../components/Developer/DeveloperHeader'
import DeveloperDashboard from '../components/Developer/DeveloperDashboard'

const Developer = () => {

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