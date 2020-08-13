import React,{useState,useEffect} from 'react';
import jquery from 'jquery';
import FolderDeletion from "./delete_fold";
import Stats from "./stats";

const checkFolderList = (data,token) => {
    return jquery.ajax({
        url: "http://localhost:8000/apiconfig/folder/exists/",
        type: "GET",
        headers : {
            Authorization : `Token ${token}`
        },
        data : {
            args : data,
        },
        success : (result) => {return result;}
    }).catch(e => {return e.message});

}

const createFolder = (name,description,token) => {
    return jquery.ajax({
        url : "http://localhost:8000/apiconfig/folder/view/",
        type: "POST",
        headers: {
            Authorization : `Token ${token}`
        },
        data : {
            name : name,
            description: description,
        },
        success: (data) => {return data}
    }).catch(e => {return e.message})
}


const Action = (props) => {

    const [length,setLength] = useState(500);
    const [disabled,setDisabed] = useState(true)
    const [typing,setTyping] = useState('')
    const [desc_typing,setDesc_typing] = useState('')
    const [status,setStatus] = useState(<i className="fa fa-question-circle" aria-hidden="true"></i>)
    const [isError,setIsError] = useState(true);
    const [isCreated,setIsCreated] = useState("");

    const [clicked,SetClicked] = useState(false);


    const success = <div><i style={{color : "green"}} className="fa fa-check-circle" aria-hidden="true"></i></div>;
    const error = <div><i style={{color : 'red'}} className="fa fa-exclamation-circle" aria-hidden="true"></i></div>;
    const loading = <div style={{width : "15px",height : "15px",}} className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div>


    const HandleChange = (event,len,length) => {
        let input = event.target.value;
        let event_length = input.length
        if (length) {
            setLength(event_length < len ? len-event_length : 0)

        }
        let newEf = input.replace(input.slice(len-1),'')
        if (event_length >= len) {
            event.target.value = newEf;
        }
    }

    //Check if folder name already exists
    useEffect(() => {
        if (!typing.trim().replace(/\s+/,'')=='') {
            setStatus(loading)
            const timeout = setTimeout(() => {
                checkFolderList(typing,props.Token).then(response => {
                    console.log(response)
                    if (response[0] == "error") {
                        console.log("THAT WAS AN ERROR")
                        setStatus(error);
                        setIsError(true)
                    }
                    else {
                        setStatus(success);
                        setIsError(false)
                    }
                })
                },1000)
                return () => clearTimeout(timeout)        
        }
        else {
            setStatus(<i className="fa fa-question-circle" aria-hidden="true"></i>)
            return () => console.log("hello")
        }
         
        } ,[typing])


    //Check if input data is valid
    useEffect(() => {
        if (typing.trim().replace(/\s+/,'').length > 1 && desc_typing.trim().replace(/\s+/,'').length > 1 && !isError) {
            setDisabed(false);
        }
        else {
            setDisabed(true)
        }
    },[typing,desc_typing])



    const handleSubmit = () => {
        setIsCreated(loading);
        const name = document.getElementById("name");
        const description = document.getElementById("description");
        createFolder(name.value,description.value,props.Token).then(response => {
            console.log(response)
            if (response.error) {
                setIsCreated(<span style={{"color" : "red"}} className="d-flex justify-content-start">{error}<span style={{"fontSize" : "14px",marginTop : "5px",marginLeft : "10px"}}>{response.error}</span></span>)
            }
            else {
                setIsCreated("");
                setStatus(<i className="fa fa-question-circle" aria-hidden="true"></i>)
                name.value = "";
                description.value = "";
                setLength(500)
                setTyping('')
                setDisabed(true)
                setDesc_typing('')
                setIsError(true)
                jquery('#folder_close').click()
                props.setPaginationState('')
                props.setTyping('')
                props.setPaginationState(' ')
                props.setTyping(' ')

            }
        })
    }



    return (
        <div>
            <div className="modal fade" id="newFolder" tabindex="-1" role="dialog" aria-labelledby="newFolderLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="newFolderLabel">Create new Folder {isCreated}</h5>
                        <button id="folder_close" type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                        <div className="form-group">
                            <label for="recipient-name" className="col-form-label">Name</label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">{status}</span>
                                    </div>
                                    <input id="name" onChange={(event) => setTyping(event.target.value)} type="text" className="form-control" aria-label="Name" aria-describedby="basic-addon1"></input>
                                </div>

                        </div>
                        <div style={{"position": "relative"}} className="form-group">
                            <label for="message-text" className="col-form-label">Description</label>
                            <textarea id="description" onChange={(event) => {HandleChange(event,500,true);setDesc_typing(event.target.value)} } style={{height : "300px",resize : "none",overflow : "none"}} className="form-control"></textarea>
                            <span style={{position: "absolute",bottom : "8px",right: "16px",fontSize: "14px","userSelect" : "none",pointerEvents : "none"}} className="text-muted">{length} Characters left</span>
                        </div>
                        </form>
                    </div>
                    <div style={{"justifyContent" : "space-around"}} className="modal-footer">
                        <button style={{"width" : "200px"}}  type="button" className="btn btn-danger" data-dismiss="modal">Abort</button>
                        <button onClick={() => handleSubmit()} style={{"width" : "200px"}}  disabled={disabled} type="button" className="btn btn-primary">Proceed</button>
                    </div>
                    </div>
                </div>
            </div>
            <FolderDeletion setPaginationState={props.setPaginationState} setTyping={props.setTyping} startSearch={props.startSearch} clicked={clicked} Token={props.Token} />
            <Stats exp={props.exp} Token={props.Token} />
        </div>

    )
}


export default Action;