
from bs4 import BeautifulSoup as SOUP
import re
import requests as HTTP

def main(emotion):

	if(emotion == 2):
		urlhere = 'http://www.imdb.com/search/title?genres=drama&title_type=feature&sort=moviemeter, asc'

	# IMDb Url for Musical genre of
	# movie against emotion Disgust
	elif(emotion == 4):
		urlhere = 'http://www.imdb.com/search/title?genres=musical&title_type=feature&sort=moviemeter, asc'

	# IMDb Url for Family genre of
	# movie against emotion Anger
	elif(emotion == 1):
		urlhere = 'http://www.imdb.com/search/title?genres=family&title_type=feature&sort=moviemeter, asc'

	# IMDb Url for Thriller genre of
	# movie against emotion Anticipation
	elif(emotion == 5):
		urlhere = 'https://www.imdb.com/search/title/?genres=happy&title_type=feature&sort=moviemeter, asc'

	# IMDb Url for Sport genre of
	# movie against emotion Fear
	elif(emotion == 3):
		urlhere = 'http://www.imdb.com/search/title?genres=sport&title_type=feature&sort=moviemeter, asc'

	# IMDb Url for Thriller genre of
	# movie against emotion Enjoyment
	elif(emotion == 6):
		urlhere = 'https://www.imdb.com/search/title/?genres=comedy&title_type=feature&sort=moviemeter, asc'



	# HTTP request to get the data of
	# the whole page
	response = HTTP.get(urlhere)
	data = response.text

	# Parsing the data using
	# BeautifulSoup
	soup = SOUP(data, "lxml")

	# Extract movie titles from the
	# data using regex
	title = soup.find_all("a", attrs = {"href" : re.compile(r'\/title\/tt+\d*\/')})
	return title

