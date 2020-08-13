import React,{useState, useEffect} from 'react';
import Navbar from "./home_components/navbar"
import logo from  '../imgres/logofinale.png';
import Google from "./home_components/logingoogle";
import Github from "./home_components/logingithub";
import "./or.css";
import { useHistory } from 'react-router-dom';
import jquery from "jquery";


const CheckAvailability = (username) => {
    return jquery.ajax({
        url : `http://localhost:8000/apiconfig/create/?username=${username}`,
        type: 'GET',
        success : (data) => {return data}
    }).catch((error => {return error.message}))

}


export const createUser = (method='normal',id=null,username,email=null,password = null,setState) => {
    return jquery.ajax({
        type: 'POST',
        url : "http://localhost:8000/apiconfig/create/",
        data : {
            method : method,
            id : id,
            username: username,
            email: email,
            password: password,
        },
        success: (info) => {
            return info;
        }
    }).catch(error => {setState(true)})
}



const Sign_in = () => {

    //For redirects
    const history = useHistory()

    const handleSuccess = () => {
        history.push("")
    }




    //CHECK IF USERNAME IS AVAILABE AND GIVE VISUAL REPRESENTATION TO USER (DISABLE SUBMIT BUTTON IF SO)
    const [available,setAvailabe] = useState("")
    const [typing,setTyping] = useState("")
    const [disabled,setDisabled] = useState(true)

    const [authMethod,setAuthMethod] = useState("normal");

    const [info,setInfo] = useState("");

    const [showErrors,setShowErrors] = useState(true);

    const errorReducer = () => {
        setShowErrors(false);
    }


    const success = <div><i style={{color : "green"}} className="fa fa-check-circle" aria-hidden="true"></i><b style={{"marginLeft": "15px"}}>Available</b></div>;
    const error = <div><i style={{color : 'red'}} className="fa fa-exclamation-circle" aria-hidden="true"></i><b style = {{marginLeft : "15px"}}>Taken</b></div>;
    const loading = <div style={{width : "18px",height : "18px",marginLeft : "20px",marginBottom : "2px"}} className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div>
    const loading_2 = <div style={{width : "15px",height : "15px",marginBottom : "2px"}} className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div>
    const [loginMode,setLoginMode] = useState(false)

    const [tooMany,setTooMany] = useState(false);

    const [authenticate,setAuthenticate] = useState(<b>Authenticate</b>)


    //User credidentials
    const [id,setid] = useState("");
    const [username,setusername] = useState("");
    const [email,setemail] = useState("");

    const username_rgrx = /^(\w+)$/
    const plain_rgx = /(\w+)/

    const handlePlainLogin = () => {
        jquery('#external').fadeOut('slow');
        setInfo(<span className="text-muted">Currently in <b>Manual Login (Local Authentication)</b> mode</span>)
        setDisabled(false);
        setLoginMode(true);
        setAvailabe("");

    }


    const setCredidentials = (parameter,property) => {
        if (property=="id") {
            setid(parameter)
        }
        else if (property=="email") {
            setemail(parameter)
        }
        else if (property=="username") {
            setusername(parameter)
        }
    }

    const needUsername = (platform,username) => {
        if (platform.toLowerCase() == 'github') {
            setInfo(<span className="text-muted">You've successfuly logged in with <a style={{"color" : "#333"}} href="https://github.com" target="_blank" rel="noopener noreferrer">www.github.com</a> , but because your GITHUB alias "<b style={{color : "red"}}>{username}</b>" already exists you must type a new one</span>)
            setAuthMethod('github')
        }
        else if (platform.toLowerCase() == 'google') {
            setInfo(<span className="text-muted">You've successfuly logged in with <a style={{"color" : "#333"}} href="https://www.google.com" target="_blank" rel="noopener noreferrer">www.google.com</a> ,but because your google alias "<b style={{color : "red"}}>{username}</b>" already exists you must type a new one</span>)
            setAuthMethod('google')

        }
    }

    //Displays where username is taken or not (display only)
    const processAuth = (bool) => {
        if (!bool) {
            setAuthenticate(<b>Authenticate</b>)
        }
        else {
            setAuthenticate(<b>Authenticating {loading}</b>)
        }
    }

    useEffect(() => {
        jquery('#success-success').fadeOut('slow');

    },[])

    //Called when the user is typing
    useEffect(() => {
        if (!loginMode) {
            setAvailabe(<p><span style={{"marginBottom" : "10px"}}><b>{loading_2} <span style={{"marginLeft": "10px"}}>Loading...</span></b></span></p>)
            const timeout = setTimeout(() => {
                CheckAvailability(typing).then(response => {
                    if (response.error) {
                        if (typing == '') {
                            setDisabled(true)
                            setAvailabe("")
                            return null;
                        }
                        
                        setAvailabe(error)
                        setDisabled(true)
                        if (showErrors) {
                            setInfo(<span style={{"fontFamily" : "'Playfair Display', serif",fontSize : "16px"}} className="text-muted">A user with that username already exists , if are the creator of that account and you have not logged in with Google or Github <a style={{"color" : "#333"}} onClick={() => handlePlainLogin()} href="#">Click here to login</a> else click the button of your login service</span>)
                        }
                    }
                    else {
                        setAvailabe(success)
                        setDisabled(false)
                        if (showErrors) {
                            setInfo("")
                        }
                    }
                })
            },1000)
            return () => clearTimeout(timeout)    
        }
        else {
            console.log("hello")
        }
    } ,[typing])

    //ONLY ALLOW WORD CHARACTERS AND _ IN THE UNSERNAME
    const handleChange = (event) => {
        let input = event.target.value;


        event.target.value = event.target.value.replace(/\s+/,'_')

        console.log(/(\W+)/.test(event.target.value))


        event.target.value = event.target.value.replace(/(\W+)/gm,'')


    }

    const handleSubmit = () => {
        processAuth(true)
        let username = document.getElementById("username")
        if (authMethod == 'normal') {
            let password = document.getElementById("password")
            createUser('normal',null,username.value,null,password.value,setTooMany).then(response => {
                if (response == undefined || tooMany) {
                    setInfo(<div class="alert alert-danger" role="alert">You've made too much Invalid requests for today</div>)
                    processAuth(false)
                    return null;
                }
                if (response.error) {
                    console.log(response)
                    processAuth(false)
                    setInfo(<div class="alert alert-danger" role="alert">Invalid Credidentials</div>)
                    return null;
                }
                console.log(response)
                
                //cookies
                document.cookie = `auth_key=${response.success.token} expires=` + new Date(9999,1,1).toUTCString() + "; path=/";
                document.cookie = `user=${response.success.username} expires=` + new Date(9999,1,1).toUTCString() + "; path=/";

                console.log(document.cookie)
                console.log("Sucessfully logged in")
                setInfo(<span style={{"color" : "green !important"}} className="text-muted">Sucessfully created account for {username.value},<p>You will be redirected soon</p></span>)
                processAuth(false)    
                jquery('#success-success').fadeIn("slow");
                jquery('#SignInModal').fadeOut('slow');
                jquery('#close').click()
                setTimeout(() => handleSuccess(),1500)
            })
        }
        else if (authMethod.toLowerCase() == 'github') {
            createUser('github',id,username.value,null,null).then(response => {
                // <------------ TEMP CODE NOT SUITABLE FOR PRODUCTION  ------------>

                //Cookies
                document.cookie = `auth_key=${response.success.token} expires=` + new Date(9999,1,1).toUTCString() + "; path=/";
                document.cookie = `user=${response.success.username} expires=` + new Date(9999,1,1).toUTCString() + "; path=/";



                console.log(document.cookie)
                console.log(`User ${response.success.username} sucessfully logged in`)
                console.log('You will be redirected soon')
                jquery('#success-success').fadeIn("slow");
                setInfo(<span style={{"color" : "green !important"}} className="text-muted">Sucessfully created account for {username.value},<p>You will be redirected soon</p></span>)
                processAuth(false)
                jquery('#SignInModal').fadeOut('slow');
                jquery('#close').click()
                setTimeout(() => handleSuccess(),1500)

            }) 
        }
        else if (authMethod.toLowerCase() == 'google') {
            createUser('google',id,username.value,email,null).then(response => {


                document.cookie = `auth_key=${response.success.token} expires=` + new Date(9999,1,1).toUTCString() + "; path=/";
                document.cookie = `user=${response.success.username} expires=` + new Date(9999,1,1).toUTCString() + "; path=/";

                console.log(document.cookie)
                jquery('#success-success').fadeIn("slow");
                setInfo(<span style={{"color" : "green !important"}} className="text-muted">Sucessfully created account for {username.value},<p>You will be redirected soon</p></span>)
                processAuth(false)
                jquery('#SignInModal').fadeOut('slow');
                jquery('#close').click()
                setTimeout(() => handleSuccess(),1500)
                console.log(response);
                console.log(`Sucessfully created account for user ${response.sucess.username}`)
            })
        }
    }



    return (
        <div>
                <div className="modal fade" id="SignInModal" tabIndex="-1" role="dialog" aria-labelledby="SignInModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="SignInModalLabel">{authenticate} <i style={{color : "green"}} id="success-success" class="fa fa-check" aria-hidden="true"></i> </h5>
                        <button id="close" type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                        <p>{info} </p>
                        <div className="form-group">
                            <label htmlFor="recipient-name" className="col-form-label">Username <b style={{"marginLeft" : "10px"}}>{available}</b> </label>
                            <input id="username" onChange={(event) => {handleChange(event);setTyping(event.target.value)}} type="text" className="form-control"></input>
                        </div>
                        <div id="password-group" className="form-group">
                            <label htmlFor="message-text" className="col-form-label">Password</label>
                            <input id="password" type="password" className="form-control" />
                        </div>
                        </form>
                    </div>
                    <div id="external">
                        <Google handleSuccess={handleSuccess} errorReducer={errorReducer} needUsername={needUsername} setCredidentials={setCredidentials} useAthenticate={processAuth} />
                        <span className="or" style={{"textAlign" : "center",marginLeft : "40px"}}>or</span>
                        <Github handleSuccess={handleSuccess} errorReducer={errorReducer} needUsername={needUsername} id={id} setCredidentials={setCredidentials} useAthenticate={processAuth} />
                    </div>
                    <div className="modal-footer">
                        <button disabled={disabled} onClick={() => handleSubmit()} style={{width : "100%",fontWeight : "bold"}} type="button" className="btn btn-success">Continue</button>
                        <button style={{width : "100%",fontWeight : "bold"}} type="button" className="btn btn-danger" data-dismiss="modal">Abort</button>
                    </div>
                    </div>
                </div>
                </div>
        </div>
    )

};

export default Sign_in;