from __future__ import print_function
from flask import Flask, current_app
from flask_cors import CORS
from urllib.parse import quote
import requests
# create flask app
application = Flask(__name__)
# cross domain



CORS(application)
# constants
CLIENT_ID = ""
API_KEY= ""
API_HOST = "https://api.yelp.com"
SEARCH_PATH = "/v3/businesses/search"
DETAIL_PATH = "/v3/businesses/"
SEARCH_LIMIT = 20

headers = {
        'Authorization': 'Bearer %s' % API_KEY,
}

# @application.route('/')
# def hello():
#     return current_app.send_static_file('bussiness.html')

# search, mapping to /search
# https://github.com/Yelp/yelp-fusion/blob/master/fusion/python/sample.py
@application.route('/search/<keyword>/<catagory>/<distance>/<lat>/<lon>')
def do_search(keyword, catagory, distance, lat, lon):
	url_params = {
		'term': keyword.replace(' ', '+'),
		'categorym': catagory.replace(' ', '+'),
        'radius': distance.replace(' ', '+'),
        'latitude': lat.replace(' ', '+'),
        'longitude': lon.replace(' ', '+'),
		'limit': SEARCH_LIMIT
	}
	return sendRequest(API_HOST, SEARCH_PATH, url_params=url_params)

# search details of a tag， mapping to /deatils
@application.route('/details/<id>')
def do_detail_search(id):
    valid_detail = DETAIL_PATH + id
    return sendRequest(API_HOST, valid_detail, API_KEY)



# handle send request
def sendRequest(host, path, url_params=None):
    # following code is cited by yelp-fusion samples
    # https://github.com/Yelp/yelp-fusion/blob/master/fusion/python/sample.py
    url_params = url_params or {}
    encoded_path = quote(path.encode('utf-8'))
    url = '{0}{1}'.format(host, encoded_path)
    print(u'Querying {0} ...'.format(url))
    response = requests.request('GET', url, headers=headers, params=url_params)
    return response.json()

# run the app.
if __name__ == '__main__':
    application.debug = True
    application.run()

