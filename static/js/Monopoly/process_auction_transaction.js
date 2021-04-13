function process_auction_transaction(transaction) {

    // Verify paramenter "transaction" was defined.
    if (typeof transaction == "undefined") {
        console.log("\nError: process_auction_transaction.js: process_auction_transaction")
        console.log('Parameter "transaction" was undefined.')
        console_trace(); set_error_encountered()
        return
    }

    // Verify parameter "transaction" was not null.
    if (transaction == null) {
        console.log("\nError: process_auction_transaction.js: process_auction_transaction")
        console.log('Parameter "transaction" was null.')
        console_trace(); set_error_encountered()
        return
    }

    // Make transaction parameters globally available.
    var details = transaction.details
    console.log("details:", details)
    g.auction.in = details.in
    g.auction.starter_key = details.starter_key
    g.auction.doubles_were_rolled = details.doubles_were_rolled
    g.auction.property = details.property
    g.auction.bids = details.bids
    g.auction.highest_bidder_key = details.highest_bidder_key
    g.auction.highest_bid = details.highest_bid

    console.log("g.auction after loaded from details:", g.auction)
    // g.auction.number_of_folds = details.number_of_folds

    var player_name = format_name_from_key(window.name)

    log(`${player_name} processing auction transaction.`)

    // Check if the auction is done.
    if (g.auction.in == false) {

        // The auction is done so remove the Auction Screen from the Roll Dice Screen.
        end_auction_for_this_player()

        return
    }

    // Determine if the Player is bankrupt.
    if (g.poorhouse[window.name] == true) {

        // The bankrupt Player folds.
        g.auction.bids[window.name] = "Fold"

        var player_name = format_name_from_key(window.name)

        log(`${player_name} folded because they are bankrupt.`)
    }


    // Added 2021-03-07 13:14
    // Display the Auction Screen.
    if (g.auction.in == true) {

        // Initialize the sugguested bid amount.
        var o = d3.select("#bid_amount")

        o["_groups"][0][0]["value"] = g.auction.highest_bid + 10

        event_group_id = "auction_group_id"

        // Unhide the Auction Screen.
        d3.select("#" + event_group_id).classed('visible', true)
        d3.select("#" + event_group_id).classed('invisible', false)


        if (g.auction.bids[window.name] == "Fold") {
            hide_bid_and_fold_auction_buttons()
        } else {
            // Unide the Bid Button and the Fold Button on the Auction Screen.
            unhide_bid_and_fold_auction_buttons()
        }

        // Hide all buttons on the Roll Dice Screen.
        var active_buttons = []

        // Update the buttons on the Roll Dice Screen.
        hide_expose_roll_dice_buttons(active_buttons)

        // Show the property card.
        d3.select("#" + g.auction.property.key + "_card_group_id").classed('visible', true)
        d3.select("#" + g.auction.property.key + "_card_group_id").classed('invisible', false)

        var player_name = format_name_from_key(window.name)

        log(`${player_name} displayed the Auction Screen.`)

        // Display the current bids.
        for (var player_key in g.auction.bids) {

            // Get a reference to the bid of a player.
            var bid = g.auction.bids[player_key]

            // Format the identifier of the current bid for the current player.
            var player_auction_bid_amount_id = player_key + "_auction_bid_amount_id"

            // Update the displayed bid amount for the current player
            if (bid == "Fold") {
                d3.select("#" + player_auction_bid_amount_id).text(bid)
            } else {
                d3.select("#" + player_auction_bid_amount_id).text(bid.toString())
            }
        }

        log(`${player_name} displayed the current bids.`)
    }

    // Determine the highest bidder and highest bid as well as the number of folds.
    g.auction.number_of_folds = 0;

    for (var player_key in g.auction.bids) {

        // Get a reference to the bid of a player.
        var bid = g.auction.bids[player_key];

        // Do not calculate highest bid if a player has folded.
        if (bid == "Fold") {

            // Increment the number of folds.
            g.auction.number_of_folds += 1;

        } else {

            // Convert the bid to type integer.
            bid = parseInt(bid);

            // Format the identifier of the current bid for the current player.
            var player_auction_bid_amount_id = player_key + "_auction_bid_amount_id";

            // Update the displayed bid amount for the current player
            d3.select("#" + player_auction_bid_amount_id).text(bid.toString());

            // Determine if the bid of a player is the highest bid.
            if (bid > g.auction.highest_bid) {

                // Update the Auction Event with the highest bid and highest bidder.
                g.auction.highest_bid = bid;
                g.auction.highest_bidder_key = player_key
                var player_name = format_name_from_key(player_key) 
                log(`${player_name} is the newest highest bidder.`)
            }
        }
    }

    log(`${player_name} counted ${g.auction.number_of_folds} folds.`)

    // If no player made a bid, assign to player who started the Auction Event.
    // TODO:  Changed number of folds from 3 to 2.  2021-03-07 10:59
    if (g.auction.number_of_folds > 2) {

        // Assign the property to the highest bidder and issue an end-auction transaction to all players.
        assign_property_to_highest_bidder()

        return
    }

    // Determine if the current player has folded.
    if (g.auction.bids[window.name] == "Fold") {

        // This player has folded.  Hide the Bid and Fold buttons on the Auction screen.
        hide_bid_and_fold_auction_buttons()

        // Hide finance buttons on the Roll Dice Screen.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Reset"].includes(d)) { return true }
            return false;
        })

        hide_expose_roll_dice_buttons(active_buttons)

        // Pass control to the next player.
        submit_bid()

        // No further processing for this player.  Continue monitoring the queue.
        return
    }

    if (g.auction.number_of_folds > 2) {

        // If there are three folds and no highest bidder, make the player who started the auction the highest bidder.
        if (g.auction.highest_bidder_key == null) {
            g.auction.highest_bidder_key = g.auction.starter_key;
            g.auction.highest_bid = 0;

            // Increment the highest bid by 1 and offer it to the current player.
            var o = d3.select("#bid_amount");
            o["_groups"][0][0]["value"] = g.auction.highest_bid + 10;

            // This player continues to participate in the auction.
            continue_auction_for_this_player();

        } else {
            // Assign the property to the highest bidder and issue an end-auction transaction to all players.
            assign_property_to_highest_bidder();
        }

    } else {

        // Increment the highest bid by 10 and offer it to the current player.
        var o = d3.select("#bid_amount");
        o["_groups"][0][0]["value"] = g.auction.highest_bid + 10;

        // This player continues to participate in the auction.
        continue_auction_for_this_player();
    }
}

