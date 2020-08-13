import jquery from 'jquery';



export const getAuth = () => {
    let cookies = document.cookie;

    if (cookies.indexOf("auth_key") == -1) return null;
    cookies = cookies.split(";")
    let auth_key;
    cookies.forEach((cookie) => {
        if (cookie.includes("auth_key=")) {
            auth_key = cookie.replace('auth_key=','') .split(" ")[1]
        }
    })
    return auth_key;
}

export const getAuthInfo = (auth_key) => {
    return jquery.ajax({
        url : `http://localhost:8000/apiconfig/create/`,
        method: 'GET',
        headers: {
            Authorization : `Token ${auth_key}`
        },
        success: (data) => {return data}
    }).catch(e => {return e.message})
}