function get_queue() {

    // Determine if an error has been encountered.
    if (g.error_encountered == true) { 

        // Stop checking the queue if an error has been encountered.
        clearInterval(g.intervals[window.name])
        console.log("Stopped listening to queue for Player:", window.name)
        console.log("\nError: get_queue.js: get_queue")
        console.log('g.error_encountered was true.  Stopped checking the queue.')
        player_name = self.players.players[window.name]["name"]
        log(`{} stopped monitoring the queue because an error was encountered.`)
        return
    }

    // Create a transaction for getting the transaction queue for a player.
    var transaction = {}
    transaction["code"] = "get_queue"
    transaction["key"] = window.name

    // Convert the object into a JSON String.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create the request.
    if (typeof get_queue_request == "undefined") {
        var get_queue_request = new XMLHttpRequest()
    }

    // Create an asynchronous listenter to monitor the request.
    get_queue_request.onreadystatechange = function () {

        // The server is done with the request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the JSON string into a javascript object.
                var response = JSON.parse(this.responseText)

                // Check for a successful request.
                if (response.status == "Pass") {

                    // Process the response.
                    get_queue_callback(response)

                } else {
                    console.log("\nError: get_queue.js: get_queue: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                     
                    console_trace(); set_error_encountered()
                    g.error_encountered = true
                }

            } else {
                console.log("\nError: get_queue.js: get_queue: onreadystatechange:")
                console.log("this.status", this.status)
                console.log("this.statusText:", this.statusText)
                 
                console_trace(); set_error_encountered()
                g.error_encountered = true
            }
        }
    }

    // Send the request for asynchronous processing.
    get_queue_request.open("GET", url, true)
    get_queue_request.send()

}

