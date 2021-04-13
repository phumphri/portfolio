function process_community_chest_event(player) {

    // console.log("\nfunction process_community_chest_event(player)", player)

    // Define the array of buttons to be displayed on the Roll Dice Screen.
    var active_buttons = []

    // Increment the index of the Community Chest Cards.
    g.community_chest.current_index += 1
    if (g.community_chest.current_index > g.community_chest.maximum_index) {
        g.community_chest.current_index = 0
    }

    // Get the key of the Card.
    var key = g.community_chest.keys[g.community_chest.current_index]

    // Get the Card from the Community Chest.
    var card = g.community_chest.cards[key]

    // Define a multiple-line message to be displayed on the Roll Dice Screen.
    var message = card.replace('. ', '.;')
    message = message.replace('. ', '.;')
    message = message.replace('. ', '.;')
    message = message.replace('. ', '.;')

    // Display the message
    add_roll_dice_message(message)

    // Log the community chest card.
    log(`${player.name} Community Chest Card: ${message}`)

    try {
        var community_chest_lines = message.split(";", 4)

        if (community_chest_lines.length > 0) {
            d3.selectAll("#community_chest_line_1").text(community_chest_lines[0])
        } else {
            d3.selectAll("#community_chest_line_1").text(" ")
        }

        if (community_chest_lines.length > 1) {
            d3.selectAll("#community_chest_line_2").text(community_chest_lines[1])
        } else {
            d3.selectAll("#community_chest_line_2").text(" ")
        }

        if (community_chest_lines.length > 2) {
            d3.selectAll("#community_chest_line_3").text(community_chest_lines[2])
        } else {
            d3.selectAll("#community_chest_line_3").text(" ")
        }

        if (community_chest_lines.length > 3) {
            d3.selectAll("#community_chest_line_4").text(community_chest_lines[3])
        } else {
            d3.selectAll("#community_chest_line_4").text(" ")
        }
    }

    catch(err) {
        console.log("\nError: process_community_chest_event.js: process_community_chest_event")
        console.log("Exception:", err.message)
        console.log("Error occurred in the formatting of the message.")
         
    }

    try {
        // Increment the index for the Community Chest for other players.
        update_community_chest_index(player, g.community_chest.current_index)
    }

    catch(err) {
        console.log("\nError: process_community_chest_event.js: process_community_chest_event")
        console.log("Exception:", err.message)
        console.log('Exception thrown by "update_community_chest_index()"')
         
    }

    try {
        // Format the function name.
        var command_string = `community_chest_${key}(player)`

        // Evaluate the function.
        active_buttons = eval(command_string)
    }

    catch(err) {
        console.log("\nError: process_community_chest_event.js: process_community_chest_event")
        console.log("Exception:", err.message)
        console.log('Exception thrown by "active_buttons = eval(command_string)"')
         
    }

    return active_buttons
}

// self.community_chest["cards"]["GO"] = "Advance to GO.  Collect $200."
function community_chest_GO(player) {

    // Move the Player to Go.
    g.dice = 40 - player.sequence

    // Display the Go Button on the Roll Dice Screen.
    var active_buttons = ["Go"]

    // Return the buttons to be displayed on the Roll Dice Screen.
    return active_buttons
}

// self.community_chest["cards"]["BR"] = "Bank error in your favor. Collect $200."
function community_chest_BR(player) {

    // Set the amount to be collected.
    g.payment = 200

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Collect"]

    // Return the buttons to be displayed.
    return active_buttons
}

// self.community_chest["cards"]["DF"] = "Doctor's fee. Pay $50."
function community_chest_DF(player) {

    // Set the amount to be paid.
    g.payment = 50

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Pay"]

    // Return the buttons to be displayed.
    return active_buttons
}

// self.community_chest["cards"]["SS"] = "From sale of stock you get $50."
function community_chest_SS(player) {

    // Set the amount to be collected.
    g.payment = 50

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Collect"]

    // Return the buttons to be displayed.
    return active_buttons
}

