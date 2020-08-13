import React,{useEffect,} from 'react';
import {getAuthInfo,getAuth} from './cookies';
import { useHistory } from "react-router"
import Navbar from "./home_components/navbar";
import logo from "../imgres/logofinale.png"
import Sign_in from "./signin";

const GetStarted = () => {

    let history = useHistory()


    useEffect(() => {
        getAuthInfo(getAuth()).then(response => {
            if (!response.error) {
                console.log("Authenticated")
                history.push("/folders")

            }
            else {
                console.log("Not Authenticated")
            }
        }).catch(error => console.log("Not Authenticated"))
    },[])


    return (
        <div>
        <div className="home-container">

            <Navbar logo={logo} userInfo={''} />
        <div class="text-center">
            <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                <header class="masthead mb-auto">
                    <div class="inner">
                    </div>
                </header>

                <main style={{ "color": "#333" }} role="main" class="inner cover">
                    <h1 style={{ "marginTop": "50%" }} class="cover-heading">Get Started</h1>
                    <p class="lead">To get started just register an account ,login if you have one,or use external platforms such as <b>Google</b> and <b>Github</b></p>
                    <btn class="btn btn-primary poutsapeos" data-toggle="modal" data-target="#SignInModal">Choose an authentication method</btn>
                </main>
            </div>
        </div>
        </div>
        <Sign_in />

        </div>
    )
}


export default GetStarted;