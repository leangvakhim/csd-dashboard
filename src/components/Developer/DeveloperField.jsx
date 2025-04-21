import React from 'react'
import Aside from '../Aside'
import DeveloperFieldHeader from './DeveloperFieldHeader'
import DeveloperFieldBody from './DeveloperFieldBody'

const DeveloperField = () => {
  return (
    <div id="main-wrapper" class=" flex">
            <Aside />

            <div class=" w-full page-wrapper overflow-hidden">
                <DeveloperFieldHeader />
                <DeveloperFieldBody/>
            </div>
        </div>
  )
}

export default DeveloperField