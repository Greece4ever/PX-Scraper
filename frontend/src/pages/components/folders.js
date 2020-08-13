// import {setValidUrls,urlFormater} from "./functions";
import React,{useState, useEffect} from 'react';
import Url from "./folderComponents/urls";
import Input from "./folderComponents/input";
import './checkmark.css';
import jquery from 'jquery';
import UrlDetail from '../detail_url';

//GETS URL NUMBER
const getUrlNum = (search,token,fold_id) => {
  return jquery.ajax({
    url : "http://localhost:8000/apiconfig/urls/create/",
    type : "GET",
    headers : {
      Authorization : `Token ${token}`
    },
    data : {
      id : fold_id,
      view_pages : true,
      search : search
    },
    success : (data) => {return data}
  })

}

//GETS URL DATA
const fetchUrls = (index,auth_token,search=null,fold_id) => {
  return jquery.ajax({
    url : "http://localhost:8000/apiconfig/urls/create/",
    type: "GET",
    headers : {
      Authorization : `Token ${auth_token}`
    },
    data : {
      id : fold_id,
      index : index,
      search : search
    },
    success: (data) => {return data}
  }).catch(e => {return e.message})
}

const Folder = (props) => {


    //For Toggling on and off the folder
    const [toggle,setToggle] = useState(props.debug ? '#collapse1' : '')
    const [togId,setTodId] = useState('collapse1')

    const [height,setHeight] = useState("auto")

    const [typing,setTyping] = useState('')

    //Loading Screeen
    let loader = <div style={{"width" : "100px",height : "100px"}} ><i style={{"fontSize" : "40px",animation: "spinning 1s infinite",color : "#0062aa"}} className="fa fa-square" aria-hidden="true"></i></div> 
    let loading_2 = <div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>  
    const [isOpen,setIsOpen] = useState(false);
    const [searchTerm,setSearchTerm] = useState("");

    //After fetching the URLS add the JSX Componets to the DOM
    const [url_list, setUrl_list] = useState([])
    
    const [awaitResponse,setAwaitResponse] = useState(false);
    
    const [numPage,setNumPage] = useState(1);
    const [currentPage,setCurrentPage] = useState(1);
    const [searchIndex,setSearchIndex] = useState(0);
    //INDEX ID TO SEND REQUEST 

    //Visual NEW url
    const appendURL = (obj) => {
      console.log(obj)
      setUrl_list(prev => [...prev,obj])
      let scroll_div = document.getElementsByClassName('url-list')[0];
      scroll_div.scrollTop = scroll_div.scrollHeight;
    }



  useEffect(() => {
    getUrlNum('',props.Token,props.id).then(response => {
      setNumPage(Math.ceil(response[0] / 20))
      setSearchIndex(20)
    })
  },[])

  //Make load bar fade out
  useEffect(() => {
    jquery(`#${props.id}loadbar`).fadeOut('fast')
  },[])


//Inistial URL fetching
  useEffect(() => {
    if (!isOpen) {
      return () => console.log('goodbye world!')
    }
    if (props.isDemo) {
      return () => console.log("This is just a test")
    }
    const timeout = setTimeout(() => {
      fetchUrls(0,props.Token,'',props.id).then(data => {
        console.log(data)
        setUrl_list(data);
        setCurrentPage(1);
        setSearchTerm('');
        jquery(`#loading${props.id}`).fadeOut('fast')
        setHeight("300px")
        let scroll_div = document.getElementsByClassName('url-list')[0];
        scroll_div.scrollTop = scroll_div.scrollHeight;
      })
    },1500)
    return () => clearTimeout(timeout)

  },[isOpen])

  //Open the modal
  useEffect(() => {
    if (props.debug) {
      jquery(`#but_${props.id}`).click();
    }
  },[])


  const handleScroll = () => 
  {
    let url_list = document.getElementsByClassName('url-list')[0];
    if (url_list.scrollTop < 40 && !awaitResponse && currentPage != numPage) {
      if (currentPage > numPage) {
        return null;
      }
      jquery(`#${props.id}loadbar`).fadeIn('fast')
      setAwaitResponse(true);
      setTimeout(() => {
        fetchUrls(searchIndex,props.Token,searchTerm,props.id).then(response => {
          let old_height = url_list.scrollHeight;        
          console.log(response)
          setSearchIndex(searchIndex+20)
          setCurrentPage(prev => prev +1)
          response.forEach(item => {
            setUrl_list(prev => [item,...prev]);
          })
          let new_height = url_list.scrollHeight;
          url_list.scrollTop = new_height - old_height
          setAwaitResponse(false)
          jquery(`#${props.id}loadbar`).fadeOut('fast')

        })
      },3000)
    } 
  }

  // console.log(`This is the new height : ${new_height-old_height}`)

  const newWindowOpen = () => {
    window.open(`/folders/id=${props.id}&name=${props.name}`, '_blank','width=685,height=1000,resizable=no,status=no');
  }

  const newWindowToggle = () => {
    let targLink    = document.getElementById (`but_${props.id}`);
    let clickEvent  = document.createEvent('MouseEvents');
    clickEvent.initEvent ('dblclick', true, true);
    targLink.dispatchEvent(clickEvent);
  }

  const EventHandler = () => {
    {newWindowToggle();setIsOpen(true)}
  }

  //Managing the collapse
  useEffect(() => {
    if (localStorage.getItem('newin') != 'true') {
      console.log("NOT TRUE")
      setToggle(`#collapse${props.index}`)
      setTodId(`collapse${props.index}`)
    }
  },[])


  useEffect(() => {
    if (!isOpen) {
      return () => console.log("NOT OPENED")
    }
    console.log(`${typing} TYPING HAS CHANGED`)
    setAwaitResponse(true);
    jquery(`#loading${props.id}`).fadeIn('fast')
    setUrl_list([])
    const timeout = setTimeout(() => {
      fetchUrls(0,props.Token,typing,props.id).then(response => {
        setUrl_list(response.reverse())
        setSearchTerm(typing);
        setCurrentPage(1)
        jquery(`#loading${props.id}`).fadeOut('fast')   
        let scroll_div = document.getElementsByClassName('url-list')[0];
        scroll_div.scrollTop = scroll_div.scrollHeight;
      })
    },500)
    return () => clearTimeout(timeout);
  },[typing])

  
  useEffect(() => {
    setAwaitResponse(true);
    getUrlNum(typing,props.Token,props.id).then(response => {
      setNumPage(Math.ceil(response[0] / 20))
      setSearchIndex(20)
      setAwaitResponse(false);
    })
  },[typing])

  return (
    <div  className="main">
      <div  className="accordion" id="accordionExample">
        <div style={{backgroundColor : props.black ?  "#44494D" : '',borderRadius : "0"}}  className="card">
          <div style={{"cursor": "pointer",outline: 'none',minWidth : "500px"}} className="card-header" id="headingOne">
            <h2  style={{"cursor": "pointer",outline: 'none'}}  className="mb-0">
              <div >
              <button id={`but_${props.id}`} onDoubleClick={() => localStorage.getItem('newin') == 'true' ?  newWindowOpen() : null}  onClick={() => localStorage.getItem('newin') == 'true' ? EventHandler() : setIsOpen(true)}  style={{'textDecoration': 'none','outline': 'none'}} className="btn btn-link btn-block" type="button" data-toggle="collapse" data-target={toggle} aria-expanded="true" aria-controls="collapseOne">
              <div  className="row">
                <div   style={{marginLeft:0,fontFamily : "MuseoModerno",textAlign : "start",fontSize : "20px",minWidth : "300px"}} className="col">
                  <i style={{color: 'orange'}} className="fa fa-folder" aria-hidden="true"></i>
                  <label data-toggle="tooltip" data-placement="left" data-html="true" title={`<p style="font-family: arial;" class="lead">${props.description}</p>`} style={{marginLeft : "10px",cursor : "pointer",color : props.black ? "#6eb4ff" : ""}}>{props.name}</label>
                </div>
                  <div style={{textAlign : "end",minWidth : "150px"}} className="col">
                </div>
                </div>
              </button>
              </div>
            </h2>
          </div>
          </div>
          </div>
          <div  id={togId} className="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
      <div style={{backgroundColor : props.black ? '#282828' : "#edefee"}} className="card-body">
        <div style={{"textAlign" : "center"}} className="inline" >
          <div>
            <div style={{"float" : "left",width : "50%",maxWidth : "400px",marginLeft : "30px",}} className="input-group mb-3">
                  <input style={{backgroundColor: props.black ?'#343a40' : '',border : props.black ? '1px solid #565454' : '' ,borderRadius : '0px !important'}} onChange={(event) => setTyping(event.target.value)} type="text" class="form-control" placeholder="Search in this folder" aria-label="Here you can search folders or urls" aria-describedby="basic-addon2"></input>
                  <div  id="search" className="input-group-append">
                      <span style={{cursor : "pointer",backgroundColor : "#0062cc",border : props.black ? '1px solid #565454' : '' ,borderRadius : 0}} className="input-group-text" id="basic-addon2">
                      <i style={{color: '#fff'}} class="fa fa-search" aria-hidden="true"></i> </span>
                  </div>
              </div>
              <div style={{"float" : "right",marginRight : "30px",marginTop : "2px"}}>
                <nav style={{"marginBottom" : "30px"}} aria-label="...">
                      <ul id={`${props.id}loadbar`} style={{letterSpacing : "0 !important",}} className="pagination pagination-sm">
                          {loading_2}
                      </ul>                                                                       
                  </nav>
                  
              </div>
          </div>
        </div>
        <br></br>
        <br></br>
        <hr></hr>
        <div onScroll={() => handleScroll()} className="url-list" style={{"overflow": "auto",height : !props.debug ? height : "700px",width: !props.debug ? "auto" : "630px",resize : props.debug ? "none" : "vertical"}}>
          {!props.debug ? url_list.map(object => (
            <Url black={props.black} Token={props.Token}  id_index={`fold_${object.id}`} fold_id={object.fold_id} id={object.id} url={object.url} title={object.title} description={object.description ? object.description : ''} image={object.image ? object.image : ''} favicon={object.favicon} domain={object.domain} duration={object.duration ? <div style={{position: "relative"}}><kbd className="bottom-left">{object.duration ? object.duration : ""}</kbd></div> : ""} /> 
          )) : url_list.map(object => (
            <UrlDetail black={props.black} Token={props.Token} tags={object.tags ? object.tags : []} id_index={`fold_${object.id}`} fold_id={object.fold_id} id={object.id} url={object.url} title={object.title} description={object.description ? object.description : ''} image={object.image ? object.image : ''} favicon={object.favicon} domain={object.domain} duration={object.duration ? <div style={{position: "relative"}}><kbd className="bottom-left">{object.duration ? object.duration : ""}</kbd></div> : ""} /> 
          ))}
        </div>
        <div id={`loading${props.id}`} style={{"position" : props.debug ? "fixed" : "relative",left: props.debug ? "50%" : "70%" ,transform: "translateX(-20%)",top : props.debug ? "50%" : "70%"}}>
            {loader}
        </div>

        <hr>
        </hr>
        <Input black={props.black} Token={props.Token} id={props.id} appendURL={appendURL} />
      </div>
    </div>
    </div>
  )
};

export default Folder;
