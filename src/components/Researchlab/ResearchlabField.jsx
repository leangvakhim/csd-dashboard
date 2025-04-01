import React from 'react'
import Aside from '../Aside'
import ResearchlabFieldHeader from './ResearchlabFieldHeader'
import ResearchlabFieldBody from './ResearchlabFieldBody'

const ResearchlabField = () => {
    return (
        <div id="main-wrapper" class=" flex">
            <Aside/>

            <div class=" w-full page-wrapper overflow-hidden">
                <ResearchlabFieldHeader/>
                <ResearchlabFieldBody />
            </div>
        </div>
    )
}

export default ResearchlabField