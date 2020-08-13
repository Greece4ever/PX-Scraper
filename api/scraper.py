import requests
import cloudscraper
from bs4 import BeautifulSoup
from bs4.dammit import EncodingDetector
import re
from typing import Union
import html
import time


def convertLength(table_row : str,max_length : int) -> str:
    if (len(table_row) > max_length):
        return "".join(table_row[:max_length])
    return table_row


REGEX_PROTOCOL = r"^(\w+):(\/)(\/)"
STATIC_REGEXP = r"(.*)\.\w+$"
NAME_REPLACE_REGEX = r"\.(.*)$"

REGEXP = re.compile(STATIC_REGEXP)
NAME_REGEXP = re.compile(NAME_REPLACE_REGEX)

INTS = [16, 18, 26, 32, 42, 48, ]

scraper = cloudscraper.create_scraper()

def getSitename(url: str) -> list:
    url = url.strip()
    if (not re.compile(REGEX_PROTOCOL).match(url)):
        url = "http://" + url
    else:
        PROTOCOL = re.search(r'\w+:(\/)(\/)', url)[0]

    f = re.sub(REGEX_PROTOCOL, "", url)  # Remove the protocol
    REGEX_CONTENT = r"(\/)(.*)"
    g = re.sub(REGEX_CONTENT, "", f)
    if (not g.startswith("www")):
        g = "www." + g
    gg = PROTOCOL if 'PROTOCOL' in locals() else ""
    return [g.upper(), gg]


def get_client_ip(request) -> str:
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return str(ip)


def modifyIcon(icon_url: str, BASE_DOMAIN: str) -> Union[str, None]:
    print(icon_url)
    print(BASE_DOMAIN)
    if (icon_url is None):
        return None
    if icon_url.startswith("http"):
        return icon_url
    elif (icon_url.startswith("/")):
        return f'{BASE_DOMAIN}{icon_url}'
    else:
        return f'{BASE_DOMAIN}/{icon_url}'


def getFavicon(url: str, soup: BeautifulSoup, site_name: str) -> Union[str, None]:
    status = False
    favicon = soup.find("link", {"rel": "icon"})
    if favicon is None:
        favicon = soup.find("link", {"rel": "shortcut icon"})
        if favicon is None:
            favicon = soup.find("link", {"rel": "apple-touch-icon"})
            if favicon is None:
                favicon = f'{site_name}/favicon.ico'
                test_fav = requests.head(favicon,headers={"Connection" : "close"})
                if (not test_fav.status_code >= 400):
                    status = True
                else:
                    favicon = {'href' : ''}

    print(favicon)
    if not status:
        return modifyIcon(favicon['href'],site_name)
    return modifyIcon(favicon,site_name)


def extractExternalName(URI : str,file_type : str) -> str:
    if (not REGEXP.match(URI)):
        return None
    LAST_INDEX = len(URI) - 1
    index = 0
    for i in reversed(range(0,LAST_INDEX + 1)):
        if URI[i] == '/':
            index = i +1
            break
    CACHE = []
    for i in range(index,LAST_INDEX +1):
        CACHE.append(URI[i])
    f = "".join(CACHE)
    rgxr = NAME_REGEXP.search(f)[0]
    return f.replace(rgxr,f'.{file_type}') if rgxr is not None else f


