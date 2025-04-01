import React from 'react'
import Aside from '../Aside'
import ScholarshipFieldHeader from './ScholarshipFieldHeader'
import ScholarshipFieldBody from './ScholarshipFieldBody'

const ScholarshipField = () => {
    return (
        <div id="main-wrapper" class=" flex">
            <Aside/>

            <div class=" w-full page-wrapper overflow-hidden">
                <ScholarshipFieldHeader/>
                <ScholarshipFieldBody />
            </div>
        </div>
    )
}

export default ScholarshipField