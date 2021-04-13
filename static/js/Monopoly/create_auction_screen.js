function create_auction_screen() {

    // Format the event group identifier based on the event title.
    var auction_group_id = "auction_group_id"
    var auction_border_id = "auction_border_id"
    var auction_text_id = "auction_text_id"

    // Create the group for the Auction Screen.
    d3.select("#svg")
        .append("g")
        .attr("id", auction_group_id)

    // Create the border for the Auction Screen.
    d3.select("#" + auction_group_id)
        .append("rect")
        .attr("id", auction_border_id)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", g.auction.width)
        .attr("height", g.auction.height)
        .attr("fill-opacity", "0.0")
        .attr("stroke", "darkgrey")
        .attr("stroke-width", 3)

    // Add the title for the Auction Screen.
    d3.select("#" + auction_group_id)
        .append("text")
        .attr("id", auction_text_id)
        .attr("x", g.auction.width / 2)
        .attr("y", "2em")
        .attr("fill", "White")
        .attr("fill-opacity", "1.0")
        .attr("font-size", g.auction.title_size)
        .attr("text-anchor", "middle")
        .text("Auction")


    // Determine the sizes of the text.
    var text_dimensions = measure_text("Your Bid: 1,000", g.auction.text_size)
    var your_bid_width = text_dimensions.width
    var text_height = text_dimensions.height

    // Append a Foreign Object to the Auction Screen.
    var fo = d3.select("#" + auction_group_id)
        .append("foreignObject")
        .attr("x", 20)
        .attr("y", (4 * text_height))
        .attr("width", (g.card.width - 25))
        .attr("height", text_height)

    // Append HTML to the Foreign Object.
    var fo_html = fo.append("xhtml:html")
        .attr("xmlns", "http://www.w3.org/1999/xhtml")

    // Append a label to the HTML.
    var fo_label = fo_html.append("label")
        .attr("style", "color:yellow; font-size:14px")
        .text("Your Bid:")

    // Bind the Bid Amount Field to the label for this field.
    fo_label.append("input")
        .attr("id", "bid_amount")
        .attr("type", "number")
        .attr("value", 1)
        .attr("min", 1)
        .attr("max", 9999)
        .attr("step", 10)
        .attr("style", "color:yellow; background-color:black; font-size:14px; text-align:right")

    // Create a bid amount for each player in the Auction Screen.
    for (var player_keys_index in g.player_keys) {

        var player_key = g.player_keys[player_keys_index]

        var player_name = format_name_from_key(player_key)

        var player_auction_bid_name_id = player_key + "_auction_bid_name_id"

        var player_auction_bid_amount_id = player_key + "_auction_bid_amount_id"

        var y = (7 * text_height) + (2 * player_keys_index * text_height)

        d3.select("#" + auction_group_id)
            .append("text")
            .attr("id", player_auction_bid_name_id)
            .attr("x", 20)
            .attr("y", y)
            .attr("fill", "White")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.auction.text_size)
            .attr("text-anchor", "left")
            .text(player_name)

        d3.select("#" + auction_group_id)
            .append("text")
            .attr("id", player_auction_bid_amount_id)
            .attr("x", 20 + your_bid_width)
            .attr("y", y)
            .attr("fill", "White")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.auction.text_size)
            .attr("size", 5)
            .attr("text-anchor", "right")
            .text("0")

    }

    // Create the Bid Button and Fold Button in the Auction Screen.
    var auction_buttons = {}

    var y = (15 * text_height)
    var x = (g.card.width - (2 * g.dialog.button_width)) / 3
    auction_buttons["bid"] = { "key": "bid", "name": "Bid", "x": x, "y": y }

    var x = (2 * x) + g.dialog.button_width
    auction_buttons["fold"] = { "key": "fold", "name": "Fold", "x": x, "y": y }

    for (var auction_button_key in auction_buttons) {

        var auction_button = auction_buttons[auction_button_key]

        var auction_button_group_id = auction_button.key + "_auction_button_group_id"
        var auction_button_rect_id = auction_button.key + "_auction_button_rect_id"
        var auction_button_text_id = auction_button.key + "_auction_button_text_id"

        var auction_button_text = auction_button.name

        // Append the group for an auction button to the Auction Screen.
        d3.select("#" + auction_group_id)
            .append("g")
            .attr("id", auction_button_group_id)

        // Append the rectangle for an auction button.
        d3.select("#" + auction_button_group_id)
            .append("rect")
            .attr("id", auction_button_rect_id)
            .attr("x", auction_button.x)
            .attr("y", auction_button.y)
            .attr("width", g.dialog.button_width)
            .attr("height", g.dialog.button_height)
            .attr("rx", 5)
            .attr("fill-opacity", "1.0")
            .attr("fill", "Blue")
            .attr("stroke", "darkgrey")
            .attr("stroke-width", 1)
            .on("click", (d) => {

                // Check if this is the rectangle for the Bid Button Group.
                if (d.target.id == "bid_auction_button_rect_id") { process_bid_auction_button_click() }

                // Check if this is the rectangle for the Fold Button Group.
                if (d.target.id == "fold_auction_button_rect_id") { process_fold_auction_button_click() }
            })

        // Append the text for an auction button.
        d3.select("#" + auction_button_group_id)
            .append("text")
            .attr("id", auction_button_text_id)
            .attr("x", (auction_button.x + (g.dialog.button_width / 2)))
            .attr("y", (auction_button.y + g.dialog.button_height * 0.6))
            .attr("fill", "white")
            .attr("fill-opacity", "1.0")
            .attr("font-size", "12px")
            .attr("text-anchor", "middle")
            .text(auction_button_text)
            .on("click", (d) => {

                // Check if this is the text for the Bid Button Group.
                if (d.target.id == "bid_auction_button_text_id") { process_bid_auction_button_click() }

                // Check if this is the rectangle for the Fold Button Group.
                if (d.target.id == "fold_auction_button_text_id") { process_fold_auction_button_click() }
            })
    }

    // Move the Auction Screen to the right of the Property Cards.
    var new_x = g.auction.x
    var new_y = g.auction.y
    var translate = "translate(" + new_x + " " + new_y + ")"
    d3.select("#" + auction_group_id).attr("transform", translate)

    // Hide the event until it is requested to be displayed.
    d3.select("#" + auction_group_id).classed('visible', false)
    d3.select("#" + auction_group_id).classed('invisible', true)
}

