class Budget_Function:

    def __init__(self):
        self.total_agencies = None
        self.response = None
        self.current_agency_name = "Starting"

    def get_budget_function_status(self, app):

        import json

        # Convert python dictionary to a json format.
        current_agency_name_json = json.dumps(self.current_agency_name)

        # Add status and mime type to the response.
        response = app.response_class(
                response=current_agency_name_json, status=200, mimetype='application/json')

        # Return the results dictionary to the calling module.
        return {"status": 200, "response": response}


    def get_budget_function(self, app, requests):

        if self.total_agencies == None:

            # json is needed for parsing the reponse from the server.
            import json

            # Define an empty response that will contain results and presidental terms.
            self.total_agencies = {
                "name": "Total Agencies",
                "value": 0.0,
                "children": []}

            # Get the data and return an error message if not successful.
            url = "http://api.usaspending.gov/api/v2/references/toptier_agencies"
            print(" ")
            print("Budget_Function:  Loading from " + url)
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
                print("Budget_Function:  " + s)
                print(" ")
                return return_dictionary

            toptier_agencies = web_response.json()["results"]

            i = 0
            for toptier_agency in toptier_agencies:
                self.current_agency_name = toptier_agency["agency_name"]
                agency = {}
                agency["name"] = toptier_agency["agency_name"]
                agency["toptier_code"] = toptier_agency["toptier_code"]

                url = "http://api.usaspending.gov/api/v2/agency/" + \
                    toptier_agency["toptier_code"] + "/budget_function"
                print(" ")
                print("Budget_Function:  Loading from " + url)
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
                    print("Budget_Function:  " + s)
                    print(" ")
                    return return_dictionary

                agency["children"] = web_response.json()["results"]
                self.total_agencies["children"].append(agency)
                i += 1
                if i > 10000:
                    break
            self.current_agency_name = None

            # Aggregate agencies.
            total_agencies_total = 0
            for agency in self.total_agencies["children"]:
                agency_total = 0
                for budget in agency["children"]:
                    agency_total += budget["gross_outlay_amount"]
                    total_agencies_total += budget["gross_outlay_amount"]
                agency["value"] = agency_total
            self.total_agencies["value"] = total_agencies_total


            # Convert python dictionary to a json format.
            total_agencies_json = json.dumps(self.total_agencies)

            # Add status and mime type to the response.
            self.response = app.response_class(
                response=total_agencies_json, status=200, mimetype='application/json')
        else:
            print(" ")
            print("Budget_Function:  Returned cached response.")

        # Return the results dictionary to the calling module.
        return {"status": 200, "response": self.response}

    def get_agency_hierarchy(self, app, requests):

        import json

        if self.total_agencies == None:
            self.get_budget_function(app, requests)


        agency_hierarchy = {}
        agency_hierarchy["name"] = self.total_agencies["name"]
        agency_hierarchy["value"] = round((self.total_agencies["value"]/1000000000), 1)
        agency_hierarchy["children"] = []
        children = []
        for agency in self.total_agencies["children"]:
            try:
                child = {}
                child["name"] = agency["name"]
                child["toptier_code"] = agency["toptier_code"]
                child["value"] = round((agency["value"]/1000000000), 1)
                children.append(child)
            except Exception as err:
                print(" ")
                print("Error Budget_Function@118: " + err)
                print("agency:")
                print(agency)


        # Sort the agencies in ascending order of outlays.
        children = sorted(children,  key = lambda d : d["value"])

        # Poping a list sorted in ascending order returns entries in descending order.
        if len(children) > 10:
            for i in range(10):
                agency_hierarchy["children"].append(children.pop())
        else:
            for i in range(len(children)):
                agency_hierarchy["children"].append(children.pop())

        agency_hierarchy = json.dumps(agency_hierarchy)

        response = app.response_class(response=agency_hierarchy, 
            status=200, mimetype='aplication/json')

        # Return the results dictionary to the calling module.
        return {"status": 200, "response": response}


    def get_budget_hierarchy(self, app, requests, toptier_code):

        import json

        if self.total_agencies == None:
            self.get_budget_function(app, requests)


        budget_hierarchy = {}

        agencies = self.total_agencies["children"]

        agency = None
        for o in agencies:
            if o["toptier_code"] == toptier_code:
                agency = o
                break

        if agency == None:
            return_dictionary = {}
            return_dictionary["status"] = 500
            s = "Error in Budget_Function.get_budget_hierarchy() at line 156.  "
            s += "Parameter value for toptier_code was not found in self.total_agencies['children']"
            return_dictionary["message_from_the_application"] = s
            print(" ")
            print(s)
            print(" ")
            return return_dictionary

        budget_hierarchy["name"] = agency["name"]
        budget_hierarchy["value"] = round((agency["value"]/1000000000), 1)
        budget_hierarchy["toptier_code"] = agency["toptier_code"]
        budget_hierarchy["children"] = []

        children = []
        for budget in agency["children"]:
            child = {}
            child["name"] = budget["name"]
            child["value"] = round((budget["gross_outlay_amount"]/1000000000), 1)
            if child["value"] < 1.0:
                continue
            children.append(child)

        # Sort the agencies in ascending order of outlays.
        children = sorted(children,  key = lambda d : d["value"])

        # Poping a list sorted in ascending order returns entries in descending order.
        if len(children) > 10:
            for i in range(10):
                budget_hierarchy["children"].append(children.pop())
        else:
            for i in range(len(children)):
                budget_hierarchy["children"].append(children.pop())

        budget_hierarchy = json.dumps(budget_hierarchy)

        response = app.response_class(response=budget_hierarchy, 
            status=200, mimetype='aplication/json')

        # Return the results dictionary to the calling module.
        return {"status": 200, "response": response}


    def get_item_hierarchy(self, app, requests, toptier_code, budget_name):

        import json

        if self.total_agencies == None:
            self.get_budget_function(app, requests)

 
        budget_hierarchy = {}

        agencies = self.total_agencies["children"]

        agency = None
        for o in agencies:
            if o["toptier_code"] == toptier_code:
                agency = o
                break
        if agency == None:
            return_dictionary = {}
            return_dictionary["status"] = 500
            s = "Error in Budget_Function.get_item_hierarchy() at line 216.  "
            s += "Parameter value for toptier_code was not found in self.total_agencies['children']"
            return_dictionary["message_from_the_application"] = s
            print(" ")
            print(s)
            print(" ")
            return return_dictionary

        budgets = agency["children"]
        for o in budgets:
            if o["name"] == budget_name:
                budget = o
                break
        if budget == None:
            return_dictionary = {}
            return_dictionary["status"] = 500
            s = "Error in Budget_Function.get_item_hierarchy() at line 232.  "
            s += "Parameter value for budget_name was not found in budget['children']"
            return_dictionary["message_from_the_application"] = s
            print(" ")
            print(s)
            print(" ")
            return return_dictionary

        item_hierarchy = {}
        item_hierarchy["name"] = budget["name"]
        item_hierarchy["agency_name"] = agency["name"]
        item_hierarchy["toptier_code"] = agency["toptier_code"]
        item_hierarchy["value"] = round((budget["gross_outlay_amount"]/1000000000), 1)
        item_hierarchy["children"] = []

        children = []
        for item in budget["children"]:
            child = {}
            child["name"] = item["name"]
            child["value"] = round((item["gross_outlay_amount"]/1000000000), 1)
            if child["value"] < 1.0:
                continue
            children.append(child)

        # Sort the items in ascending order of outlays.
        children = sorted(children,  key = lambda d : d["value"])

        # Poping a list sorted in ascending order returns entries in descending order.
        if len(children) > 10:
            for i in range(10):
                item_hierarchy["children"].append(children.pop())
        else:
            for i in range(len(children)):
                item_hierarchy["children"].append(children.pop())

        item_hierarchy = json.dumps(item_hierarchy)

        response = app.response_class(response=item_hierarchy, 
            status=200, mimetype='aplication/json')

        # Return the results dictionary to the calling module.
        return {"status": 200, "response": response}

