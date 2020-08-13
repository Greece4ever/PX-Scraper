import React, { useEffect, useState } from 'react';
import badge from "./../../../imgres/badge.png"
import jquery from 'jquery';

const getToken = (token) =>
{
    return jquery.ajax({
        url : "http://localhost:8000/apiconfig/level/",
        type: 'GET',
        headers: {
            Authorization : `Token ${token}`
        },
        success : (data) => {
            return data
        }
    }).catch(e => console.log(e))

}



const Stats = (props) => {

    const [folderNum,setFoldernNum] = useState('')
    const [urlNum,setUrlNum] = useState('')
    const [EXP,setEXP] = useState('')
    const [multiplier,setMultiplier] = useState('')
    const [width,setWidth] = useState('')
    const [level,setLevel] = useState('')
    const [final,setFinal] = useState('')

    useEffect(() => {
        jquery('#takisgamiete123').fadeOut('fast')
    },[])


    useEffect(() => {
        if (props.exp) {
            getToken(props.Token).then(response => {
                console.log(response)
                setEXP(response.final_xp - response.exp)
                setMultiplier(response.MULTIPLIER)
                setWidth((response.exp / response.final_xp) * 1000)
                setLevel(response.level)
                setUrlNum(response.urls)
                setFoldernNum(response.folders)
                setFinal(response.final_xp)
            })    
        }
    },[props.exp])


    return (
        <div className="modal fade" id="StatsPreview" tabindex="-1" role="dialog" aria-labelledby="StatsPreviewLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="StatsPreviewLabel">Statistics</h5>
                    <button id="folder_close" type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div style={{"position" : "relative",textAlign : "center"}}>
                        <img style={{"width" : "128px"}} src={badge} />
                        <b style={{"fontSize" : "25px",fontFamily : "'Luckiest Guy', cursive",color :'rgb(72, 8, 8)',position : "absolute",top : "50%",left : "50%",transform : "translate(-50%, -50%)"}}>{level}</b>
                    </div>
                    <div style={{"marginTop" : "20px"}} class="progress">
                        <div class="progress-bar bg-success" role="progressbar" style={{"width" : `${width}%`}} aria-valuenow={`${width}%`} aria-valuemin="0" aria-valuemax="100">{`${width}%`}</div>
                    </div>
                    <div style={{"fontFamily" : "'Teko', sans-serif;"}}>
                        <b style={{"float" : "left",}}>0</b>
                        <b style={{"float" : "right",}}>{final}</b>
                    </div>
                    <div style={{"marginTop" : "25px"}} className="text-center stats">
                        <ul>
                            <hr></hr>
                            <li onMouseOver={() => document.getElementById("b1").style.visibility = "visible"} onMouseLeave={() =>document.getElementById("b1").style.visibility = "hidden"} id="c1">
                                <b id="b1" style={{"marginRight" : "20px",pointerEvents : "none",userSelect : "none",visibility : "hidden"}}>&gt;</b>  Total Number of Folders : <samp><b style={{"color" : "rgb(168, 104, 40)"}}>{folderNum}</b></samp>
                            </li>
                            <hr></hr>
                            <li onMouseOver={() => document.getElementById("b2").style.visibility = "visible"} onMouseLeave={() =>document.getElementById("b2").style.visibility = "hidden"} id="c2">
                                <b id="b2" style={{"marginRight" : "20px",pointerEvents : "none",userSelect : "none",visibility : "hidden"}}>&gt;</b>Total Number of URLS : <b><samp style={{"color" : "#dd6a6a"}}>{urlNum}</samp></b>
                            </li>
                            <hr></hr>

                            <li onMouseOver={() => document.getElementById("b3").style.visibility = "visible"} onMouseLeave={() =>document.getElementById("b3").style.visibility = "hidden"} id="c3">
                                <b id="b3" style={{"marginRight" : "20px",pointerEvents : "none",userSelect : "none",visibility : "hidden"}}>&gt;</b>Experience to next level : <b><samp style={{"color" : "#287dc9"}}>{EXP}</samp></b>
                            </li>
                            <hr></hr>

                            <li onMouseOver={() => document.getElementById("b4").style.visibility = "visible"} onMouseLeave={() =>document.getElementById("b4").style.visibility = "hidden"} id="c4">
                                <b id="b4" style={{"marginRight" : "20px",pointerEvents : "none",userSelect : "none",visibility : "hidden"}}>&gt;</b>Experience Multiplier : <b><samp style={{"color" : "#645454"}}>{multiplier}</samp></b>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="inline text-muted text-center">
                <samp>
                Icon made by <a style={{"color" : "#333"}} target="_blank" rel="noopener noreferrer" href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a style={{"color" : "#333"}} target="_blank" rel="noopener noreferrer" href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
                </samp>
                </div>
                <div style={{"justifyContent" : "space-around"}} className="modal-footer">
                    <button style={{"width" : "200px"}}  type="button" className="btn btn-danger" data-dismiss="modal">Not ok</button>
                    <button style={{"width" : "200px"}}  type="button" className="btn btn-primary">Ok</button>
                </div>
                </div>
            </div>
    </div>
    )
}


export default Stats;