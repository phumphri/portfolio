class Toptier_Agencies_Data:

    # def __init__(self):
    #     self.active_fy = "2020"
    #     self.active_fq = "4"
    #     print(" ")
    #     print("Class Toptier_Agencies_Data was instantiated.")
    
    def get_toptier_agencies_data(self, requests, active_fy, active_fq):

        # json is needed for parsing the reponse from the server.
        import json

        # Define an empty response that will contain results and
        # presidental terms.
        response = {}
        response["results"] = []
        response["term"] = {}

        # Get the data and return an error message if not successful.
        url = "http://api.usaspending.gov/api/v2/references/toptier_agencies"
        web_response = requests.get(url)
        sc = web_response.status_code
        if sc != 200:
            return_dictionary = {"status":"fail"}
            return_dictionary["message_from_the_application"] = "Unsuccessful " + url + ".</br>" + \
                "response.status_code: " + web_response.status_code + "</br>" + \
                "response.reason: " + web_response.reason + "</br>"
            return return_dictionary

        # Extract the data list from the json response
        results = web_response.json()["results"]

        # Process the dictionaries in the data list.
        # Filtering on the parameter values.
        for d in results:

            if d["active_fy"] != active_fy:
                continue

            if d["active_fq"] != active_fq:
                continue
                        
            # if d["percentage_of_total_budget_authority"] < percentage_of_total_budget_authority:
                # continue

            # Append the selected result entry to the response.
            response["results"].append(d)

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

        # Return the results dictionary to the calling module.
        return {"status":"Success", "response":response}
