function process_chance_event(player) {

    // console.log("\nfunction process_chance_event(player)", player)

    // Define the buttons to be displayed on the Roll Dice Screen.
    var active_buttons = []

    if (typeof g.chance == "undefined") {
        console.log("\nError: process_chance_event.js: process_chance_event")
        console.log('Global variable "g.chance" was undefined.')
        console_trace(); set_error_encountered()
    }

    // Increment the index of the Chance Cards.
    g.chance.current_index += 1
    if (g.chance.current_index > g.chance.maximum_index) {
        g.chance.current_index = 0
    }

    // Get the key of the Card.
    var key = g.chance.keys[g.chance.current_index]

    if (typeof key == "undefined") {
        console.log("\nError: process_chance_event.js: process_chance_event")
        console.log('Local variable "key" was undefined.')
        console.log("g.chance:", g.chance)
        console_trace(); set_error_encountered()
    }

    // Get the Card from the Community Chest.
    var card = g.chance.cards[key]

    if (typeof card == "undefined") {
        console.log("\nError: process_chance_event.js: process_chance_event")
        console.log('Local variable "card" was undefined.')
        console.log("g.chance:", g.chance)
        console.log("key:", key)
        console_trace(); set_error_encountered()
    }

    // Define a multiple-line message to be displayed on the Roll Dice Screen.
    var message = card.replace('. ', '.;')
    message = message.replace('. ', '.;')
    message = message.replace('. ', '.;')
    message = message.replace('. ', '.;')

    // Display the message on the Roll Dice Screen.
    add_roll_dice_message(message)
    log(`${player.name} Chance Card: ${message}`)

    // Split the message into four lines or less.
    var chance_lines = message.split(";", 4)

    // If there is at least one message, assign the first message to the first line of the Chance Card.
    if (chance_lines.length > 0) {
        d3.selectAll("#chance_line_1").text(chance_lines[0])
    } else {
        d3.selectAll("#chance_line_1").text(" ")
    }

    // If there is at least two messages, assign the second message to the second line of the Chance Card.
    if (chance_lines.length > 1) {
        d3.selectAll("#chance_line_2").text(chance_lines[1])
    } else {
        d3.selectAll("#chance_line_2").text(" ")
    }

    // If there is at least three messages, assign the third message to the third line of the Chance Card.
    if (chance_lines.length > 2) {
        d3.selectAll("#chance_line_3").text(chance_lines[2])
    } else {
        d3.selectAll("#chance_line_3").text(" ")
    }

    // If there are four messages, assign the fourth message to the fourth line of the Chance Card.
    if (chance_lines.length > 3) {
        d3.selectAll("#chance_line_4").text(chance_lines[3])
    } else {
        d3.selectAll("#chance_line_4").text(" ")
    }

    // Increment the index for the Chance Card for other Players.
    update_chance_index(player, g.chance.current_index)

    // Format the function name.
    var command_string = `chance_${key}(player)`

    // Execute the function.
    active_buttons = eval(command_string)

    // Return the buttons to be displayed on the Roll Dice Screen.
    return active_buttons
}

// self.chance["cards"]["GO"] = "Advance to GO.  Collect $200."
function chance_GO(player) {

    // Move Player from current Property to Go.
    g.dice = 40 - player.sequence

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Go"]

    // Return the buttons to be displayed on the Roll Dice Screen.
    return active_buttons
}

// self.chance["cards"]["IL"] = "Advance to Illinois Avenue.  If you pass GO, collect $200."
function chance_IL(player) {

    // console.log("\nfunction chance_IL(player)", player)

    // Determine if the Player is before Illinois Avenue.
    if (player.sequence < 24) {

        // Move Player from current Property to Illinois Avenue.
        g.dice = 24 - player.sequence

        // Player is past Illinois Avenue.
    } else {

        // Move Player to Go and on to Illinois Avenue
        g.dice = 40 - player.sequence + 24
    }

    // Define active buttons to be displayed on the Roll Dice Screen.
    var active_buttons = ["Go"]

    // Return the buttons to be displayed on the Roll Dice Screen.
    return active_buttons
}

// self.chance["cards"]["SC"] = "Advance to St. Charles Place.  If you pass GO, ollect $200."
function chance_SC(player) {

    // Determine if the Player is before St. Charles Place.
    if (player.sequence < 11) {

        // Move the Player from the current Property to St. Charles Place.
        g.dice = 11 - player.sequence

        // The Player is past St. Charles Place.
    } else {

        // Move Player to Go and then to St. Charles Place.
        g.dice = 40 - player.sequence + 11
    }

    // Display the Go Button on the Roll Dice Screen.
    var active_buttons = ["Go"]

    // Return the buttons to be displayed on the Roll Dice Screen.
    return active_buttons
}

