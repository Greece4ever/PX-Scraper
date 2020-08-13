import React, { useEffect, useState } from 'react';
import Folder from './components/folders';
import jquery from 'jquery';
import {getAuth} from './cookies';
import {useHistory} from 'react-router-dom';
import {getMaxSize} from './components/functions';


const getDetailedFolder = (id,token) => {
    return jquery.ajax({
        url : 'http://localhost:8000/apiconfig/folder_detail/',
        type: 'GET',
        headers : {
            Authorization : `Token ${token}`
        },
        data : {
            id : id
        },
        success : (data) => {return data}
    }).catch(e => {return e.message;})

}



const FolderDetail = () => {

    const [takis,setTakis] = useState('test')
    const history = useHistory()
    const [detail,setDetail] = useState([]);
    const [id,setId] = useState('')
    const auth_key = getAuth()
    const [black,setBlack] = useState(false);


    useEffect(() => {
        const href = window.location.href;
        if (auth_key == undefined) {
            return () => {history.push("/")}
        }
        let id = getMaxSize(window.location.href)
        if (id == null) {
            console.log(`id is null`)
            history.push('/')
        }
        setId(id)
        getDetailedFolder(id,auth_key).then(data => {
            if (data.error) {
                history.push('/')
            }
            else {
                setDetail(prev => [...prev,data])

            }
        })
    },[])

    useEffect(() => {
        let dark_mode = localStorage.getItem('dark');
        if (dark_mode == null) {localStorage.setItem('dark',false)}
        if (dark_mode == 'true') {
            setBlack(true)
        } 
        else {
            setBlack(false)
        }
    },[])




    return(
        <div className="fixed-container">
            {detail.map(item => (
                <Folder black={black} debug={true} Token={auth_key} id={item.id} name={item.name} description={item.description}  />
            ))}
                {/* <Folder debug={true} Token={"4b6c1b5b43b3998c9c1b1791f4f040c4e3cf24c0"} id={"136"} name={"3123"} index={"0"} description={"my new folder"} date={"2020-08-07"}  /> */}
        </div>

    )
}



export default FolderDetail;