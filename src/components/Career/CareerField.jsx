import React from 'react'
import Aside from '../Aside'
import CareerFieldHeader from './CareerFieldHeader'
import CareerFieldBody from './CareerFieldBody'


const CareerField = () => {
    return (
        <div id="main-wrapper" class=" flex">
            <Aside/>

            <div class=" w-full page-wrapper overflow-hidden">
               <CareerFieldHeader/>
                {/* <CareerFieldBody/> */}
                <CareerFieldBody />

            </div>
        </div>
    )
}

export default CareerField