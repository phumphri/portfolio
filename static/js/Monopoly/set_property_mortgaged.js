function set_property_mortgaged(property_key, property_mortgaged) {

    // Format the transaction for setting the mortgage Boolean for the Property.
    var transaction = {}
    transaction["code"] = "set_property_mortgaged"
    transaction["property_key"] = property_key
    transaction["property_mortgaged"] = property_mortgaged

    // Convert the transaction to a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the url base.
    url = "/monopoly_api?transaction="
    url += transaction;

    // Create an asynchronous request for setting the property.
    if (typeof set_property_mortgaged_request == "undefined") {
        var set_property_mortgaged_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    set_property_mortgaged_request.onreadystatechange = function () {

        // The server is done with this request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response to a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful response.
                if (response.status == "Pass") {

                    // Update the appearance of the Property buttons on the Boards of the other Players.
                    notify_players_of_mortgaged_change(property_key, property_mortgaged)

                    // Extract the Property from the response.
                    var property = response.property

                    // Extract the key of the Property.
                    var key = property.key

                    // Format the identifier of the Property Icon.
                    var property_icon_border_id = key + "_icon_border"

                    // Get the reference to the Property Icon.
                    var property_icon = d3.select("#" + property_icon_border_id)

                    // Extract the class dictionary from the Property Icon.
                    var property_icon_class = JSON.parse(property_icon.attr("class"))

                    // Update the mortgaged attribute of the class dictionary.
                    property_icon_class.mortgaged = property_mortgaged

                    // Update the class attribute of the Property Icon.
                    property_icon.attr("class", JSON.stringify(property_icon_class))

                    var owner_name = format_name_from_key(property_icon_class.owner)

                    if (property_mortgaged) {

                        log(`${owner_name} just mortgaged ${property.name}.`)

                    } else {

                        log(`${owner_name} just unmortgaged ${property.name}.`)
                    }

                } else {

                    console.log("\nError: set_property_mortgaged.js: set_property_mortgage: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: set_property_mortgaged.js: set_property_mortgage: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                 
                console_trace(); set_error_encountered()
            }
        }
    };

    // Send the asynchronous request to the server.
    set_property_mortgaged_request.open("GET", url, true)
    set_property_mortgaged_request.send()
}

function notify_players_of_mortgaged_change(property_key, property_mortgaged) {

    // Update this player's properties on other player boards.
    for (player_keys_index in g.player_keys) {

        // Select the next player to be notified.
        var player_key = g.player_keys[player_keys_index]

        // Create a transaction to update a player's property.
        var transaction = {}
        transaction["code"] = "append_queue"
        transaction["key"] = player_key
        transaction["action"] = "Update Property Mortgaged"

        // Add details to the transaction.
        var details = {}
        details["property_key"] = property_key
        details["property_mortgaged"] = property_mortgaged
        transaction["details"] = details

        // Add the transaction to another player's queue.
        append_queue(transaction)
    }
}
