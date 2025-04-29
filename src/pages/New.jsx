import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import NewHeader from '../components/New/NewHeader'
import NewDashboard from '../components/New/NewDashboard'

const New = () => {

    return (
        <div id="main-wrapper" className=" flex">
            <Aside/>

            <div className=" w-full page-wrapper overflow-hidden">
                <NewHeader/>
                <NewDashboard/>
            </div>
        </div>
    )
}

export default New