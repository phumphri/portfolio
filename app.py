import os
import xlrd
import requests
import decimal
import psycopg2
import datetime
from flask_moment import Moment
from werkzeug.exceptions import NotFound, InternalServerError, NotImplemented
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
if False:
    print('Updating libraries.')
    os.system("python -m pip install --upgrade pip")
    os.system("python -m pip install --upgrade flask")
    os.system("python -m pip install --upgrade flask_cors")
    os.system("python -m pip install --upgrade flask_bootstrap")
    os.system("python -m pip install --upgrade flask_moment")
    os.system("python -m pip install --upgrade datetime")
    os.system("python -m pip install --upgrade werkzeug")
    os.system("python -m pip install --upgrade werkzeug.exceptions")
 
# Assigning the Flask framework.
app = Flask(__name__)
CORS(app)
                                                                                                                                                                                                                                              
# Definining global variables.
historical_debt_outstanding_annual = None
historical_debt_outstanding_annual_years = None   
hostname = "localhost"
port = "5000"
budget_data = None
  
# Index page.
@app.route("/")
def home():
    return render_template("index.html",
                           project_name="Portfolio",
                           current_time=datetime.datetime.utcnow())
    
# Do not delete!
# This is an example of view function using a class to query data.
@app.route("/toptier_agencies_data", methods=['GET'])
def toptier_agencies_data():

    # Get the active fiscal year and quarter from parameter values.
    active_fy = request.args.get('active_fy')
    active_fq = request.args.get('active_fq')

    # The Toptier_Agencies_Data "module" is in subdirectory "py"
    # under subdirectory "static".
    from static.py import Toptier_Agencies_Data

    # Instantiate the "class" in the "module" as "o"
    o = Toptier_Agencies_Data.Toptier_Agencies_Data()

    # The "requests" is needed to make HTTP calls during the session.
    return_dictionary = o.get_toptier_agencies_data(requests, active_fy, active_fq)

    # Return the custom 500 page if the query fails.
    if return_dictionary["status"] == "fail":
        message_from_the_application = return_dictionary["message_from_the_application"]
        print(message_from_the_application)
        raise InternalServerError(message_from_the_application)

    # Get the embedded python dictionary that will be used in the response.
    response = return_dictionary["response"]

    # Convert python dictionary to a json format.
    response = json.dumps(response)

    # Add status and mime type to the response.
    response = app.response_class(
        response=response, status=200, mimetype='application/json')

    # Return the json package to the calling application.
    return response
                                                                                   
# Mortgage Tutorial
@app.route("/examples_01.01.loancalc.html")
def mortgage():
    return render_template("examples_01.01.loancalc.html")

# Mortgage Tutorial

 
@app.route("/mortgage_with_flask_bootstrap")
def mortgage_boostrap():
    return render_template("mortgage_with_flask_bootstrap.html",
                           project_name="Tutorial",
                           current_time=datetime.datetime.utcnow())

# Mortgage Tutorial
       

@app.route("/mortgage_with_d3")
def mortgage_d3():

    return render_template("read_json.html",
                           project_name="Tutorial",
                           current_time=datetime.datetime.utcnow())

    # return render_template("mortgage_with_d3.html",
    #     project_name="Tutorial",
    #     current_time=datetime.datetime.utcnow())

# Mortgage
                                                        
            
@app.route("/mortgage")
def mortgage_function():
    # Instantiate Mortgage module.
    import Mortgage
    import json
    mortgage_json = {"interest": [], "principal": [], "balance": []}
    mortgage = Mortgage.Mortgage()
    mortgage_dictionary = mortgage.calculate_mortgage()
    for i in range(len(mortgage_dictionary["balance"])):
        interest_payment = str(mortgage_dictionary["interest"][i])
        principal_payment = str(mortgage_dictionary["principal"][i])
        balance = str(mortgage_dictionary["balance"][i])

        mortgage_json["interest"].append(interest_payment)
        mortgage_json["principal"].append(principal_payment)
        mortgage_json["balance"].append(balance)

    return jsonify(mortgage_json)


