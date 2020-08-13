import React, { useState, } from 'react';
import {matchURL, addUrl } from "../functions";
import jquery from "jquery";





const Input = (props) => {

    const [tooMany,setTooMany] = useState(false);



    const exampleDemoSend = (url) => {
        return jquery.ajax({
            url: 'http://localhost:8000/apiconfig/url_demo/',
            type: 'GET',
            data: {
                url: url
            },
            success: (data) => { return data }
        }).catch(e => { 
            if (e.status == 429) {
                setTooMany(true)
            }
         })
    
    }
    
    

    //React useState variables
    const [message, setMessage] = useState("")
    const [read, setRead] = useState(false)
    const [placeholder, setPlaceholder] = useState("Type Your URI's here")

    // 452C2F
    const msg_icons = {
        error : <b style={{color : props.black ? "#ff836b" : "red"}}><i className="fa fa-exclamation-circle" aria-hidden="true"></i></b>,
        warning : <b style={{color : "#e8bb17"}}><i className="fa fa-exclamation-circle" aria-hidden="true"></i></b>,
        success : <b style={{color : props.black ? "#6bff97" : "green"}}> <i className="fa fa-check-circle" aria-hidden="true"></i></b>,
        loading : <div style={{width : "17px",height : "17px"}} className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div>,
        info : <b style={{color : props.black ? "#6ac6f7" : "#096c96"}}><i className="fa fa-info-circle"></i></b>
    }
    
    const msg_next_icons = {
        error : <b style={{color : "red"}}><i className="fa fa-exclamation-triangle" aria-hidden="true"></i></b>,
        warning : <b style={{color : props.black ? "#fff" : "props.black"}}><i className="fa fa-exclamation-triangle" aria-hidden="true"></i></b>,
        success: <b style={{color : "green"}}><i className="fa fa-check-square" aria-hidden="true"></i></b>
    }


    const msg = {
        empty :  <div><p style={{"marginLeft" : "20px",backgroundColor : props.black ? "#452C2F" : '',border : props.black ? "1px solid #452C2F" : "",color : props.black ? "#FFB5B2" : ""}} className="alert alert-danger"><b>{msg_next_icons.error}   Url must not  be empty</b></p></div>,
        notmatch : <div><p style={{"marginLeft" : "20px",backgroundColor : props.black ? "#3a3001" : "",color : props.black ? "#fff" : '',border : props.black ? "1px solid #3a3001" : ''}} className="alert alert-warning">{msg_next_icons.warning}   <b>Input does not match the pattern of a valid URL</b></p></div>,
        success : <div><p style={{"marginLeft" : "20px",backgroundColor : props.black ? "#1E3123" : '',border : props.black ? "1px solid #1E3123" : "",color : props.black ? "#61e279" : ''}} className="alert alert-success">{msg_next_icons.success}    Successfully added URI to folder</p></div>,
        already : <div><p style={{"marginLeft" : "20px",backgroundColor : props.black ? "#452C2F" : '',border : props.black ? "1px solid #452C2F" : "",color : props.black ? "#FFB5B2" : ""}} className="alert alert-danger"><b>{msg_next_icons.error}   Url already exists in the current folder</b></p></div>
    }
    


    const [header, setHeader] = useState(msg_icons.info)
    const error_429 = <div><p style={{"marginLeft" : "20px",backgroundColor : props.black ? "#452C2F" : '',border : props.black ? "1px solid #452C2F" : "",color : props.black ? "#FFB5B2" : ""}} className="alert alert-danger"><b>{msg_next_icons.error} You've tested enough, Click <a href="/getstarted">Here</a> to continue</b></p></div>;






    //Handles Submit Success
    const handleSuccess = () => {
        setMessage(msg.success)
        setHeader(msg_icons.success)
        setRead(false)
        setPlaceholder("Type Your URI's here")

    }

    //Handles Submit Error
    const handleError = () => {
        setMessage(msg.already)
        setHeader(msg_icons.error)
        setRead(false)
        setPlaceholder(`Type your URI's here`)
    }

    const InternalError = (url) => {
        setMessage(<div><p style={{"marginLeft" : "20px",backgroundColor : props.black ? "#452C2F" : '',border : props.black ? "1px solid #452C2F" : "",color : props.black ? "#FFB5B2" : ""}} className="alert alert-danger"><b>{msg_next_icons.error} System could not fetch '{url}' either because it is unsafe or the target machine refused it</b></p></div>)
        setRead(false)
        setPlaceholder(`Type your URI's here`)
    }

    const handleMisMatch = (input) => {
        setMessage(<div><p style={{"marginLeft" : "20px",backgroundColor : props.black ? "#452C2F" : '',border : props.black ? "1px solid #452C2F" : "",color : props.black ? "#FFB5B2" : ""}} className="alert alert-danger"><b>{msg_next_icons.error}You are trying to pass in '{input}' which does not match URL regex</b></p></div>)
        setRead(false)
        setPlaceholder(`Type your URI's here`)
    }

    const handleSubmit = (event) => {

        if (event.key === "Enter") {

            if (props.exampleDemo) {
                setHeader(msg_icons.loading)
                if (event.target.value.trim().length === 0) {
                    setHeader(msg_icons.error) //if lenght is 0
                    setMessage(msg.empty)
                    return null;
                }
                if (!matchURL(event.target.value.trim()) && event.target.value != '') {
                    setHeader(msg_icons.error) //if the regex does not match
                    setMessage(msg.notmatch)
                    handleMisMatch(event.target.value);
                    return null;
                }
                setRead(prev => true)
                let URI = event.target.value
                event.target.value = ""
                setPlaceholder(URI)
                console.log("YOU ARE TESTING")
                exampleDemoSend(URI).then(response => {
                    if (response == undefined || response.error) {
                        if (error_429) {
                            setRead(prev => true);
                            setHeader(msg_icons.error)
                            setMessage(error_429)
                            return null;
                        }
                        InternalError(URI);
                        setHeader(msg_icons.error)
                        return null;

                    }
                    console.log(response)
                    props.setUrlList(prev => [...prev, response])
                    setHeader(msg_icons.success)
                    setRead(prev => false)
                    setPlaceholder("Type Your URI's here")
                    let scroll_div = document.getElementsByClassName('url-list')[0];
                    scroll_div.scrollTop = scroll_div.scrollHeight;
              
                    return null;
                })
            }
            else {

                console.log("I STILL GET CALLED")

                let url_2 = event.target.value; //URL
                let id_2 = event.target.getAttribute('id_s'); //folder id
                if (url_2.trim().length === 0) {
                    setHeader(msg_icons.error) //if lenght is 0
                    setMessage(msg.empty)
                    return null;
                }
                if (!matchURL(url_2.trim())) {
                    setHeader(msg_icons.error) //if the regex does not match
                    setMessage(msg.notmatch)
                    return null;
                }
                //Visual representation
                setRead(prev => true)
                setPlaceholder(event.target.value)
                setHeader(msg_icons.loading)

                event.target.value = "";

                addUrl(url_2, id_2, props.Token).then(data => {
                    if (data.big) {
                        setHeader(msg_icons.error)
                        setMessage(<div><p style={{"marginLeft" : "20px",backgroundColor : props.black ? "#452C2F" : '',border : props.black ? "1px solid #452C2F" : "",color : props.black ? "#FFB5B2" : ""}} className="alert alert-danger"><b>{msg_next_icons.error}<span style={{"marginLeft" : "10px"}}>URL greater than 400, consider using a URL shortener</span></b></p></div>)
                        setRead(false)
                        return null;

                    }

                    console.log(data)
                    if (data.error) {
                        if (data.error.trim() == 'URL already exists in the current folder') {
                            handleError()
                            return null
                        }
                        else {
                            setHeader(msg_icons.error)
                            setMessage(<div><p style={{"marginLeft" : "20px",backgroundColor : props.black ? "#452C2F" : '',border : props.black ? "1px solid #452C2F" : "",color : props.black ? "#FFB5B2" : ""}} className="alert alert-danger"><b>{msg_next_icons.error}<span style={{"marginLeft" : "10px"}}>System was unable to fetch the specified domain</span></b></p></div>)
                            setRead(false)
                            return null;
                        }
                    }
                    else {
                        handleSuccess();
                        props.appendURL(data)
                    }

                }).catch(
                    err => {
                        console.error(err)
                        setHeader(msg_icons.error)
                        setMessage(<div><p style={{"marginLeft" : "20px",backgroundColor : props.black ? "#452C2F" : '',border : props.black ? "1px solid #452C2F" : "",color : props.black ? "#FFB5B2" : ""}} className="alert alert-danger"><b>{msg_next_icons.error}<span style={{"marginLeft" : "10px"}}>System was unable to fetch the specified domain</span></b></p></div>)
                        setRead(false)

                    }

                )

            }
        }
    }

    //Checks URL regex
    const handleChange = (event) => {
        
        if (event.target.value.trim() == '') {
            setMessage('');
            setHeader(msg_icons.info);
            return null;
        }

        if (!matchURL(event.target.value)) {
            setMessage(msg.notmatch)
            setHeader(msg_icons.warning)
        }
        else {
            setMessage("")
            setHeader(msg_icons.info)
        }
    }


    return (
        <div>
            <div>
                {message}
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span style={{backgroundColor : props.black ? '#282a2b' : '',border : props.black ? '1px solid #2d2d2d' :'' }} className="input-group-text" id="basic-addon1">
                            {header}
                        </span>
                    </div>
                    <input style={{backgroundColor : props.black ? '#212020 ' : '',border : props.black ? '1px solid #2d2d2d' : ''}} id={props.id} id_s={props.id} onChange={event => handleChange(event)} onKeyPress={(event) => { handleSubmit(event); }} type="text" className="form-control" placeholder={placeholder} aria-label="Type Your URI's here" aria-describedby="basic-addon1" data-target="#takispeosnafas" readOnly={read}></input>
                </div>
            </div>
        </div>


    )
}


export default Input;