function get_queue_callback(response) {

    // The queue for a player is returned in the response.
    var transactions = response.queue

    // Process each transaction in the list of transactions.
    for (transaction_index in transactions) {

        // Extract the action and details from the transaction.
        var transaction = transactions[transaction_index]
        var action = transaction.action
        var details = transaction.details

        // The "Do Nothing" action is returned when the transaction queue is empty.
        if (action == "Do Nothing") {
            continue
        }

        console.log("\n", action, transaction)

        // Determine if an Error Encountered transaction is found.
        if (action == "Error Encountered") {

            // Extract the Boolean state from the details.
            g.error_encountered = details.error_encountered

            // Determine if an error was encountered.
            if (g.error_encountered == true) {

                // Log the transaction.
                console.log("\nError: get_queue.js: get_queue: get_queue_callback")
                console.log(`Action "Error Encountered" was received and was "True".`)
                console.log(`Player "${window.name}" stopped monitoring the queue.`)

                // Stop monitoring the queue.
                clearInterval(g.intervals[window.name])
                console.log("Stopped listening to queue for Player:", window.name)

                // Stop processing transactions.
                break
            }
        }

        // End the game when the "Winner" transaction is encountered.
        if (action == "Winner") {


            // Unhide the Roll Dice Screen
            d3.select("#" + "roll_dice_group_id").classed('visible', true)
            d3.select("#" + "roll_dice_group_id").classed('invisible', false)

            // Inform the Player who won with a message on the Roll Dice Screen.
            add_roll_dice_message(`Player ${details.winner} won.`)

            player_name = format_name_from_key(window.name)

            winning_player_name = format_name_from_key(details.winner)

            log(`${player_name} was notified that player ${details.winner} won.`)

            // We're done.  Hide all buttons.
            active_buttons = []

            // Hide or expose buttons on the Roll Dice Screen.
            hide_expose_roll_dice_buttons(active_buttons)

            // Stop checking the queue.
            clearInterval(g.intervals[window.name])
            player_name = format_name_from_key(window.name)
            console.log(`\n${player_name} stopped monitoring the queue.`)
            log(`${player_name} stopped monitoring the queue.`)

            // Stop processing transactions.
            console.log(`\n${player_name} stopped processing transactions.`)
            log(`${player_name} stopped processing transactions.`)
            break
        }

        // Update the balances from other players.
        if (action == "Update Balance") {
            var id = "#" + details.target_player_key + "_column_balance_id"
            d3.select(id).text(details.balance)
            continue
        }

        // Update the Property Icon Class
        if (action == "Update Property Icon Class"){

            // Extract the Property from the details of the transaction.
            property = JSON.parse(details.property)

            // Format the identifier of the Property Icon.
            var property_icon_border_id = property.key + "_icon_border"
            var property_icon_text_id = property.key + "_icon_name"

            // Get the reference to the Property Icon.
            var property_icon = d3.select("#" + property_icon_border_id)

            // Extract the class dictionary from the Property Icon.
            var property_icon_class = JSON.parse(property_icon.attr("class"))

            var property_icon_class_owner_name = format_name_from_key(property_icon_class["owner"])

            var new_owner_name = format_name_from_key(property["owner"])

            log(`Icon ${property["name"]} had its class owner updated from ${property_icon_class_owner_name} to ${new_owner_name}.`)

            // Update the owner attribute of the class dictionary.
            property_icon_class["owner"] = property["owner"]

            // Update the mortgaged attributed of the class dictionary.
            property_icon_class["mortgaged"] = property["mortgaged"]

            // Update the class attribute of the Property Icon.
            property_icon.attr("class", JSON.stringify(property_icon_class))

            // Get the fill and font colors for the Property Icon depending if it is morgtaged or not.
            var property_colors = get_property_icon_colors(property.key, property.mortgaged)

            // Update the fill and font colors for the Property Icon.
            d3.select("#" + property_icon_border_id).attr("fill", property_colors.fill)
            d3.select("#" + property_icon_text_id).attr("fill", property_colors.font)
            
            continue
        }

        // Update the index for the Community Chest Cards.
        if (action == "Update Community Chest Index") {

            // Match this Player to the Player who just incremented their index into the Community Chest Cards.
            g.community_chest.current_index = details.key
            continue
        }

        // Update the index for the Chance Cards.
        if (action == "Update Chance Index") {

            // Match this Player to the Player who just incremented their index into the Chance Cards.
            g.chance.current_index = details.key
            continue
        }

        // Update the mortgaged Properties from other players.
        if (action == "Update Property Mortgaged") {

            // Format identifiers for the rectangle and text of the Property Icon.
            var property_icon_border_id = details.property_key + "_icon_border"
            var property_icon_text_id_1 = details.property_key + "_icon_name"

            // Extract and copy the key of the Property.
            var property_key = JSON.parse(JSON.stringify(details.property_key))

            // Extract and copy the mortgaged of the Property from the transaction.
            var property_mortgaged = JSON.parse(JSON.stringify(details.property_mortgaged))

            // Get the fill and font colors for the Property Icon depending if it is morgtaged or not.
            var property_colors = get_property_icon_colors(property_key, property_mortgaged)

            // Update the fill and font colors for the Property Icon.
            d3.select("#" + property_icon_border_id).attr("fill", property_colors.fill)
            d3.select("#" + property_icon_text_id_1).attr("fill", property_colors.font)
            continue
        }

        // Update the ownership for other players.
        if (action == "Update Property") {

            // Move the property icon from the Bank to the Player
            var property_icon_id = details.property_key + "_icon"
            var new_x = g.asset_columns[details.target_player_key]
            var new_y = g.rows[details.property_key]
            var translate = "translate(" + new_x + " " + new_y + ")"

            d3.select("#" + property_icon_id)
                .transition()
                .delay(500)
                .duration(1000)
                .attr("transform", translate)

            var property_name = format_name_from_key(details.property_key)
            var target_player_name = format_name_from_key(details.target_player_key)

            log(`${property_name} was moved to the assets for ${target_player_name}.`)

            continue
        }

        // Determine if this is a Move Piece Transaction.
        if (action == "Move Piece") {

            // Move pieces of other players on the Board of this Player.
            move_other_piece(details)
            continue
        }

        // Determine if this is a Trade Transaction.
        if (action == "Trade") {

            console.log("\n**********")
            console.log("Player Trade Details:")
            console.log(details)
            console.log("**********")

            // Construct, update, or remove the Trade Group.
            process_trade_transaction(details)
            continue
        }

        // Determine if this is an Update Mortgaged Transaction.
        if (action == "Update Mortgaged") {

            try {

                property = details.property

                // Format Property Icon Border Identifier.
                var property_icon_border_id = property.key + "_icon_border"
                var property_icon_text_id = property.key + "_icon_name"

                // Get the fill and font colors for the Property Icon depending if it is morgtaged or not.
                var property_colors = get_property_icon_colors(property.key, property.mortgaged)

                // Update the fill and font colors for the Property Icon.
                d3.select("#" + property_icon_border_id).attr("fill", property_colors.fill)
                d3.select("#" + property_icon_text_id).attr("fill", property_colors.font)

            } catch (err) {
                console.log("\nError: get_queue.js: get_queue: get_queue_callback")
                console.log("err.message:", err.message)
                console.log("action:", action)
                console.log("typeof transaction:", typeof transaction)
                console.log("transaction:", transaction)
            }

            continue
        }

        // Unhide newly constructed house or hotel.
        if (action == "Unhide House or Hotel") {

            try {

                // Extract the identifier for the house or the hotel from the details.
                building_id = details.building_id

                // Unhide the house or hotel.
                d3.select("#" + building_id).classed("visible", true)
                d3.select("#" + building_id).classed("invisible", false)

            } catch (err) {

                console.log("\nError: get_queue.js: get_queue: get_queue_callback")
                console.log("err.message:", err.message)
                console.log("action:", action)
                console.log("transaction:", transaction)
            }

            continue
        }

        // Hide house or hotel.
        if (action == "Hide House or Hotel") {

            try {

                // Extract the identifier for the house or the hotel from the details.
                building_id = details.building_id

                // Unhide the house or hotel.
                d3.select("#" + building_id).classed("visible", false)
                d3.select("#" + building_id).classed("invisible", true)

            } catch (err) {

                console.log("\nError: get_queue.js: get_queue: get_queue_callback")
                console.log("err.message:", err.message)
                console.log("action:", action)
                console.log("transaction:", transaction)
            }

            continue
        }
        
        // A player pressed the Reset Button.
        if (action == "Reset") {

            // Display the Select Player Screen.
            process_reset_transaction()

            // Stop this Player from monitoring the queue.
            clearInterval(g.intervals[window.name])
            console.log("Stopped listening to queue for Player:", window.name)

            break
        }

        // A player has started an Auction Event.
        if (action == "Auction") {

            process_auction_transaction(transaction)
            continue
        }

        // Move the piece of the bankrupt Player to the Poorhouse.
        if (action == "Poorhouse") {

            player_key = details.target_player_key

            // Move the piece of the player to their cell in jail.
            if (player_key == "car") {
                g.poorhouse.car = true
                var new_x = g.left_margin + (1.5 * g.properties.width)
                var new_y = (7.5 * g.properties.height)

            } else if (player_key == "top_hat") {
                g.poorhouse.top_hat = true
                var new_x = g.left_margin + (2.5 * g.properties.width)
                var new_y = (7.5 * g.properties.height)

            } else if (player_key == "shoe") {
                g.poorhouse.shoe = true
                var new_x = g.left_margin + (1.5 * g.properties.width)
                var new_y = (8.5 * g.properties.height)

            } else if (player_key == "dog") {
                g.poorhouse.dog = true
                var new_x = g.left_margin + (2.5 * g.properties.width)
                var new_y = (8.5 * g.properties.height)

            } else {
                console.log("\nError: get_queue.js: get_queue: get_queue_callback: 9 Poorhouse")
                console.log("Unexpected details.target_player_key:", player_key)
                 
                console_trace(); set_error_encountered()
                continue
            }
            // Move the player's token to the new location.
            var translate = "translate(" + new_x + " " + new_y + ")"

            // Configure the piece for the player.
            g.piece = {}
            g.piece["group_id"] = player_key + "_piece_group_id"
            g.piece["border_id"] = player_key + "_piece_border_id"
            g.piece["text_id"] = player_key + "_piece_text_id"

            d3.select("#" + g.piece.group_id)
                .transition()
                .delay(500)
                .duration(2000)
                .attr("transform", translate)

            continue
        }

        // Execute a command from another player.
        if (action == "Eval") {

            // Extract the command from the details of the transaction.
            var command = details.command

            try {

                // Execute the command.
                eval(command)

                // Execute all command transactions before 9 Roll Dice.
                continue

            } catch(err) {
                console.log("\nError: get_queue.js: get_queue: get_queue_callback")
                console.log("action:", action)
                console.log("details:", details)
                console.log("err.message:", err.message)
            }
        }

        // Display the buttons and stop checking the queue for this player.
        if (action == "Roll Dice") {

            process_roll_transaction()
            continue
        }

        console.log("\nError: get_queue.js: get_queue: get_queue_callback")
        console.log("Invalid action:", action)
        console.log("transaction:", transaction)
         
        console_trace(); set_error_encountered()
        break
    }
}

