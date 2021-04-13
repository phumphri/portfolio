function add_balance(player, amount) {

    // Construct a get_properties request.
    if (add_balance_request == undefined) {
        var add_balance_request = new XMLHttpRequest()
    }

    // Construct the transaction.
    var transaction = {}
    transaction["code"] = "add_balance"
    transaction["key"] = player.key
    transaction["amount"] = amount

    // Convert the transaction to a JSON string.
    transaction = JSON.stringify(transaction)

    // Create the base url and append the transaction.
    url = "/monopoly_api?transaction="
    url += transaction

    // Construct an asynchronous listener, monitoring the sent request.
    add_balance_request.onreadystatechange = function () {

        // Server is done with the request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the JSON string to a javascript object.
                var response = JSON.parse(this.responseText)

                if (response.status == "Pass") {

                    // Update the local player.
                    player = response.player

                    // Extract balance from the player.
                    var balance = player.balance

                    // Update the displayed balance for the current player.
                    var id = "#" + player.key + "_column_balance_id"
                    d3.select(id).text(balance)

                    // Update the balance for this player in the assets for all players.
                    notify_players_of_balance_change(player, balance)

                } else {

                    console.log("\nError: change_balance.js: add_balance: onreadystatechange")
                    console.log("An unexpected response.status was returned.")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: change_balance.js: add_balance: onreadystatechange")
                console.log("An unexpected this.status was returned.")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    add_balance_request.open("GET", url, true);
    add_balance_request.send();
}

function subtract_balance(player, amount) {

    var transaction = {}
    transaction["code"] = "subtract_balance"
    transaction["key"] = player.key
    transaction["amount"] = amount

    // Convert the transaction dictionary to a JSON string.
    transaction = JSON.stringify(transaction)

    // Create the base url and append the transaction.
    url = "/monopoly_api?transaction="
    url += transaction

    // Construct an asynchronous request.
    if (subtract_balance_request == undefined) {
        var subtract_balance_request = new XMLHttpRequest()
    }

    // Construct an asynchronous listener, monitoring the sent request.
    subtract_balance_request.onreadystatechange = function () {

        // Server is done with the request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the JSON string to a javascript object.
                var response = JSON.parse(this.responseText)

                if (response.status == "Pass") {

                    // Update the local player.
                    player = response.player

                    // Extract balance from the player.
                    var balance = player.balance

                    // Create the identifier for the displayed balance.
                    var id = "#" + player.key + "_column_balance_id"

                    // Update the displayed balance for the current player.
                    d3.select(id).text(balance)

                    // Update the balance for this player in the assets for all players.
                    notify_players_of_balance_change(player, balance)

                } else {
                    console.log("\nError: change_balance.js: subtract_balance: onreadystatechange")
                    console.log("Unexpected response.status was returned.")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console.log("player:", player)
                    console.log("balance:", balance)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: change_balance.js: subtract_balance: onreadystatechange")
                console.log("Unexpected this.status was returned.")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    subtract_balance_request.open("GET", url, true);
    subtract_balance_request.send();
}

function notify_players_of_balance_change(player, balance) {

    // Update this player's balance on all other player boards.
    for (player_keys_index in g.player_keys) {

        // Select the next player to be notified.
        var player_key = g.player_keys[player_keys_index]

        // Create a transaction to move a player's token.
        var transaction = {}
        transaction["code"] = "append_queue"
        transaction["key"] = player_key
        transaction["action"] = "Update Balance"

        // Add details to the transaction.
        var details = {}
        details["target_player_key"] = player.key
        details["balance"] = balance
        transaction["details"] = details

        // Add the transaction to another player's queue.
        append_queue(transaction)
    }
}

function notify_players_of_ownership_change(player, property) {

    // Update this player's properties on other player boards.
    for (player_keys_index in g.player_keys) {

        // Select the next player to be notified.
        var player_key = g.player_keys[player_keys_index]

        // Create a transaction to update a player's property.
        var transaction = {}
        transaction["code"] = "append_queue"
        transaction["key"] = player_key
        transaction["action"] = "Update Property"

        // Add details to the transaction.
        var details = {}
        details["target_player_key"] = player.key
        details["property_key"] = property.key
        transaction["details"] = details

        // Add the transaction to another player's queue.
        append_queue(transaction)

        var player_key_name = format_name_from_key(player_key)

        log(`${player_key_name} was notified that ${player["name"]} now owns ${property["name"]}.`)
    }
}

function notify_players_of_reset() {

    // Move this player's token on all other player boards.
    for (player_keys_index in g.player_keys) {

        // Select the next player to be notified.
        var player_key = g.player_keys[player_keys_index]

        // Bypass the current player.
        if (player_key == player.key) { continue }

        // Create a transaction to move a player's token.
        var transaction = {}
        transaction["code"] = "append_queue"
        transaction["key"] = player_key
        transaction["action"] = "Reset"

        // Add details to the transaction.
        var details = {}
        transaction["details"] = details

        // Add the transaction to another player's queue.
        append_queue(transaction)
    }
}
