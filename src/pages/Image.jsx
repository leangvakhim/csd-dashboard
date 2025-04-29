import React, {useEffect} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import ImageBody from '../components/Image/ImageBody'

const Image = () => {

  return (
    <div id="main-wrapper" class=" flex">
        <Aside/>

        <div class=" w-full page-wrapper overflow-hidden">
          <ImageBody/>
        </div>
    </div>
  )
}

export default Image