function process_fold_auction_button_click() {

    // Increment the number of folds.  Property assigned to the remaining bidder when number of folds is three.
    g.auction.number_of_folds += 1

    // Update the Auction Event to indicate that this player has foleded.
    g.auction.bids[window.name] = "Fold"

    player_name = format_name_from_key(window.name)

    log(`${player_name} folded.`)

    // Get the identifier for the player's bid amount.
    var window_name_auction_bid_amount_id = window.name + "_auction_bid_amount_id"

    // Set the value of the player's bit to be "Fold".
    d3.select("#" + window_name_auction_bid_amount_id).text("Fold")

    // Pass the current bids to the next player using a transaction.
    submit_bid()
}

function process_bid_auction_button_click() {

    // Hide the Bid Button and the Fold Button on the Auction Screen.
    hide_bid_and_fold_auction_buttons()

    // Create a transaction to get player information from the server.
    var transaction = {}
    transaction["code"] = "get_player"
    transaction["key"] = window.name

    // Convert the transaction into a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an unique handle for the request.
    if (typeof get_player_balance_request == "undefined") {
        var get_player_balance_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    get_player_balance_request.onreadystatechange = function () {

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

                    // Determine if the Player is bankrupt.
                    g.poorhouse[player.key] = player.bankrupt

                    // Determine if the Player has sufficient funds.
                    make_bid_or_fold(player)

                } else {
                    console.log("\nError: create_auction_screen.js: process_bid_aution_button_click: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: create_auction_screen.js: process_bid_aution_button_click: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for ansynchronous processing.
    get_player_balance_request.open("GET", url, true)
    get_player_balance_request.send()
}

function make_bid_or_fold(player) {

    var player_auction_bid_amount_id = player.key + "_auction_bid_amount_id"

    // Get the element containing the bid amount.
    var bid_amount = document.getElementById("bid_amount")

    // Get the bid amount from the element containing the bid amount.
    var bid_amount_value = parseInt(bid_amount.value)

    // Determine if the player has sufficient funds to buy the property.
    // If the Player is bankrupt, automatically fold.
    var threshold = player.balance * 0.20
    if ((bid_amount_value > threshold) || (g.poorhouse[player.key])) {

        // The player has insufficient funds and must fold.
        g.auction.bids[player.key] = "Fold"

        // Update the displayed bid amount for the current player
        d3.select("#" + player_auction_bid_amount_id).text("Fold")

        if (g.poorhouse[player.key]) {

            log(`${player.name} folded because they were bankrupt.`)

        } else {

            log(`${player.name} folded because ${bid_amount_value.toString()} was greater than the treshold of ${threshold.toString()}`)
        }

    } else {

        // Update the Auction Event with this player's bid.
        g.auction.bids[player.key] = bid_amount_value

        log(`${player.name} increased their bid to ${bid_amount_value.toString()}.`)

            // If it is the highest bid, update the Auction Event.
        if (bid_amount_value > g.auction.highest_bid) {
            g.auction.highest_bid = bid_amount_value
            g.auction.highest_bidder_key = player.key

            log(`${player.key} is the highest bidder at ${bid_amount_value.toString()}.`)
        }

        // Update the displayed bid amount for the current player
        d3.select("#" + player_auction_bid_amount_id).text(bid_amount_value.toString())
    }

    // Pass the current bids to the next player using a transaction.
    submit_bid()
}

function submit_bid() {

    // Get the current bids to be passed to the other players.
    var car_bid_amount = document.getElementById("car_auction_bid_amount_id").innerHTML
    var top_hat_bid_amount = document.getElementById("top_hat_auction_bid_amount_id").innerHTML
    var shoe_bid_amount = document.getElementById("shoe_auction_bid_amount_id").innerHTML
    var dog_bid_amount = document.getElementById("dog_auction_bid_amount_id").innerHTML

    // Update the global variabless with the current bids.
    g.auction.bids.car = car_bid_amount
    g.auction.bids.top_hat = top_hat_bid_amount
    g.auction.bids.shoe = shoe_bid_amount
    g.auction.bids.dog = dog_bid_amount

    // Pass control to the next player.
    if (window.name == "car") { var player_key = "top_hat" }
    else if (window.name == "top_hat") { var player_key = "shoe" }
    else if (window.name == "shoe") { var player_key = "dog" }
    else if (window.name == "dog") { var player_key = "car" }
    else {
        console.log("\nError: create_auction_screen.js: submit_bid")
        console.log("Invalid window.name:", window.name)
         
        console_trace(); set_error_encountered()
    }

    // Bypass the bankrupt Players.
    if ((player_key == "car") && (g.poorhouse.car)) {
        player_key = "top_hat"
        g.auction.bids.car = "Fold"
    }

    if ((player_key == "top_hat") && (g.poorhouse.top_hat)) {
        player_key = "shoe"
        g.auction.bids.top_hat = "Fold"
    }

    if ((player_key == "shoe") && (g.poorhouse.shoe)) {
        player_key = "dog"
        g.auction.bids.shoe = "Fold"
    }

    if ((player_key == "dog") && (g.poorhouse.dog)) {
        player_key = "car"
        g.auction.bids.dog = "Fold"
    }

    if ((player_key == "car") && (g.poorhouse.car)) {
        player_key = "top_hat"
        g.auction.bids.car = "Fold"
    }

    if ((player_key == "top_hat") && (g.poorhouse.top_hat)) {
        player_key = "shoe"
        g.auction.bids.top_hat = "Fold"
    }

    if ((player_key == "shoe") && (g.poorhouse.shoe)) {
        player_key = "dog"
        g.auction.bids.shoe = "Fold"
    }

    if ((player_key == "dog") && (g.poorhouse.dog)) {
        player_key = "car"
        g.auction.bids.dog = "Fold"
    }

    // Create a transaction to pass the auction to the next player.
    var transaction = {}
    transaction["code"] = "append_queue"
    transaction["key"] = player_key
    transaction["action"] = "Auction"

    // Create details containing the current bids.
    var details = {}
    details["in"] = g.auction.in
    details["starter_key"] = g.auction.starter_key
    details["doubles_were_rolled"] = g.auction.doubles_were_rolled
    details["property"] = g.auction.property
    details["highest_bid"] = g.auction.highest_bid
    details["highest_bidder_key"] = g.auction.highest_bidder_key
    details["bids"] = g.auction.bids
    details["number_of_folds"] = g.auction.number_of_folds

    var player_name = format_name_from_key(window.name)

    var next_player_name = format_name_from_key(player_key)

    console.log(`\n${player_name} submitted bid as "Auction" transaction to ${next_player_name}.`)
    log(`${player_name} submitted bid as "Auction" transaction to ${next_player_name}.`)

    // Add details to the transaction.
    transaction["details"] = details

    // Add the transaction to another player's queue.
    append_queue(transaction)

    // Start monitoring the transaction queue for bids from other users.
    g.intervals[window.name] = setInterval(get_queue, g.queue_interval)
    console.log(`\n${player_name} started monitoring queue.`)
    log(`${player_name} started monitoring queue.`)

    // Hide the Bid and Fold auction_buttons on the Auction Screen.
    hide_bid_and_fold_auction_buttons()

    // Hide finance buttons on the Roll Dice Screen.
    var active_buttons = g.dialog.buttons.filter((d) => {
        if (["Reset"].includes(d)) { return true }
        return false
    })

    hide_expose_roll_dice_buttons(active_buttons)
}

function hide_bid_and_fold_auction_buttons() {

    // Hide the Bid Button and Fold Button of the Auction Screen.
    d3.select("#" + "bid_auction_button_group_id").classed('visible', false)
    d3.select("#" + "bid_auction_button_group_id").classed('invisible', true)
    d3.select("#" + "fold_auction_button_group_id").classed('visible', false)
    d3.select("#" + "fold_auction_button_group_id").classed('invisible', true)
}

function unhide_bid_and_fold_auction_buttons() {

    // Unhide the Bid Button and Fold Button of the Auction Screen.
    d3.select("#" + "bid_auction_button_group_id").classed('visible', true)
    d3.select("#" + "bid_auction_button_group_id").classed('invisible', false)
    d3.select("#" + "fold_auction_button_group_id").classed('visible', true)
    d3.select("#" + "fold_auction_button_group_id").classed('invisible', false)
}

