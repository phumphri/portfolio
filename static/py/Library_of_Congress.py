class Library_of_Congress:

    def get_references(self, app, requests, q):

        import json

        # Get the data and return an error message if not successful.
        url = "https://www.loc.gov/search/?q="
        url += q
        url += "&fa=original-format:book|language=english&at=results&fo=json"
        print(" ")
        print("Library_of_Congress:  Loading from " + url)
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

        # Extract from the web response and create a response.
        results = web_response.json()["results"]
        books = []
        for result in results:
            child = {}
            child["id"] = result["id"]
            child["title"] = result["title"]
            books.append(child)

        # Convert python list to a json format.
        books = json.dumps(books)

        # Add status and mime type to the response.
        self.response = app.response_class(
            response=books, status=200, mimetype='application/json')
 
        # Return the results dictionary to the calling module.
        return {"status":200, "response":self.response}

        





        
    