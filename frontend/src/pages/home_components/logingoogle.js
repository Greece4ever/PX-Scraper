import React from 'react';
import GoogleLogin from 'react-google-login';
import jquery from 'jquery';
import {createUser} from "../signin";

const Google = (props) => {

    const googleResponse = (response) => {
        props.useAthenticate(true)
        let email = response.profileObj.email;
        let username = response.profileObj.name.trim().replace(/\s+/,'_')
        let google_id = response.profileObj.googleId
        props.setCredidentials(response.googleId,"id")
        props.setCredidentials(username,'username')
        props.setCredidentials(email,'email')
        createUser('google',google_id,username,email,null).then(response => {
            console.log(response)
            if (response.error) {
                jquery('#password-group').fadeOut('slow');
                jquery('#external').fadeOut('slow');
                props.needUsername('google',username)
                console.log("Username already exists your must make a slight change")
                console.log(`Change your ${username} to something else`)
                props.errorReducer()
                props.useAthenticate(false)

            }
            else {
                // <--------------- TEMP FUNCTION TO BE REMOVED IN PRODUCTION --------------->
                
                //Set the user cookie
                document.cookie = `auth_key=${response.success.token} expires=` + new Date(9999,1,1).toUTCString() + "; path=/";
                document.cookie = `user=${response.success.username} expires=` + new Date(9999,1,1).toUTCString() + "; path=/";
                console.log(response)
                console.log(document.cookie)
                

                //Return redirect
                jquery('#exampleModal').fadeOut('slow');
                jquery('#close').click()
                setTimeout(() => props.handleSuccess(),1500)
                jquery('#success-success').fadeIn("slow");
                console.log(document.cookie)
                console.log("Sucessfully logged in")
                props.useAthenticate(false)

            }
        })
    }

    const handleFailure = () => {
        console.log("User Authentication failed")
    }


    return (
        <div className="google-login" style={{marginLeft: '20px',marginBottom : "20px",float : "left",}}>
            <GoogleLogin 
                clientId={'109107559044-e8l1vf9bjrv8iqa8lrt4tl6n6eiubo19.apps.googleusercontent.com'}
                redirectUri={"http://localhost:8000/accounts/register"}
                buttonText={"Login with Google"}
                onSuccess={googleResponse}
                onFailure={handleFailure}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}


export default Google;