# D3 Tutorial
@app.route("/d3_tutorial")
def d3_tutorial():
    return render_template("d3_tutorial.html",
                           project_name="D3 Tutorial",
                           current_time=datetime.datetime.utcnow())

# Sandbox for D3
 
                                                                                       
@app.route("/electoral_college") 
def sandbox():
    return render_template("electoral_college.html",
                           project_name="Electoral College",
                           current_time=datetime.datetime.utcnow())
 
  
@app.route("/sandbox_sales/<year>")
def sandbox_sales(year):

    print('Year:', year)

    conn = None
    try:
        conn = psycopg2.connect(
            'postgresql://postgres:welcome@localhost:5432/postgres')
        print('Connection okay.')
    except Exception as e:
        print('Connection failed:', e)
        message_from_the_application = 'Exception thrown during database connection.  Check log.'
        raise InternalServerError(message_from_the_application)

    if conn == None:
        print("psycopg2.connect returned None.")
        message_from_the_application = 'psycopg2.connect returned None.'
        raise InternalServerError(message_from_the_application)

    try:
        cur = conn.cursor()
        print('Cursor okay.')

        sql = "select "
        sql += "sales_date, "
        sql += "sales_volume "
        sql += "from public.udemy_sales "
        sql += "where extract(year from sales_date) = " + year
        sql += "order by sales_date"

        cur.execute(sql)
        print('Execute Okay.')

        table_data = cur.fetchall()
        print("Fetch All Okay")

        value_list = []

        previous_balance = decimal.Decimal(0.00)
        current_amount = decimal.Decimal(0.00)
        current_balance = decimal.Decimal(0.00)

        for table_entry_list in table_data:

            # Calculate Balance.
            current_amount = table_entry_list[1]
            current_balance = previous_balance + current_amount
            previous_balance = current_balance

            table_entry_json = {}
            table_entry_json["sales_date"] = str(table_entry_list[0])
            table_entry_json["sales_volume"] = str(table_entry_list[1])
            value_list.append(table_entry_json)

        # Create json dictionary to hold metadata and table data.
        json_dict = {}

        # Add table_data to json dictionary.
        json_dict["udemy_volume"] = value_list

        cur = conn.cursor()
        print('Cursor okay.')

        sql = "select "
        sql += "distinct extract(year from sales_date) "
        sql += "from public.udemy_sales "
        sql += "order by 1"

        cur.execute(sql)
        print('Execute Okay.')

        table_data = cur.fetchall()
        print("Fetch All Okay")

        date_list = []

        for table_entry_list in table_data:

            date_list.append(int(table_entry_list[0]))

        # Add table_data to json dictionary.
        json_dict["udemy_year"] = date_list

        json_object = jsonify(json_dict)
        print("jsonify Okay")

        response = json_object
        print("response Okay")
        response.headers['Content-Type'] = "application/json"
        print("Headers Okay")

        print("Returning response.")
        return response

    except Exception as e:
        print('Execute Failed', str(e))
        message_from_the_application = 'Exception thrown during database execution.  Check log.'
        raise InternalServerError(message_from_the_application)

    finally:
        if conn is not None:
            conn.close

    
@app.route("/udemy_years")
def udemy_years():

    conn = None

    try:
        conn = psycopg2.connect(
            'postgresql://postgres:welcome@localhost:5432/postgres')
        print('Connection okay.')
    except Exception as e:
        print('Connection failed:', e)
        message_from_the_application = 'Exception thrown during database connection.  Check log.'
        raise InternalServerError(message_from_the_application)

    if conn == None:
        print("psycopg2.connect returned None.")
        message_from_the_application = 'psycopg2.connect returned None.'
        raise InternalServerError(message_from_the_application)

    sql = "select "
    sql += "distinct extract(year from sales_date)"
    sql += "from public.udemy_sales "
    sql += "order by 1"
    print("sql: ", sql)

    try:
        cur = conn.cursor()
        print('Cursor okay.')

        cur.execute(sql)
        print('Execute Okay.')

        table_data = cur.fetchall()
        print("Fetch All Okay")

        years = []

        for table_entry_list in table_data:

            years.append(int(table_entry_list[0]))

        json_object = jsonify(years)
        print("jsonify Okay")

        response = json_object
        print("response Okay")
        response.headers['Content-Type'] = "application/json"
        print("Headers Okay")

        print("Returning response.")
        return response

    except Exception as e:
        print('Execute Failed', str(e))
        message_from_the_application = 'Exception thrown during database execution.  Check log.'
        raise InternalServerError(message_from_the_application)

    finally:
        if conn is not None:
            conn.close

