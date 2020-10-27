class Bureau_of_Economic_Analysis:

    def __init__(self):
        self.response = None

    def get_quarters(self, app, requests):

        from static.py import presidents_and_parties as pap

        if self.response == None:

            print("self.quarters was None.  Downloading data and building a new response.")

            import json

            years = ""
            for year in range(1929, 2021, 1):
                years += str(year)
                years += ","

            # Get the data and return an error message if not successful.
            url = "https://apps.bea.gov/api/data"
            url += "?UserID=D43B6C96-5B54-4B40-BFAA-308776384BC6"
            url += "&method=GetData"
            url += "&DatasetName=NIPA"
            url += "&TableName=T10101"
            url += "&Frequency=Q"
            url += "&Year=" + years
            url += "&ResultFormat=JSON"
            print(" ")
            print("Bureau_of_Economic_Analysis:  Loading from " + url)
            print(" ")
            web_response = requests.get(url)
            sc = web_response.status_code
            if sc != 200:
                return_dictionary = {"status": sc}
                s = "Unsuccessful " + url + ".  "
                s += "Status Code: " + str(web_response.status_code) + ".  "
                s += "Reason: " + web_response.reason + "."
                return_dictionary["message_from_the_application"] = s
                print(" ")
                print("Bureau_of_Economic_Analysis:  " + s)
                print(" ")
                return return_dictionary

            # Extract from the web response and create a response.
            web_response = web_response.json()
            web_response = web_response["BEAAPI"]
            web_response = web_response["Results"]
            data = web_response["Data"]
            quarters = []
            for datum in data:
                # LineNumber 1 is Gross Domestic Product.
                if datum["LineNumber"] == "1":
                    child = {}
                    child["period"] = datum["TimePeriod"]
                    child["value"] = datum["DataValue"]
                    time_period = datum["TimePeriod"]
                    year = int(time_period[0:4])
                    o = pap.get_president_and_party(year)
                    child["president"] = o["president"]
                    child["party"] = o["party"]
                    child["color"] = o["color"]
                    quarters.append(child)

            # Sort the quarters in ascending order of TimePeriod.
            quarters = sorted(quarters, key = lambda d : d["period"])

            # Convert python list to a json format.
            quarters = json.dumps(quarters)

            # Add status and mime type to the response.
            self.response = app.response_class(
                response=quarters, status=200, mimetype='application/json')
 
        # Return the results dictionary to the calling module.
        return {"status":200, "response":self.response}

        





        
    