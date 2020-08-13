import React,{useEffect, useState} from 'react';
import jquery from 'jquery';
import {fetchFolders} from "../functions";
import Fold_del from "./folder_comp_del";
import DeletionPaginator from "./delete_pagination";


const handleDelete = (id,token) => {
  return jquery.ajax({
    method: "POST",
    url: "http://localhost:8000/apiconfig/folder/exists/",
    headers : {
      Authorization : `Token ${token}`
    },
    data : {
      ids : id
    },
    success: (info) => {return info}
  })
}




const FolderDeletion = (props) => {


    const [dataFolders,setDatFolders] = useState([])
    let loader = <div style={{"width" : "100px",height : "100px"}} ><i style={{"fontSize" : "40px",animation: "spinning 1s infinite",color : "#0062aa"}} className="fa fa-square" aria-hidden="true"></i></div> 
    const [loading,isLoading] = useState(loader);
    const [pageChange,setPageChange] = useState("");
    const [delPagination,setDelPagination] = useState("");


    const setFolder = (data) => {
      setDatFolders(data)
    }



    useEffect(() => {
      setDelPagination("")
        setDatFolders([])
        isLoading(loader)
        if (props.startSearch !== 'initial') {
            console.log("I THE CHILKD OF GANDALD WAS CALLED")
            let LRU = [];
            setTimeout(() => {
                fetchFolders(0,props.Token).then(response => {
                    response.forEach(item => {
                        LRU.push([item.name,item.folder_id])
                    })
                isLoading('')
                setDelPagination(<DeletionPaginator setPageChange={setPageChange} setFolder={setFolder} Token={props.Token} start={props.startSearch} />)
                setDatFolders(prev => LRU)
                })
            },1500)
        }
    },[props.startSearch])

    const handleFolders = () => {
      let del_obj = document.getElementsByClassName("list-group-item list-group-item-action active");
      const data = [];
      for (let i=0;i < del_obj.length;i++) {
        let id = del_obj[i].getAttribute('id').replace('del_','')
        data.push(id)
      }
      console.log(data)
      console.log("SENDING DELETE REQUEST")
      handleDelete(data,props.Token).then(response => {
        props.setTyping("   ");
        props.setPaginationState("   ")
        props.setTyping(" ");
        props.setPaginationState(" ")

        jquery('#delte_closed').click()


      })

    }


    return (
        <div class="modal fade" id="folder_delete" tabindex="-1" role="dialog" aria-labelledby="folder_deleteTitle" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="folder_deleteTitle">Select Folders to delete</h5>
                <button id="delte_closed" type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  
                </button>
              </div>
              
              <div class="modal-body">
              {delPagination}
              <div class="list-group">
                    <div style={{"transform" : "translateX(45%)",marginTop : "30px"}}>{loading}</div>    
                    {dataFolders.map(
                        folder => (
                            <Fold_del pageChange={pageChange} name={folder[0]} id={`del_${folder[1]}`} />
                        )
                    )}
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button onClick={() => handleFolders()} type="button" class="btn btn-danger">Delete Selected Folders</button>
              </div>
            </div>
          </div>
        </div>        
    )
}


export default FolderDeletion;