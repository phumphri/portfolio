function process_pay_request(player) {

    // Build the server transaction to the Player with the attribute "net_worth".
    var transaction = {}
    transaction["code"] = "get_player_net_worth"
    transaction["key"] = player.key

    // Convert the transaction into a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create the unique request.
    var get_player_net_worth_request = new XMLHttpRequest()

    // Create an asychronous listener to monitor the request.
    get_player_net_worth_request.onreadystatechange = function () {

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

                    // Determine if the Player has sufficient funds to make the payment or go bankrupt (Poorhouse).
                    process_pay_request_callback(player)

                } else {
                    console.log("\nError: process_pay_request.js: process_pay_request: readystatechange")
                    console.log("transaction:", transaction)
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console.log("this.responseText:", this.responseText)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: process_pay_request.js: process_pay_request: readystatechange")
                console.log("transaction:", transaction)
                console.log("this.status:", this.status)
                console.log("this.text:", this.statusText)
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request to the server.
    get_player_net_worth_request.open("GET", url, true)
    get_player_net_worth_request.send()
}

function process_pay_request_callback(player) {

    // Define the container for active buttons.
    var active_buttons = []

    // Determine if the player is in jail.
    if (player["jail"] == true) {

        // See if the Player can pay the fine or be bankrupt (Poorhouse).
        active_buttons = process_pay_request_player_in_jail(player)

        // Determine if the player has been released from jail.
        if (player["jail"] == false) {
            
            // Update jail status of the player.
            set_player_out_of_jail(player)
        }

        // Determine if the net worth of the Player is sufficient to make the payment.
    } else if (g.payment > player.net_worth) {

        // The net worth of the Player is insufficient to make the payment and is bankrupt.
        // Funds and properties transferred by Players.py: Players: set_player_bankrupt.
        // Property and funds updates are submitted to the queues of Other Players.
        process_player_bankruptcy(player)

        // Determine if the Player has sufficient cash to make the payment.
    } else if (g.payment > player.balance) {

        // The Mortgage Event must be started because the Player has insufficient cash but sufficient net worth.
        active_buttons = process_player_with_insufficient_funds(player)

        // The Player has sufficient cash to make the payment.
    } else {

        // The Player makes the payment.
        active_buttons = process_player_with_sufficient_funds(player)
    }

    // Update the buttons on the Roll Dice Screen.
    hide_expose_roll_dice_buttons(active_buttons)

    // After displaying buttons, stop checking the queue and wait for a button to be pressed.
    clearInterval(g.intervals[window.name])
    console.log(`\n${player["name"]} is monitoring the queue.`)
    log(`${player["name"]} is monitoring the queue.`)
}

function process_player_with_sufficient_funds(player) {

    // Define the container for the active buttons.
    var active_buttons = []

    // Subtract the payment from the balance of the payer Player.
    subtract_balance(player, g.payment)

    // Add the payment to the balance of a player (payee).
    // g.payee_key was set by move_piece when called by process_roll_request.
    if (g.payee_key != null) {

        // Add the payment to the payee Player.
        add_player_balance(g.payee_key, g.payment)
    }

    // Determine if the Player had rolled doubles.
    if (player.doubles > 0) {

        // The Player rolled doubles so the "Roll" button is enabled.
        active_buttons = ["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"]

    } else {

        // The Player did not roll doubles, so the "Roll" button is disabled.
        active_buttons = ["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"]
    }

    if (g.payee_key == null) {
        var payee_name = "Bank"
    } else {
        var payee_name = format_name_from_key(g.payee_key)
    }

    // Update the message on the Roll Dice Screen.
    add_roll_dice_message(`Payment of ${g.payment.toString()} was made to ${payee_name}.`)

    // Return the active buttons to be displayed.
    return active_buttons
}

function process_player_with_insufficient_funds(player) {

    // Inform the Player that they have insufficient cash to make the payment on the first message line.
    var message = `You have insufficient funds to make a payment of ${g.payment}.;`

    // Instruct the Player how to generate cash on the second message line.
    message += "Try selling houses, hotels or mortgaging properties."

    // Display the the multiple message ones on the Roll Dice Screen.
    add_roll_dice_message(message)

    // Enable only buttons that will increase cash.
    var active_buttons = ["Mortgage", "Sell", "Pay", "Reset"]

    // Return the active buttons to be displayed.
    return active_buttons
}

function process_pay_request_player_in_jail(player) {

    // Set the fine for being in Jail to 50.  There is no payee.
    g.payment = 50
    g.payee = null

    // Define the container for active buttons.
    var active_buttons = []

    // Determine if the net worth of the Player is sufficient to pay the fine.
    if (g.payment > player.net_worth) {

        // The net worth of the Player is insufficient to pay the fine.
        process_player_bankruptcy(player)

        // The bankrupt Player no longer plays.
        active_buttons = ["Reset"]

        // Determine if the Player has sufficient cash to pay the fine.
    } else if (g.payment > player.balance) {

        // The Player has insufficient cash to pay the fine.  Player must sell or mortgage.
        active_buttons = process_player_with_insufficient_funds(player)

    } else {

        // Pay the fine of 50 to get out of jail.
        subtract_balance(player, 50)

        // Release the player from jail because they rolled doubles.
        player["jail"] = false

        // Configure the piece for the Player.
        g.piece = {}
        g.piece["group_id"] = player.key + "_piece_group_id"
        g.piece["border_id"] = player.key + "_piece_border_id"
        g.piece["text_id"] = player.key + "_piece_text_id"

        // Move the piece for the Player to the lobby of the jail.
        var new_x = g.left_margin
        var new_y = (10 * g.properties.height)
        var translate = "translate(" + new_x + " " + new_y + ")"
        d3.select("#" + g.piece.group_id)
            .transition()
            .delay(0)
            .duration(500)
            .attr("transform", translate)

        // Update the sequence (location) of the Player.
        update_player_sequence(player, 10)

        // Inform the user that their Player is out of jail on the first message line.
        var message = `${player.name} paid 50 to get out of jail.;`

        // Inform the user what actions are available on the second message line.
        message += "Roll dice or take other action."

        // Display the multiple-line message on the Roll Dice Screen.
        add_roll_dice_message(message)

        // Enable the normal buttons including the Roll Button.
        active_buttons = ["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"]
    }

    // Return the active buttons to be displayed.
    return active_buttons
}

function process_player_bankruptcy(player) {

    console.log(`\nBankruptcy proceedings for ${player["name"]}.`)
    log(`Bankruptcy proceedings for ${player["name"]}.`)

    // Globally indicate that the player is bankrupted.
    g.poorhouse[player.key] = true

    // Build the server transaction to bankrupt the Player.
    // All funds and Properties are transferred by the server.
    var transaction = {}
    transaction["code"] = "set_player_bankrupt"
    transaction["key"] = player.key
    transaction["other_player_key"] = g.payee_key

    // Convert the transaction into a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create the unique request.
    var set_player_bankrupt = new XMLHttpRequest()

    // Create an asychronous listener to monitor the request.
    set_player_bankrupt.onreadystatechange = function () {

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

                    process_player_bankruptcy_callback(player)

                } else {

                    console.log("\nError: process_pay_request.js: process_player_bankruptcy: onreadystatechange")
                    console.log("transaction:", transaction)
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console.log("this.responseText:", this.responseText)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: process_pay_request.js: process_player_bankruptcy: onreadystatechange")
                console.log("transaction:", transaction)
                console.log("this.status:", this.status)
                console.log("this.text:", this.statusText)
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request to the server.
    set_player_bankrupt.open("GET", url, true)
    set_player_bankrupt.send()
    
    // Pass control to the next player and start monitoring this player's transaction queue.
    process_end_turn_request(player)
}

function process_player_bankruptcy_callback(player) {

    log(`Moving ${player["name"]} to the poorhouse.`)

    // Move the piece of the player to their cell in jail.
    if (player.key == "car") {
        var new_x = g.left_margin + (1.5 * g.properties.width)
        var new_y = (7.5 * g.properties.height)

    } else if (player.key == "top_hat") {
        var new_x = g.left_margin + (2.5 * g.properties.width)
        var new_y = (7.5 * g.properties.height)

    } else if (player.key == "shoe") {
        var new_x = g.left_margin + (1.5 * g.properties.width)
        var new_y = (8.5 * g.properties.height)

    } else if (player.key == "dog") {
        var new_x = g.left_margin + (2.5 * g.properties.width)
        var new_y = (8.5 * g.properties.height)

    } else {
        console.log("\nError: process_pay_request.js: move_bankrupted_player_to_poorhouse")
        console.log("Unexpected player.key:", player.key)
        console_trace(); set_error_encountered()
    }
    // Move the player's token to the new location.
    var translate = "translate(" + new_x + " " + new_y + ")"

    // Configure the piece for the player.
    g.piece = {}
    g.piece["group_id"] = player.key + "_piece_group_id"
    g.piece["border_id"] = player.key + "_piece_border_id"
    g.piece["text_id"] = player.key + "_piece_text_id"

    d3.select("#" + g.piece.group_id)
        .transition()
        .delay(500)
        .duration(2000)
        .attr("transform", translate)

    // Determine if the Player is bankrupt.
    if (player.key == window.name) {

        // Let the player have the good news.
        add_roll_dice_message(player.name + " is bankrupt.")
        log(`${player.name} is bankrupt.`)

        // Determine the identifier for the Current Roll Dice Property group.
        var current_roll_dice_property_id = "roll_dice_property_id"

        // Remove all the elements within the current cloned group.
        d3.select("#" + current_roll_dice_property_id).selectAll("*").remove()

        // Remove the cloned group.
        d3.select("#" + current_roll_dice_property_id).remove() 

        // Start monitoring the queue.
        g.intervals[window.name] = setInterval(get_queue, g.queue_interval)
        console.log(`${player.name} started monitoring queue.`)
        log(`${player.name} started monitoring queue.`)
    }
}
