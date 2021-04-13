function clone_and_move_property_icon_to_trade_screen(d) {

    // Convert Property Icon identifier to Property key.
    var property_key = d.path[1].id
    property_key = property_key.replace("_icon", "")

    // Create a transaction to get property information from the server.
    var transaction = {};
    transaction["code"] = "get_property";
    transaction["key"] = property_key
    transaction["hold"] = false;

    // Convert the transaction object to a string.
    transaction = JSON.stringify(transaction);

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction=";
    url += transaction;

    // Create an unique handle for the request.
    if (typeof get_property_request_for_trade == "undefined") {
        var get_property_request_for_trade = new XMLHttpRequest();
    }

    // Create an asynchronous listener for the request.
    get_property_request_for_trade.onreadystatechange = function () {

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

                    // Clone the Property Group as Trade Property and move it to the Trade Screen.
                    process_trade_property(property)

                } else {
                    console.log("\nError: clone_and_move_property_icon_to_trade_screen.js: clone_and_move_property_icon_to_trade_screen: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: clone_and_move_property_icon_to_trade_screen.js: clone_and_move_property_icon_to_trade_screen: onreadystatechange")
                console.log("this.status", this.status);
                console.log("this.statusText:", this.statusText);
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    get_property_request_for_trade.open("GET", url, true);
    get_property_request_for_trade.send();
}

function process_trade_property(property) {

    // Determine if the property is developed.
    if ((property.hotels > 0) || (property.houses > 0)) {

        // Cannot trade a developed property.
        return
    }

    // Format the Property Icon identifier.
    var icon = {}
    icon["id"] = property.key + "_icon"

    // Clone the Property Icon.
    var cloned_icon = d3.select("#" + icon.id).clone(true)

    // Determine if the owner of the Property (Icon) is the Player of the Trade Event.
    if (property.owner == g.trade.player.key) {

        // Determine if Trade Screen Player Property "a" is occupied.
        if (g.trade.screen.player.property.a.occupied == false) {

            // Assign a new identifier to the cloned Property.
            var cloned_icon_id = "trade_player_property_a_button_id"
            cloned_icon.attr("id", cloned_icon_id)

            cloned_icon.on("click", () => {

                // Remove the cloned Property Icon from the Trade Screen.
                cloned_icon.remove()

                // Indicate space is available for Property "a" for the Player on the Trade Screen.
                g.trade.screen.player.property.a.occupied = false

                // Remove the cloned Property "a" of the Player from the Trade Event.
                g.trade.property.player.a = null
            })

            // Determine the coordinates for Trade Screen Player Property "a".
            var new_x = g.trade.screen.x + g.trade.screen.player.property.a.x
            var new_y = g.trade.screen.y + g.trade.screen.player.property.a.y

            // Indicate that the "a" Property of the Player is occupied.
            g.trade.screen.player.property.a.occupied = true

            // Pass the "a" Property of the Player to the next Player.
            g.trade.property.player.a = property

            // Determine if Trade Screen Player Property "b" is occupied.
        } else if (g.trade.screen.player.property.b.occupied == false) {

            // Assign a new identifier to the cloned Property.
            var cloned_icon_id = "trade_player_property_b_button_id"
            cloned_icon.attr("id", cloned_icon_id)

            // Remove the cloned Property from the Trade Screen when clicked.
            cloned_icon.on("click", () => {

                // Remove the cloned Property Icon from the Trade Screen.
                cloned_icon.remove()

                // Indicate space is available for Property "b" for the Player on the Trade Screen.
                g.trade.screen.player.property.b.occupied = false

                // Remove the cloned Property "b" of the Player from the Trade Event.
                g.trade.property.player.b = null
            })

            // Determine the coordinates for Trade Screen Player Property "b".
            var new_x = g.trade.screen.x + g.trade.screen.player.property.b.x
            var new_y = g.trade.screen.y + g.trade.screen.player.property.b.y

            // Indicate that the "b" Property of the Player is occupied.
            g.trade.screen.player.property.b.occupied = true

            // Pass the "b" Property of the Player to the next Player.
            g.trade.property.player.b = property

            // Determine if Trade Screen Player Property "c" is occupied.
        } else if (g.trade.screen.player.property.c.occupied == false) {

            // Assign a new identifier to the clone Property.
            var cloned_icon_id = "trade_player_property_c_button_id"
            cloned_icon.attr("id", cloned_icon_id)

            // Remove the cloned Property from the Trade Screen when clicked.
            cloned_icon.on("click", () => {

                // Remove the cloned Property Icon from the Trade Screen.
                cloned_icon.remove()

                // Indicate space is available for Property "c" for the Player on the Trade Screen.
                g.trade.screen.player.property.c.occupied = false

                // Remove the cloned Property "c" of the Player from the Trade Event.
                g.trade.property.player.c = null
            })

            // Determine the coordinates for Trade Screen Player Property "c".
            var new_x = g.trade.screen.x + g.trade.screen.player.property.c.x
            var new_y = g.trade.screen.y + g.trade.screen.player.property.c.y

            // Indicate that the "c" Property of the Player is occupied.
            g.trade.screen.player.property.c.occupied = true

            // Pass the "c" Property of the Player to next Player
            g.trade.property.player.c = property

            // Determine if the Trade Screen for the Player is full of properties.
        } else {

            // No more locations on the Trade Screen for Player properties.
            return
        }

        // Determine if the user is the Other Player in the Trade Event.
    } else if (property.owner == g.trade.other_player.key) {

        // Determine if Trade Screen Other Player Property "a" is occupied.
        if (g.trade.screen.other_player.property.a.occupied == false) {

            // Assign a new identifier to the cloned Property.
            var cloned_icon_id = "trade_other_player_property_a_button_id"
            cloned_icon.attr("id", cloned_icon_id)

            cloned_icon.on("click", () => {

                // Remove the cloned Property Icon from the Trade Screen.
                cloned_icon.remove()

                // Indicate space is available for Property "a" for the Other Player on the Trade Screen.
                g.trade.screen.other_player.property.a.occupied = false

                // Remove the cloned Property "a" of the Other Player from the Trade Event.
                g.trade.property.other_player.a = null
            })

            // Determine the coordinates for Trade Screen Other Player Property "a".
            var new_x = g.trade.screen.x + g.trade.screen.other_player.property.a.x
            var new_y = g.trade.screen.y + g.trade.screen.other_player.property.a.y

            // Indicate that the "a" Property of the Other Player is occupied.
            g.trade.screen.other_player.property.a.occupied = true

            // Pass the "a" Property of the Other Player to the next Player.
            g.trade.property.other_player.a = property

            // Determine if Trade Screen Other Player Property "b" is occupied.
        } else if (g.trade.screen.other_player.property.b.occupied == false) {

            // Assign a new identifier to the cloned Property.
            var cloned_icon_id = "trade_other_player_property_b_button_id"
            cloned_icon.attr("id", cloned_icon_id)

            cloned_icon.on("click", () => {

                // Remove the cloned Property Icon from the Trade Screen.
                cloned_icon.remove()

                // Indicate space is available for Property "b" for the Other Player on the Trade Screen.
                g.trade.screen.other_player.property.b.occupied = false

                // Remove the cloned Property "b" of the Other Player from the Trade Event.
                g.trade.property.other_player.b = null
            })

            // Determine the coordinates for Trade Screen Other Player Property "b".
            var new_x = g.trade.screen.x + g.trade.screen.other_player.property.b.x
            var new_y = g.trade.screen.y + g.trade.screen.other_player.property.b.y

            // Indicate that the "b" Property of the Other Player is occupied.
            g.trade.screen.other_player.property.b.occupied = true

            // Pass the "b" Property of the Other Player to the next Player.
            g.trade.property.other_player.b = property

            // Determine if Trade Screen Other Player Property "c" is occupied.
        } else if (g.trade.screen.other_player.property.c.occupied == false) {

            // Assign a new identifier to the cloned Property.
            var cloned_icon_id = "trade_other_player_property_c_button_id"
            cloned_icon.attr("id", cloned_icon_id)

            // Remove the cloned Property from the Trade Screen when clicked.
            cloned_icon.on("click", () => {

                // Remove the cloned Property Icon from the Trade Screen.
                cloned_icon.remove()

                // Indicate space is available for Property "c" for the Other Player on the Trade Screen.
                g.trade.screen.other_player.property.c.occupied = false

                // Remove the cloned Property "c" of the Other Player from the Trade Event.
                g.trade.property.other_player.c = null
            })

            // Determine the coordinates for Trade Screen Other Player Property "c".
            var new_x = g.trade.screen.x + g.trade.screen.other_player.property.c.x
            var new_y = g.trade.screen.y + g.trade.screen.other_player.property.c.y

            // Indicate that the "c" Property of the Other Player is occupied.
            g.trade.screen.other_player.property.c.occupied = true

            // Pass the "c" Property of the Other Player to the next Player.
            g.trade.property.other_player.c = property

            // Determine if the Trade Screen for the Other Player is full of properties.
        } else {

            // No more locations on the Trade Screen for Other Player properties.
            return
        }

        // The owner of the property is neither the originating player or the other player.
    } else {

        // Remove the cloned Property Icon from the Trade Screen.
        cloned_icon.remove()

        // This Property does not participate in this Trade Event.
        return
    }

    // Move the Trade Property Card.
    var translate = "translate(" + new_x + " " + new_y + ")"
    d3.select("#" + cloned_icon_id)
        .transition()
        .duration(1000)
        .attr("transform", translate)
}


