import React from 'react';

const NotFound = (props) => {
    return(
        <div>
            <div style={{"textAlign": "center"}}>
                <i style={{"fontSize": "40px"}} className="fa fa-search-minus" aria-hidden="true"></i>
            </div>
            <p style={{"marginTop" : "10px"}} className="lead text-muted">
                No Folders were found, go create One!
                {props.text}
            </p>
        </div>

    )
}

export default NotFound;
