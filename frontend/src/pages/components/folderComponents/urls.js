import React,{useState} from 'react';
import jquery from 'jquery';

const delAjax = (folder_id,url_id,token) => {
    return jquery.ajax({
        url : 'http://localhost:8000/apiconfig/url_demo/',
        type : 'POST',
        headers : {
            Authorization : `Token ${token}`
        },
        data : {
            folder_id : folder_id,
            url_id : url_id
        },
        success : (data) => {return data}
    }).catch(e => {return e.message})
}




const Url = (props) => {
    // INFO NEEDED
    // props.id (url id)
    // props.title
    // props.image | props.favicon
    // props.description
    // props.url
    // props.domain
    // props.duration

    const [copy,setCopy] = useState("fa fa-clipboard")
    let ran_num = `${Math.random() * 10000 * Math.random() *2313}`


    const handleDelete = (element) => {
        

        const URL = element.getAttribute("url_id");
        const folder = element.getAttribute("fol_id")

        if (props.Testing) 
        {
            jquery(element).fadeOut("slow")
            return null;

        }


        console.log(`${URL} ${folder}`)

        console.log(`Folder is ${element.getAttribute("fol_id")} url is ${URL}`)
        delAjax(folder,URL,props.Token).then(response => {
            if (response.error) {
                console.log(response)
            }
            else {
                console.log("Everything went smoothely")
                jquery(element).fadeOut('slow');
                console.log(response)
            }
        })
    }

    const getTitle = () => {
        if (props.title) {
            if (props.title != '') {
                return props.title;
            }
            return props.domain;
        }
        return props.domain;
    }



    return (
        <div fol_id={props.fold_id} url_id={props.id} id={props.Testing ? ran_num : props.id_index} style={{minWidth: "330px",maxWidth: "750px",position: "relative",}} className="w-50 p-3">
            <div style={{backgroundColor : props.black ? "#333" : ''}} className="shadow p-3 mb-5 rounded">
                <button onClick={() => handleDelete(document.getElementById(props.Testing ? ran_num : props.id_index))} style={{position:"absolute",top:"15px",right:"25px",}} type="button" className="close" aria-label="Close">
                    <span style={{"color" : props.black ? '#fff' : ''}} aria-hidden="true">&times;</span>
                </button>
                <div onClick={(event) => {event.preventDefault();window.open(props.url,"_blank")}} className="img_input" style={{float: "left",maxWidth: "300px",marginRight : "20px",cursor:"pointer"}}>
                  <img referrerPolicy={"no-referrer"} style={{maxHeight : "230px",border : props.black ? "1px solid #565454" : "1px solid #dee2e6",backgroundColor : props.black ? '#4c4848' : '#fff' }} className="rounded img-thumbnail" src={props.image ? props.image : props.favicon}></img>
                    {props.duration}
                </div>
                <div style={{letterSpacing: "0px"}} className="lead">
                    <div> 
                        <b><a className="title" style={{fontSize: "14px",color : props.black ? '#76b2f2' : "#2c6dc1"}} href={props.url} target="_blank" rel="noopener noreferrer">{getTitle()}</a></b>
                    </div>
        <span style={{fontSize: "13px",letterSpacing: 0,fontWeight : props.black ? '470' : ''}} className="text-muted"><span className="description">{props.description ? props.description : ""}</span></span>
                </div>
                {/* <input onClick={(event) => navigator.clipboard.writeText(props.url)} style={{display: "inline-block",marginTop: "10px",cursor:"pointer"}} className="form-control" type="text" placeholder={props.site_name ? props.site_name : props.url } readOnly></input> */}
                <div style={{paddingTop : '10px',cursor: "pointer"}} className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span style={{"backgroundColor" : props.black ? '#343a40' : '',border : props.black ? '1px solid #565454' : ''}} onClick={(event) => {navigator.clipboard.writeText(props.url);setCopy("fa fa-check-square")}} className="input-group-text" id="basic-addon1"><i className={copy} aria-hidden="true"></i></span>
                    </div>
                    <input onClick={(event) => {navigator.clipboard.writeText(props.url);setCopy("fa fa-check-square")}} style={{cursor : "pointer",backgroundColor: props.black ?'#343a40' : '',border : props.black ? '1px solid #565454' : '' }} type="text" className="form-control" placeholder={props.domain ? props.domain : props.url} aria-label={props.website ? props.website : props.url} aria-describedby="basic-addon1" readOnly></input>
                  </div>
            </div>
        </div>        
    )
}


export default Url;