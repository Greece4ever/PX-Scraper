import React, { useEffect,useState } from 'react';
import jquery from 'jquery';
import {fetchFolders} from "../functions";
import NotFound from "./not_found";

//Ajax Call
export const getFolder_num = (token,search) => {
    return jquery.ajax({
        url : "http://localhost:8000/apiconfig/folder/view/",
        type: 'GET',
        headers : {
            Authorization : `Token ${token}`
        },
        data : {
            view_pages : true,
            search : search
        },
        success: (data) => {return data}
    }).catch(e => {return e.message})

}

//Paginator Component
const Paginator = (props) => {

    const [pages,setPages] = useState([]) //visual pagination
    const [num_page,setNum_page] = useState(0)
    const [lastNum,setLastNum] = useState()
    const [low,setLowNum] = useState(0)
    const [found,isFound] = useState("");

    const [currentPage,setcurrentPage] = useState(1)

    //Sets the number of pages according to the search term
    const setMaxPaginators = (search) => {
        //Sets the normal pagination
        getFolder_num(props.Token,search).then(response => {
            let result = Math.ceil(response[0] / 20) //Number of folders
            setNum_page([result,response[0]]) //SETS IT TO THE NUMBER OF FOLDERS [0] - SETS IT TO TOTAL NUMBER OF FOLDERS [1]
            setLastNum(result < 4 ? result : 4);
            setLowNum(1);
            setPages([])
            for (let j=0;j < result;j++) {
                let page;
                if (result > 4 && j==4) {
                    page = [`...${result}`,false]
                    setPages(prev => [...prev,page])
                    break;
                };
                switch (j) {
                    case 0:
                        page = [j+1,true]
                        break;
                    default:
                        page = [j+1,false]
                        break;
                }
                setPages(prev => [...prev,page])
            }       
        })
    }

    //Visual representation of page change
    const PaginationSetter = (num,plain_text) => {

        // 1 2 3 4 ...10
        let PAGE_LIST = [];
        let teleft;
        let mikros;
        console.log(`This is the low ${low}`)
        console.log(`This is the max ${lastNum}`)


        if (lastNum && num==lastNum && lastNum != num_page[0]) {
            let new_values = Number(lastNum)+4;
            console.log(`O TELEFTEOS ARITMOS ${lastNum}`)
            console.log(`NEES TIMES ${new_values}`)
            let target = (new_values > num_page[0]) ? num_page[0] : new_values
            console.log(`O STOXOS ${target}`)

           
            // 4 5 6 7 8 ===== 4   8
            for (let i=num;i <= target;i++) {
                PAGE_LIST.push(i==num ? [i,true] : [i,false])
            };
            setPages(prev => PAGE_LIST);
            setLastNum(target);
            setLowNum(num);
            teleft = target;
            mikros = num;
        }    
        else if (plain_text.includes("...")) {

            console.log("I have three dots")
            // 1234 |.. 4 5 6 7 8  ..|.. 8 9 10 
            if (num == num_page[0]) {
                console.log(" I AM THE LAST ONE")
                let arithmos = 0;
                for (let i=1;i < num_page[0];i++) {
                    if (arithmos >= num_page[0]) {
                        break;
                    }
                    arithmos +=4;
                }


                let diffeq = arithmos-4
                teleft = num_page[0];
                mikros = diffeq;
                for (let i=diffeq;i <=num_page[0];i++) {
                    PAGE_LIST.push(i==num ? [i,true] : [i,false])
                }
                setPages(prev => PAGE_LIST);
                setPages(prev => [[`...${diffeq-1}`,false],...prev])
                setLowNum(diffeq);
                setLastNum(num_page[0])


            }
            else {
                //if it is the previous
                let mkr = low == 4 ? low - 3 : low - 4; //1 4
                let max = low;
                console.log(`AUTOS EINAI O MIKROS ${mkr}`)
                console.log(`AUTOS EINAI O MEGALOS ${max}`)
                for (let $=mkr;$<=max;$++) {
                    PAGE_LIST.push($==num ? [$,true] : [$,false])
                }
                setLowNum(mkr);
                setLastNum(max);
                mikros = mkr;
                teleft = max;
            }
            setPages(PAGE_LIST)

        }
        else {
            console.log("DEFAULT WAS CALLED")
            for (let i=low;i <= lastNum;i++) {
                PAGE_LIST.push(i==num ? [i,true] : [i,false])
            }
            teleft = lastNum;
            mikros = low;
            setPages(PAGE_LIST);
        }
        if (teleft !=num_page[0]) {
            setPages(prev => [...prev,[`...${num_page[0]}`,false]])
        }
        if (mikros != 1) {
            setPages(prev => [[`...${mikros-1}`,false],...prev])
        }
    }
    // props.setFolers('something')

    //Set the initial Pagination
    useEffect(() => {
        setMaxPaginators('')
    },[])

    //Handles clicks made to the pagination numbers
    const handleClick = (event) => {
        let id = event.currentTarget.getAttribute("id").replace("page_", "").replace("...",'').trim();
        let plain_text = event.currentTarget.getAttribute("id").replace("page_", "");
        if (id == currentPage) return null; //if the requested id is the current page
        //VISUAL REPRESENTATION
        PaginationSetter(id,plain_text);
        let index;
        //THIS ALWAYS WORKS <---- DO NOT TOUCH IT ----->

        // YOU GIVE IT A PAGE AND IT FINDS THE INDEX POSITION THAT IT SHOULD SEND TO THE BACK END
        for (let k=0;k <num_page[0];k++) {
            let local_index = (k+1)
            if (local_index==1) {
                index = 0;
            }
            else {
                index += 20;
            }
            if (local_index == Number(id)) {
                setcurrentPage(local_index)
                break;
            }
        }

        //HERE IS THE AJAX CALL (AND THE SETTING OF THE FOLDERS)
        fetchFolders(index,props.Token,props.paginationState).then(data => {
            console.log(data)
            console.log("This is data")
            let tmpFolder = [];
            for (let i=0;i <data.length;i++) {
              tmpFolder.push(
                [{id:data[i].folder_id, name:data[i].name, index:data[i].local_id, description:data[i].description, date:data[i].date_created}]
              )
            }
            props.setFolders(tmpFolder);
        })
    }

    useEffect(() => {
        setMaxPaginators(/\w+/.test(props.paginationState) ? props.paginationState : props.paginationState.trim().replace(/\s+/,''))
        fetchFolders(0,props.Token,/\w+/.test(props.paginationState) ? props.paginationState : props.paginationState.trim().replace(/\s+/,'')).then(data => {
            console.log(data)
            if (data.length === 0) {
                props.setNotFound(true)
                isFound(<NotFound text={props.paginationState} />)
            }
            console.log("This is data")
            let tmpFolder = [];
            for (let i=0;i <data.length;i++) {
              tmpFolder.push(
                [{id:data[i].folder_id, name:data[i].name, index:data[i].local_id, description:data[i].description, date:data[i].date_created}]
              )
            }
            props.setFolders(tmpFolder);
        })
    },[props.paginationState])

    return(
        <div className="navbar navbar-dark bg-dark" style={{"width" : "100%",borderTop: "5px solid rgb(39, 185, 210)",height : "50px"}}>
            <div style={{"float": "left",marginBottom : "30px"}}>
                <b className="text-muted">Folders List</b>
            </div>
            <div style={{float : "right",}}>
                <nav style={{"marginBottom" : "30px"}} aria-label="...">
                    <ul className="pagination pagination-sm">
                        {pages.map(value => (
                            <li className={value[1] ? "page-item active" : "page-item"}><a id={"page_" + value[0]} onClick={(event) =>  handleClick(event)} class="page-link" href="#">{value[0]}</a></li>
                        ))}
                    </ul>                                                                       
                </nav>
            </div>
            <div style={{visibility: "visible","position" : "fixed",left:"45%",transform: "translateX(-20%)",top : "40%"}}>
                {props.notFound ? found : ''}
            </div>

        </div>
    )

}


export default Paginator;