function process_roll_transaction() {

    // Unhide the Roll Dice Screen
    d3.select("#" + "roll_dice_group_id").classed('visible', true)
    d3.select("#" + "roll_dice_group_id").classed('invisible', false)

    // Build the server transaction to get the Player.
    var transaction = {}
    transaction["code"] = "get_player_net_worth"
    transaction["key"] = window.name

    // Convert the transaction into a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create the unique request.
    var get_player = new XMLHttpRequest()

    // Create an asychronous listener to monitor the request.
    get_player.onreadystatechange = function () {

        // The server is done with the request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert json response text to a response dictionary.
                response = JSON.parse(this.responseText)

                // Check the status of the response.
                if (response.status == "Pass") {

                    // Extract Player from the response.
                    var player = response.player

                    // Determine if the Player is bankrupt.
                    if (player.bankrupt == true) {

                        // Update the global variable for other functions.
                        g.poorhouse[player.key] = true

                        // Pass control to the next Player who is not bankrupt.
                        process_end_turn_request(player)

                    } else {

                        // Display the appropriate buttons on the Roll Dice Screen and wait for the user to press one.
                        process_roll_transaction_that_is_not_bankrupt(player)
                    }

                } else {
                    console.log("\nError: process_pay_request.js: process_pay_request: readystatechange")
                    console.log("transaction:", transaction)
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console.log("this.responseText:", this.responseText)
                     
                    console_trace(); set_error_encountered()
                    clearInterval(g.intervals[window.name])
                    g.error_encountered = true
                }

            } else {
                console.log("\nError: process_pay_request.js: process_pay_request: readystatechange")
                console.log("transaction:", transaction)
                console.log("this.status:", this.status)
                console.log("this.text:", this.statusText)
                 
                console_trace(); set_error_encountered()
                clearInterval(g.intervals[window.name])
                console.log("Stopped listening to queue for Player:", window.name)

                g.error_encountered = true
            }
        }
    }

    // Send the request to the server.
    get_player.open("GET", url, true)
    get_player.send()

}

