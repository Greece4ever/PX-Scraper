import React from 'react';
import GitHubLogin from 'react-github-login';
import "./github.css";
import jquery from 'jquery';
import {createUser} from '../signin';



const fetchGit = (code) => {
    return jquery.ajax({
        url : "http://localhost:8000/apiconfig/github/",
        method : "GET",
        data : {
            code : code
        },
        success: (data) => {return data}
    }).catch(e => {return e.message})

}



const Github = (props) => {

    const onSuccess = info => {
        let code = info.code;
        fetchGit(code).then(response => {
            console.log(response)
            createUser('github',response.id,response.login,response.email == '' ? response.email : null,null).then(data => {
                console.log(data)
                if (data.error) {
                    props.setCredidentials(response.id,"id");
                    props.setCredidentials(response.email == '' ? response.email : null,"email");
                    props.setCredidentials(response.username,"username");

                    console.log("Username already exists must choose a new one");
                    props.errorReducer()

                    jquery('#password-group').fadeOut('slow');
                    jquery('#external').fadeOut('slow');
                    props.needUsername('github',response.login);

                }
                else {
                    console.log(data)
                    jquery('#success-success').fadeIn("slow");

                    //Set Login info cookies
                    document.cookie = `auth_key=${data.success.token} expires=` + new Date(9999,1,1).toUTCString() + "; path=/";
                    document.cookie = `user=${data.success.username} expires=` + new Date(9999,1,1).toUTCString() + "; path=/";
                    console.log(document.cookie)

                    //Redirect to main page
                    jquery('#exampleModal').fadeOut('slow');
                    jquery('#close').click()
                    setTimeout(() => props.handleSuccess(),1500)
    
                    console.log("Sucessfull user creation")
                    console.log("You will be redirected soon")
                }

            })
        })
    }    

    return(
        <div onClick={() => document.getElementsByClassName('Github')[0].click()} style={{"float": "right",marginRight : "30px",padding : "8px",cursor : "pointer"}} className="row git">
            <i style={{fontSize : "30px",color : "#fff"}} className="fa fa-github" aria-hidden="true"></i>
            <GitHubLogin
            className="Github"
            clientId="a576f18260d1b1e15b86"
            redirectUri="http://localhost:8000/accounts/register"
            onSuccess={onSuccess}
            onFailure={(error) => console.log(error)}
            buttonText={'Github Login'}
            />
        </div>
    )
}


export default Github;