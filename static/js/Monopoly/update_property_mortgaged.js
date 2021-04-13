function update_property_mortgaged(d, property_mortgaged) {

    // Get the Property key from the Property Button.
    var property_key = d.path[1].id.replace("_icon", "");

    // Create a transaction to get Property information from the server.
    // This is done to verify that the Player clicking on the Property Button owns the Property.
    var transaction = {}
    transaction["code"] = "get_property"
    transaction["key"] = property_key
    transaction["hold"] = false
    transaction = JSON.stringify(transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an unique handle for the request.
    if (typeof get_property_request == "undefined") {
        var get_property_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener for the request.
    get_property_request.onreadystatechange = function () {

        // Server is done with the request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response into a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful response.
                if (response.status == "Pass") {

                    // Extract the property from the response.
                    var property = response.property

                    // Update the mortgaged attribute of the Property.
                    update_property_mortgaged_callback(property, property_mortgaged)

                } else {
                    console.log("\nError: update_property_mortgaged.js: update_property_mortgaged: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: update_property_mortgaged.js: update_property_mortgaged: onreadystatechange")
                console.log("this.status", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    get_property_request.open("GET", url, true)
    get_property_request.send()
}

function update_property_mortgaged_callback(property, property_mortgaged) {

    // Determine if the player owns the property.
    if (property.owner != window.name) {

        // The player cannot mortgage this property.
        return
    }

    // Determine if the player has developed the property.
    if ((property.hotels > 0) || (property.houses > 0)) {

        // The player cannot mortgage developed properties.
        return
    }

    // Format Property Icon Border Identifier.
    var property_icon_border_id = property.key + "_icon_border"
    var property_icon_text_id = property.key + "_icon_name"

    // Get the fill and font colors for the Property Icon depending if it is morgtaged or not.
    var property_key = JSON.parse(JSON.stringify(property.key));
    var property_colors = get_property_icon_colors(property_key, property_mortgaged)

    // Update the fill and font colors for the Property Icon.
    d3.select("#" + property_icon_border_id).attr("fill", property_colors.fill)
    d3.select("#" + property_icon_text_id).attr("fill", property_colors.font)

    // Make a copy of the key of the Property so it persists during the asynchronous process.
    var property_key = JSON.parse(JSON.stringify(property.key));

    // Update the Property and notify all other Players of the change.
    set_property_mortgaged(property_key, property_mortgaged);

    // Make a copy of the roperty so it persists during the asynchronous process.
    var property = JSON.parse(JSON.stringify(property));

    // Make a copy of the mortgaged of the Property so it persists during the asynchronous process.
    var property_mortgaged = JSON.parse(JSON.stringify(property_mortgaged))

    // Update the balance of the Player with the mortgage amount.
    update_player_balance_with_mortgage(property, property_mortgaged)
}

function update_player_balance_with_mortgage(property, property_mortgaged) {

    // Extract and copy key of Player from the owner attribute of the Property.
    // The copy persists the player_key in asynchronous processing.
    var player_key = JSON.parse(JSON.stringify(property.owner))

// Create a transaction to get player information from the server.
    var transaction = {}
    transaction["code"] = "get_player"
    transaction["key"] = player_key

    // Convert the transaction into a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an unique handle for the request.
    if (typeof get_player_request == "undefined") {
        var get_player_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    get_player_request.onreadystatechange = function () {

        // The server is done with the request.
        if (this.readyState == 4) {

            // the request was successful.
            if (this.status == 200) {

                // Convert the JSON string into a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful response.
                if (response.status == "Pass") {

                    // Extract the Player from the response.
                    var player = response.player

                    // Extract the "bankrupt" attribute from the Player.
                    g.poorhouse[player.key] = player.bankrupt

                    // Determine that the Player is not bankrupt.
                    if (g.poorhouse[player.key] == false) {

                        // Determine if this is a mortgaged or unmortgaged property.
                        if (property_mortgaged == "true") {

                            // Add the mortgage value to the balance of the player.
                            add_balance(player, property.mortgage)

                        } else {

                            // Subtract the mortgage varlue plus ten percent from the balance of the Player.
                            subtract_balance(player, (property.mortgage * 1.10))
                        }
                    }

                } else {
                    console.log("\nError: get_queue.js: assign_property_to_highest_bidder: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: get_queue.js: assign_property_to_highest_bidder: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    get_player_request.open("GET", url, true);
    get_player_request.send();
}

function get_property_icon_colors(property_key, property_mortgaged) {

    // Define the dictionary that will contain the font and fill colors for a Property Icon.
    var property_colors = {}

    // The default colors are for a mortgaged Property Icon.
    property_colors["font"] = "White"
    property_colors["fill"] = "Grey"

    // Determine if the Property is mortgaged.
    if ((property_mortgaged == "true") || (property_mortgaged == true)){

        // Return the default colors if the Property is mortgaged.
        return property_colors
    }

    if (["mediterranean_avenue", "baltic_avenue"].includes(property_key)) {
        property_colors.font = "White"
        property_colors.fill = "Brown"
        return property_colors
    }

    if (["oriental_avenue", "vermont_avenue", "connecticut_avenue"].includes(property_key)) {
        property_colors.font = "Black"
        property_colors.fill = "LightBlue"
        return property_colors
    }

    if (["st_charles_place", "states_avenue", "virginia_avenue"].includes(property_key)) {
        property_colors.font = "White"
        property_colors.fill = "Purple"
        return property_colors
    }

    if (["st_james_place", "tennessee_avenue", "new_york_avenue"].includes(property_key)) {
        property_colors.font = "Black"
        property_colors.fill = "Orange"
        return property_colors
    }

    if (["kentucky_avenue", "indiana_avenue", "illinois_avenue"].includes(property_key)) {
        property_colors.font = "Black"
        property_colors.fill = "Red"
        return property_colors
    }

    if (["atlantic_avenue", "ventnor_avenue", "marvin_gardens"].includes(property_key)) {
        property_colors.font = "Black"
        property_colors.fill = "Yellow"
        return property_colors
    }

    if (["pacific_avenue", "north_carolina_avenue", "pennsylvania_avenue"].includes(property_key)) {
        property_colors.font = "White"
        property_colors.fill = "Green"
        return property_colors
    }

    if (["park_place", "boardwalk"].includes(property_key)) {
        property_colors.font = "White"
        property_colors.fill = "DarkBlue"
        return property_colors
    }

    if (["reading_railroad", "pennsylvania_railroad", "b_o_railroad", "short_line_railroad"].includes(property_key)) {
        property_colors.font = "White"
        property_colors.fill = "Black"
        return property_colors
    }

    if (["electric_company", "water_works"].includes(property_key)) {
        property_colors.font = "White"
        property_colors.fill = "DarkSlateGrey"
        return property_colors
    }

    console.log("\n**********")
    console.log("Error: update_property_mortgaged.js: get_property_icon_colors")
    console.log('Invalid parameter "property_key":', property_key)
    console.log("**********")
}