// self.community_chest["cards"]["OJ"] = "Get Out of Jail Free."
function community_chest_OJ(player) {

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
                    community_chest_OJ_callback(player)

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

function community_chest_OJ_callback(player) {

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

// self.community_chest["cards"]["TJ"] = "Go to Jail. Go directly to jail. Do not pass Go. Do not collect $200."
function community_chest_TJ(player) {

    log(`${player.name} pulled the Community Chest GO TO Jail card.  Only option is the Go Button.`)

    // The the Go Button to move the Player directly to Jail.
    g.go_to_jail = true

    // Display the Go Button on the Roll Dice Screen.
    var active_buttons = ["Go"]

    // Return the buttons to be displayed to be displayed on the Roll Dice Screen.
    return active_buttons
}

// self.community_chest["cards"]["ON"] = "Grand Opera Night. Collect $50 from every player for opening night seats."
function community_chest_ON(player) {

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
                    community_chest_ON_callback(player, players)

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
    get_players_request.open("GET", url, true);
    get_players_request.send();

    // Active buttons are displayed using the call back.
    return []
}

function community_chest_ON_callback(player, players) {

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

        // Call the asynchronous function to subtract 50 from the other player.
        // A copy of the other player is made so not to overlay the variable in the for loop.
        subtract_balance(JSON.parse(JSON.stringify(other_player)), 50)
    }

    d3.select("#" + g.roll_dice.screen.text_id_4).text(`Collect ${g.payment.toString()}.`)

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Collect"]

    // Update the buttons on the Roll Dice Screen
    hide_expose_roll_dice_buttons(active_buttons)
}

// self.community_chest["cards"]["XM"] = "Xmas Fund matures. Collect $100."
function community_chest_XM(player) {

    // Set the amount to be collected.
    g.payment = 100

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Collect"]

    // Return the buttons to be displayed.
    return active_buttons
}

// self.community_chest["cards"]["IT"] = "Income tax refund. Collect $20."
function community_chest_IT(player) {

    // Set the amount to be collected.
    g.payment = 20

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Collect"]

    // Return the buttons to be displayed.
    return active_buttons
}

// self.community_chest["cards"]["BD"] = "It is  your birthday. Collect $10 from every player."
function community_chest_BD(player) {

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
                    community_chest_BD_callback(player, players)

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

function community_chest_BD_callback(player, players) {    

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
        g.payment += 10

        // Call the asynchronous function to subtract 50 from the other player.
        // A copy of the other player is made so not to overlay the variable in the for loop.
        subtract_balance(JSON.parse(JSON.stringify(other_player)), 10)
    }

    d3.select("#" + g.roll_dice.screen.text_id_4).text(`Collect ${g.payment.toString()}.`)

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Collect"]

    // Update the buttons on the Roll Dice Screen
    hide_expose_roll_dice_buttons(active_buttons)
}

// self.community_chest["cards"]["LI"] = "Life insurance matures – Collect $100."
function community_chest_LI(player) {

    // Set the amount to be collected.
    g.payment = 100

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Collect"]

    // Return the buttons to be displayed.
    return active_buttons
}

// self.community_chest["cards"]["HF"] = "Hospital Fees. Pay of $100."
function community_chest_HF(player) {

    // Set the amount to be paid.
    g.payment = 100

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Pay"]

    // Return the buttons to be displayed.
    return active_buttons
}

// self.community_chest["cards"]["SF"] = "Pay school fees $150."
function community_chest_SF(player) {

    // Set the amount to be paid.
    g.payment = 150

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Pay"]

    // Return the buttons to be displayed.
    return active_buttons
}

// self.community_chest["cards"]["RC"] = "Receive $25 consultancy fee."
function community_chest_RC(player) {

    // Set the amount to be collected.
    g.payment = 25

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Collect"]

    // Return the buttons to be displayed.
    return active_buttons
}

// self.community_chest["cards"]["SR"] = "You are assessed for street repairs: Pay $40 per house and $115 per hotel you own."
function community_chest_SR(player) {

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
                    community_chest_SR_callback(player, properties)

                } else {
                    console.log("\nError: process_community_chest_event.js: community_chest_SR: onreadystatechange")
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

    // Active buttons displayed in the callback.
    return []
}

function community_chest_SR_callback(player, properties) {

    // console.log("function community_chest_SR_with_properties(player, properties)", player, properties)

    // Define the counter for the number of houses owned by this Player.
    var number_of_houses = 0

    // Define the counter for the number of hotels owned by this Player.
    var number_of_hotels = 0

    // Define the key used to identify a Property.
    var property_key = null

    // Initialize the global variable g.payment.
    g.payment = 0

    // Process each key of the Properties.
    for (property_key in properties) {

        // Get a Property by key.
        var property = properties[property_key]

        // Determine if the Property is the type that would have houses or a hotel.
        if (property.type == "property") {

            // Determine if the Property is owned by the Player.
            if (property.owner == player.key) {

                // Increment the number of houses owned by the Player.
                number_of_houses += property.houses

                // Increment the number hotels owned by the Player.
                number_of_hotels += property.hotels
            }
        }
    }

    // Calculate the payment based on the number of houses.
    g.payment = (number_of_houses * 40)

    // Increase the payment based on the number of hotels.
    g.payment += (number_of_hotels * 115)

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

        // Add the amount to the Roll Dice Screen.
        d3.select("#" + g.roll_dice.screen.text_id_4).text("You're lucky.  Nothing is owed.")

    } else {

        // Add the amount to the Roll Dice Screen.
        d3.select("#" + g.roll_dice.screen.text_id_4).text(`Pay $${g.payment.toString()}.`)

        // Display the Pay Button on the Roll Dice Screen.
        var active_buttons = ["Pay"]
    }

    // Update the buttons on the Roll Dice Screen
    hide_expose_roll_dice_buttons(active_buttons)
}

// self.community_chest["cards"]["BC"] = "You have won second prize in a beauty contest. Collect $10."
function community_chest_BC(player) {

    // Set the amount to be collected.
    g.payment = 10

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Collect"]

    // Return the buttons to be displayed.
    return active_buttons
}

// self.community_chest["cards"]["IN"] = "You inherit $100."
function community_chest_IN(player) {

    // Set the amount to be collected.
    g.payment = 100

    // Set the button to be displayed on the Roll Dice Screen.
    var active_buttons = ["Collect"]

    // Return the buttons to be displayed.
    return active_buttons
}

function update_community_chest_index(player, key) {

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
        transaction["action"] = "Update Community Chest Index"

        // Add details to the transaction.
        var details = {}
        details["key"] = key
        transaction["details"] = details

        // Add the transaction to another player's queue.
        append_queue(transaction)
    }
}
