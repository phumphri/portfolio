function process_trade_transaction(details) {

    // Extract details to local variables.
    var mode = details.mode

    // Extract details to global variables to be accessed by other functions.
    g.trade.in = details.in
    g.trade.player = details.player
    g.trade.other_player = details.other_player
    g.trade.money = details.money
    g.trade.property = details.property

    if (mode == "offer") {

        var active_buttons = process_trade_transaction_offer()

    } else if (mode == "counter") {

        var active_buttons = process_trade_transaction_counter()

    } else if (mode == "reject") {

        var active_buttons = process_trade_transaction_reject()

    } else if (mode == "accept") {

        var active_buttons = process_trade_transaction_accept()

    } else {
        console.log("\nError: process_trade_transaction.js: process_trade_transaction")
        console.log("Invalid details.mode:", details.mode)
        console_trace(); set_error_encountered()
        return
    }

    // Update the buttons on the Roll Dice Screen.
    hide_expose_roll_dice_buttons(active_buttons)
}

// Process the offer made by the originating Player.
function process_trade_transaction_offer() {

    // Unhide the Trade Screen.
    d3.select("#" + g.trade.screen.id).classed('visible', true)
    d3.select("#" + g.trade.screen.id).classed('invisible', false)

    // Move Player and Other Player to the Trade Screen.
    move_player_to_trade_screen()
    move_other_player_to_trade_screen(g.trade.other_player)

    // Clear the Properties on the Trade Screen.
    d3.select("#trade_player_property_a_button_id").remove()
    d3.select("#trade_player_property_b_button_id").remove()
    d3.select("#trade_player_property_c_button_id").remove()

    d3.select("#trade_other_player_property_a_button_id").remove()
    d3.select("#trade_other_player_property_b_button_id").remove()
    d3.select("#trade_other_player_property_c_button_id").remove()

    // Reset the occupied indicators.
    g.trade.screen.player.property.a.occupied = false
    g.trade.screen.player.property.b.occupied = false
    g.trade.screen.player.property.c.occupied = false

    g.trade.screen.other_player.property.a.occupied = false
    g.trade.screen.other_player.property.b.occupied = false
    g.trade.screen.other_player.property.c.occupied = false


    // Populate Trade Screen with the Trade Transaction Offer.
    document.getElementById("trade_player_amount").value = parseInt(g.trade.money.player)
    if (g.trade.property.player.a != null) { process_trade_property(g.trade.property.player.a) }
    if (g.trade.property.player.b != null) { process_trade_property(g.trade.property.player.b) }
    if (g.trade.property.player.c != null) { process_trade_property(g.trade.property.player.c) }

    document.getElementById("trade_other_player_amount").value = parseInt(g.trade.money.other_player)
    if (g.trade.property.other_player.a != null) { process_trade_property(g.trade.property.other_player.a) }
    if (g.trade.property.other_player.b != null) { process_trade_property(g.trade.property.other_player.b) }
    if (g.trade.property.other_player.c != null) { process_trade_property(g.trade.property.other_player.c) }

    // Update the message on the Roll Dice Screen for the Other Player.
    var message = `You received an offer from ${g.trade.player.name}.;`
    message += "You need to counter, reject or accept."
    add_roll_dice_message(message)

    // Display only the Counter Button, the Reject Button, and the Accept Button.
    var active_buttons = g.dialog.buttons.filter((d) => {
        if (["Counter", "Reject", "Accept", "Reset"].includes(d)) { return true }
        return false
    })

    // After displaying buttons, stop checking the queue and wait for a button to be pressed.
    clearInterval(g.intervals[window.name])
    console.log("Stopped listening to queue for Player:", window.name)

    // Control is passed back to the Roll Dice Screen.
    return active_buttons
}