# Historical Debt Outstanding Annual View Function.
@app.route("/historical_debt_outstanding_annual")
def historical_debt_outstanding_annual():
    return render_template("historical_debt_outstanding_annual.html",
                           project_name="Historical Debt Outstanding Annual(Loading Data)",
                           current_time=datetime.datetime.utcnow(),
                           hostname=hostname,
                           port=port)

@app.route("/historical_debt_outstanding_annual_data", methods=['GET'])
def historical_debt_outstanding_annual_data():
    begin_year = request.args.get('begin_year')
    end_year = request.args.get('end_year')

    # Define an empty response.
    response = {}
    response["years"] = []
    response["data"] = {}
    response["scale"] = {}
    response["scale"]["min_value"] = 999999999999
    response["scale"]["max_value"] = -999999999999
    response["scale"]["divisor"] = 1
    response["scale"]["text"] = "placeholder"

  

    base_url = "https://www.transparency.treasury.gov"
    endpoint = "/services/api/fiscal_service/v1/accounting/od/debt_outstanding"
    fields = "?fields=reporting_calendar_year,debt_outstanding_amt"
    sort = "&sort=reporting_calendar_year"
    page = "&page[size]=300"
    url = base_url + endpoint + fields + sort + page
    web_response = requests.get(url)
    sc = web_response.status_code
    if sc != 200:
        message_from_the_application = "Unsuccessful " + url + ".</br>" + \
            "response.status_code: " + response.status_code + "</br>" + \
            "response.reason: " + response.reason + "</br>"
        print(message_from_the_application)
        raise InternalServerError(message_from_the_application)

    # Extract the data list from the json response
    data = web_response.json()["data"]

    # Process the dictionaries in the data list.
    for d in data:

        # Extract the year from the entry in the data array.
        year = int(d["reporting_calendar_year"])

        # Add the year to the array of years.
        response["years"].append(year)

        # Filter on year parameters.
        if year < int(begin_year) or year > int(end_year):
            continue

        # Convert debt_outstanding_amt string to float.
        debt_outstanding_amt = float(d["debt_outstanding_amt"])

        # Update the minimum value.
        if debt_outstanding_amt < response["scale"]["min_value"]:
            response["scale"]["min_value"] = debt_outstanding_amt

        # Update the maximum value.
        if debt_outstanding_amt > response["scale"]["max_value"]:
            response["scale"]["max_value"] = debt_outstanding_amt

        # Add a year to the response.
        response["data"][year] = {}

        # Get a shorthand reference to the response-data-year.
        d = response["data"][year]

        # Add receipts less outlays to the response.
        d["value"] = debt_outstanding_amt

        # Add president and color to the response.
        if year >= 2021:
            d["president"] = "placeholder"
            d["color"] = "grey"
        elif year >= 2017:
            d["president"] = "Trump"
            d["color"] = "red"
        elif year >= 2009:
            d["president"] = "Obama"
            d["color"] = "blue"
        elif year >= 2001:
            d["president"] = "Bush"
            d["color"] = "red"
        elif year >= 1993:
            d["president"] = "Clinton"
            d["color"] = "blue"
        elif year >= 1989:
            d["president"] = "Bush"
            d["color"] = "red"
        elif year >= 1981:
            d["president"] = "Reagan"
            d["color"] = "red"
        elif year >= 1977:
            d["president"] = "Carter"
            d["color"] = "blue"
        elif year >= 1974:
            d["president"] = "Ford"
            d["color"] = "red"
        elif year >= 1969:
            d["president"] = "Nixon"
            d["color"] = "red"
        elif year >= 1963:
            d["president"] = "Johnson"
            d["color"] = "blue"
        elif year >= 1961:
            d["president"] = "Kennedy"
            d["color"] = "blue"
        else:
            d["president"] = "Placeholder"
            d["color"] = "grey"
                                   
    # Calculate scale.
    x = abs(response["scale"]["max_value"])
    y = abs(response["scale"]["min_value"])
    if x > y:
        z = x
    else:
        z = y
    if z > 999999999999:
        response["scale"]["divisor"] = 1000000000000
        response["scale"]["text"] = "Trillions of Dollars"
    elif z > 999999999:
        response["scale"]["divisor"] = 1000000000
        response["scale"]["text"] = "Billions of Dollars"
    elif z > 999999:
        response["scale"]["divisor"] = 1000000
        response["scale"]["text"] = "Millions of Dollars"
    elif z > 999:
        response["scale"]["divisor"] = 1000
        response["scale"]["text"] = "Thousands of Dollars"
    else:
        response["scale"]["divisor"] = 1
        response["scale"]["text"] = "Dollars"

    # Convert python dictionary to a json format.
    response = json.dumps(response)

    # Add status and mime type to the response.
    response = app.response_class(
        response=response, status=200, mimetype='application/json')

    return response

      
      