function process_roll_transaction_that_is_not_bankrupt(player) {

    // Check if the player is in jail.
    if (player["jail"] == true) {

        log(`${player.name} is in jail.`)

        // Check if the player has a Get Out Of Jail Card.
        if (player.cards > 0) {

            // Player is in jail and has a Get Out Of Jail Card.
            add_roll_dice_message("Pay fine, use card, or roll doubles.")

            // Select buttons to be displayed on the Roll Dice Screen.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Roll", "Pay", "Use Card", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
                return false
            })

        } else {

            // Player is in jail with no Get Out Of Jail Cards
            add_roll_dice_message("Pay fine or roll doubles.")

            // Select buttons to be displayed on the Roll Dice Screen.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Roll", "Pay", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
                return false
            })
        }

    } else {

        // Player is not in jail.
        add_roll_dice_message("Roll dice or select another action.")

        // Select buttons to be displayed on the Roll Dice Screen.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
            return false
        })
    }

    // Hide or expose buttons on the Roll Dice Screen.
    hide_expose_roll_dice_buttons(active_buttons)

    // Indicate that the Player has yet to roll.
    g.has_rolled = false

    // After displaying buttons, stop checking the queue and wait for a button to be pressed.
    clearInterval(g.intervals[window.name])
    console.log("Stopped listening to queue for Player:", window.name)
}