// Process the counter offer made by either the originating Player or the Other Player.
function process_trade_transaction_counter() {

    // Validate the Counter Trade Transaction.
    if (window.name == g.trade.player.key) {

        // The user is the originating Player.
        var a = null

    } else if (window.name == g.trade.other_player.key) {

        // The user is the Other Player
        var a = null

    } else {
        console.log("\nError process_trade_transaction.js: process_trade_transaction_counter")
        console.log("window.name was not matched.")
        console.log("window.name:", window.name)
        console.log("g.trade.player.key:", g.trade.player.key)
        console.log("g.trade.other_player.key:", g.trade.other_player.key)
        console_trace(); set_error_encountered()
        return
    }

    // Clear the Properties on the Trade Screen.
    d3.select("#trade_player_property_a_button_id").remove()
    d3.select("#trade_player_property_b_button_id").remove()
    d3.select("#trade_player_property_c_button_id").remove()

    d3.select("#trade_other_player_property_a_button_id").remove()
    d3.select("#trade_other_player_property_b_button_id").remove()
    d3.select("#trade_other_player_property_c_button_id").remove()

    // Reset the occupied indicators.
    g.trade.screen.player.property.a.occupied = false
    g.trade.screen.player.property.b.occupied = false
    g.trade.screen.player.property.c.occupied = false

    g.trade.screen.other_player.property.a.occupied = false
    g.trade.screen.other_player.property.b.occupied = false
    g.trade.screen.other_player.property.c.occupied = false


    // Populate Trade Screen with the Trade Transaction Offer.
    document.getElementById("trade_player_amount").value = parseInt(g.trade.money.player)
    if (g.trade.property.player.a != null) { process_trade_property(g.trade.property.player.a) }
    if (g.trade.property.player.b != null) { process_trade_property(g.trade.property.player.b) }
    if (g.trade.property.player.c != null) { process_trade_property(g.trade.property.player.c) }

    document.getElementById("trade_other_player_amount").value = parseInt(g.trade.money.other_player)
    if (g.trade.property.other_player.a != null) { process_trade_property(g.trade.property.other_player.a) }
    if (g.trade.property.other_player.b != null) { process_trade_property(g.trade.property.other_player.b) }
    if (g.trade.property.other_player.c != null) { process_trade_property(g.trade.property.other_player.c) }

    // Define the multiple-line message for the Roll Dice Screen.
    var message = ""

    // Determine if the user is the originating Player.
    if (window.name == g.trade.player.key) {

        // Update the message on the Roll Dice Screen for the originating Player on the first line.
        message = `You received a counter offer from ${g.trade.other_player.name}.;`

    } else {

        // Update the message on the Roll Dice Screen for the Other Player on the first line.
        message = `You received a counter offer from ${g.trade.player.name}.;`
    }

    // Instruct the Player on the second line.
    message += "You need to counter, reject or accept."

    // Display the multiple-line message on the Roll Dice Screen.
    add_roll_dice_message(message)

    // Display only the Counter Button, the Reject Button, and the Accept Button.
    var active_buttons = g.dialog.buttons.filter((d) => {
        if (["Counter", "Reject", "Accept", "Reset"].includes(d)) { return true }
        return false
    })

    // After displaying buttons, stop checking the queue and wait for a button to be pressed.
    clearInterval(g.intervals[window.name])
    console.log("Stopped listening to queue for Player:", window.name)

    // Control is passed back to the Roll Dice Screen.
    return active_buttons
}