def scrape(url: str) -> dict:
    """ Scrapes URL and fetches Certain information about the server,
    if the content-type is not text-html it fatches the static file name if it exists,
    (ex : if it was a www.domain.com/static/dog.jpg it would return DOG.JPG)
    and then the request falls back to the base domain, where it looks for an image to display (favicon),
    else if the content-type is text-html if tries to fetch all of the following
    -- TITLE
    -- DESCRIPTION
    -- FAVICON OR DISPLAY IMAGE
    -- KEYWORDS
    -- VIDEO DURATION
    after scraping it returns the data in the form of an object => :

        {
        "url":"http://www.sovmusic.ru/m32/ptrmolo2.mp3",
        "title":"PTRMOLO2.MP3",
        "domain":"WWW.SOVMUSIC.RU",
        "description":"static MPEG at WWW.SOVMUSIC.RU",
        "image":"http://sovmusic.ru/favicon.ico"
        }
        
     """

    SITENAMEFUNC = getSitename(url)

    INFO = {}

    try:
        if ('reddit' in url):
            print("REDDIT IS IN")
            data = scraper.get(url,headers={'Connection': 'close'})
        else:
            data = requests.get(url, headers={'Connection': 'close'},verify=False)
    except Exception as wtf:
        return {"error" : str(wtf)}


    http_encoding = data.encoding if 'charset' in data.headers.get(
        'content-type', '').lower() else None
    html_encoding = EncodingDetector.find_declared_encoding(
        data.content, is_html=True)
    encoding = html_encoding or http_encoding

    headers = data.headers['Content-Type'].split("/")[1].upper()

    if not 'text/html' in data.headers['Content-Type']:
        print('NO TEXT HTML IN CONTENT')
        favicon = f'http://{SITENAMEFUNC[0].lower()}/favicon.ico'.replace("www.", '')
        INFO['url'] = url
        extract_STATIC = extractExternalName(url,data.headers['Content-Type'].split("/")[1].upper())
        INFO['title'] = extract_STATIC.upper() if extract_STATIC is not None else ''
        INFO['domain'] = SITENAMEFUNC[0]
        INFO['description'] = f'static {headers} at {SITENAMEFUNC[0]}'
        INFO['image'] = url if ('image' in data.headers['Content-Type']) else favicon
        if 'image' in data.headers['Content-Type']:
            INFO['image'] = url
        else:
            r = requests.head(favicon)
            print(r.status_code)
            if (not r.status_code >= 400):
                INFO['image'] = favicon
        return INFO

    data = data.content

    soup = BeautifulSoup(data, 'lxml',from_encoding=encoding)

    # Pass in the url
    INFO['url'] = url

    # TITLE
    try:
        TITLE_0 = soup.title.string

        TITLE_1 = soup.find("meta",  property="og:title")
        print(f'\n\n\n {TITLE_1}')

        if (TITLE_1 is not None):
            INFO['title'] = html.unescape(TITLE_1['content'])
        else:
            INFO['title'] = html.unescape(TITLE_0)
    except:
        pass

    # Description
    description = soup.find("meta",  property="og:description")

    if (description is not None):
        INFO['description'] = description['content']
    else:
        description_2 = soup.find("meta", {'name': "description"})
        if (description_2 is not None):
            INFO['description'] = description_2['content']
        else:
            description_3 = soup.find("meta", {'itemprop': "description"})
            if (description_3 is not None):
                INFO['description'] = description_3['content']

    if ('description' in INFO):
        INFO['description'] = html.unescape(INFO['description'].replace("\n", " ").replace("\r", ' '))

    # SITE NAME
    site_name = soup.find("meta",  property="og:site_name")
    if (site_name is not None):
        INFO['site_name'] = site_name['content']

    # Image
    image = soup.find("meta",  property="og:image")
    if (image is not None):
        print("IMAGE IS NOT NONE")
        href = image['content']
        print(href)
        if (not href.lower().startswith("http")):
            if (href.startswith("/")):
                href = SITENAMEFUNC[1] + SITENAMEFUNC[0].lower() + href
            else:
                f = re.compile(r"\w+\.\w+")
                if (f.match(href)):
                    href = SITENAMEFUNC[1] + href
                else:
                    href = SITENAMEFUNC[1] + SITENAMEFUNC[0].lower() + "/" + href

        INFO['image'] = href

    # Keywords (not that commonly used)
    keywords = soup.find('meta', {'name': 'keywords'})
    if (keywords is not None):
        if (',' in keywords['content']):
            INFO['keywords'] = keywords['content'].strip().replace("\r",' ').split(',')
        else:
            INFO['keywords'] = keywords['content']

    # Duration
    duration = soup.find('meta', property='video:duration')
    if (duration is None):
        duration = soup.find('meta', property='og:duration')
        if (duration is None):
            duration = soup.find('meta', {"name": 'duration'})

    if (duration is not None):
        tmp = time.strftime('%H:%M:%S', time.gmtime(int(duration['content'])))
        if tmp.startswith("00:"):
            tmp = time.strftime('%M:%S', time.gmtime(int(duration['content'])))

        INFO['duration'] = tmp


    if not 'image' in INFO:
        fav = getFavicon(url,soup,"http://" + SITENAMEFUNC[0].lower().replace("www.",''))
        if fav is not None:
            INFO['image'] = fav

    INFO['domain'] = SITENAMEFUNC[0]

    return INFO



def isNumber(args):
    try:
        float(args)
        return True
    except:
        return False


if __name__ == "__main__":
    print(convertLength("The Horst Wessel Lied, AKA Die Fahne Hoch, was the official anthem of the National Socialist Party of The German Workers, and was composed, as the name suggests, by Horst Wessel, a member and martyr. After the end of WW2, the German government(s) outlawed the song. Lyrics: Die Fahne hoch! Die Reihen fest geschlossen! SA marschiert Mit mutig festem Schritt Kam’raden, die Rotfront und Reaktion erschossen, Marschier’n im Geist In unser’n Reihen mit! Die Straße frei Den braunen Bataillonen Die Straße frei Dem Sturmabteilungsmann! Es schau’n aufs Hakenkreuz voll Hoffnung schon Millionen Der Tag der Freiheit Und für Brot bricht an Zum letzten Mal Wird Sturmalarm geblasen! Zum Kampfe steh’n Wir alle schon bereit! Schon flattern Hitlerfahnen über allen Straßen Die Knechtschaft dauert Nur noch kurze Zeit! Die Fahne hoch! Die Reihen fest geschlossen! SA marschiert Mit mutig festem Schritt Kam’raden, die Rotfront und Reaktion erschossen, Marschier’n im Geist In unser’n Reihen mit! (Published on Jan 13, 2016)",400))