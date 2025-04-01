import React from 'react'
import Aside from '../Aside'
import PartnershipFieldHeader from './PartnershipFieldHeader'
import PartnershipFieldBody from './PartnershipFieldBody'


const NewsField = () => {
    return (
        <div id="main-wrapper" class=" flex">
            <Aside/>

            <div class=" w-full page-wrapper overflow-hidden">
               <PartnershipFieldHeader />
               <PartnershipFieldBody />
            </div>
        </div>
    )
}

export default NewsField