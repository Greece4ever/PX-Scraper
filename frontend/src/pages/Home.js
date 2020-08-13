import React, { useEffect, useState } from 'react';
import logo from '../imgres/logofinale.png';
import '../home.css';
import Navbar from "./home_components/navbar";
import "./home_components/cover.css"
import { getAuth, getAuthInfo } from "./cookies";
import FolderDemo from "./folder_demo";
import { useHistory } from 'react-router-dom';

const Home = () => {

    const [userInfo, setUserInfo] = useState([])
    const [position, setPosition] = useState(window.pageYOffset)
    const [stop, setStop] = useState(true);
    const [dark,setDark] = useState(false);
    const history = useHistory();

    const [taji,setTaji] = useState("row")

    const handleScroll = () => {
        const position = window.pageYOffset;
        setPosition(position);
    };


    useEffect(() => {
        if (stop) {
            window.addEventListener('scroll', handleScroll, { passive: true })
            return () => window.removeEventListener('scroll', setPosition(window.pageYOffset))
        }
        else {
            return () => console.log('helo')
        }
    }, [])


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

    useEffect(() => {
        window.addEventListener('resize', () => {
            let result = window.matchMedia('(max-width: 778px)').matches;
            if (result) {
                setTaji("col text-center")

            }
            else {
                setTaji("d-flex justify-content-around text-center")

            }
        })
        return () => window.removeEventListener('resize',console.log('hello'))
    },[])

    useEffect(() => {
        let result = window.matchMedia('(max-width: 778px)').matches;
        if (result) {
            setTaji("col text-center")

        }
        else {
            setTaji("d-flex justify-content-around text-center")

        }

    },[])




    return (
        <div style={{"padding" : 0,"margin" : 0}}>
            <div>
                <div className="home-container">
                    <Navbar logo={logo} userInfo={userInfo} />
                    <div class="text-center">
                        <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                            <header class="masthead mb-auto">
                                <div class="inner">
                                </div>
                            </header>

                            <main style={{ "color": "#333" }} role="main" class="inner cover">
                                <h1 style={{ "marginTop": "50%" }} class="cover-heading">Save your URLS</h1>
                                <p class="lead">Easily store your favorite URI's in and access them with a nice GUI-visual representation</p>
                                <p class="lead">
                                    <a style={{ "color": "#fff" }} onClick={() => document.getElementById("preview_fold").scrollIntoView({ behavior: 'smooth' })} class="btn btn-lg btn-dark">Try a demo</a>
                                </p>
                            </main>
                            <footer class="mastfoot mt-auto">
                                <div class="inner">
                                    <br></br>
                    
                </div>
                            </footer>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className="d-flex justify-content-around">
                    <div style={{ "marginRight": "50px", marginLeft: "20px",borderRadius : "0" }} className="card">
                        <div class="card-header">
                            Easy
                </div>
                        <div class="card-body">
                            <h5 class="card-title">Easy to use</h5>
                            <p class="card-text">Accessible via the browser,as easy as pasting a link</p>
                        </div>
                    </div>

                    <div style={{ "marginRight": "20px" }} class="card">
                        <div class="card-header">
                        Free
                </div>
                        <div class="card-body">
                            <h5 class="card-title">
                                Free to use
                            </h5>
                            <p class="card-text">Entirely free and <a style={{"color" : "#333"}} href="#">open source</a> with no limitations</p>
                        </div>
                    </div>
                </div>
                <div style={{ "marginTop": "50px",marginLeft : "10px"}} className="d-flex justify-content-around">
                    <div style={{ "marginRight": "50px", marginLeft: "0px" }} class="card">
                        <div class="card-header">
                            Very Detailed
                </div>
                        <div class="card-body">
                            <h5 class="card-title">Offers a lot of details</h5>
                            <p class="card-text">Gives a nice GUI representation of the target domain.</p>
                        </div>
                    </div>

                    <div style={{ "marginRight": "10px" }} class="card">
                        <div class="card-header">
                            Categories
                </div>
                        <div class="card-body">
                            <h5 class="card-title">Choose Categories</h5>
                            <p class="card-text">Create the folders in which you can add your URLS</p>
                        </div>
                    </div>
                </div>
                
                <div className={taji} style={{ "marginTop": "150px" }}>
                    <div style={{marginLeft : taji == 'col text-center' ? "" : "50px"}} className="col">
                        <p class="lead"><b style={{ "fontWeight": "2000", fontFamily: "sans-serif" }}>Save your URLS</b></p>
                        <button onClick={() => window.location.href = "getstarted/" } style={{ "backgroundColor": "#346f82", border: "5px solid #346f82", color: "#fff", fontSize: "20px" }}>Get Started Now</button>
                    </div>
                    <div className="col">
                        <p class="lead"><b style={{ "fontWeight": "2000", fontFamily: "sans-serif" }}>Authenticate</b></p>
                        <button onClick={() => window.location.href = "getstarted/" } style={{ "backgroundColor": "#346f82", border: "5px solid #346f82", color: "#fff", fontSize: "20px" }}>Continue</button>
                    </div>
                    <div className="col">
                        <p class="lead"><b style={{ "fontWeight": "2000", fontFamily: "sans-serif" }}>Create folders to put your URLS</b></p>
                        <button onClick={() => window.location.href = "getstarted/" } style={{ "backgroundColor": "#346f82", border: "5px solid #346f82", color: "#fff", fontSize: "20px" }}>Register now</button>
                    </div>


                </div>
                <div style={{ marginTop: "50px" }} className="text-center">
                    <button style={{ "marginLeft": "5px", marginRight: "5px",marginTop : '10px' }} type="button" class="btn btn-light">
                        Title
            </button>
                    <button style={{ "marginLeft": "5px", marginRight: "5px",marginTop : '10px' }} type="button" class="btn btn-light">
                        Description
            </button>
                    <button style={{ "marginLeft": "5px", marginRight: "5px",marginTop : '10px' }} type="button" class="btn btn-light">
                        Image preview
            </button>
                    <button style={{ "marginLeft": "5px", marginRight: "5px",marginTop : '10px' }} type="button" class="btn btn-light">
                        Domain name
            </button>
                    <button style={{ "marginLeft": "5px", marginRight: "5px",marginTop : '10px' }} type="button" class="btn btn-light">
                        Keywords
            </button>
                </div>
                <div id="preview_fold" style={{ "marginTop": "150px",marginLeft : dark ? 0 : "5%",marginRight : dark ? 0 : "5%",}} >
                    <FolderDemo dark={dark} setDark={setDark} stop={stop} setStop={setStop} position={position} />
                </div>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <footer style={{"backgroundColor" : "#333",marginTop: "150px",height : "50px",textAlign : "center",color : "#fff"}}>
                <p style={{"marginTop" : "50px",padding : 0,margin : 0}} className="lead"><a className="text-muted">
                    <div style={{"position" : "relative",marginRight : "50px"}} className="d-flex justify-content-around">
                        <div onClick={() => window.open("https://github.com/Greece4ever")} style={{"cursor" : "pointer",position : "relative",}}>
                            <i style={{"fontSize" : "40px",marginTop : "5px",}} class="fa fa-github" aria-hidden="true"></i>
                           <span style={{"marginLeft" : "20px",position : "absolute",bottom : "5px"}}>Github</span>
                        </div>
                        <div style={{"cursor" : "pointer",position : "relative",marginRight : "50px"}}>
                            <i style={{"fontSize" : "40px",marginTop : "5px",}} class="fa fa-code-fork" aria-hidden="true"></i>
                            <span style={{"marginLeft" : "20px",position : "absolute",bottom : "5px"}}>Source</span>
                        </div>

                    </div>
                    </a>
                    
                    </p>
                    
            </footer>

        </div>

    )
}


export default Home;