import React, {useEffect, useState} from 'react'
import Aside from '../components/Aside'
import MenuHeader from '../components/Menu/MenuHeader'
import MenuDashboard from '../components/Menu/MenuDashboard'
import { useLoading } from '../components/Context/LoadingContext'

const Menu = () => {
  const { loading, setLoading } = useLoading();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div id="main-wrapper" className=" flex">
        <Aside username={username}/>

        <div className=" w-full page-wrapper overflow-hidden">
            <MenuHeader/>
            <MenuDashboard/>
        </div>
    </div>
  )
}

export default Menu