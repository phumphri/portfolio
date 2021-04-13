function process_the_trade_request(player) {

    // Intialize the Trade Event. The g.trade.other_player will be set by onclick of player tile. 
    g.trade.in = true
    g.trade.player = player
    g.trade.other_player = {}
    g.trade.other_player["key"] = null
    g.trade["money"] = {}
    g.trade.money["player"] = 0
    g.trade.money["other_player"] = 0
    g.trade["property"] = {}
    g.trade.property["player"] = {}
    g.trade.property.player["a"] = null
    g.trade.property.player["b"] = null
    g.trade.property.player["c"] = null
    g.trade.property["other_player"] = {}
    g.trade.property.other_player["a"] = null
    g.trade.property.other_player["b"] = null
    g.trade.property.other_player["c"] = null


    // Remove the Trade Player Button and the Trade Other Player Button from the Trade Screen.
    d3.select("#trade_player_button_id").remove()
    d3.select("#trade_player_property_a_button_id").remove()
    d3.select("#trade_player_property_b_button_id").remove()
    d3.select("#trade_player_property_c_button_id").remove()

    d3.select("#trade_other_player_button_id").remove()
    d3.select("#trade_other_player_property_a_button_id").remove()
    d3.select("#trade_other_player_property_b_button_id").remove()
    d3.select("#trade_other_player_property_c_button_id").remove()

    // Initialize the Trade Screen.
    document.getElementById("trade_player_amount").value = 0
    g.trade.screen.player.property.a.occupied = false
    g.trade.screen.player.property.b.occupied = false
    g.trade.screen.player.property.c.occupied = false

    document.getElementById("trade_other_player_amount").value = 0
    g.trade.screen.other_player.property.a.occupied = false
    g.trade.screen.other_player.property.b.occupied = false
    g.trade.screen.other_player.property.c.occupied = false

    // Unhide the Trade Screen.
    d3.select("#" + g.trade.screen.id).classed('visible', true)
    d3.select("#" + g.trade.screen.id).classed('invisible', false)

    // Preserve the state of the Roll Button to be used in acceptance or rejection.
    g["roll_button_class"] = d3.select("#roll_button_id").attr("class")

    // Clone the Player Button as the Trade Player Button and move it to the Trade Screen.
    move_player_to_trade_screen()

    // Display only the Canel Button on the Roll Dice Screen.
    var active_buttons = g.dialog.buttons.filter((d) => {
        if (["Cancel", "Reset"].includes(d)) { return true }
        return false
    })

    // Update the buttons on the Roll Dice Screen.
    hide_expose_roll_dice_buttons(active_buttons)

    // Add a mutiple-line message on the Roll Dice Screen.
    var message = "Select the player to which to trade.;"
    message += "Select assets to trade.;"
    message += "Click Offer Button."
    add_roll_dice_message(message)
}

function move_player_to_trade_screen() {

    // Construct the identifier of the Trade Player Button Group.
    var player_column = {}
    player_column["button"] = {}
    player_column.button["id"] = g.trade.player.key + "_column_button_group_id"
    player_column["width"] = g.bank_column.width
    player_column["height"] = g.bank_column.height
    player_column["text_height"] = g.bank_column.text_height

    // Create the parameters to move the cloned Trade Player Button.
    var new_x = g.trade.screen.x
    var new_y = g.trade.screen.y + g.bank_column.text_height * 4
    var translate = "translate(" + new_x + " " + new_y + ")"

    // Clone the the Player Button as the Trade Player Button and move it to the Trade Screen.
    d3.select("#" + player_column.button.id)
        .clone(true)
        .attr("id", "trade_player_button_id")

    // Remove the identifier for the rectangle on the Trade Player Button.
    d3.select("#trade_player_button_id")
        .select("#" + g.trade.player.key + "_column_button_rect_id")
        .attr("id", null)

    // Remove the identifier for the text on the Trade Player Button.
    d3.select("#trade_player_button_id")
        .select("#" + g.trade.player.key + "_column_button_text_id")
        .attr("id", null)

    // Move the Trade Player Button to the Trade Screen.
    d3.select("#trade_player_button_id")
        .transition()
        .duration(1000)
        .attr("class", "visible")
        .attr("transform", translate)
}