// self.chance["cards"]["NU"] = "Advance to the nearest Utility."
function chance_NU(player) {

    // Determine if the Player is before the Electric Company.
    if (player.sequence < 12) {

        // The Player is going to the Electric Company.
        g.dice = 12 - player.sequence

        // Determine if the Player is before the Water Works.
    } else if (player.sequence < 28) {

        // The Player is past the Electric Company is going to the Water Works.
        g.dice = 28 - player.sequence

        // The Player is past the Water Works.
    } else {

        // Going to Go and then to Electric Company.
        g.dice = 40 - player.sequence + 12
    }

    // Display the Go Button on the Roll Dice Screen.
    var active_buttons = ["Go"]

    // Return the buttons to be displayed on the Roll Dice Screen.
    return active_buttons
}

// self.chance["cards"]["NR"] = "Advance to the nearest Railroad."
function chance_NR(player) {

    // // console.log("function chance_NR(player)", player)

    // Determine if the Player is before the Reading Railroad.
    if (player.sequence < 5) {

        // Move the Player to the Reading Railroad.
        g.dice = 5 - player.sequencee

        // Determine if the Player is before the Pennsylvania Railroad.
    } else if (player.sequence < 15) {

        // Move the Player to the Pennsylvania Railroad.
        g.dice = 15 - player.sequence

        // Determine if the Player is before the B & O Railroad.
    } else if (player.sequence < 25) {

        // Move the Player to the B & O Railroad.
        g.dice = 25 - player.sequence

        // Determine if the Player is before the Short Line Railroad.
    } else if (player.sequence < 35) {

        // Move the Player to the Short Line Railroad.
        g.dice = 35 - player.sequence

        // The Player is past the Short Line Railroad. 
    } else {

        // Move the Player to Go and then to the Reading Railroad.
        g.dice = 40 - player.sequence + 5
    }

    // Display the Go Button on the Roll Dice Screen.
    var active_buttons = ["Go"]

    // Return the buttons to be displayed on the Roll Dice Screen.
    return active_buttons
}

// self.chance["cards"]["BD"] = "Bank pays you a dividend of $50."
function chance_BD(player) {

    // Set the amount to be collected.
    g.payment = 50

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = "Collect"

    // Return the buttons to be displayed on the Roll Dice Screen.
    return active_buttons
}

// self.community_chest["cards"]["OJ"] = "Get Out of Jail Free."
function chance_OJ(player) {

    // Construct the get_players_request.
    if (typeof add_get_out_of_jail_card_request == "undefined") {
        var add_get_out_of_jail_card_request = new XMLHttpRequest()
    }

    // Define the transaction to add a get-out-of-jail card to a player.
    transaction = {}
    transaction["code"] = "add_get_out_of_jail_card"
    transaction["key"] = player.key

    // Convert the transaction object to a string.
    transaction = JSON.stringify(transaction)

    // Append the transaction string to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Construct an asynchronous listener, monitoring the sent request.
    add_get_out_of_jail_card_request.onreadystatechange = function () {

        // The server is done.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert response into a javascript object.
                var response = JSON.parse(this.responseText)

                // Check for a successful request.
                if (response.status == "Pass") {

                    // Extract the updated player from the response.
                    player = response.player

                    // Process the updated player.
                    chance_OJ_callback(player)

                } else {
                    console.log("\nError: process_community_chest_event.js: community_chest_ON: onreadstatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                    console.trace
                }

            } else {
                console.log("\nError: process_community_chest_event.js: community_chest_ON: onreadstatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
                console.trace
            }
        }
    }

    // Send the request for asynchronous processing.
    add_get_out_of_jail_card_request.open("GET", url, true);
    add_get_out_of_jail_card_request.send();

    // Active buttons are displayed using the call back.
    return []
} 

function chance_OJ_callback(player) {

    console.log(`\n${player.name} had their number of get-out-of-jail cards increased to ${player["cards"].toString()}.`)

    // Define the active buttons to be returned.
    var active_buttons = []

    // Determine if the Player had rolled doubles.
    if (player.doubles > 0) {

        // The Player rolled doubles so the "Roll" button is enabled.
        active_buttons = ["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"]

    } else {

        // The Player did not roll doubles, so the "Roll" button is disabled.
        active_buttons = ["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"]
    }

    // Update the buttons on the Roll Dice Screen
    hide_expose_roll_dice_buttons(active_buttons)
}

