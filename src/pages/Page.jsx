import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import PageHeader from '../components/Page/PageHeader'
import PageDashboard from '../components/Page/PageDashboard'

const Page = () => {

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