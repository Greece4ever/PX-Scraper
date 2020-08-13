import React,{useState, useEffect} from 'react';
import Action from "./searchBarComps/actions"
import "./searchBarComps/animation.css"
import jquery from 'jquery';


const OpenNewWindow = () => {
    const x = localStorage.getItem('newin')
    if (x == null) return x;
    if (x.trim().toLowerCase() == 'true') {
        return true;
    }
    return false;
}


const Searchbar = (props) => {
    const [visualOrder,setVisualOrder] = useState(<b>Actions</b>);
    const [showResults,setShowResults] = useState(["","32px"])

    const [typing,setTyping] = useState("");

    const [searchPlaceholder,setSearchPlaceholder] = useState("Search Folders...")

    const [startSearch,setStartSearch] = useState('initial');

    const [result,setResult] = useState('dropdown-item');
    const [blackVisual,setBlackVisual] = useState('dropdown-item')

    const [exp,setExp] = useState(false)


    const setSearch = (data) => {
        setStartSearch(data)
    }

    let loader = <div style={{"width" : "100px",height : "100px"}} ><i style={{"fontSize" : "40px",animation: "spinning 1s infinite",color : "#0062aa"}} className="fa fa-square" aria-hidden="true"></i></div> 



    useEffect(() => {
        jquery('#loader').fadeOut("fast")
    },[ ])

    useEffect(() => {
        let res = OpenNewWindow();
        if (res == null) {
            localStorage.setItem('newin','true')
            setResult("dropdown-item active")
            return () => console.log("hello")
        }
        else {
            switch(res) {
                case true:
                    setResult("dropdown-item active")
                    return () => console.log(true)
                   break;
                case false:
                    setResult("dropdown-item")
                    return () => console.log(false)
                    break;
            }
        }
    },[])


    useEffect(() => {
        props.setNotFound(false)
        jquery('#loader').fadeIn('fast')
        props.setFolders([]);
        console.log(typing)
        const timeout = setTimeout(() => {
            props.setPaginationState(typing);
            jquery('#loader').fadeOut('fast')
        },500);
        return () => clearTimeout(timeout);
    },[typing])


    const handleFolderChange = () => {
        let localItem = localStorage.getItem("newin")
        if (localItem.trim().toLowerCase() == 'true') {
            localStorage.setItem('newin','false')
            setResult("dropdown-item")
            return null;
        }
        else if (localItem.trim().toLowerCase() == 'false') {
            localStorage.setItem('newin','true')
            setResult("dropdown-item active")
            return null;
        }
    }



    return (
        <div  >
        <div style={{position : "relative",}} className={props.black ? "shadow p-3 bg-dark rounded" : "shadow p-3 bg-white rounded"}>
            <div  style={{width : "50%",maxWidth : "400px",}} className="input-group mb-3">
                <input style={{backgroundColor: props.black ?'#343a40' : '',border : props.black ? '1px solid #565454' : '' ,borderRadius : 0}} onChange={(event) => setTyping(event.target.value)} type="text" className="form-control" placeholder={searchPlaceholder} aria-label="Here you can search folders or urls" aria-describedby="basic-addon2"></input>
                <div  id="search" className="input-group-append">
                    <span style={{cursor : "pointer",backgroundColor : "#0062cc",border : props.black ? '1px solid #565454' : '' ,borderRadius : 0}} className="input-group-text" id="basic-addon2">
                    <i style={{"color" : "#fff"}}  className="fa fa-search" aria-hidden="true"></i> </span>
                </div>
            </div>
            {showResults[0]}
            <div style={{right : "20px",position : "absolute",bottom : showResults[1]}} className="dropdown show">
                <a className="btn btn-primary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {visualOrder} 
                </a>
                <div style={{marginRight : "100px"}}  className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <a data-toggle="modal" data-target="#newFolder"  className="dropdown-item" href="#"><b style={{"fontWeight": "300"}}>Create New</b> <i style={{"marginLeft" : "10px"}} className="fa fa-plus" aria-hidden="true"></i></a>
                    <a onClick={() => setSearch(Math.random().toString())} data-toggle="modal" data-target="#folder_delete"  className="dropdown-item" href="#"><b style={{"fontWeight": "300"}}>Delete Folder</b> <i style={{"marginLeft" : "10px"}} className="fa fa-trash" aria-hidden="true"></i></a>
                    <a data-placement="left" data-toggle="tooltip" data-html="true" title="<p class='lead'>if enabled ,when a folder is clicked, it is opened individually in a new window, offering slightly better performance <p class='text-warning'>(REFRESH REQUIRED)</p><p class='text-danger'>(OPERA 68 : BUG THAT CAUSES POPUP TO BE OPENED UP MORE THAN ONCE)</p></p>" onClick={() => {handleFolderChange();setTimeout(function(){window.location.reload();});}}   className={result} href="#"><b style={{"fontWeight": "300"}}>Open in new window</b> <i style={{"marginLeft" : "10px"}} className="fa fa-window-restore" aria-hidden="true"></i></a>
                    <a onClick={() => {
                        if (localStorage.getItem('dark') == 'true') 
                        {
                            props.setBlack(false);
                            localStorage.setItem('dark',false)                              

                        }
                        else if (localStorage.getItem('dark') == 'false') 
                        {
                            props.setBlack(true);
                            localStorage.setItem('dark',true)
                        }
                        
                    }} data-toggle="modal"  className={props.black ? "dropdown-item active" : 'dropdown-item'} href="#"><b style={{"fontWeight": "300"}}>Toggle Dark Mode</b> <i style={{"marginLeft" : "10px"}} className="fa fa-moon-o" aria-hidden="true"></i></a>

                </div>
            </div>
            <Action exp={exp} setPaginationState={props.setPaginationState} setTyping={setTyping} startSearch={startSearch} setFolders={props.setFolders} Token={props.Token} />
        </div>
        <div id="loader" style={{"position" : "fixed",left: "50%",transform: "translateX(-20%)",top : "40%"}}>
            {loader}
        </div>
        </div>


    )
}



export default Searchbar;