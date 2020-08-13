import React from 'react';

const UserProfile = (props) => {
    return (
        <span>
            <b style="font-family: 'MuseoModerno';font-size: 20px;margin-right: 10px;">{props.username}</b>
            <img width="40px" height="40px" style={{borderRadius: "50px"}} src={props.img}></img>
        </span>
        
    )
}


const Navbar = (props) => {


    return (
        <nav style={{background: "transparent"}} className="navbar navbar-expand-lg navbar-light">
            <a className="navbar-brand" href="#"><img width="120px" height="64px" src={props.logo}></img></a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                <a style={{color: "#fff",fontFamily: 'MuseoModerno',fontSize: "19px"}} className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                <a style={{color: "#fff",fontFamily: 'MuseoModerno',fontSize: "19px",opacity : "70%"}} className={props.isAuthenticated ? "nav-link" : "nav-link disabled"} href={props.isAuthenticated ? "/folders" : "#"}>Folders</a>
                </li>
                <li className="nav-item">
                <a style={{color: "#fff",fontFamily: 'MuseoModerno',fontSize: "19px"}} className="nav-link" href="/getstarted">Get Started</a>
                </li>
            </ul>
            <span className="navbar-text">
                {props.userInfo.username}
            </span>
            </div>
        </nav>
    )
}

export default Navbar;