function process_the_offer_request(player) {

    // Validate the Offer Trade Transaction.
    if (g.trade.player == null) {
        console.log("\nError: process_trade_requests.js: process_the_offer_request")
        console.log("g.trade.player was null.")
        console_trace(); set_error_encountered()
        return
    }

    if (g.trade.other_player.key == null) {
        console.log("\nError: process_trade_requests.js: process_the_offer_request")
        console.log("g.trade.other_player.key was null")
        console_trace(); set_error_encountered()
        return
    }

    // Construct a get_properties request.
    if (typeof get_properties_request == "undefined") {
        var get_properties_request = new XMLHttpRequest()
    }

    // Create the transactions with url.
    url = '/monopoly_api?transaction={"code":"get_properties"}'

    // Construct an asynchronous listener, monitoring the sent request.
    get_properties_request.onreadystatechange = function () {

        // Server is done with the request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response string into a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful request.
                if (response.status == "Pass") {

                    // Start the Trade Event with the player and properties.
                    g.properties.tracts = response.properties
                    process_the_offer_request_with_properties(response.properties)

                } else {
                    console.log("\nError: process_trade_requests.js: process_the_offer_request: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: process_trade_requests.js: process_the_offer_request: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    get_properties_request.open("GET", url, true);
    get_properties_request.send();
}

function process_the_offer_request_with_properties(properties) {

    // console.log("\nfunction process_the_offer_request_with_properties(properties)")

    // Send a 2 Trade Transaction, mode "offer", to the other player.
    var transaction = {}
    transaction["code"] = "append_queue"
    transaction["key"] = g.trade.other_player.key
    transaction["action"] = "Trade"

    // Add details to the transaction.
    var details = {}

    // The Trade Event starts with an offer.
    details["mode"] = "offer"

    // Add the status of the Trade Event
    details["in"] = g.trade.in

    // Add Player.
    details["player"] = g.trade.player

    // Add Other Player.
    details["other_player"] = g.trade.other_player

    // Add monies.
    details["money"] = g.trade.money

    // Add Properties.
    details["property"] = g.trade.property

    // Mode, Player, and Other Player are collected into the details of the Trade Event.
    transaction["details"] = details

    // Add the Trade Event transaction to another player's queue.
    append_queue(transaction)

    // Hide all buttons.  They will reappear when the other player responds.
    var active_buttons = g.dialog.buttons.filter((d) => {
        if (["Reset"].includes(d)) { return true }
        return false
    })

    // Update the buttons on the Roll Dice Screen.
    hide_expose_roll_dice_buttons(active_buttons)

    // Update the message on the first line of the message on the Roll Dice Screen.
    var message = `You made an offer to ${g.trade.other_player.name}.;`
    log(`${g.trade.player.name} made an offer to ${g.trade.other_player.name}.`)

    // Inform the Player when it is their turn on the second line.
    message += "Buttons will appear when it is your turn in the trade."

    // Display the multiple-line message on the Roll Dice Screen.
    add_roll_dice_message(message)

    // Start monitoring the queue for this player, expecting a response from the other player.
    g.intervals[window.name] = setInterval(get_queue, g.queue_interval)
    console.log("Started listening to queue for Player:", window.name)
}

function process_the_counter_request() {

    // Validate Counter Trade Transaction.
    if (window.name == g.trade.player.key) {

        var a = null

    } else if (window.name == g.trade.other_player.key) {

        var a = null

    } else {
        console.log("\nError: process_trade_requests.js: process_the_counter_offer")
        console.log("There was no match for window.name.")
        console.log("window.name:", window.name)
        console.log("g.trade.player.key:", g.trade.player.key)
        console.log("g.trade.other_player.key:", g.trade.other_player.key)
        console_trace(); set_error_encountered()
        return
    }

    // Send a Counter Offer Trade Transaction.
    var transaction = {}
    transaction["code"] = "append_queue"

    // Determine if the user is the originating Player.
    if (window.name == g.trade.player.key) {

        // The user is the originating Player sending the counter offer to the Other Player.
        transaction["key"] = g.trade.other_player.key

    } else {

        // The user is the Other Player sending the counter offer to the originating Player.
        transaction["key"] = g.trade.player.key
    }
    transaction["action"] = "Trade"

    // Add details to the transaction.
    var details = {}

    // Set mode to counter offer.
    details["mode"] = "counter"

    // Add status of Trade Event.
    details["in"] = g.trade.in

    // Add Player.
    details["player"] = g.trade.player

    // Add Other Player.
    details["other_player"] = g.trade.other_player

    // Add monies.
    details["money"] = g.trade.money

    // Add Properties.
    details["property"] = g.trade.property

    // Mode, Player, and Other Player are collected into the details of the Trade Event.
    transaction["details"] = details

    // Add the transaction to another player's queue.
    append_queue(transaction)

    // Hide all buttons.  They will reappear when the other player responds.
    var active_buttons = g.dialog.buttons.filter((d) => {
        if (["Reset"].includes(d)) { return true }
        return false
    })

    // Update the buttons on the Roll Dice Screen.
    hide_expose_roll_dice_buttons(active_buttons)

    // Define a multiple-line message to be displayed on the Roll Dice Screen.
    var message = ""

    // Determine if the Player is the originator of the Trade Event.
    if (window.name == g.trade.player.key) {

        // Update the message to the originating Player on the first line.
        message = `You sent a counter offer to ${g.trade.other_player.name}.;`
        log(`${g.trade.player.name} sent a counter offer to ${g.trade.other_player.name}.`)
        
    } else {

        // Update the message to the Other Player on the first line.
        message = `You sent a counter offer to ${g.trade.player.name}.;`
        log(`${g.trade.other_player.name} sent a counter offer to ${g.trade.player.name}.`)
    }

    // Inform the Player when it is their turn on the second line.
    message += "Buttons will appear when it is your turn in the trade."

    // Display the multiple-line message on the Roll Dice Screen.
    add_roll_dice_message(message)

    // Start monitoring the queue for this player, expecting a response from the other player.
    g.intervals[window.name] = setInterval(get_queue, g.queue_interval)
    console.log("Started listening to queue for Player:", window.name)
}

function process_the_reject_request(player) {

    // Validate the Reject Trade Transaction Request.
    if (window.name == g.trade.player.key) {

        // The user is the originating Player.
        var a = null

    } else if (window.name == g.trade.other_player.key) {

        // The user is the Other Player.
        var a = null

    } else {
        console.log("\nError: process_trade_requests.js: process_the_reject_request")
        console.log("There was no match for window.name.")
        console.log("window.name:", window.name)
        console.log("g.trade.player.key:", g.trade.player.key)
        console.log("g.trade.other_player.key:", g.trade.other_player.key)
        console_trace(); set_error_encountered()
        return
    }

    // Send a Trade Transaction, mode "reject", to the other player.
    var transaction = {}
    transaction["code"] = "append_queue"

    // Determine is the user is the originating Player.
    if (window.name == g.trade.player.key) {

        // The user is the originating Player sending the rejection to the Other Player.
        transaction["key"] = g.trade.other_player.key

        log(`${g.trade.player.name} rejected offer from ${g.trade.other_player.name}.`)

    } else {

        // The user is the Other Player sending the rejection to the originating Player.
        transaction["key"] = g.trade.player.key

        log(`${g.trade.other_player.name} rejected offer from ${g.trade.player.name}.`)
    }

    transaction["action"] = "Trade"

    // Add details to the transaction.
    var details = {}

    // Set mode to reject the offer.
    details["mode"] = "reject"

    // Add status of the Trade Event.
    details["in"] = g.trade.in

    // Add Player.
    details["player"] = g.trade.player

    // Add Other Player.
    details["other_player"] = g.trade.other_player

    // Add monies.
    details["money"] = g.trade.money

    // Add Properties.
    details["property"] = g.trade.property

    // Mode, Player, and Other Player are collected into the details of the Trade Event.
    transaction["details"] = details

    // Add the transaction to another player's queue.
    append_queue(transaction)

    // Remove the Trade Player Button and the Trade Other Player Button from the Trade Screen.
    d3.select("#trade_player_button_id").remove()
    // d3.select("#trade_player_money_button_id").remove()
    d3.select("#trade_player_property_a_button_id").remove()
    d3.select("#trade_player_property_b_button_id").remove()
    d3.select("#trade_player_property_c_button_id").remove()

    d3.select("#trade_other_player_button_id").remove()
    // d3.select("#trade_other_player_money_button_id").remove()
    d3.select("#trade_other_player_property_a_button_id").remove()
    d3.select("#trade_other_player_property_b_button_id").remove()
    d3.select("#trade_other_player_property_c_button_id").remove()

    // Reset the Trade Screen.
    document.getElementById("trade_player_amount").value = 0
    g.trade.screen.player.property.a.occupied = false
    g.trade.screen.player.property.b.occupied = false
    g.trade.screen.player.property.c.occupied = false

    document.getElementById("trade_other_player_amount").value = 0
    g.trade.screen.other_player.property.a.occupied = false
    g.trade.screen.other_player.property.b.occupied = false
    g.trade.screen.other_player.property.c.occupied = false

    // Hide the Trade Screen.
    d3.select("#" + g.trade.screen.id).classed('visible', false)
    d3.select("#" + g.trade.screen.id).classed('invisible', true)

    // Define a multiple-line message to the displayed on the Roll Dice Screen.

    // Determine if the Player is the Player that originated the Trade Event.
    if (window.name == g.trade.player.key) {

        // This player started and stopped the Trade Event.  Determine if previously they rolled doubles.
        if ((player.doubles > 0) || (g.roll_button_class == "visible")){

            // Show the normal buttons for a player who previously rolled doubles.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
                return false
            })
        } else {

            // Show the normal buttons.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"].includes(d)) { return true }
                return false
            })
        }

        // Inform the Player that they rejected the offer from the Other Player on the first line.
        message =`You rejected the offer from ${g.trade.other_player.name}.;`
        log(`${g.trade.player.name} rejected the offer from ${g.trade.other_player.name}.`)

        // After displaying buttons, stop checking the queue and wait for a button to be pressed.
        clearInterval(g.intervals[window.name])
        console.log("Stopped listening to queue for Player:", window.name)

    } else {

        // Inform the Other Player that they rejected the offer from the originating Player on the first line.
        message = `You rejected the offer from ${g.trade.player.name}.;`
        log(`${g.trade.other_player.name} rejected the offer from ${g.trade.player.name}.`)

        // Hide all buttons.  The buttons will reappear when it is the player's turn.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Reset"].includes(d)) { return true }
            return false
        })

        // Update the Player or Other Player when it will be their turn on the second line.
        message += "The buttons will reappear when it is your turn."

        // Have the Other Player start monitoring their queue.
        g.intervals[window.name] = setInterval(get_queue, g.queue_interval)
        console.log("Started listening to queue for Player:", window.name)
    }

    // Display the multiple-line message on the Roll Dice Screen.
    add_roll_dice_message(message)

    // Update the buttons on the Roll Dice Screen.
    hide_expose_roll_dice_buttons(active_buttons)

    // Player exits the Trade Event.
    g.trade.in = false

    // Reset the participants of the Trade Event.
    g.trade.player = null
    g.trade.other_player.key = null

    // Reset the monies of the Trade Event.
    g.trade.money.player = 0
    g.trade.money.other_player = 0

    // Reset the Properties of the Trade Event.
    g.trade.property.player.a = null
    g.trade.property.player.b = null
    g.trade.property.player.c = null
    g.trade.property.other_player.a = null
    g.trade.property.other_player.b = null
    g.trade.property.other_player.c = null
}