@app.route("/receipts_less_outlays")
def render_receipts_less_outlays():

    return render_template("historical_receipts_less_outlays.html",
                           project_name="Historical Receipts less Outlays (Loading Data)",
                           current_time=datetime.datetime.utcnow())

#   outlays: https://www.whitehouse.gov/wp-content/uploads/2020/02/outlays_fy21.xlsx
#   receipts: https://www.whitehouse.gov/wp-content/uploads/2020/02/receipts_fy21.xlsx
# Reading data from a spread sheet from a website.
 

@app.route("/receipts_less_outlays_data", methods=['GET'])
def get_receipts_less_outlays_data_from_website():
    begin_year = request.args.get('begin_year')
    end_year = request.args.get('end_year')
   
    # Define an empty response.
    response = {}
    response["years"] = []
    response["data"] = {}
    response["scale"] = {}
    response["scale"]["min_value"] = 999999999999
    response["scale"]["max_value"] = -999999999999
    response["scale"]["divisor"] = 1
    response["scale"]["text"] = "placeholder"

    # Define the budget data to be available between calls.
    global budget_data 
  
    # If budget_data already exists, bypass the query.
    if budget_data == None:
 
        # Initialize budget data.
        budget_data = {}
 
        # Load budget data with receipts.
        url = "https://www.whitehouse.gov/wp-content/uploads/2020/02/receipts_fy21.xlsx"
        xlsx = requests.get(url)
        if xlsx is None:
            message_from_the_application = 'Request failed for: ' + url
            print(message_from_the_application)
            raise InternalServerError(message_from_the_application)
        else:
            workbook = xlrd.open_workbook(file_contents=xlsx.content)
            worksheet = workbook.sheet_by_index(0)
            first_row = worksheet.row(0)
            num_rows = worksheet.nrows
            col = 0
            for cell in first_row:
                if cell.ctype == 2:
                    year = int(cell.value)
                    year_total = 0.0
                    for row in range(1, num_rows):
                        if worksheet.cell_value(row, col) > 0:
                            year_total += worksheet.cell_value(row, col)
                    budget_data[year] = {"data": year_total}
                col += 1

    # Subtract outlays from receipts.
        url = "https://www.whitehouse.gov/wp-content/uploads/2020/02/outlays_fy21.xlsx"
        xlsx = requests.get(url)
        if response is None:
            message_from_the_application = 'Request failed for: ' + url
            print(message_from_the_application)
            raise InternalServerError(message_from_the_application)
        else:
            workbook = xlrd.open_workbook(file_contents=xlsx.content)
            worksheet = workbook.sheet_by_index(0)
            first_row = worksheet.row(0)
            num_rows = worksheet.nrows
            col = 0
            for cell in first_row:
                if cell.ctype == 2:
                    year = int(cell.value)
                    year_outlays = 0
                    for row in range(1, num_rows):
                        if worksheet.cell_value(row, col) > 0:
                            year_outlays += worksheet.cell_value(row, col)
                    budget_data[year]["data"] = int(
                        budget_data[year]["data"] - year_outlays)
                col += 1

    # Populate years of the response from budget data years.
    response["years"] = list(budget_data.keys())

    # Populate the response data values from the budget data.
    # Determine the maximum and minimum values.
    for year in budget_data:

        # Filter on year parameters.
        if year < int(begin_year) or year > int(end_year):
            continue

        receipts_less_outlays = budget_data[year]["data"]

        # Update the minimum value.
        if receipts_less_outlays < response["scale"]["min_value"]:
            response["scale"]["min_value"] = receipts_less_outlays

        # Update the maximum value.
        if receipts_less_outlays > response["scale"]["max_value"]:
            response["scale"]["max_value"] = receipts_less_outlays

        # Add a year to the response.
        response["data"][year] = {}

        # Get a shorthand reference to the response-data-year.
        d = response["data"][year]

        # Add receipts less outlays to the response.
        d["value"] = receipts_less_outlays

        # Add president and color to the response.
        if year >= 2021:
            d["president"] = "placeholder"
            d["color"] = "grey"
        elif year >= 2017:
            d["president"] = "Trump"
            d["color"] = "red"
        elif year >= 2009:
            d["president"] = "Obama"
            d["color"] = "blue"
        elif year >= 2001:
            d["president"] = "Bush"
            d["color"] = "red"
        elif year >= 1993:
            d["president"] = "Clinton"
            d["color"] = "blue"
        elif year >= 1989:
            d["president"] = "Bush"
            d["color"] = "red"
        elif year >= 1981:
            d["president"] = "Reagan"
            d["color"] = "red"
        elif year >= 1977:
            d["president"] = "Carter"
            d["color"] = "blue"
        elif year >= 1974:
            d["president"] = "Ford"
            d["color"] = "red"
        elif year >= 1969:
            d["president"] = "Nixon"
            d["color"] = "red"
        elif year >= 1963:
            d["president"] = "Johnson"
            d["color"] = "blue"
        elif year >= 1961:
            d["president"] = "Kennedy"
            d["color"] = "blue"
        else:
            d["president"] = "Placeholder"
            d["color"] = "grey"
                                   
    # Calculate scale.
    x = abs(response["scale"]["max_value"])
    y = abs(response["scale"]["min_value"])
    if x > y:
        z = x
    else:
        z = y
    if y > 999999999:
        response["scale"]["divisor"] = 1000000000
        response["scale"]["text"] = "Trillions of Dollars"
    elif y > 999999:
        response["scale"]["divisor"] = 1000000
        response["scale"]["text"] = "Billions of Dollars"
    elif y > 999:
        response["scale"]["divisor"] = 1000
        response["scale"]["text"] = "Millions of Dollars"
    else:
        response["scale"]["divisor"] = 1
        response["scale"]["text"] = "Thousands of Dollars"

    # Convert python dictionary to a json format.
    response = json.dumps(response)

    # Add status and mime type to the response.
    response = app.response_class(
        response=response, status=200, mimetype='application/json')

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

    
# Determine if running on home workstation, laptop, or from a deployment server.
if __name__ == "__main__":

    hostname = socket.gethostname()
    print("socket.hostname():", hostname)

    bootstrap = Bootstrap(app)
    moment = Moment(app)

    if (hostname == 'XPS'):
        # app.run(debug=False, host='localhost', port=5000)
        app.run(debug=False, use_reloader=True)
    elif (hostname == 'DESKTOP-S08TN4O'):
        app.run(debug=False, use_reloader=True)
    else:
        print(" ")
        print("Heroku:")
        print("port", os.environ.get("PORT", "Not Found"))
        print("hostname:", hostname)
        app.run(debug=False, host='0.0.0.0',
                port=int(os.environ.get("PORT", 5000)))
