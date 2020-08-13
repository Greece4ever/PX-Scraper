import React, { useState,useEffect } from 'react';
import Url from "./components/folderComponents/urls"
import Input from "./components/folderComponents/input"

const FolderDemo = (props) => {

    const [url_list,setUrlList] = useState([])
    let toggle = 1;
    let loader = <div style={{"width" : "100px",height : "100px"}} ><i style={{"fontSize" : "40px",animation: "spinning 1s infinite",color : "#0062aa"}} className="fa fa-square" aria-hidden="true"></i></div> 
    const [loading,setLoading] = useState(true)
    const [height,setHeight] = useState("auto")

    const [black,setBlack] = useState(eval(localStorage.getItem('black')));
    const [dark,setDark] = useState(true)


    const night = <a onClick={() => {
        if (localStorage.getItem('dark') == 'true') 
        {
            setBlack(false);
            localStorage.setItem('dark',false)                              

        }
        else if (localStorage.getItem('dark') == 'false') 
        {
            setBlack(true);
            localStorage.setItem('dark',true)
        }
        
    }} data-toggle="modal"  className={black ? "dropdown-item active" : 'dropdown-item'} href="#"><b style={{"fontWeight": "300",width : "auto"}}>Night </b> <i style={{"marginLeft" : "10px"}} className="fa fa-moon-o" aria-hidden="true"></i></a>




    const ricky = {
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "title": "Rick Astley - Never Gonna Give You Up (Video)",
        "description": "Rick Astley's official music video for “Never Gonna Give You Up” Listen to Rick Astley: https://RickAstley.lnk.to/_listenYD Subscribe to the official Rick As...",
        "site_name": "YouTube",
        "image": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        "keywords": [
          "the boys soundtrack",
          " the boys amazon prime",
          " Never gonna give you up the boys",
          " RickAstleyvevo",
          " vevo",
          " official",
          " Rick Roll",
          " video",
          " music video",
          " Rick Astley albu..."
        ],
        "domain": "WWW.YOUTUBE.COM",
        "id_index" : "1"
      }    


    const egg = {
        "url": "https://www.instagram.com/p/BsOGulcndj-/",
        "title": "Eugene | #EggGang on Instagram: “Let’s set a world record together and get the most liked post on Instagram. Beating the current world record held by Kylie Jenner (18…”",
        "description": "@world_record_egg posted on their Instagram profile: “Let’s set a world record together and get the most liked post on Instagram. Beating the current…”",
        "site_name": "Instagram",
        "image": "https://instagram.fskg1-1.fna.fbcdn.net/v/t51.2885-15/e35/47692668_1958135090974774_6762833792332802352_n.jpg?_nc_ht=instagram.fskg1-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=dBwe9f8p_KgAX_FDamG&oh=bc9fb7813936cf540d891c266b91833b&oe=5F54554C",
        "domain": "WWW.INSTAGRAM.COM",
        "id_index" : "2"

      }


    useEffect(() => {
        let ricky = localStorage.getItem('ricky');
        let egg = localStorage.getItem('egg');
        if (ricky == null) {
            localStorage.setItem('ricky',true)
        }
        if (egg == null) {
            localStorage.setItem('egg',false)
        } 
    })


    useEffect(() => {
        if (props.position < 1044) {
        }
        else {
            if (props.stop) {
                props.setStop(false)
                setTimeout(() => {
                    setLoading(false)
                    //Checking if ricky is false (other option is null) and false != null
                    if (localStorage.getItem('ricky') != "false") {
                        setUrlList(prev => [...prev,ricky])
                    }
                    if (localStorage.getItem('egg') != "false") {
                        setUrlList(prev => [...prev,egg])
                    }
                    setHeight("500px")    
                },750)
    
            }
        }

    },[props.position])

    function dontCrash() {
        return null;
    }

    useEffect(() => {
        window.addEventListener('resize', () => {
            let result = window.matchMedia('(max-width: 450px)').matches;
            if (result) {
                props.setDark(true)

            }
            else {
                props.setDark(false)

            }
        })
        return () => window.removeEventListener('resize',dontCrash())
    },[])

    useEffect(() => {
        let match = window.matchMedia('(max-width: 450px)').matches;
        props.setDark(match ? true : false)
    },[])



    useEffect(() => {

        if (localStorage.getItem('dark') == null) {
          localStorage.setItem('dark',false);
          setBlack(false);
        }
        
        else if (localStorage.getItem('dark') == 'true') {
          setBlack(true)
        }
        else if (localStorage.getItem('dark') == 'false') {
          setBlack(false);
        }

      },[])
    

    return (
        <div style={{overflowX : "hidden",}}>
            
            <div className="main">
            <div  className="accordion" id="accordionExample">

                <div style={{backgroundColor : black ?  "#44494D" : '',borderRadius : "0"}}  className="card">
                <div style={{"cursor": "pointer",outline: 'none',minWidth : "500px"}} className="card-header" id="headingOne">
                    <h2 style={{"cursor": "pointer",outline: 'none'}}  className="mb-0">
                    <button className="btn btn-link btn-block" type="button" data-toggle="collapse" data-target="#example2" aria-expanded="true" aria-controls="collapseOne">
                    <div className="row">
                        <div  style={{marginLeft:0,fontFamily : "MuseoModerno",textAlign : "start",fontSize : "20px",minWidth : "300px"}} className="col">
                        <i style={{color: 'orange'}} className="fa fa-folder" aria-hidden="true"></i>
                        <label  style={{marginLeft : "10px",cursor : "pointer"}}>Sample Folder</label>
                        </div>
                        <div style={{textAlign : "end",minWidth : "150px"}} className="col">
                        <b style={{fontFamily: "'Kaushan Script', cursive"}} className="text-muted">{props.date}</b>
                        </div>
                        </div>
                    </button>
                    </h2>
                </div>
                </div>
                </div>
                <div id="example2"  className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
            <div style={{backgroundColor : black ? '#282828' : "#edefee"}} className="card-body">
                
                <div style={{"textAlign" : "center"}} className="inline" >
                <div>
                    <div style={{"float" : "left",width : "50%",maxWidth : "400px",marginLeft : "30px",}} className="input-group mb-3">
                        <input style={{backgroundColor: black ?'#343a40' : '',border : black ? '1px solid #565454' : '' ,borderRadius : '0px !important'}} type="text" class="form-control" placeholder="Search in this folder" aria-label="Here you can search folders or urls" aria-describedby="basic-addon2" readOnly></input>
                        <div  id="search" className="input-group-append">
                            <span style={{cursor : "pointer",backgroundColor : "#0062cc",border : black ? '1px solid #565454' : '' ,borderRadius : 0}} className="input-group-text" id="basic-addon2">
                            <i style={{color: '#fff'}} class="fa fa-search" aria-hidden="true"></i> </span>
                        </div>
                    </div>
                    <div style={{"float" : "right",marginRight : "30px",marginTop : "2px"}}>
                        {props.dark ? "":  <a onClick={() => {
        if (localStorage.getItem('dark') == 'true') 
        {
            setBlack(false);
            localStorage.setItem('dark',false)                              

        }
        else if (localStorage.getItem('dark') == 'false') 
        {
            setBlack(true);
            localStorage.setItem('dark',true)
        }
        
    }} data-toggle="modal"  className={black ? "dropdown-item active" : 'dropdown-item'} href="#"><b style={{"fontWeight": "300",width : "auto"}}>Night </b> <i style={{"marginLeft" : "10px"}} className="fa fa-moon-o" aria-hidden="true"></i></a>
}
                    </div>
                </div>
                </div>
                <br></br>
                <br></br>
                <hr></hr>
                <div  className="url-list" className="url-list" style={{"overflow": "auto",height : height,}}>
                {url_list.map(object => (
                    <Url black={black} id_index={object.id_index} Testing={true}  url={object.url} title={object.title} description={object.description ? object.description : ''} image={object.image ? object.image : ''} favicon={object.favicon} domain={object.domain} duration={object.duration ? <div style={{position: "relative"}}><kbd className="bottom-left">{object.duration ? object.duration : ""}</kbd></div> : ""} /> 
                ))}
                </div>
                <div id={`loading${props.id}`} style={{"position" : "relative",left:"70%",transform: "translateX(-20%)",top : "30px"}}>
                    {loading ? loader : ''}
                </div>

                <hr>
                </hr>
                <Input black={black} exampleDemo={true} setUrlList={setUrlList} />
                
            </div>
            </div>
            </div>

        </div>
    )
}


export default FolderDemo;