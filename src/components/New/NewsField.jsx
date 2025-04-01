import React from 'react'
import Aside from '../Aside'
import NewsFieldHeader from './NewsFieldHeader'
import NewsFieldBody from './NewsFieldBody'

const NewsField = () => {
    return (
        <div id="main-wrapper" class=" flex">
            <Aside/>

            <div class=" w-full page-wrapper overflow-hidden">
                <NewsFieldHeader/>
                <NewsFieldBody />
            </div>
        </div>
    )
}

export default NewsField