function continue_auction_for_this_player() {

    var player_name = format_name_from_key(window.name)

    log(`Auction continued for ${player_name}.`)

    // Unhide the Roll Dice Screen.
    d3.select("#" + "roll_dice_group_id").classed('visible', true)
    d3.select("#" + "roll_dice_group_id").classed('invisible', false)

    // Unhide the finance buttons on the Roll Dice Screen.
    var active_buttons = g.dialog.buttons.filter((d) => {
        if (["Mortgage", "Sell", "Reset"].includes(d)) { return true }
        return false
    })

    hide_expose_roll_dice_buttons(active_buttons)

    // Unhide the Auction Screen.
    d3.select("#" + "auction_group_id").classed('visible', true)
    d3.select("#" + "auction_group_id").classed('invisible', false)

    // Unhide the Bid Button and Fold Button on the Auction Screen.
    unhide_bid_and_fold_auction_buttons()

    // Unhide the Property Card.
    var property_card_group_id = g.auction.property.key + "_card_group_id"
    d3.select("#" + property_card_group_id).classed('visible', true)
    d3.select("#" + property_card_group_id).classed('invisible', false)

    // After displaying buttons, stop checking the queue and wait for a button to be pressed.
    clearInterval(g.intervals[window.name])
    console.log("Stopped listening to queue for Player:", window.name)
}

