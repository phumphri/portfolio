class Budget_Function_Total:

    def __init__(self):
        self.response = None

    def get_budget_function_total(self, app, requests):

        # toptier_code:  If the toptier_code is None, return the top ten agencies based on outlay_amount.
        #                Otherwise, return the budget_function for the agency.
        # self:  Reference to the instantiation of this class.
        # app:  Reference to the Flask application used for building a web response.
        # requests:  Web context of the current request.

        if self.response == None:
            # json is needed for parsing the reponse from the server.
            import json

            # Define an empty response that will contain results and presidental terms.
            total_agencies = {
                "name":"Total Agencies", 
                "leaf_level":"Agency",
                "value":0.0, 
                "children":[]}

            # Get the data and return an error message if not successful.
            url = "http://api.usaspending.gov/api/v2/references/toptier_agencies"
            print(" ")
            print("Budget_function:  Loading from " + url)
            print(" ")
            web_response = requests.get(url)
            sc = web_response.status_code
            if sc != 200:
                return_dictionary = {"status":sc}
                return_dictionary["message_from_the_application"] = "Unsuccessful " + url + ".  " + \
                    "response.status_code: " + str(web_response.status_code) + ", " + \
                    "response.reason: " + web_response.reason + "."
                print(" ")
                print("Budget_Function:  " + return_dictionary["message_from_the_application"])
                print(" ")
                return return_dictionary

            # Extract the data list from the json response
            agencies = web_response.json()["results"]

            # Extract the children from the results.
            children = []
            for agency in agencies:
                child = {}
                child["name"] = agency["agency_name"]
                child["toptier_code"] = agency["toptier_code"]
                # Scale to billions of dollars.
                child["value"] = round((agency["outlay_amount"] / 1000000000))
                children.append(child)

            # Sort the agencies in ascending order of outlays.
            children = sorted(children,  key = lambda d : d["value"])

            # Poping a list sorted in ascending order returns entries in descending order.
            if len(children) > 10:
                for i in range(10):
                    total_agencies["children"].append(children.pop())
            else:
                for i in range(len(children)):
                    total_agencies["children"].append(children.pop())

            # Calculate the sum of the children for the parent "Total"
            value = 0.0
            for child in total_agencies["children"]:
                value += child["value"]
            total_agencies["value"] = value

            # Convert python dictionary to a json format.
            total_agencies = json.dumps(total_agencies)

            # Add status and mime type to the response.
            self.response = app.response_class(
                response=total_agencies, status=200, mimetype='application/json')

        else:
            print(" ")
            print("Budget_Function response was cached.")
            print(" ")

        # Return the results dictionary to the calling module.
        return {"status":200, "response":self.response}
