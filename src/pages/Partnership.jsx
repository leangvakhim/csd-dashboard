import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import PartnershipHeader from '../components/Partnership/PartnershipHeader'
import PartnershipDashboard from '../components/Partnership/PartnershipDashboard'

const Partnership = () => {

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
                <PartnershipHeader/>
                <PartnershipDashboard/>
            </div>
        </div>
    )
}

export default Partnership