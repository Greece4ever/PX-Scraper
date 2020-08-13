import React,{useState,useEffect} from 'react';


const Fold_del = (props) => {

    const energos = "list-group-item list-group-item-action active";
    const aergos = "list-group-item list-group-item-action";

    const [active,setActive] = useState(aergos);

    useEffect(() => {
        setActive(aergos)
    } ,[props.pageChange])



    return (
        <button id={props.id} onClick={() => setActive(active==energos ? aergos : energos)} style={{"height" : "10px"}} type="button" class={active}><b style={{position: "absolute",bottom : "0px",fontWeight : "300"}}><i style={{color: 'orange'}} className="fa fa-folder" aria-hidden="true"></i><span style={{"marginLeft" : "10px",color : "black"}}>{props.name}</span></b></button>
    )
}


export default Fold_del;