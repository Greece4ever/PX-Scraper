import React,{useState, useEffect} from 'react';
import Folder from './components/folders';
import Searchbar from './components/searchbar';
import {fetchFolders} from "./components/functions";
import "../url.css";
import "../App.css";
import {getAuth,getAuthInfo} from "./cookies";
import Paginator from "./components/folderComponents/paginator";
import { useHistory } from 'react-router-dom';
import jquery from 'jquery'


const Folder_preview = () => {

  const Token = getAuth();
  const history = useHistory()

  let tmpFolder = [];
  const [folder_JSX,setFolder_JSX] = useState([]);
  const [results,setResults] = useState([]);
  const [paginationState,setPaginationState] = useState('');

  const [black,setBlack] = useState(false)

  const [found,setFound] = useState(false);

  useEffect(() => {
    if (!Token) {
      history.push('/getstarted')
    }
    if (!getAuthInfo) {
      console.log("NOT")
      history.push('/getstarted')

    }
  },[])

  const setNotFound = (data) => {
    setFound(data)
  }

  const [last,setLast] = useState(0)

  const setStatePaginator = (data) => {
    setPaginationState(data)
  }


  const modifyLast = (info) => {
    setLast(info)
  }

  const getResults = (data) => {
    setResults(data)
  }


  const setAfterSearch = (data) => {
    setFolder_JSX(data)
  }

  //When user first vists show them all their folders by default
  useEffect(() => fetchFolders(0,Token).then(data => {
    for (let i=0;i <data.length;i++) {
      tmpFolder.push(
        [{id:data[i].folder_id,name:data[i].name, index:data[i].local_id, description:data[i].description, date:data[i].date_created}]
      )
      setLast(prev => i);
    }
    setFolder_JSX(tmpFolder);
  }),[])


  useEffect(() => {
    if (localStorage.getItem('dark') == null) {
      localStorage.setItem('dark',false);
      setBlack(false);
    }
    else if (localStorage.getItem('dark') == 'true') {
      setBlack(true)
    }
    else if (localStorage.getItem('dark') == 'false') {
      setBlack(false);
    }
  },[])


  useEffect(() => {
    if (black) {
      document.querySelector('body').style.backgroundColor = "#404546"
      document.querySelector('html').style.backgroundColor = "#404546"  
    }
    else {
      document.querySelector('body').style.backgroundColor = ""
      document.querySelector('html').style.backgroundColor = ""  

    }

  },[black])


  return (
    <div>
      <div>
        <Paginator notFound={found} setNotFound={setNotFound} paginationState={paginationState} setLast={modifyLast} last={last} setFolders={setAfterSearch} Token={Token} />
        <Searchbar setBlack={setBlack} black={black} setNotFound={setNotFound} setPaginationState={setStatePaginator} Token={Token} setFolders={setAfterSearch} getResults={getResults} />
        {folder_JSX.map(item => (
          item == [] ? '' : <Folder black={black} Token={Token} id={item[0].id} name={item[0].name} index={item[0].index} description={item[0].description} date={item[0].date} />
        ) )}
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

    </div>
  )
};

export default Folder_preview;