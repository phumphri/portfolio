function build_house_or_hotel(d) {

    // Get the Property key from the Property Button.
    var property_key = d.path[1].id.replace("_icon", "");

    // Create a transaction to get Property information from the server.
    // This is done to verify that the Player clicking on the Property Button owns the Property.
    var transaction = {}
    transaction["code"] = "build_house_or_hotel"
    transaction["property_key"] = property_key
    transaction = JSON.stringify(transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an unique handle for the request.
    if (typeof build_request == "undefined") {
        var build_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener for the request.
    build_request.onreadystatechange = function () {

        // Server is done with the request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response into a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful response.
                if (response.status == "Pass") {

                    // If a house or hotel was built, display (unhide) it.
                    build_house_or_hotel_callback(response)

                } else {
                    console.log("\nError: process_building_and_selling.js: build_house_or_hotel: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: process_building_and_selling.js: build_house_or_hotel: onreadystatechange")
                console.log("this.status", this.status)
                console.log("this.statusText:", this.statusText)
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    build_request.open("GET", url, true)
    build_request.send()
}

function build_house_or_hotel_callback(response) {

    // Update the balance in the response from the server on the Roll Dice Screen.
    var balance_display = response["player"]["key"] + "_column_balance_id"
    d3.select("#" + balance_display).text(response["player"]["balance"].toString())

    // Determine if a house or hotel was built.
    if (response["building_id"] != null) {

        // Unhide the house or hotel that was just built.
        d3.select("#" + response["building_id"]).classed("visible", true)
        d3.select("#" + response["building_id"]).classed("invisible", false)

        log(`Displaying building ${response["building_id"]}.`)

        // Determine if the building being displayed is a hotel.
        if (response["building_id"].includes("hotel") == true) {

            // Extract the identifier for the property from the identifier for the building.
            var property_id = response["building_id"].replace("_hotel", "")

            // Loop through the number of houses.
            var i
            for (i = 1; i < 5; i++) {

                // Format the identifier for the house.
                var house_id = property_id + "_house_" + i.toString()
                log(`Hidding house ${house_id}.`)

                // Hide the house.
                d3.select("#" + house_id).classed("visible", false)
                d3.select("#" + house_id).classed("invisible", true)
            }
        }
    }

    // Display the message describing the results of the build on the Roll Dice Screen.
    add_roll_dice_message(response["text"])
}

function sell_house_or_hotel(d) {

    // Get the Property key from the Property Button.
    var property_key = d.path[1].id.replace("_icon", "");

    // Create a transaction to get Property information from the server.
    // This is done to verify that the Player clicking on the Property Button owns the Property.
    var transaction = {}
    transaction["code"] = "sell_house_or_hotel"
    transaction["property_key"] = property_key
    transaction = JSON.stringify(transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an unique handle for the request.
    if (typeof sell_request == "undefined") {
        var sell_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener for the request.
    sell_request.onreadystatechange = function () {

        // Server is done with the request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response into a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful response.
                if (response.status == "Pass") {

                    // If a house or hotel was built, display (unhide) it.
                    sell_house_or_hotel_callback(response)

                } else {
                    console.log("\nError: process_building_and_selling.js: sell_house_or_hotel: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: process_building_and_selling.js: sell_house_or_hotel: onreadystatechange")
                console.log("this.status", this.status)
                console.log("this.statusText:", this.statusText)
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    sell_request.open("GET", url, true)
    sell_request.send()
}

function sell_house_or_hotel_callback(response) {

    // Update the balance in the response from the server on the Roll Dice Screen.
    var balance_display = response["player"]["key"] + "_column_balance_id"
    d3.select("#" + balance_display).text(response["player"]["balance"].toString())

    // Determine if a house or hotel was built.
    if (response["building_id"] != null) {

        // Unhide the house or hotel that was just built.
        d3.select("#" + response["building_id"]).classed("visible", false)
        d3.select("#" + response["building_id"]).classed("invisible", true)

        log(`Hiding building ${response["building_id"]}.`)
        
        // Determine if the building being displayed is a hotel.
        if (response["building_id"].includes("hotel") == true) {

            // Extract the identifier for the property from the identifier for the building.
            var property_id = response["building_id"].replace("_hotel", "")

            // Loop through the number of houses.
            var i
            for (i = 1; i < 5; i++) {

                // Format the identifier for the house.
                var house_id = property_id + "_house_" + i.toString()

                log(`Displaying house ${house_id}.`)

                // Unhide house.
                d3.select("#" + house_id).classed("visible", true)
                d3.select("#" + house_id).classed("invisible", false)
            }
        }
    }

    // Display the message describing the results of the build on the Roll Dice Screen.
    add_roll_dice_message(response["text"])
}