function process_the_accept_request(player) {

    console.log(`\nfunction process_the_accept_request(player="{${player.name}}")`)

    // Validate the Accept Trade Transaction Request.
    if (window.name == g.trade.player.key) {

        // The user is the originating Player.
        var a = null

    } else if (window.name == g.trade.other_player.key) {

        // The user is the Other Player.
        var a = null

    } else {
        console.log("\nError: process_trade_requests.js: process_the_accpet_request")
        console.log("There was no match for window.name.")
        console.log("window.name:", window.name)
        console.log("g.trade.player.key:", g.trade.player.key)
        console.log("g.trade.other_player.key:", g.trade.other_player.key)
        console_trace(); set_error_encountered()
        return
    }

    // Send a Trade Transaction, mode "reject", to the other player.
    var transaction = {}
    transaction["code"] = "append_queue"

    // Determine if the user is the originating Player.
    if (window.name == g.trade.player.key) {

        // The user is the originating Player who is sending the acceptance to the Other Player.
        transaction["key"] = g.trade.other_player.key

        log(`${g.trade.player.name} accepted offer from ${g.trade.other_player.name}.`)

    } else {

        // The user is the Other Player who is sending the acceptance to the originating Player.
        transaction["key"] = g.trade.player.key

        log(`${g.trade.other_player.name} accepted offer from ${g.trade.player.name}.`)
    }
    transaction["action"] = "Trade"

    // Add details to the transaction.
    var details = {}

    // Accept the grade offer.
    details["mode"] = "accept"

    // Add status of the Trade Event.
    details["in"] = g.trade.in

    // Add Player.
    details["player"] = g.trade.player

    // Add Other Player.
    details["other_player"] = g.trade.other_player

    // Add monies.
    details["money"] = g.trade.money

    // Add Properties.
    details["property"] = g.trade.property

    // Mode, Player, and Other Player are collected into the details of the Trade Event.
    transaction["details"] = details

    // Add the transaction to another player's queue.
    append_queue(transaction)

    // Get money offers from the Trade Screen.
    // When one offer is greater than zero, the other is set to zero by the Trade Screen.
    var player_offer = parseInt(document.getElementById("trade_player_amount").value)
    var other_player_offer = parseInt(document.getElementById("trade_other_player_amount").value)

    // Make copies of Player and Other Player so they persist after initialization of the Trade Event.
    var player_clone = JSON.parse(JSON.stringify(g.trade.player))
    var other_player_clone = JSON.parse(JSON.stringify(g.trade.other_player))

    // Determine if the Other Player made an offer.
    if (other_player_offer > 0) {

        // Subtract the Other Player's offer amount from the balance of the Other Player.
        subtract_balance(other_player_clone, other_player_offer)

        // Add the Other Player's offer amount to the balance of the Player.
        add_balance(player_clone, other_player_offer)

        // Determine if the Player made an offer.
    } else if (player_offer > 0) {

        // Subtract the Player's offer amount from the the balance of the Player.
        subtract_balance(player_clone, player_offer)

        // Add the Player's offer amount to the balance of the Other Player.
        add_balance(other_player_clone, player_offer)
    }

    // Update the Board by reasigning Player Property "a" to Other Player.
    if (g.trade.screen.player.property.a.occupied == true) {

        // Make copy of g.trade.property.player.a so it persists after the initialization of the Trade Event.
        var property_player_a_clone = JSON.parse(JSON.stringify(g.trade.property.player.a))

        // Change the owner of the Property from Player to Other Player.
        set_property_owner(property_player_a_clone, other_player_clone)

        // Remove the Property key from the Player.
        remove_player_property_key(player_clone, property_player_a_clone)

        // Add the Property key to the Other Player.
        add_player_property_key(other_player_clone, property_player_a_clone)

        // Notify the other Players that ownership has changed and their Boards need to be updated.
        notify_players_of_ownership_change(other_player_clone, property_player_a_clone)
    }

    // Update the Board by reasigning Player Property "b" to Other Player.
    if (g.trade.screen.player.property.b.occupied == true) {

        // Make copy of g.trade.property.player.b so it persists after the initialization of the Trade Event.
        var property_player_b_clone = JSON.parse(JSON.stringify(g.trade.property.player.b))

        // Change the owner of the Property from Player to Other Player.
        set_property_owner(property_player_b_clone, other_player_clone)

        // Remove the Property key from the Player.
        remove_player_property_key(player_clone, property_player_b_clone)

        // Add the Property key to the Other Player.
        add_player_property_key(other_player_clone, property_player_b_clone)

        // Notify the other Players that ownership has changed and their Boards need to be updated.
        notify_players_of_ownership_change(other_player_clone, property_player_b_clone)
    }

    // Update the Board by reasigning Player Property "c" to Other Player.
    if (g.trade.screen.player.property.c.occupied == true) {

        // Make copy of g.trade.property.player.c so it persists after the initialization of the Trade Event.
        var property_player_c_clone = JSON.parse(JSON.stringify(g.trade.property.player.c))

        // Change the owner of the Property from Player to Other Player.
        set_property_owner(property_player_c_clone, other_player_clone)

        // Remove the Property key from the Player.
        remove_player_property_key(player_clone, property_player_c_clone)

        // Add the Property key to the Other Player.
        add_player_property_key(other_player_clone, property_player_c_clone)

        // Notify the other Players that ownership has changed and their Boards need to be updated.
        notify_players_of_ownership_change(other_player_clone, property_player_c_clone)
    }

    // Update the Board by reasigning Other Player Property "a" to Player.
    if (g.trade.screen.other_player.property.a.occupied == true) {

        // Make copy of g.trade.property.other_player.a so it persists after the initialization of the Trade Event.
        var property_other_player_a_clone = JSON.parse(JSON.stringify(g.trade.property.other_player.a))

        // Change the owner of the Property from Other Player to Player.
        set_property_owner(property_other_player_a_clone, player_clone)

        // Remove the Property key from the Other Player.
        remove_player_property_key(other_player_clone, property_other_player_a_clone)

        // Add the Property key to the Player.
        add_player_property_key(player_clone, property_other_player_a_clone)

        // Notify the other Players that ownership has changed and their Boards need to be updated.
        notify_players_of_ownership_change(player_clone, property_other_player_a_clone)
    }

    // Update the Board by reasigning Other Player Property "b" to Player.
    if (g.trade.screen.other_player.property.b.occupied == true) {

        // Make copy of g.trade.property.other_player.b so it persists after the initialization of the Trade Event.
        var property_other_player_b_clone = JSON.parse(JSON.stringify(g.trade.property.other_player.b))

        // Change the owner of the Property from Other Player to Player.
        set_property_owner(property_other_player_b_clone, player_clone)

        // Remove the Property key from the Other Player.
        remove_player_property_key(other_player_clone, property_other_player_b_clone)

        // Add the Property key to the Player.
        add_player_property_key(player_clone, property_other_player_b_clone)

        // Notify the other Players that ownership has changed and their Boards need to be updated.
        notify_players_of_ownership_change(player_clone, property_other_player_b_clone)
    }

    // Update the Board by reasigning Other Player Property "c" to Player.
    if (g.trade.screen.other_player.property.c.occupied == true) {

        // Make copy of g.trade.property.other_player.c so it persists after the initialization of the Trade Event.
        var property_other_player_c_clone = JSON.parse(JSON.stringify(g.trade.property.other_player.c))

        // Change the owner of the Property from Other Player to Player.
        set_property_owner(property_other_player_c_clone, player_clone)

        // Remove the Property key from the Other Player.
        remove_player_property_key(other_player_clone, property_other_player_c_clone)

        // Add the Property key to the Player.
        add_player_property_key(player_clone, property_other_player_c_clone)

        // Notify the other Players that ownership has changed and their Boards need to be updated.
        notify_players_of_ownership_change(player_clone, property_other_player_c_clone)
    }

    // Process Property movement transactions.
    get_queue()

    // Remove the Trade Player Button and the Trade Other Player Button from the Trade Screen.
    d3.select("#trade_player_button_id").remove()
    d3.select("#trade_player_property_a_button_id").remove()
    d3.select("#trade_player_property_b_button_id").remove()
    d3.select("#trade_player_property_c_button_id").remove()

    d3.select("#trade_other_player_button_id").remove()
    d3.select("#trade_other_player_property_a_button_id").remove()
    d3.select("#trade_other_player_property_b_button_id").remove()
    d3.select("#trade_other_player_property_c_button_id").remove()

    // Reset the Trade Screen.
    document.getElementById("trade_player_amount").value = 0
    g.trade.screen.player.property.a.occupied = false
    g.trade.screen.player.property.b.occupied = false
    g.trade.screen.player.property.c.occupied = false

    document.getElementById("trade_other_player_amount").value = 0
    g.trade.screen.other_player.property.a.occupied = false
    g.trade.screen.other_player.property.b.occupied = false
    g.trade.screen.other_player.property.c.occupied = false

    // Hide the Trade Screen.
    d3.select("#" + g.trade.screen.id).classed('visible', false)
    d3.select("#" + g.trade.screen.id).classed('invisible', true)

    // Define a multiple-line message to be displayed on the Roll Dice Screen.
    var message = ""

    // Determine if the player who is accepting the offer started the Trade Event.
    if (window.name == g.trade.player.key) {

        // This player started and stopped the Trade Event.  
        // Determine if previously they rolled doubles or the Roll Button was visible.
        if ((player.doubles > 0) || (g.roll_button_class == "visible")){

            // Show the normal buttons for a player who previously rolled doubles.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
                return false
            })
        } else {

            // Show the normal buttons.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"].includes(d)) { return true }
                return false
            })
        }

        // Inform the Player that the Other Player accepted the offer on the first line.
        message = `You accepted the offer from Other Player ${g.trade.other_player.name}.;`

        // After displaying buttons, stop checking the queue and wait for a button to be pressed.
        clearInterval(g.intervals[window.name])
        console.log("Stopped listening to queue for Player:", window.name)

    } else {

        // Inform the Other Player accepted the offer on the first line.
        message = `You accepted the offer from Player ${g.trade.player.name}.;`
        log(`${g.trade.other_player.name} accepted the offer from ${g.trade.player.name}.`)

        // Inform the Player or Other Player when it is their turn on the second line.
        message += "The buttons will reappear when it is your turn."

        // Hide all buttons.  The buttons will reappear when it is the player's turn.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Reset"].includes(d)) { return true }
            return false
        })

        // Have the Other Player start monitoring their queue.
        g.intervals[window.name] = setInterval(get_queue, g.queue_interval)
        console.log("Started listening to queue for Player:", window.name)
    }

    // Display the multiple-line message on the Roll Dice Screen.
    add_roll_dice_message(message)

    // Update the buttons on the Roll Dice Screen.
    hide_expose_roll_dice_buttons(active_buttons)

    // Reset the Trade Event.
    g.trade.in = false

    // Reset the participants of the Trade Event.
    g.trade.player = null
    g.trade.other_player.key = null

    // Reset the monies of the Trade Event.
    g.trade.money.player = 0
    g.trade.money.other_player = 0

    // Reset the Properties of the Trade Event.
    g.trade.property.player.a = null
    g.trade.property.player.b = null
    g.trade.property.player.c = null

    g.trade.property.other_player.a = null
    g.trade.property.other_player.b = null
    g.trade.property.other_player.c = null
}

