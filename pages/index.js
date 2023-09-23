import React from 'react'
import HomeComp from '../Components/Home/HomeComp.jsx'
const Home = (props) => {
  return (
    <div>
      <HomeComp handlePopup={props.handlePopup} sendDataToApp={props?.sendDataToApp} userRoute={props?.userRoute} />
    </div>
  )
}

export default Home