function assign_property_to_highest_bidder() {

    log(`${window.name}  determined that ${g.auction.highest_bidder_key} is the highest bidder.`)

    var transaction = {}
    transaction["code"] = "get_player"
    if (g.auction.highest_bidder_key == null) {
        g.auction.highest_bidder_key = g.auction.starter_key
    }
    transaction["key"] = g.auction.highest_bidder_key

    // Convert the transaction into a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an unique handle for the request.
    if (typeof get_highest_bidder_request == "undefined") {
        var get_highest_bidder_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    get_highest_bidder_request.onreadystatechange = function () {

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

                    // Determine if the Player is not bankrupt.
                    if (g.poorhouse[player.key] == false) {

                        // Update the owner of the unowned property.
                        set_property_owner(g.auction.property, player)

                        // Update the player.
                        add_player_property_key(player, g.auction.property)

                        // Update the player balance.  The new balance is broadcasted to other players.
                        if (g.auction.highest_bid > player.balance) {
                            g.auction.highest_bid = player.balance
                        }
                        subtract_balance(player, g.auction.highest_bid)

                        // Update the assets on other players' boards.
                        notify_players_of_ownership_change(player, g.auction.property)
                    }

                    // Set the g.auction.in to false and pass the transaction to the next player.
                    submit_end_auction_transactions()

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

    // Send the request for ansynchronous processing.
    get_highest_bidder_request.open("GET", url, true)
    get_highest_bidder_request.send()
}

function submit_end_auction_transactions() {

    for (var player_key_index in g.player_keys) {

        // Get a player key.
        var player_key = g.player_keys[player_key_index]

        // End the auction.
        g.auction.in = false

        // Create a transaction to pass the auction to the next player.
        var transaction = {}
        transaction["code"] = "append_queue"
        transaction["key"] = player_key
        transaction["action"] = "Auction"

        // Create details containing the current bids.
        var details = {}
        details["in"] = false
        details["starter_key"] = g.auction.starter_key
        details["doubles_were_rolled"] = g.auction.doubles_were_rolled
        details["property"] = g.auction.property
        details["highest_bidder_key"] = g.auction.highest_bidder_key
        details["highest_bid"] = g.auction.highest_bid
        details["bids"] = g.auction.bids

        // Add details to the transaction.
        transaction["details"] = details

        // Add the transaction to another player's queue.
        append_queue(transaction)

        log(`${window.name}  sent end of auction transaction "Auction" to ${player_key}.`)
    }

    var starter_name = format_name_from_key(g.auction.starter_key)

    // Pass control to the next player.
    if (g.auction.doubles_were_rolled == true) {

        next_player_key = g.auction.starter_key

        log(`${starter_name} sent transaction "Roll Dice" to itself because it rolled doubles.`)

        g.auction.doubles_were_rolled = false

    } else {

        if (g.auction.starter_key == "car") { next_player_key = "top_hat"}
        else if (g.auction.starter_key == "top_hat") { next_player_key = "shoe"}
        else if (g.auction.starter_key == "shoe") { next_player_key = "dog"}
        else if (g.auction.starter_key == "dog") { next_player_key = "car"}

        next_player_name = format_name_from_key(player_key)

        log(`${starter_name} sent transaction "Roll Dice" to ${next_player_name}.`)
    }

    // Create a transaction to pass the auction to the next player.
    var transaction = {}
    transaction["code"] = "append_queue"
    transaction["key"] = next_player_key
    transaction["action"] = "Roll Dice"

    // Create details containing the current bids.
    var details = {}

    // Add details to the transaction.
    transaction["details"] = details

    // Add the transaction to another player's queue.
    append_queue(transaction)
}

function end_auction_for_this_player() {

    log(`End auction for ${window.name}.`)

    // Define the multiple-line message to be displayed on the Roll Dice Screen.
    var message = ""

    var player_name = format_name_from_key(g.auction.highest_bidder_key)

    // Determine if the Player won the auction.
    if (window.name == g.auction.highest_bidder_key) {

        var player_name = format_name_from_key(g.auction.highest_bidder_key)

        // Inform the Player that they won the auction in the first line.
        message = "You won the auction for " + g.auction.property.name + " at " + g.auction.highest_bid + ".;"
        log(`${player_name} won the bid for ${g.auction.property.name}.`)

    } else {

        // Determine if the Player is bankrupt.
        if (g.poorhouse[window.name] == true) {

            // Inform the Player that they are bankrupt on the first message line.
            message = `Sorry, but you're still in the poorhouse.;`
            log(message)
        }

        // Inform the Player who won the aution on the second message line.
        message += player_name + " won the auction for " + g.auction.property.name + " at " + g.auction.highest_bid + ".;"
        log(`${player_name} won the auction for ${g.auction.property.name}.`)
    }

    // Hide the property card.
    d3.select("#" + g.auction.property.key + "_card_group_id").classed('visible', false)
    d3.select("#" + g.auction.property.key + "_card_group_id").classed('invisible', true)

    // Hide the Bid Button and the Fold Button on the Auction Screen.
    hide_bid_and_fold_auction_buttons()

    // Hide the Auction Screen.
    d3.select("#" + "auction_group_id").classed('visible', false)
    d3.select("#" + "auction_group_id").classed('invisible', true)

    // Define buttons to be displayed on the Roll Dice Screen.
    var active_buttons = []

    // Update the buttons on the Roll Dice Screen.
    hide_expose_roll_dice_buttons(active_buttons)

    // Display the multiple-line message on the Roll Dice Screen.
    add_roll_dice_message(message)

}
