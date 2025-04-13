import React from 'react'
import Aside from '../components/Aside'
import SettingHeader from '../components/Setting/SettingHeader'
import SettingField from '../components/Setting/SettingField'

const Setting = () => {
    return (
        <div id="main-wrapper" className=" flex">
            <Aside/>

            <div className=" w-full page-wrapper overflow-hidden">
                <SettingHeader/>
                <SettingField />
            </div>
        </div>
    )
}

export default Setting