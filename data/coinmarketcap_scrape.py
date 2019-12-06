import pandas
import json
from bs4 import BeautifulSoup
import requests

url = "https://coinmarketcap.com"
content = requests.get(url).content
soup = BeautifulSoup(content, 'html.parser')
table = soup.find('table', {'class':'table'})

print(table)