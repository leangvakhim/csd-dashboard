import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import ResearchHeader from '../components/Research/ResearchHeader'
import ResearchDashboard from '../components/Research/ResearchDashboard'

const Research = () => {

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
                <ResearchHeader/>
                <ResearchDashboard/>
            </div>
        </div>
    )
}

export default Research