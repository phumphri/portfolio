class Toptier_Agencies_Data:

    def __init__(self):
        self.results = None

    def get_toptier_agencies_data(self, app, requests, active_fy, active_fq):

        # json is needed for parsing the reponse from the server.
        import json

        # Define an empty response that will contain results and presidental terms.
        response = {}
        response["results"] = []
        response["term"] = {}
        o = []

        if self.results == None:

            # Get the data and return an error message if not successful.
            print("Toptier_Agencies_Data:  Loading data.")
            url = "http://api.usaspending.gov/api/v2/references/toptier_agencies"
            print("Toptier_Agencies_Data:  Loading from " + url)
            web_response = requests.get(url)
            sc = web_response.status_code
            if sc != 200:
                return_dictionary = {"status":"fail"}
                return_dictionary["message_from_the_application"] = "Unsuccessful " + url + ".  " + \
                    "response.status_code: " + str(web_response.status_code) + ", " + \
                    "response.reason: " + web_response.reason + "."
                print("Toptier_SAgencies_Data:  " + return_dictionary["message_from_the_application"])
                return return_dictionary

            # Extract the data list from the json response
            self.results = web_response.json()["results"]
        else:
            print("Toptier_Agencies_Data:  Data already cached.")

        # Process the dictionaries in the data list.
        # Filtering on the parameter values.
        for d in self.results:

            if d["active_fy"] != active_fy:
                continue

            if d["active_fq"] != active_fq:
                continue
                        
            # Append the selected result entry to the response.
            o.append(d)

        # Sort the agencies in ascending order of percentage of budget.
        o = sorted(o,  key = lambda d : d["percentage_of_total_budget_authority"])

        # Poping a list sorted in ascending order returns entries in descending order.
        if len(o) > 5:
            for i in range(5):
                response["results"].append(o.pop())
        else:
            for i in range(len(o)):
                response["results"].append(o.pop())

        # Log the number of hits.
        print("Toptier_Agencies_data:  len(response['results']): " + str(len(response["results"])))

        # Add president and color to the response.
        if active_fy >= "2021":
            response["term"] = {"president":"placeholder", "color":"grey"}
        elif active_fy >= "2017":
            response["term"] = {"president":"Trump", "color":"red"}
        elif active_fy >= "2009":
            response["term"] = {"president":"Obama", "color":"blue"}
        elif active_fy >= "2001":
            response["term"] = {"president":"Bush", "color":"red"}
        elif active_fy >= "1993":
            response["term"] = {"president":"Clinton", "color":"blue"}
        elif active_fy >= "1989":
            response["term"] = {"president":"Bush", "color":"red"}
        elif active_fy >= "1981":
            response["term"] = {"president":"Reagan", "color":"red"}
        elif active_fy >= "1977":
            response["term"] = {"president":"Carter", "color":"blue"}
        elif active_fy >= "1974":
            response["term"] = {"president":"Ford", "color":"red"}
        elif active_fy >= "1969":
            response["term"] = {"president":"Nixon", "color":"red"}
        elif active_fy >= "1963":
            response["term"] = {"president":"Johnson", "color":"blue"}
        elif active_fy >= "1961":
            response["term"] = {"president":"Kenedy", "color":"blue"}
        else:
            response["term"] = {"president":"placeholder", "color":"grey"}

        # Convert python dictionary to a json format.
        response = json.dumps(response)

        # Add status and mime type to the response.
        response = app.response_class(
            response=response, status=200, mimetype='application/json')

        # Return the results dictionary to the calling module.
        return {"status":"Success", "response":response}
