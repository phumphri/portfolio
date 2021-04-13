import os
import xlrd
import requests 
import decimal
import datetime
from flask_moment import Moment
from werkzeug.exceptions import NotFound, InternalServerError, NotImplemented
from waitress import serve
from flask_bootstrap import Bootstrap
from flask_cors import CORS
from flask import (
    Response,
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
import json
import socket
import flask
import logging

# Inport the Monopoly Class
from static.py.Monopoly import Monopoly
  




if False:
    print('Updating libraries.')
    os.system("python -m pip install --upgrade pip")
    os.system("python -m pip install --upgrade flask")
    os.system("python -m pip install --upgrade flask_cors")
    os.system("python -m pip install --upgrade flask_bootstrap")
    os.system("python -m pip install --upgrade flask_moment")
    os.system("python -m pip install --upgrade datetime")
    # os.system("python -m pip install --upgrade logging")
    os.system("python -m pip install --upgrade werkzeug")
    os.system("python -m pip install --upgrade urllib3")
    os.system("python -m pip install --upgrade werkzeug.exceptions")
   
# Assigning the Flask framework.
app = Flask(__name__)
bootstrap = Bootstrap(app)
moment = Moment(app)
CORS(app)

# Change Flask max-age of 12 hours to 0 to prevent caching.
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
           
# Limit logging to errors.
# log = logging.getLogger('werkzeug')
log = logging.getLogger('waitress')
log.setLevel(logging.ERROR)
                                                                                                                                                                                                                                                                                                                                                 
# Definining global variables.
hostname = "localhost"
port = "5000"

# Monopoly Instance
monopoly = None
      
# Index page.
@app.route("/")
def home():
    return render_template("index.html",
                           project_name="Monopoly",
                           current_time=datetime.datetime.utcnow())
                                                                      
# Monopoly
@app.route("/monopoly_games")
def monnopoly():
    return render_template("monopoly_games.html",
                           project_name="Monopoly Games",
                           current_time=datetime.datetime.utcnow())
                                   
# Monopoly Application Program Interface
@app.route("/monopoly_api") 
def monopoly_api():  
                              
    # Instantiate the class in the module.
    global monopoly
    if monopoly == None:
        monopoly = Monopoly.Monopoly()
                 
    # Get the transaction.
    transaction = request.args.get('transaction')

    # Get the response containing status, text, and target object.
    response = monopoly.process_transaction(app, requests, transaction)

    # Return the response containing status, target object, and text.
    return response               
                                                         
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html',
                           project_name="Oops!",
                           message_from_the_application=e,
                           current_time=datetime.datetime.utcnow()), 404


@app.route("/oops")
def simulate_page_not_found():
    message_from_the_application = 'Relax.  This was only a test.'
    raise NotFound(message_from_the_application)


@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html',
                           project_name="Bummer!",
                           message_from_the_application=e,
                           current_time=datetime.datetime.utcnow()), 500

  
@app.route("/bummer")
def simulate_internal_server_error():
    message_from_the_application = 'Relax.  This was only a test.'
    raise InternalServerError(message_from_the_application)

 
@app.errorhandler(501)
def not_implemented(e):
    return render_template('501.html',
                           project_name="Not Implemented",
                           current_time=datetime.datetime.utcnow()), 501


@app.route("/not_implemented")
def raise_not_implemented():
    raise NotImplemented()

# Start waitress server.
if __name__ == "__main__":
    serve(app)
