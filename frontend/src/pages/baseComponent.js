import React from 'react';
import Navbar from "./home_components/navbar"
import logo from '../imgres/logofinale.png'


const BaseComponent = () => {
    return (
        <div style={{"backgroundColor" : "rgb(229, 231, 221)"}}>
            <Navbar logo={logo} userInfo={''} />
        </div>
    )
}


export default BaseComponent;