function process_the_cancel_request(player) {

    // Remove the Trade Player Button and the Trade Other Player Button from the Trade Screen.
    d3.select("#trade_player_button_id").remove()
    d3.select("#trade_other_player_button_id").remove()

    // Hide the Trade Screen.
    d3.select("#" + g.trade.screen.id).classed('visible', false)
    d3.select("#" + g.trade.screen.id).classed('invisible', true)

    // Update the message on the Roll Dice Screen.
    var message = ""
    message = "You cancelled the trade.;"
    message += "Roll dice or select another action."
    add_roll_dice_message(message)
    log(`${player.name} cancelled the trade.`)

    // This player started and stopped the Trade Event.  Determine if previously they rolled doubles.
    if ((player.doubles > 0) || (g.roll_button_class == "visible")){

        // Show the normal buttons for a player who previously rolled doubles.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
            return false
        })
    } else {

        // Show the normal buttons.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"].includes(d)) { return true }
            return false
        })
    }

    // Update the buttons on the Roll Dice Screen.
    hide_expose_roll_dice_buttons(active_buttons)

    // Reset the Trade Event.
    g.trade.in = false

    // Reset the participants of the Trade Event.
    // g.trade.player = null
    // g.trade.other_player.key = null

    // Reset the monies of the Trade Event.
    // g.trade.money.player = 0
    // g.trade.money.other_player = 0

    // Reset the monies of the Trade Screen.
    document.getElementById("trade_player_amount").value = 0
    document.getElementById("trade_other_player_amount").value = 0


    // Remove the Trade Player Button and the Trade Other Player Button from the Trade Screen.
    d3.select("#trade_player_button_id").remove()
    d3.select("#trade_player_money_button_id").remove()
    d3.select("#trade_player_property_a_button_id").remove()
    d3.select("#trade_player_property_b_button_id").remove()
    d3.select("#trade_player_property_c_button_id").remove()

    d3.select("#trade_other_player_button_id").remove()
    d3.select("#trade_other_player_money_button_id").remove()
    d3.select("#trade_other_player_property_a_button_id").remove()
    d3.select("#trade_other_player_property_b_button_id").remove()
    d3.select("#trade_other_player_property_c_button_id").remove()

    // Reset the Properties of the Trade Event.
    // g.trade.property.player.a = null
    // g.trade.property.player.b = null
    // g.trade.property.player.c = null

    // g.trade.property.other_player.a = null
    // g.trade.property.other_player.b = null
    // g.trade.property.other_player.c = null

    // Reset the occupied flags on the Trade Screen.
    g.trade.screen.player.property.a.occupied = false
    g.trade.screen.player.property.b.occupied = false
    g.trade.screen.player.property.c.occupied = false

    g.trade.screen.other_player.property.a.occupied = false
    g.trade.screen.other_player.property.b.occupied = false
    g.trade.screen.other_player.property.c.occupied = false
}
