import React, {useEffect, useState} from 'react'
import { useLoading } from '../components/Context/LoadingContext'
import Aside from '../components/Aside'
import ImageBody from '../components/Image/ImageBody'

const Image = () => {

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

        <div class=" w-full page-wrapper overflow-hidden">
          <ImageBody/>
        </div>
    </div>
  )
}

export default Image