// Process the rejection from either the originating Player or the Other Player.
function process_trade_transaction_reject() {

    // Validate Reject Trade Transaction.
    if (window.name == g.trade.player.key) {

        // The user is the originating Player.
        var a = null

    } else if (window.name == g.trade.other_player.key) {

        // The user is the Other Player.
        var a = null

    } else {
        console.log("\nError: process_trade_transaction.js: process_trade_transaction: process_trade_transaction_reject")
        console.log("windows.name was not matched.")
        console.log("window.name:", window.name)
        console.log("g.trade.player.key:", g.trade.player.key)
        console.log("g.trade.other_player.key:", g.trade.other_player.key)
        return
    }

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

    // Define a multiple-line message for the Roll Dice Screen.
    var message = ""

    // Determine if the user is the originating Player.
    if (window.name == g.trade.player.key) {

        // This player started and stopped the Trade Event.  Determine if previously they rolled doubles or rolled at all.
        if (g.has_rolled == false) {

            // Show the normal buttons for a Player who previously rolled doubles.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
                return false
            })
            g.has_rolled = true
        } else {

            // Show the normal buttons.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"].includes(d)) { return true }
                return false
            })
        }

        // Update the message on the Roll Dice Screen for the originating Player on the first line.
        message = `Your offer was rejected by ${g.trade.other_player.name}.;`

        // After displaying buttons, stop checking the queue and wait for a button to be pressed.
        clearInterval(g.intervals[window.name])
        console.log("Stopped listening to queue for Player:", window.name)

    } else {

        // Update the message on the Roll Dice Screen for the Other Player on the first line.
        message = `Your offer was rejected by ${g.trade.player.name}.;`

        // Inform the Player when it is their on the second line.
        message += "Buttons will reappear when it is your turn."

        // Hide all buttons.  The buttons will reappear when it is the player's turn.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Reset"].includes(d)) { return true }
            return false
        })

        // Start monitoring the transaction queue for this player.
        g.intervals[window.name] = setInterval(get_queue, g.queue_interval)
        console.log("Started listening to queue for Player:", window.name)
    }

    // Display the multiple-line message on the Roll Dice Screen.
    add_roll_dice_message(message)

    // Reset the Trade Event.
    g.trade.in = false

    // Control is passed back to the Roll Dice Screen.
    return active_buttons
}

// Process the acceptance from the other player.
function process_trade_transaction_accept() {

    // Validate Accept Trade Transaction.
    if (window.name == g.trade.player.key) {

        // The user is the originating Player.
        var a = null


    } else if (window.name == g.trade.other_player.key) {

        // The user is the Other Player.
        var a = null

    } else {
        console.log("\nError: process_trade_transaction.js: process_trade_transaction: process_trade_transaction_accept")
        console.log("window.name was not matched.")
        console.log("g.trade.player.key:", g.trade.player.key)
        console.log("g.trade.other_player.key:", g.trade.other_player.key)
        console_trace(); set_error_encountered()
        return
    }

    // Remove the Trade Player Button and the Trade Other Player Button from the Trade Screen.
    d3.select("#trade_player_button_id").remove()
    d3.select("#trade_player_property_a_button_id").remove()
    d3.select("#trade_player_property_b_button_id").remove()
    d3.select("#trade_player_property_c_button_id").remove()

    d3.select("#trade_other_player_button_id").remove()
    d3.select("#trade_other_player_property_a_button_id").remove()
    d3.select("#trade_other_player_property_b_button_id").remove()
    d3.select("#trade_other_player_property_c_button_id").remove()

    // Reset the Trade Screen
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

    // Define a multiple-line message for the Roll Dice Screen.
    var message = ""

    // Determine if the player who is rejecting the offer started the Trade Event.
    if (window.name == g.trade.player.key) {

        // This player started and stopped the Trade Event.  Determine if previously they rolled doubles or rolled at all.
        if (g.has_rolled == false) {

            // Show the normal buttons for a player who previously rolled doubles.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
                return false
            })
            g.has_rolled = true
        } else {

            // Show the normal buttons.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"].includes(d)) { return true }
                return false
            })
        }

        // Inform the Player that their offer was accepted on the first line.
        message = `Your offer was accepted by  ${g.trade.other_player.name}.;`

        // After displaying buttons, stop checking the queue and wait for a button to be pressed.
        clearInterval(g.intervals[window.name])
        console.log("Stopped listening to queue for Player:", window.name)

    } else {

        // Inform the Other Player that their counter offer was accepted on the first line.
        message = `Your offer was accepted by  ${g.trade.player.name}.;`

        // Inform the Player when it is their turn on the second line.
        message += "Buttons will reappear when it is your turn."

        // Hide all buttons.  The buttons will reappear when it is the player's turn.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Reset"].includes(d)) { return true }
            return false
        })

        // Start monitoring the transaction queue for this player.
        g.intervals[window.name] = setInterval(get_queue, g.queue_interval)
        console.log("Started listening to queue for Player:", window.name)
    }

    // Display the multiple-line message on the Roll Dice Screen.
    add_roll_dice_message(message)

    // Reset the Trade Event.
    g.trade.in = false

    // Control is passed back to the Roll Dice Screen.
    return active_buttons
}

