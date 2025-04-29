import React, {useEffect} from 'react'
import Aside from '../components/Aside'
import MenuHeader from '../components/Menu/MenuHeader'
import MenuDashboard from '../components/Menu/MenuDashboard'
import { useLoading } from '../components/Context/LoadingContext'

const Menu = () => {
  const { loading, setLoading } = useLoading();

  return (
    <div id="main-wrapper" className=" flex">
        <Aside/>

        <div className=" w-full page-wrapper overflow-hidden">
            <MenuHeader/>
            <MenuDashboard/>
        </div>
    </div>
  )
}

export default Menu