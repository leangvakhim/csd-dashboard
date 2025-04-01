import React from 'react'
import Aside from '../Aside'
import FeedbackFieldHeader from './FeedbackFieldHeader'
import FeedbackFieldBody from './FeedbackFieldBody'

const FeedBackField = () => {
    return (
        <div id="main-wrapper" class=" flex">
            <Aside/>

            <div class=" w-full page-wrapper overflow-hidden">
                <FeedbackFieldHeader/>
                <FeedbackFieldBody />
            </div>
        </div>
    )
}

export default FeedBackField