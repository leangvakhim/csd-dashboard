import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import CareerHeader from '../components/Career/CareerHeader'
import CareerDashboard from '../components/Career/CareerDashboard'

const Career = () => {

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
                <CareerHeader/>
                <CareerDashboard/>
            </div>
        </div>
    )
}

export default Career