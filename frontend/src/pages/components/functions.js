import React from 'react';
import jquery from 'jquery';

//Regex and matching
//www in www in word else the second
const regex = {
    "www" : /^\w+:(\/)(\/)(((www)\.((([^\x00-\x7F])|(\w+)|[A-Za-z0-9_.\-~])+)\.\w+)|(((([^\x00-\x7F])|(\w+)|[A-Za-z0-9_.\-~])+)\.\((([^\x00-\x7F])|(\w+)|[A-Za-z0-9_.\-~])+))(.*)$/,
    "default" : /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/
}

export const matchURL = (url) => {
    const www = /^\w+:(\/)(\/)/;
    switch (true) {
        case www.test(www):
            return regex.www.test(url);
        default:
            return regex.default.test(url);
    }
}

//Ajax Requests

export const fetchFolders = (index,auth_token,search=null) => {
  return jquery.ajax({
    url : "http://localhost:8000/apiconfig/folder/view/",
    method: 'GET',
    data : {
      index : index,
      search : search
    },
    headers : {
      Authorization : `Token ${auth_token}`
    },
    success : (data) => {return data}
  }).catch(e => {return e.message})
}

//Get folder and url count

export const getCount = () => {
  return jquery.ajax({
    type: 'GET',
    headers : {
      Authorization: "Token 8873ba8df06bca73929e3fd00804035e6e0ccd29"
    },
    url : 'http://192.168.1.4:8000/apiconfig/urlcount/',
    success : (data) => {return data}
  }).catch(e => {return e.message})
}

//Create new URL
export const addUrl = (request_url,request_id,token) => {
    return jquery.ajax({
        type : "POST",
        url : "http://localhost:8000/apiconfig/urls/create/",
        headers: {
          Authorization : `Token ${token}`  
        },
        data : {
            url : request_url,
            id : request_id
        },
        success : (data) => {return data}
    }).catch(error => {return error.message})
}

//Delete URL from folder (Actual work)
const deleteAJAX = (item) => {
  const url_id = item.getAttribute('url_id').trim();
  const fold_id = item.getAttribute('fol_id').trim();
  return jquery.ajax({
    type : "POST",
    url : `http://192.168.1.4:8000/apiconfig/removelink/`,
    headers: {
      Authorization : "Token 8873ba8df06bca73929e3fd00804035e6e0ccd29"
    },
    data: {
      fold_id : fold_id,
      url_id : url_id
    },
    success: (data) => {return data}
  }).catch(error => {return error.message})


}

//Delete URL from folder (visual representation)
const deleteURL = (item) => {
  deleteAJAX(item).then(data => {
    console.log("FINISHED REQUEST")
    console.log(data)
    if (!data.error) {
      jquery(item).fadeOut('slow')
    }

  })
}
  
//Query folders based on user input
export const queryFolder = (args,order_by=null,params=null) => {
  let data = {
    args : args,
    order_by : order_by,
  }
  if (params) {data.params = params;}

  return jquery.ajax({
    method: "GET",
    url : "http://192.168.1.4:8000/apiconfig/queryfolder/",
    headers: {
      Authorization: "Token 8873ba8df06bca73929e3fd00804035e6e0ccd29"
    },
    data : data,
    success: (data) => {return data}
  }).catch(error => {return error.message})
}
  

class URLReducer {
  constructor() {
    return null;
  }
  fetchReducer(pattern) {
    let index = pattern.indexOf('id=')
    if (index == -1) return null;
    let CACHE = []
    for (let i=index;i < pattern.length;i++) {
      CACHE.push(pattern[i])
    }
    return CACHE.join("")
  }
}

let dispatcher = new URLReducer()
export const getMaxSize = (kwargs) => {
  let LRU_CACHE = [];
  let s = dispatcher.fetchReducer(`${kwargs}`)
  if (s ==null) {
    return s;
  }
  for (let i=0;i < s.length;i++) {
    if (s[i] == "&") break;
    LRU_CACHE.push(s[i])
  }
  return LRU_CACHE.join("").replace("id=","")
}