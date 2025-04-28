import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import PageHeader from '../components/Page/PageHeader'
import PageDashboard from '../components/Page/PageDashboard'

const Page = () => {
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
                <PageHeader />
                <PageDashboard />
            </div>
        </div>
    )
}

export default Page