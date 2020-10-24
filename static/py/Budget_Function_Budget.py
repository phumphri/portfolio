class Budget_Function_Budget:

    def get_budget_function_budget(self, app, requests, agency_name, toptier_code, budget_name):

        import json

        url = "http://api.usaspending.gov/api/v2/agency/" + toptier_code + "/budget_function"
        print("Budget_function:  Loading from " + url)
        web_response = requests.get(url)
        sc = web_response.status_code
        if sc != 200:
            return_dictionary = {"status":sc}
            return_dictionary["message_from_the_application"] = "Unsuccessful " + url + ".  " + \
                "response.status_code: " + str(web_response.status_code) + ", " + \
                "response.reason: " + web_response.reason + "."
            print("Budget_Function:  " + return_dictionary["message_from_the_application"])
            return return_dictionary

        # Extract the data list from the json response
        agency_budgets = web_response.json()["results"]

        budget = {
            "name":budget_name, 
            "toptier_code":toptier_code, 
            "agency_name":agency_name,
            "leaf_level":"Item",
            "value":0.0, 
            "children":[]}

        # Extract the children from the results.
        children = []
        for agency_budget in agency_budgets:

            if agency_budget["name"] == budget_name:

                agency_budget_children = agency_budget["children"]

                for agency_budget_child in agency_budget_children:
                    child = {}
                    child["name"] = agency_budget_child["name"]
                    child["value"] = round((agency_budget_child["gross_outlay_amount"] / 1000000000))
                    children.append(child)

        # Sort the agencies in ascending order of outlays.
        children = sorted(children,  key = lambda d : d["value"])

        # Poping a list sorted in ascending order returns entries in descending order.
        if len(children) > 10:
            for i in range(10):
                budget["children"].append(children.pop())
        else:
            for i in range(len(children)):
                budget["children"].append(children.pop())

        # Calculate the sum of the children for the parent "Total"
        value = 0.0
        for child in budget["children"]:
            value += child["value"]
        budget["value"] = value


        # Convert python dictionary to a json format.
        budget = json.dumps(budget)

        # Add status and mime type to the response.
        self.response = app.response_class(
            response=budget, status=200, mimetype='application/json')

        # Return the results dictionary to the calling module.
        return {"status":200, "response":self.response}
