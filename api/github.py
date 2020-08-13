import requests
import json


def getGithub(code):
    """Does all the stupid things github has forced developers to do in order,
        to fetch github user data
    """

    response = requests.post('https://github.com/login/oauth/access_token',{
        "client_id" : 'a576f18260d1b1e15b86',
        "client_secret" : 'a0241c231a8c0c7b85d5921a6d6d8bc5366e442a',
        "code" : f"{code}",
    }).text
    print(response)
    try:
        INDEX = response.index('&')
    except ValueError:
        return None

    new = response[:INDEX]
    token = new[13:]

    #Fetch the github API
    r = requests.get('https://api.github.com/user',headers={'Authorization' : f'token {token}'})
    f = json.loads(r.text)
    return f