// self.chance["cards"]["BS"] = "Go back three spaces."
function chance_BS(player) {

    // // console.log("function chance_BS(player)", player)

    g["dice"] = -3

    var active_buttons = ["Go"]

    // Return the buttons to be displayed on the Roll Dice Screen.
    return active_buttons
}

// self.chance["cards"]["TJ"] = "Go to Jail. Go directly to jail. Do not pass Go. Do not collect $200."
function chance_TJ(player) {

    // console.log("function chance_TJ(player)", player)

    // Tell the Go Button to move Player directly to Jail.
    g.go_to_jail = true

    // Display the Go Button on the Roll Dice Screen.
    var active_buttons = ["Go"]

    // Return the buttons to be displayed on the Roll Dice Screen.
    return active_buttons
}

// self.chance["cards"]["GR"] = "You are to make repairs on all your properties. Pay $25 per house and $100 per hotel you own."
function chance_GR(player) {

    // console.log("function chance_GR(player)", player)

    // Construct the get_properties_request.
    if (typeof get_properties_request == "undefined") {
        var get_properties_request = new XMLHttpRequest()
    }

    // Format the url and transaction.
    url = '/monopoly_api?transaction={"code":"get_properties"}'

    // Construct an asynchronous listener, monitoring the sent request.
    get_properties_request.onreadystatechange = function () {

        // The server is done.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response string into a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful request.
                if (response.status == "Pass") {

                    // Get Properties.
                    var properties = response.properties

                    // Determine fess for houses and hotels owned by the Player.
                    chance_GR_with_callback(player, properties)

                } else {
                    console.log("\nError: process_chance_event.js: chance_SR: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: automation.js: check_for_bank_properties: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    get_properties_request.open("GET", url, true);
    get_properties_request.send();

    // Set default payment.
    g.payment = 0

    console.log("g.payment:", g.payment)

    // The buttons will be set in the called asynchronous function.
    var active_buttons = []

    // Return an empty list of buttons to be displayed on the Roll Dice Screen.
    return active_buttons
}

function chance_GR_with_callback(player, properties) {

    // console.log("function chance_GR_with_properties(player, properties)", player, properties)

    // Define the counter for the number of houses owned by this Player.
    var number_of_houses = 0

    // Define the counter for the number of hotels owned by this Player.
    var number_of_hotels = 0

    // Initialize the global variable g.payment.
    g.payment = 0

    // Process each key of the Properties.
    for (var property_key in properties) {

        // Get a Property by key.
        var property = properties[property_key]

        // Determine if the Property would contain houses or a hotel
        if (property.type == "property") {

            console.log("property:", property)

            // Determine if the Property is owned by the Player.
            if (property.owner == player.key) {

                // Increment the number of houses owned by the Player.
                console.log("property.houses:", property.houses)
                number_of_houses += property.houses
                console.log("number_of_houses:", number_of_houses)

                // Increment the number hotels owned by the Player.
                console.log("property.hotels:", property.hotels)
                number_of_hotels += property.hotels
                console.log("number_of_hotels:", number_of_hotels)

                if ((number_of_houses == NaN) || (number_of_hotels == NaN)) {
                    console.log("number_of_houses:", number_of_houses)
                    console.log("number_of_hotels:", number_of_hotels)
                    console.log("property:", property)
                }
            }
        }
    }

    // Calculate the payment based on the number of houses.
    console.log("number_of_houses:", number_of_houses)
    g.payment = (number_of_houses * 25)
    console.log("g.payment:", g.payment)

    // Increase the payment based on the number of hotels.
    console.log("number_of_hotels:", number_of_hotels)
    g.payment += (number_of_hotels * 100)
    console.log("g.payment", g.payment)

    // Determine if the Player needs to make a payment.
    if (g.payment == 0) {

        // Define the active buttons to be returned.
        var active_buttons = []

        // Determine if the Player had rolled doubles.
        if (player.doubles > 0) {

            // The Player rolled doubles so the "Roll" button is enabled.
            active_buttons = ["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"]

        } else {

            // The Player did not roll doubles, so the "Roll" button is disabled.
            active_buttons = ["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"]
        }

        // Add the amount to pay on the Roll Dice Screen. 
        d3.select("#" + g.roll_dice.screen.text_id_4).text("You're lucky.  Nothing is owed.")

    } else {

        // Add the amount to pay on the Roll Dice Screen. 
        d3.select("#" + g.roll_dice.screen.text_id_4).text(`Pay $${g.payment.toString()}.`)

        // Display the Pay Button on the Roll Dice Screen.
        var active_buttons = ["Pay"]
    }

    console.log("active_buttons:", active_buttons)
    console.log("g.payment:", g.payment)

    // Update the buttons on the Roll Dice Screen
    hide_expose_roll_dice_buttons(active_buttons)
}

// self.chance["cards"]["PT"] = "Pay Poor Tax of $15."
function chance_PT(player) {

    // Set the amount to be paid.
    g.payment = 15

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Pay"]

    // Return the buttons to be displayed on the Roll Dice Screen.
    return active_buttons
}

// self.chance["cards"]["RR"] = "Take a trip on the Reading Railroad."
function chance_RR(player) {

    // Determine if the Player is before the Reading Railroad.
    if (player.sequence < 5) {

        // Move the Player to the Reading Railroad.
        g.dice = 5 - player.sequence

        // The Player is past the Reading Railroad.
    } else {

        // Move the Player to Go and then to the Reading Railroad.
        g.dice = 40 - player.sequence + 5
    }

    // Display the Go Button on the Roll Dice Screen.
    var active_buttons = ["Go"]

    // Return the buttons to be displayed on the Roll Dice Screen.
    return active_buttons
}

// self.chance["cards"]["WB"] = "Take a walk on the Boardwalk."
function chance_WB(player) {

    // Move the Player to Boardwalk.
    g.dice = 39 - player.sequence

    // Display the Go Button on the Roll Dice Screen.
    var active_buttons = ["Go"]

    // Return the buttons to be displayed on the Roll Dice Screen.
    return active_buttons
}

// self.chance["cards"]["CB"] = "You have been elected Chairman of the Board.  Pay each player $50."
function chance_CB(player) {

    // Construct the get_players_request.
    if (typeof get_players_request == "undefined") {
        var get_players_request = new XMLHttpRequest()
    }

    // Format the url with transaction.
    url = '/monopoly_api?transaction={"code":"get_players"}'

    // Construct an asynchronous listener, monitoring the sent request.
    get_players_request.onreadystatechange = function () {

        // The server is done.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert response into a javascript object.
                var response = JSON.parse(this.responseText)

                // Check for a successful request.
                if (response.status == "Pass") {

                    var players = response.players

                    // Process each player, paying the player.
                    chance_CD_callback(player, players)

                } else {
                    console.log("\nError: process_community_chest_event.js: community_chest_ON: onreadstatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: process_community_chest_event.js: community_chest_ON: onreadstatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    get_players_request.open("GET", url, true);
    get_players_request.send();

    // Active buttons are displayed in the callback.
    return []
}

function chance_CD_callback(player, players) {    

    // Initialize the payment.
    g.payment = 0

    // Get the index for the array of Player keys.
    for (var other_player_key in players) {

        // Bypass the current player.
        if (other_player_key == player.key) { continue }

        // Get the other player.
        other_player = players[other_player_key]

        // Bypass the bakrupt player.
        if (other_player.bankrupt == true) { continue }

        // Add to the payment for the player.
        g.payment += 50

        // Call the asynchronous function to add 10 to the balance of all other players.
        // A copy of the other player is made so not to overlay the variable in the for loop.
        add_balance(JSON.parse(JSON.stringify(other_player)), 50)
    }

    d3.select("#" + g.roll_dice.screen.text_id_4).text(`Collect ${g.payment.toString()}.`)

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Pay"]

    // Update the buttons on the Roll Dice Screen
    hide_expose_roll_dice_buttons(active_buttons)
}

// self.chance["cards"]["BL"] = "Your building and loan matures.  Collect $150."
function chance_BL(player) {

    // Set the amount to be collected.
    g.payment = 150

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = "Collect"

    // Return the buttons to be displayed on the Roll Dice Screen.
    return active_buttons
}

function update_chance_index(player, key) {

    // Update this player's balance on all other player boards.
    for (player_keys_index in g.player_keys) {

        // Select the next player to be notified.
        var player_key = g.player_keys[player_keys_index]

        // Bypass current Player.  The Community Chest was incremented locally.
        if (player_key == player.key) { continue }

        // Create a transaction to move a player's token.
        var transaction = {}
        transaction["code"] = "append_queue"
        transaction["key"] = player_key
        transaction["action"] = "Update Chance Index"

        // Add details to the transaction.
        var details = {}
        details["key"] = key
        transaction["details"] = details

        // Add the transaction to another player's queue.
        append_queue(transaction)
    }
}
