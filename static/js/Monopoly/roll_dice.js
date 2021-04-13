function roll_dice() {

    var dialog = {}
    dialog["group_id"] = "roll_dice_group_id"
    dialog["border_id"] = "roll_dice_border_id"
    dialog["text_id_1"] = g.roll_dice.screen.text_id_1
    dialog["text_id_2"] = g.roll_dice.screen.text_id_2
    dialog["text_id_3"] = g.roll_dice.screen.text_id_3
    dialog["text_id_4"] = g.roll_dice.screen.text_id_4
    dialog["button_group_id"] = "roll_dice_button_group_id"
    dialog["code"] = "get_number_of_assigned"
    dialog["active_buttons"] = ["Roll"]
    dialog["number_of_assigned"] = 0
    dialog["next_player_key"] = null
    dialog["property_id"] = "roll_dice_property_id"
    dialog["winner_name"] = null


    // Construct the Roll Dice Screen.
    o = document.getElementById(dialog.group_id)
    if (o == null) {
        construct_roll_dice_screen()
    }

    function construct_roll_dice_screen() {

        // console.log("function construct_roll_dice_screen()")

        // Create dialog group.
        d3.select("#svg")
            .append("g")
            .attr("id", dialog.group_id)

        // Create dialog rectangle.
        d3.select("#" + dialog.group_id)
            .append("rect")
            .attr("id", dialog.border_id)

        // Hide the Roll Dice Screen until it is called.
        d3.select("#" + dialog.group_id).classed('visible', false)
        d3.select("#" + dialog.group_id).classed('invisible', true)

        // Set border properties.
        d3.select("#" + dialog.border_id)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", g.dialog.width)
            .attr("height", g.dialog.height)
            .attr("fill-opacity", "0.0")
            .attr("stroke", "darkgrey")
            .attr("stroke-width", 3)

        // Add first message line.
        d3.select("#" + dialog.group_id)
            .append("text")
            .attr("id", dialog.text_id_1)
            .attr("x", g.card.width + g.dialog.button_margin)
            .attr("y", g.dialog.height * 0.1)
            .attr("fill", "white")
            .attr("fill-opacity", "1.0")
            .attr("font-size", "18px")
            .attr("text-anchor", "left")
            .text("Roll Dice")

        // Add the second message line.
        d3.select("#" + dialog.group_id)
            .append("text")
            .attr("id", dialog.text_id_2)
            .attr("x", g.card.width + g.dialog.button_margin)
            .attr("y", g.dialog.height * 0.2)
            .attr("fill", "white")
            .attr("fill-opacity", "1.0")
            .attr("font-size", "18px")
            .attr("text-anchor", "left")

        // Add the third message line.
        d3.select("#" + dialog.group_id)
            .append("text")
            .attr("id", dialog.text_id_3)
            .attr("x", g.card.width + g.dialog.button_margin)
            .attr("y", g.dialog.height * 0.3)
            .attr("fill", "white")
            .attr("fill-opacity", "1.0")
            .attr("font-size", "18px")
            .attr("text-anchor", "left")

        // Add the fourth message line.
        d3.select("#" + dialog.group_id)
            .append("text")
            .attr("id", dialog.text_id_4)
            .attr("x", g.card.width + g.dialog.button_margin)
            .attr("y", g.dialog.height * 0.4)
            .attr("fill", "white")
            .attr("fill-opacity", "1.0")
            .attr("font-size", "18px")
            .attr("text-anchor", "left")

        // Add property rectangle.
        d3.select("#" + dialog.group_id)
            .append("rect")
            .attr("id", dialog.property_id)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", g.card.width)
            .attr("height", g.card.height)
            .attr("fill-opacity", "0.0")
            .attr("stroke", "darkgrey")
            .attr("stroke-width", 3)

        // Group the buttons together.
        d3.select("#" + dialog.group_id)
            .append("g")
            .attr("id", dialog.button_group_id)

        // Create each button.
        for (button_index in g.dialog.buttons) {

            // Select the next button for the Roll Dice Screen.
            var button = g.dialog.buttons[button_index]

            // Format the button identifier, allowing for two spaces in "Go To Jail".
            var button_id = button.toLowerCase() + "_button_id"
            button_id = button_id.replace(" ", "_")
            button_id = button_id.replace(" ", "_")

            // Format the identifier for the button text, again allowing for two spaces.
            var button_text_id = button.toLowerCase() + "_button_text_id"
            button_text_id = button_text_id.replace(" ", "_")
            button_text_id = button_text_id.replace(" ", "_")

            // Calculate the button's horizontal position.
            if (button_index < 6) {
                var i = button_index
            } else if (button_index < 12) {
                i = button_index - 6
            } else if (button_index < 18) {
                i = button_index - 12
            } else {
                i = button_index - 18
            }

            // Find the middle of the dialog box.
            var x = g.card.width + g.dialog.button_margin

            // Add the widths of the previous buttons and margin.
            x += i * (g.dialog.button_width + g.dialog.button_margin)

            // Calculate the button's vertical position.
            if (button_index < 6) {
                var y = g.dialog.height * 0.4
            } else if (button_index < 12) {
                y = g.dialog.height * 0.55
            } else if (button_index < 18) {
                y = g.dialog.height * 0.7
            } else {
                y = g.dialog.height * 0.85
            }

            d3.select("#" + dialog.button_group_id)
                .append("rect")
                .attr("id", button_id)
                .attr("x", x)
                .attr("y", y)
                .attr("width", g.dialog.button_width)
                .attr("height", g.dialog.button_height)
                .attr("rx", 5)
                .attr("fill-opacity", "1.0")
                .attr("fill", "Blue")
                .attr("stroke", "darkgrey")
                .attr("stroke-width", 1)
                .on("click", (d) => { get_selected_player(d) })

            d3.select("#" + dialog.button_group_id)
                .append("text")
                .attr("id", button_text_id)
                .attr("x", (x + (g.dialog.button_width / 2)))
                .attr("y", (y + g.dialog.button_height * 0.6))
                .attr("fill", "white")
                .attr("fill-opacity", "1.0")
                .attr("font-size", "12px")
                .attr("text-anchor", "middle")
                .text(button)
                .on("click", (d) => { get_selected_player(d) })

        }

        // Move dialog box to middle of board
        var translate = "translate(" + g.dialog.x + " " + g.dialog.y + ")"
        d3.select("#" + dialog.group_id).attr("transform", translate)

        // Display just the Roll Button on the Roll Dice Screen.
        var active_buttons = ["Roll"]
        hide_expose_roll_dice_buttons(active_buttons)

        // Return to the Roll Dice Screen with only the Roll Button displayed.
    }

    function get_selected_player(d) {

        var transaction = {}
        transaction["code"] = "get_player"
        transaction["key"] = window.name

        // Convert the transaction to a JSON string.
        transaction = JSON.stringify(transaction)

        // Append the transaction to the url base.
        url = "/monopoly_api?transaction="
        url += transaction

        // Create an asynchronous request for setting the Player.
        if (typeof get_selected_player_request == "undefined") {
            var get_selected_player_request = new XMLHttpRequest()
        }

        // Create an asynchronous listener to monitor the request.
        get_selected_player_request.onreadystatechange = function () {

            // The server is done with this request.
            if (this.readyState == 4) {

                // The request was successful.
                if (this.status == 200) {

                    // Convert the response to a javascript object.
                    response = JSON.parse(this.responseText)

                    // Check for a successful response.
                    if (response.status == "Pass") {

                        // Successful response returns the Player.
                        var player = response.player

                        // Extract the "bankrupt" attribute from the Player.
                        g.poorhouse[player.key] = player.bankrupt

                        // Determine the that Player is not in the Poorhouse.
                        if (g.poorhouse[player.key] == false) {

                            // Check if there are enought players to start.
                            get_selected_player_callback(player, d)
                        }

                    } else {
                        console.log("\nError: roll_dice.js: roll_dice: get_selected_player: onreadystatechange")
                        console.log("response.status:", response.status)
                        console.log("response.text:", response.text)
                         
                        console_trace(); set_error_encountered()
                    }

                } else {
                    console.log("\nError: roll_dice.js: roll_dice: get_selected_player: onreadystatechange")
                    console.log("this.status:", this.status)
                    console.log("this.statusText:", this.statusText)
                     
                    console_trace(); set_error_encountered()
                }
            }
        }

        // Send the asynchronous request to the server.
        get_selected_player_request.open("GET", url, true)
        get_selected_player_request.send()
    }

    function get_selected_player_callback(player, d) {

        // Check the player's queue every five seconds.
        get_delay = 5000

        // Build the server transaction to get the number of assigned players.
        var transaction = {}
        transaction["code"] = "get_number_of_assigned"
        transaction = JSON.stringify(transaction)

        // Append the transaction to the base url.
        url = "/monopoly_api?transaction="
        url += transaction

        // Create the unique request.
        var get_number_of_assigned_request = new XMLHttpRequest()

        // Create an asychronous listener to monitor the request.
        get_number_of_assigned_request.onreadystatechange = function () {

            // The server is done with the request.
            if (this.readyState == 4) {

                // The request was successful.
                if (this.status == 200) {

                    // Convert json response text to a response dictionary.
                    response = JSON.parse(this.responseText)

                    // Check the status of the response.
                    if (response.status == "Pass") {

                        // Extract the numberof assigned from the response.
                        dialog.number_of_assigned = response.number_of_assigned

                        // There were insufficient number of players.
                        if (dialog.number_of_assigned < 4) {

                            // Update the message on the Roll Dice Screen.
                            add_roll_dice_message(`Please wait.  There are only ${dialog.number_of_assigned.toString()} players.`)

                            // Hide all the buttons on the Roll Dice Screen, preventing any user input.
                            var active_buttons = []
                            hide_expose_roll_dice_buttons(active_buttons)

                            // Start monitoring the transaction queue for this player.
                            g.intervals[window.name] = setInterval(get_queue, g.queue_interval)
                            console.log(`${player.name} started monitoring queue.`)
                            log(`${player.name} started monitoring queue.`)

                        } else {

                            // Process the user's roll.
                            process_roll_dice_request(player, d)
                        }

                    } else {
                        console.log("\nError: roll_dice.js: roll_dice: get_number_of_assigned: readystatechange")
                        console.log("response.status:", response.status)
                        console.log("response.text:", response.text)
                        console.log("this.responseText:", this.responseText)
                         
                        console_trace(); set_error_encountered()
                    }

                } else {
                    console.log("\nError: roll_dice.js: roll_dice: get_number_of_assigned: readystatechange")
                    console.log("this.status:", this.status)
                    console.log("this.text:", this.statusText)
                     
                    console_trace(); set_error_encountered()
                }
            }
        }

        // Send the request to the server.
        get_number_of_assigned_request.open("GET", url, true)
        get_number_of_assigned_request.send()
    }

    function process_roll_dice_request(player, d) {

        g.has_rolled = false

        // Determine which button was selected.
        if ((d.target.id == "roll_button_id") || (d.target.id == "roll_button_text_id")) {

            process_roll_request(player)

        } else if ((d.target.id == "buy_button_id") || (d.target.id == "buy_button_text_id")) {

            process_buy_request(player)

        } else if ((d.target.id == "auction_button_id") || (d.target.id == "auction_button_text_id")) {

            process_auction_request(player)

        } else if ((d.target.id == "bid_button_id") || (d.target.id == "bid_button_text_id")) {

            process_bid_request(player)

        } else if ((d.target.id == "fold_button_id") || (d.target.id == "fold_button_text_id")) {

            process_fold_request(player)

        } else if ((d.target.id == "trade_button_id") || (d.target.id == "trade_button_text_id")) {

            process_the_trade_request(player)

        } else if ((d.target.id == "pay_button_id") || (d.target.id == "pay_button_text_id")) {

            process_pay_request(player)

        } else if ((d.target.id == "collect_button_id") || (d.target.id == "collect_button_text_id")) {

            process_collect_request(player)

        } else if ((d.target.id == "go_button_id") || (d.target.id == "go_button_text_id")) {

            process_go_to_property_request(player)

        } else if ((d.target.id == "build_button_id") || (d.target.id == "build_button_text_id")) {

            process_build_request(player)

        } else if ((d.target.id == "mortgage_button_id") || (d.target.id == "mortgage_button_text_id")) {

            process_mortgage_request(player)

        } else if ((d.target.id == "unmortgage_button_id") || (d.target.id == "unmortgage_button_text_id")) {

            process_unmortgage_request(player)

        } else if ((d.target.id == "sell_button_id") || (d.target.id == "sell_button_text_id")) {

            process_sell_request(player)

        } else if ((d.target.id == "end_turn_button_id") || (d.target.id == "end_turn_button_text_id")) {

            process_end_turn_request(player)

        } else if ((d.target.id == "offer_button_id") || (d.target.id == "offer_button_text_id")) {

            process_the_offer_request(player)

        } else if ((d.target.id == "counter_button_id") || (d.target.id == "counter_button_text_id")) {

            process_the_counter_request()

        } else if ((d.target.id == "reject_button_id") || (d.target.id == "reject_button_text_id")) {

            process_the_reject_request(player)

        } else if ((d.target.id == "accept_button_id") || (d.target.id == "accept_button_text_id")) {

            process_the_accept_request(player)

        } else if ((d.target.id == "cancel_button_id") || (d.target.id == "cancel_button_text_id")) {

            process_the_cancel_request(player)

        } else if ((d.target.id == "jail_button_id") || (d.target.id == "jail_button_text_id")) {

            process_jail_request(player)

        } else if ((d.target.id == "reset_button_id") || (d.target.id == "reset_button_text_id")) {

            process_reset_request()

        } else if ((d.target.id == "go_to_jail_button_id") || (d.target.id == "go_to_jail_button_text_id")) {

            process_jail_request(player)

        } else if ((d.target.id == "add_card_button_id") || (d.target.id == "add_card_button_text_id")) {

            process_add_card_request(player)

        } else if ((d.target.id == "use_card_button_id") || (d.target.id == "use_card_button_text_id")) {

            process_use_card_request(player)

        } else {

            // Update the message on the Roll Dice Screen that an invalid button was pressed.
            add_roll_dice_message("Invalid button was pressed: " + d.target.id)

            // Display only the Reset Button on the Roll Dice Screen when this error occurs.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Reset"].includes(d)) { return true }
                return false
            })

            hide_expose_roll_dice_buttons(active_buttons)

            console.log("\nError: roll_dice.js: roll_dice: process_roll_dice_request")
            console.log("Invalid d.target.id:", d.target.id)
             
            console_trace(); set_error_encountered()
        }
    }

    function process_roll_request(player) {

        // Roll dice.
        var dice_1 = Math.floor((Math.random() * 6)) + 1
        var dice_2 = Math.floor((Math.random() * 6)) + 1
        var dice = dice_1 + dice_2

        // Indicate to other functions that the Player has rolled dice.
        g.has_rolled = true

        // Notify the user what was rolled.
        if (dice_1 == dice_2) {

            player.doubles += 1
            player.has_rolled_doubles = true

            add_roll_dice_message(`${player.name} rolled double ${dice_1.toString()} for ${dice.toString()}.`)
            log(`${player.name} rolled double ${dice_1.toString()} for ${dice.toString()}.`)

        } else {

            player.doubles = 0
            player.has_rolled_doubles = false

            add_roll_dice_message(`${player.name} rolled a ${dice_1.toString()} and a ${dice_2.toString()} for ${dice.toString()}.`)
            log(`${player.name} rolled a ${dice_1.toString()} and a ${dice_2.toString()} for ${dice.toString()}.`)
        }

        // Check if the player is in jail.
        if (player["jail"] == true) {

            // The player was in jail when dice were rolled.
            process_roll_request_player_in_jail(player, dice)

            // Determine if the player is released from jail.
            if (player["jail"] == false) {

                // Update the jail status of the player.
                set_player_out_of_jail(player)
            }

            // The player is not in jail.  Check if the player rolled three doubles.
        } else if (player.doubles > 2) {

            // Execute the following string after the player's piece has been placed at sequence 29.
            var command_string = "dice = 1; "
            command_string += "move_piece(player.key, dice, use_prior_sequence = false); "
            command_string += "process_roll_request_notify_players(player, dice)"

            // Place the player's piece just before "Go To Jail" and execute the command string.
            update_player_sequence(player, 29, command_string)

            // Update the jail status of the player.
            set_player_in_jail(player)

            // The player is neither in jail nor rolled three doubles.  Move player's piece normally.
        } else {

            // Move the player's token.  Process property is done during move_piece.
            move_piece(player.key, dice, use_prior_sequence = false)

            // Move the piece for this player on all boards.
            process_roll_request_notify_players(player, dice)
        }

        // Automation:  Used only in automation mode.
        // unmortgage_properties(player)
    }

    function process_roll_request_player_in_jail(player, dice) {

        // Increment the number of rollys by the player while in jail.
        player.rolls_in_jail += 1

        // The player gets out of jail if they roll doubles.
        if (player.doubles > 0) {

            // Doubles get you out of jail, not an extra turn.
            player.doubles = 0

            // Replease the player from jail because they rolled doubles.
            player["jail"] = false

            // Configure the piece for the player.
            g.piece = {}
            g.piece["group_id"] = player.key + "_piece_group_id"
            g.piece["border_id"] = player.key + "_piece_border_id"
            g.piece["text_id"] = player.key + "_piece_text_id"

            // Move the player's piece to the jail's lobby.
            var new_x = g.left_margin
            var new_y = (10 * g.properties.height)
            var translate = "translate(" + new_x + " " + new_y + ")"
            d3.select("#" + g.piece.group_id)
                .transition()
                .delay(0)
                .duration(500)
                .attr("transform", translate)

            // Update the player's location (sequence).
            update_player_sequence(player, 10)

            // Inform the user that they are out of jail.
            var message = "Doubles got " + player.name + " out of jail.;"

            // Inform the user what actions are available.
            message += "Roll dice or take other action."

            // Display the mutiple-line message to the Roll Dice Screen.
            add_roll_dice_message(message)

            dialog["active_buttons"] = g.dialog.buttons.filter((d) => {
                if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
                return false
            })

            // Update the buttons on the Roll Dice Screen.
            hide_expose_roll_dice_buttons(dialog.active_buttons)

        } else if (player.rolls_in_jail > 2) {

            // Allow the player to pay with net worth.
            process_pay_request(player)

        } else {

            // Inform the user that they are out of jail after paying a fine.
            add_roll_dice_message(`No doubles.  No card.  ${player.name} remains in lockup.`)

            // Hide all buttons and pass control to another player.
            process_end_turn_request(player)
        }
    }

    function process_roll_request_notify_players(player, dice) {

        // Move this player on all boards.
        var player_keys = ["car", "top_hat", "shoe", "dog"]
        for (var player_keys_index in player_keys) {

            // Bypass the current player.
            var player_key = player_keys[player_keys_index]
            if (player_key == player_keys[player_keys_index]) {
                continue
            }

            // Create a transaction to move a player's token.
            var transaction = {}
            transaction["code"] = "append_queue"
            transaction["key"] = player_key
            transaction["action"] = "Move Piece"

            // Add details to the transaction.
            var details = {}
            details["target_player_key"] = player["key"]
            details["dice"] = dice
            details["use_prior_sequence"] = true
            transaction["details"] = details

            // Add the transaction to another player's queue.
            append_queue(transaction)
        }
    }

    function process_buy_request(player) {

        // Update the owner of the unowned property.
        // g.current_property was set by move_piece when called by process_roll_request.
        set_property_owner(g.current_property, player)

        // Update the player.
        add_player_property_key(player, g.current_property)

        // Update the player balance
        // The new balance is broadcasted to other players.
        subtract_balance(player, g.current_property.price)

        // When a player purchases a property, display the normal buttons.
        // If player rolled doubles, redisplay the Roll Button.  
        // Otherwise, the End Turn Button.
        if (player.doubles > 0) {
            dialog["active_buttons"] = g.dialog.buttons.filter((d) => {
                if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
                return false
            })
        } else {
            dialog["active_buttons"] = g.dialog.buttons.filter((d) => {
                if (["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"].includes(d)) { return true }
                return false
            })
        }

        // Update the buttons on the Roll Dice Screen.
        hide_expose_roll_dice_buttons(dialog.active_buttons)

        // Update the message on the Roll Dice Screen.
        add_roll_dice_message(`${player.name} purchased ${g.current_property.name}.`)
        log(`${player.name} purchased ${g.current_property.name}.`)

        // Move the property icon from the Bank to the Player
        var property_key = g.current_property.key
        var property_icon_id = property_key + "_icon"
        var new_x = g.asset_columns[player.key]
        var new_y = g.rows[property_key]
        var translate = "translate(" + new_x + " " + new_y + ")"

        d3.select("#" + property_icon_id)
            .transition()
            .duration(500)
            .attr("transform", translate)

        // Update assets on other players' boards.
        notify_players_of_ownership_change(player, g.current_property)
    }

    function process_auction_request(player) {

        // Initialize the Auction Event and disable Roll Dice Event and Trade Event.
        g.roll.in = false
        g.auction.in = true
        g.trade.in = false

        g.auction.starter_key = player.key

        if (player.doubles > 0) {
            g.auction.doubles_were_rolled = true
        } else {
            g.auction.doubles_were_rolled = false
        }
        g.auction.property = g.current_property
        g.auction.highest_bidder_key = null
        g.auction.highest_bid = 0

        for (var player_keys_index in g.player_keys) {

            var player_key = g.player_keys[player_keys_index]

            g.auction.bids[player_key] = 0

            var auction_bid_amount_id = player_key + "_auction_bid_amount_id"

            d3.select("#" + auction_bid_amount_id).text("0")
        }

        // Initialize the sugguested bid amount.
        var o = d3.select("#bid_amount")

        o["_groups"][0][0]["value"] = g.auction.highest_bid + 10

        // Format the event group identifier.
        event_group_id = "auction_group_id"

        // Unhide the Auction Screen.
        d3.select("#" + event_group_id).classed('visible', true)
        d3.select("#" + event_group_id).classed('invisible', false)

        // Unide the Bid Button and the Fold Button on the Auction Screen.
        unhide_bid_and_fold_auction_buttons()

        // Hide all buttons on the Roll Dice Screen.
        var active_buttons = []

        // Update the buttons on the Roll Dice Screen.
        hide_expose_roll_dice_buttons(active_buttons)

        // Show the property card.
        d3.select("#" + g.current_property.key + "_card_group_id").classed('visible', true)
        d3.select("#" + g.current_property.key + "_card_group_id").classed('invisible', false)

        // Update the message on the Roll Dice Screen.
        add_roll_dice_message("Auction started by " + player.name + ".")

        log(`${player.name} started auction for ${g.current_property.name}.`)
    }

    function process_bid_request(player) {

        // console.log("function process_bid_request(player)", player)

        // Delete this because the event group id and event class will control the bidding.

        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Bid", "Fold"].includes(d)) { return true }
            return false
        })

        // Update the buttons on the Roll Dice Screen.
        hide_expose_roll_dice_buttons(active_buttons)
    }

    function process_fold_request(player) {

        // console.log("function process_fold_request(player)", player)

        // Delete this because the event group id will pass control to the next player.

        // For development, use the Fold to hide the Auction Event and pass control to the next player.

        log(`${window.name} called "function process_fold_request(player).  This displayed the Roll Button among others.`)

        // Unhide the acution event group.
        d3.select("#" + event_group_id).classed('visible', false)
        d3.select("#" + event_group_id).classed('invisible', true)

        // Hid the property card.
        d3.select("#" + g.current_property.key + "_card_group_id").classed('visible', false)
        d3.select("#" + g.current_property.key + "_card_group_id").classed('invisible', true)

        // Remove this Player from the Auction Event.
        g.auction.in = false

        if (player.doubles > 0) {
            dialog["active_buttons"] = g.dialog.buttons.filter((d) => {
                if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
                return false
            })

            // Update the buttons on the Roll Dice Screen.
            hide_expose_roll_dice_buttons(dialog.active_buttons)

        } else {

            process_end_turn_request(player)
        }
    }

    function process_collect_request(player) {

        // console.log("function process_collect_request(player)", player)

        if (g.payment == NaN) {
            console.log("\nError: roll_dice.js: roll_dice: process_collect_request")
            // console.log("function process_collect_request(player)")
            console.log("add_balance(player, g.payment)")
            console.log("player:", player)
            console.log("g.payment:", g.payment)
            console_trace(); set_error_encountered()
        }

        // g.payment was set by move_piece when called by process_roll_request.
        add_balance(player, g.payment)

        if (player.doubles > 0) {

            // When the player rolls doubles and has collected, display the normal buttons with "Roll" and without "End Turn".
            dialog["active_buttons"] = g.dialog.buttons.filter((d) => {
                if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
                return false
            })
        } else {

            // When the player has collected, display the normal buttons without "Roll" and with "End Turn".
            dialog["active_buttons"] = g.dialog.buttons.filter((d) => {
                if (["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"].includes(d)) { return true }
                return false
            })
        }

        // Update the buttons on the Roll Dice Screen.
        hide_expose_roll_dice_buttons(dialog.active_buttons)

        // Update the message on the Roll Dice Screen.
        add_roll_dice_message("Collection made.")
    }

    function process_go_to_property_request(player) {

        current_sequence = player["sequence"]

        // A go-to-jail card was encountered.
        if (g.go_to_jail == true) {
            g.go_to_jail = false
            process_jail_request(player)

            // Update the criminal status of this user on all other Baords.
            for (player_keys_index in g.player_keys) {

                // Select the next player to be notified.
                var player_key = g.player_keys[player_keys_index]

                // Bypass current Player.  The Player was processed locally.
                if (player_key == player.key) { continue }

                // Create a transaction to process the Player.
                var transaction = {}
                transaction["code"] = "append_queue"
                transaction["key"] = player_key
                transaction["action"] = "Eval"

                // Add details to the transaction.
                var details = {}
                var player_as_string = JSON.stringify(player)
                details["command"] = `var temp_player = JSON.parse('${player_as_string}'); process_jail_request(temp_player); `
                transaction["details"] = details

                // Add the transaction to another player's queue.
                append_queue(transaction)
            }

            // Finished with the incarceration of the Player.
            return
        }

        var new_sequence = player.sequence + g.dice

        var command_string = `var dice = ${g.dice}; `
        command_string += `move_piece(player.key, dice, use_prior_sequence = true); `
        command_string += "process_roll_request_notify_players(player, dice); "

        // If the dice takes the Player past Go, adjust the new_sequencce.
        if (new_sequence > 39) {
            new_sequence = new_sequence - 40
        }

        // Update the sequence of the Player and then move the Pices on all Boards.
        update_player_sequence(player, new_sequence, command_string)

        var start_name = g.sequences[player["sequence"]]["property"]["name"]
        var end_name = g.sequences[new_sequence]["property"]["name"]
        log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
}

    function process_build_request(player) {

        // Globally indicate the Build Event is active.
        g.build.in = true

        // Store active buttons.  They will be restored after the Build Event.
        store_buttons()

        // Update the message on the Roll Dice Screen.
        add_roll_dice_message("Now click on a property that you own to build.")
    }

    function process_sell_request(player) {

        

        // Globally indicate the Build Event is active.
        g.sell.in = true

        // Store active buttons.  They will be restored after the Build Event.
        store_buttons()

        // Update the message on the Roll Dice Screen.
        add_roll_dice_message("Now click on a property that has a hotel or house to sell.")
    }

    function process_mortgage_request(player) {

        // Globally indicate the Mortgage Event is active.
        g.mortgage.in = true
    }

    function process_unmortgage_request(player) {

        // console.log("function process_unmortgage_request(player)", player)

        // Globally indicate the Unmortgage Event is active.
        g.unmortgage.in = true
    }

    function process_add_card_request(player) {

        // console.log("function process_add_card_request(player)", player)

        player.cards += 1

        if (player.doubles > 0) {
            dialog["active_buttons"] = g.dialog.buttons.filter((d) => {
                if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
                return false
            })
        } else {
            dialog["active_buttons"] = g.dialog.buttons.filter((d) => {
                if (["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"].includes(d)) { return true }
                return false
            })
        }

        // Update the buttons on the Roll Dice Screen.
        hide_expose_roll_dice_buttons(dialog.active_buttons)

        // Let the player have the good news in the Jail Text field of the Roll Dice Screen.
        add_roll_dice_message(`A 'Get Out Of Jail' card has been added to ${player.name}.`)
    }

    function process_use_card_request(player) {

        // Replease the player jail because they used a get-out-of-jail-card.
        player["jail"] = false
        player.cards -= 1
        set_player_out_of_jail(player, card_used = True)

        // Configure the piece for the player.
        g.piece = {}
        g.piece["group_id"] = player.key + "_piece_group_id"
        g.piece["border_id"] = player.key + "_piece_border_id"
        g.piece["text_id"] = player.key + "_piece_text_id"

        // Move the player's piece to the jail's lobby.
        var new_x = g.left_margin
        var new_y = (10 * g.properties.height)
        var translate = "translate(" + new_x + " " + new_y + ")"
        d3.select("#" + g.piece.group_id)
            .transition()
            .delay(0)
            .duration(500)
            .attr("transform", translate)

        // Update the player's location (sequence).
        update_player_sequence(player, 10)

        // Move the player's token.  Process property is done during move_piece.
        // The asynchronous process sets g.selected_property.
        // move_piece(player.key, dice, use_prior_sequence = false)

        // Move this player's token on all other player boards.
        // process_roll_request_notify_players(player, dice)

        // Inform the user that they are out of jail.
        var message = `'Get Out Of Jail' card got ${player.name} out of jail.;`

        // Inform the user what actions are available.
        message += "Roll dice or take other action."

        // Display the multiple-line message on the Roll Dice Screen.
        add_roll_dice_message(message)

        dialog["active_buttons"] = g.dialog.buttons.filter((d) => {
            if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
            return false
        })

        // Update the buttons on the Roll Dice Screen.
        hide_expose_roll_dice_buttons(dialog.active_buttons)
    }

    function process_reset_request() {

        // console.log("function process_reset_request()", player)

        // Create the transaction to reset Players and Properties 
        // to start state.
        var transaction = {}
        transaction["code"] = "reset"
        transaction = JSON.stringify(transaction)

        // Append the transaction to the url base.
        url = "/monopoly_api?transaction="
        url += transaction

        // Create a unique handle for accessing the server.
        if (typeof reset_request == "undefined") {
            var reset_request = new XMLHttpRequest()
        }

        // Create an asynchronous listener to monitor the request.
        reset_request.onreadystatechange = function () {

            // The server is done with this request.
            if (this.readyState == 4) {

                // The request was successful.
                if (this.status == 200) {

                    // Convert response to a javascript object.
                    response = JSON.parse(this.responseText)

                    // Check for a successful reponse.
                    if (response.status == "Pass") {

                        // Extract the text from the response.
                        var text = response.text

                        // Notify the other players that the model is being reset.
                        notify_players_of_reset()

                        // Periodically run get_queue to get the next transaction for this player.
                        g.intervals[window.name] = setInterval(get_queue, g.queue_interval)
                        console.log(`${window.name} (player) started monitoring queue in "function process_reset_request()".`)
                        log(`${window.name}.name} (player) started monitoring queue in "function process_reset_request()".`)

                    } else {
                        console.log("\nError: roll_dice.js: roll_dice: process_reset_request: onreadystatechange")
                        console.log("response.status:", response.status)
                        console.log("response.text:", response.text)
                        console_trace(); set_error_encountered()
                    }

                } else {
                    console.log("\nError: roll_dice.js: roll_dice: process_reset_request: onreadystatechange")
                    console.log("this.status:", this.status)
                    console.log("this.statusText:", this.statusText)
                    console_trace(); set_error_encountered()
                }
            }
        }

        // Send the asynchronous request to the server.
        reset_request.open("GET", url, true)
        reset_request.send()

        // When a player makes a payment, display the normal buttons.
        dialog["active_buttons"] = g.dialog.buttons.filter((d) => {
            return false
        })

        // Update the buttons on the Roll Dice Screen.
        hide_expose_roll_dice_buttons(dialog.active_buttons)
    }
}

function unmortgage_properties(player) {

    // Unmortgage all properties owned by this player if they meet the financial threshold.
    // This was used only in unit testing.
    var transaction = {}
    transaction["code"] = "unmortgage_properties"
    transaction["player_key"] = window.name

    // Convert the transaction to a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the url base.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an asynchronous request for setting the Player.
    if (typeof (unmortgage_properties_request) == "undefined") {
        var unmortgage_properties_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    unmortgage_properties_request.onreadystatechange = function () {

        // The server is done with this request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response to a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful response.
                if (response.status == "Pass") {

                    // Update the local copy of the player.
                    player = response.player

                } else {

                    console.log("\nError: roll_dice.js: roll_dice: process_roll_request: unmortgage_properties")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: roll_dice.js: roll_dice: process_roll_request: unmortgage_properties")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the asynchronous request to the server.
    unmortgage_properties_request.open("GET", url, true)
    unmortgage_properties_request.send()
}

function hide_expose_roll_dice_buttons(active_buttons) {

    // console.log("\nfunction hide_expose_roll_dice_buttons(active_buttons)", active_buttons)

    // Verify that the parameter "active_buttons" is defined.
    if (typeof active_buttons == "undefined") {
        console.log("\nError: roll_dice.js: hide_expose_roll_dice_buttons")
        console.log('Parameter "active_buttons" was undefined.')
        console_trace(); set_error_encountered()
        return
    }

    // Verify that the parameter "active_buttons" is not null.
    if (active_buttons == null) {
        console.log("\nError: roll_dice.js: hide_expose_roll_dice_buttons")
        console.log('Parameter "active_buttons" was null.')
        console_trace(); set_error_encountered()
        return
    }

    // Loop through all available buttons for the Roll Dice Screen.
    for (button_index in g.dialog.buttons) {

        // Get the next button for the Roll Dice Screen.
        var button = g.dialog.buttons[button_index]

        // Format the button identifier allowing for two spaces in the "Go To Jail" button.
        var button_id = button.toLowerCase() + "_button_id"
        button_id = button_id.replace(" ", "_")
        button_id = button_id.replace(" ", "_")

        // Format the button text identifier, also allowing for two spaces.
        var button_text_id = button.toLowerCase() + "_button_text_id"
        button_text_id = button_text_id.replace(" ", "_")
        button_text_id = button_text_id.replace(" ", "_")

        // Display the button if it is in the list of active buttons.
        if (active_buttons.indexOf(button) > -1) {
            d3.select("#" + button_id).classed('visible', true)
            d3.select("#" + button_id).classed('invisible', false)
            d3.select("#" + button_text_id).classed('visible', true)
            d3.select("#" + button_text_id).classed('invisible', false)

            // Otherwise, hide the button.
        } else {
            d3.select("#" + button_id).classed('visible', false)
            d3.select("#" + button_id).classed('invisible', true)
            d3.select("#" + button_text_id).classed('visible', false)
            d3.select("#" + button_text_id).classed('invisible', true)
        }
    }
}

function add_player_property_key(player, property) {

    // console.log("function add_player_property_key(player, property)", player, property)

    // Format the transaction for setting the Player.
    var transaction = {}
    transaction["code"] = "add_player_property_key"
    transaction["key"] = player.key
    transaction["property_key"] = property.key

    // Convert the transaction to a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the url base.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an asynchronous request for setting the Player.
    if (typeof (add_player_property_key_request) == "undefined") {
        var add_player_property_key_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    add_player_property_key_request.onreadystatechange = function () {

        // The server is done with this request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response to a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful response.
                if (response.status == "Pass") {

                    // Update the local player.
                    player = response.player

                } else {

                    console.log("\nError: roll_dice.js: add_player_property_key: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: roll_dice.js: add_player_property_key: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the asynchronous request to the server.
    add_player_property_key_request.open("GET", url, true)
    add_player_property_key_request.send()
}

function remove_player_property_key(player, property) {

    var transaction = {}
    transaction["code"] = "remove_player_property_key"
    transaction["key"] = player.key
    transaction["property_key"] = property.key

    // Convert the transaction to a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the url base.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an asynchronous request for setting the Player.
    if (typeof (remove_player_property_key_request) == "undefined") {
        var remove_player_property_key_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    remove_player_property_key_request.onreadystatechange = function () {

        // The server is done with this request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response to a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful response.
                if (response.status == "Pass") {

                    // Update the local copy of the player.
                    player = response.player

                } else {

                    console.log("\nError: roll_dice.js: remove_player_property_key: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: roll_dice.js: remove_player_property_key: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the asynchronous request to the server.
    remove_player_property_key_request.open("GET", url, true)
    remove_player_property_key_request.send()
}

function set_property_owner(property, player) {

    // console.log("function set_property_owner(property, player)", property, player)

    // Format the transaction for setting the property.
    var transaction = {}
    transaction["code"] = "set_property_owner"
    transaction["key"] = property.key
    transaction["owner"] = player.key

    // Convert the transaction to a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the url base.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an asynchronous request for setting the property.
    if (typeof set_property_owner_request == "undefined") {
        var set_property_owner_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    set_property_owner_request.onreadystatechange = function () {

        // The server is done with this request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response to a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful response.
                if (response.status == "Pass") {

                    // Extract the Property from the response.
                    var property = response.property

                    // Extract the key of the Property.
                    var key = property.key

                    // Format the identifier of the Property Icon.
                    var property_icon_border_id = key + "_icon_border"

                    // Get the reference to the Property Icon.
                    var property_icon = d3.select("#" + property_icon_border_id)

                    // Extract the class dictionary from the Property Icon.
                    var property_icon_class = JSON.parse(property_icon.attr("class"))

                    // Update the owner attribute of the class dictionary.
                    property_icon_class.owner = player.key

                    // Update the class attribute of the Property Icon.
                    property_icon.attr("class", JSON.stringify(property_icon_class))

                } else {

                    console.log("\nError: roll_dice.js: set_property_owner: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: roll_dice.js: set_property_owner: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the asynchronous request to the server.
    set_property_owner_request.open("GET", url, true)
    set_property_owner_request.send()
}

function add_player_balance(player_key, amount) {

    // Format the transaction for getting the Player.
    var transaction = {}
    transaction["code"] = "get_player"
    transaction["key"] = player_key

    // Convert the transaction to a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the url base.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an asynchronous request for setting the Player.
    if (typeof get_selected_player_request == "undefined") {
        var get_selected_player_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    get_selected_player_request.onreadystatechange = function () {

        // The server is done with this request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response to a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful response.
                if (response.status == "Pass") {

                    // Extract the Player from the response.
                    var player = response.player

                    // Extract the "bankrupt" attribute from the Player.
                    g.poorhouse[player.key] = player.bankrupt

                    // Determine that the Player is not bankrupt.
                    if (g.poorhouse[player.key] == false) {

                        // This is usually a payment made to a payee given the g.payee_key set by move_piece.
                        add_balance(player, amount)
                    }

                } else {
                    console.log("\nError: roll_dice.js: add_player_balance: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: roll_dice.js: add_player_balance: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the asynchronous request to the server.
    get_selected_player_request.open("GET", url, true)
    get_selected_player_request.send()
}

function process_reset_transaction() {

    // Reset the Global Selected Player Key
    g.selected_player = null

    // Return properties to the bank.
    for (property_key in g.properties.tracts) {

        var property = g.properties.tracts[property_key]

        if (['property', 'railroad', 'utility'].includes(property.type)) {

            var property_icon_id = property_key + "_icon"
            var new_x = g.asset_columns.bank
            var new_y = g.rows[property_key]
            var translate = "translate(" + new_x + " " + new_y + ")"

            d3.select("#" + property_icon_id)
                .transition()
                .duration(500)
                .attr("transform", translate)
        }
    }

    // Reset the players' balances back to 1500 and remove piece.
    for (var player_key_index in g.player_keys) {
        var player_key = g.player_keys[player_key_index]
        d3.select("#" + player_key + "_column_balance_id").text(1500)
        d3.select("#" + player_key + "_piece_group_id").selectAll("*").remove()
        d3.select("#" + player_key + "_piece_group_id").remove()
        console.log(player_key, "piece was deleted.")
    }

    // Determine the identifier for the Current Roll Dice Property group.
    var current_roll_dice_property_id = "roll_dice_property_id"

    // Remove all the elements within the property rectangle.
    d3.select("#" + current_roll_dice_property_id).selectAll("*").remove()

    // Remove the property rectangle.
    d3.select("#" + current_roll_dice_property_id).remove()

    // Hide the Roll Dice Screen.
    d3.select("#" + "roll_dice_group_id").classed('visible', false)
    d3.select("#" + "roll_dice_group_id").classed('invisible', true)

    // Unhide the Select Player Screen
    d3.select("#select_player_group_id").classed('visible', true)
    d3.select("#select_player_group_id").classed('invisible', false)

    d3.select("#select_player_text_id").text("Click a player's blue rectangle and then a button.")

    // Unhide the Four Players Button on the Select Player Screen
    d3.select("#four_players_button_id").classed('visible', true)
    d3.select("#four_players_button_id").classed('invisible', false)
    d3.select("#four_players_button_text_id").classed('visible', true)
    d3.select("#four_players_button_text_id").classed('invisible', false)

    // Unhide the Bots Button on the Select Player Screen
    d3.select("#one_player_button_id").classed('visible', true)
    d3.select("#one_player_button_id").classed('invisible', false)
    d3.select("#one_player_button_text_id").classed('visible', true)
    d3.select("#one_player_button_text_id").classed('invisible', false)

    // Hide the Begin Button on the Select Player Screen
    d3.select("#begin_button_id").classed('visible', false)
    d3.select("#begin_button_id").classed('invisible', true)
    d3.select("#begin_button_text_id").classed('visible', false)
    d3.select("#begin_button_text_id").classed('invisible', true)
}

function process_jail_request(player) {

    log(`${player.name} is being processed into jail.`)

    // Update the jail status of the player.
    set_player_in_jail(player)
    player.rolls = 0
    player["jail"] = true
    player.rolls_in_jail = 0
    player.doubles = 0

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
        console.log("\nError: roll_dice.js: process_jail_request")
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

    // If the current player is the one going to jail, update messages, display the lawyer card, and pass control to the next player.
    if (player.key == window.name) {

        // Let the player have the good news in the Jail Text field of the Roll Dice Screen.
        add_roll_dice_message(player.name + " is in lockup now.")

        // Determine the identifier for the Current Roll Dice Property group.
        var current_roll_dice_property_id = "roll_dice_property_id"

        // Remove all the elements within the current cloned group.
        d3.select("#" + current_roll_dice_property_id).selectAll("*").remove()

        // Remove the cloned group.
        d3.select("#" + current_roll_dice_property_id).remove()

        // Clone the group for the Lawyer Card and identify it as the cloned group currently being displayed.
        d3.select("#lawyer_card_group_id")
            .clone(true)
            .attr("id", current_roll_dice_property_id)

        // These are the target coordinates for the next cloned group.
        var new_x = g.dialog.x
        var new_y = g.dialog.y
        var translate = "translate(" + new_x + " " + new_y + ")"

        // Move the cloned Lawyer Card group to the display location.
        d3.select("#" + current_roll_dice_property_id)
            .transition()
            .duration(1000)
            .attr("class", "visible")
            .attr("transform", translate)

        // Pass control to the next player and start monitoring this player's transaction queue.
        process_end_turn_request(player)
    }
}

function process_end_turn_request(player) {

    // Verify that the parameter "player" is defined.
    if (typeof player == "undefined") {
        console.log("\nError: roll_dice.js: process_end_turn_request")
        console.log('Parameter "player" was undefined.')
        console_trace(); set_error_encountered()
        return
    }

    // Verify that the parameter "player" is not null.
    if (player == null) {
        console.log("\nError: roll_dice.js: process_end_turn_request")
        console.log('Parameter "player" was null.')
        console_trace(); set_error_encountered()
        return
    }

    // Retain the message on the first line of the mutiple-line message.
    var message = d3.select("#" + "roll_dice_screen_text_id_1").text()

    // Add semicolon to indicate line break in the string.
    message += ";"

    // Determine if the Player is bankrupt.
    if (g.poorhouse[player.key] == true) {

        // Inform the Player that they are bankreupt on the second line.
        message += "Relax.  You're bankrupt.  Watch the game until a winner."
        log(`${player.name} is bankrupt and just watching the game.`)

    } else {

        // Inorm the Player when it will be their turn on the second line.
        message += "Buttons will return when it is your turn."
    }

    // Display the multiple-line message on the Roll Dice Screen.
    add_roll_dice_message(message)

    // The turn is complete for this Player.  Hide all buttons.
    var active_buttons = []

    hide_expose_roll_dice_buttons(active_buttons)

    // Create a transaction for passing control to the next player.
    var transaction = {}
    transaction["code"] = "append_queue"

    // Determine the next player.
    if (player.key == "car") { transaction["key"] = "top_hat" }
    else if (player.key == "top_hat") { transaction["key"] = "shoe" }
    else if (player.key == "shoe") { transaction["key"] = "dog" }
    else if (player.key == "dog") { transaction["key"] = "car" }
    else {
        console.log("\nError: roll_dice.js: process_end_turn_request:")
        console.log("Invalid player.key:", player.key)
        console_trace(); set_error_encountered()
    }

    // Bypass the bankrupt Players.
    if ((transaction["key"] == "car") && (g.poorhouse.car)) { transaction["key"] = "top_hat" }
    if ((transaction["key"] == "top_hat") && (g.poorhouse.top_hat)) { transaction["key"] = "shoe" }
    if ((transaction["key"] == "shoe") && (g.poorhouse.shoe)) { transaction["key"] = "dog" }
    if ((transaction["key"] == "dog") && (g.poorhouse.dog)) { transaction["key"] = "car" }
    if ((transaction["key"] == "car") && (g.poorhouse.car)) { transaction["key"] = "top_hat" }
    if ((transaction["key"] == "top_hat") && (g.poorhouse.top_hat)) { transaction["key"] = "shoe" }
    if ((transaction["key"] == "shoe") && (g.poorhouse.shoe)) { transaction["key"] = "dog" }
    if ((transaction["key"] == "dog") && (g.poorhouse.dog)) { transaction["key"] = "car" }

    // Pass control to the next player by exposing their Roll Button.
    transaction["action"] = "Roll Dice"
    transaction["details"] = null

    next_player_name = format_name_from_key(transaction["key"])

    log(`${player["name"]} passed control to ${next_player_name}.`)

    // Add the transaction to the transaction queue of the next player.
    append_queue(transaction)

    // Periodically run get_queue to get the next transaction for this Player.
    g.intervals[window.name] = setInterval(get_queue, g.queue_interval)

    // Log the monitoring of the queue locally.
    console.log(`\n${player.name} started monitoring queue in the end-turn-request.`)

    // Log the monitoring of the queue on the server.
    log(`${player.name} started monitoring queue in the end-turn-request.`)
}

function process_roll_request_notify_players(player, dice) {

    // console.log("function process_roll_request_notify_players(player, dice)", player, dice)

    // Move this player's token on all other player boards.
    var player_keys = ["car", "top_hat", "shoe", "dog"]
    for (player_keys_index in player_keys) {

        // Bypass the current player.
        var player_key = player_keys[player_keys_index]
        if (player_key == player.key) {
            continue
        }

        // Create a transaction to move a player's token.
        var transaction = {}
        transaction["code"] = "append_queue"
        transaction["key"] = player_key
        transaction["action"] = "Move Piece"

        // Add details to the transaction.
        var details = {}
        details["target_player_key"] = player.key
        details["dice"] = dice
        details["use_prior_sequence"] = true
        transaction["details"] = details

        // Add the transaction to another player's queue.
        append_queue(transaction)
    }
}

function add_roll_dice_message(message) {

    // console.log("\nfunction add_roll_dice_message(message)")

    // Verify that the parameter "message" was defined.
    if (typeof message == "undefined") {
        console.log("\nError: roll_dice.js: add_roll_dice_message")
        console.log('Parameter "message" was undefined.')
        console_trace(); set_error_encountered()
        return
    }

    // Verify that the parameter "message" was not null.
    if (message == null) {
        console.log("\nError: roll_dice.js: add_roll_dice_message")
        console.log('Parameter "message" was null.')
        console_trace(); set_error_encountered()
        return
    }

    // Define idenfiers of the text fields on the Roll Dice Screen.
    var dialog = {}
    dialog["text_id_1"] = g.roll_dice.screen.text_id_1
    dialog["text_id_2"] = g.roll_dice.screen.text_id_2
    dialog["text_id_3"] = g.roll_dice.screen.text_id_3
    dialog["text_id_4"] = g.roll_dice.screen.text_id_4

    // Determine the number of text fields on the Roll Dice Screen.
    var number_of_text_fields = Object.keys(dialog).length

    // Split the single string into multiple strings, each for a text field.
    var messages = message.split(";", number_of_text_fields)

    // Start with the first text field.
    var text_field_number = 1

    // Process each text field.
    while (text_field_number <= number_of_text_fields) {

        // Format the identifier attribute of the text field.
        var dialog_key = "text_id_" + text_field_number.toString()
        var text_id = dialog[dialog_key]

        // Determine if there is a message for the text field.
        if (messages.length < text_field_number) {

            // There is no message for this text field.
            d3.select("#" + text_id).text("")

        } else {

            // Set the text of this text field to the trimmed value of the message.
            d3.select("#" + text_id).text(messages[text_field_number - 1].trim())

            console.log("\t" + messages[text_field_number - 1].trim())
        }

        // Get the next text field.
        text_field_number += 1
    }
    console.log(" ")
}

function log(message) {

    // console.log("\nfunction log(message)")
    console.log("message:", message)

    // Create a transaction to log a message.
    var transaction = {}
    transaction["code"] = "log"
    transaction["message"] = message

    // Send the the transaction to the server, which will log the message.
    append_queue(transaction)
}

function store_buttons() {

    // Backup and then hide the active buttons to be restored after the event.
    g["active_buttons"] = []

    // Loop through the text of all buttons.
    for (var button_index in g.dialog["buttons"]) {

        // Get the text of a button.
        var button_text = g.dialog["buttons"][button_index].toLowerCase()

        // Replace spaces with underscore characters.
        button_text = button_text.replace(" ", "_")
        button_text = button_text.replace(" ", "_")
        button_text = button_text.replace(" ", "_")

        // Format the identifier for a button from the text of a button.
        var button_id = button_text + "_button_id"
        var button_text_id = button_text + "_button_text_id"

        // Get the reference to the rectangle of the button.
        var button_rect = d3.select("#" + button_id)
        var button_text = d3.select("#" + button_text_id)

        // Get the class of the rectangle of the button.
        try {
            var button_class = button_rect.attr("class")
        }
        catch (err) {
            console.log("\n**********")
            console.log("Error: roll_dice.js: roll_dice: process_build_request")
            console.log("Error:", err.message)
            console.log("button_index:", button_index)
            console.log("button_text:", button_text)
            console.log("button_id:", button_id)
            console.log("button_rect:", button_rect)
            console.log("button_class:", button_class)
            console.log("**********")
        }

        // Determine if the button is visible.
        if (button_class == "visible") {

            // Save the identifier of the visible button.
            g["active_buttons"].push(button_id)
            g["active_buttons"].push(button_text_id)

            // Hide the button.  It will be unhidden when the Build Even completes.
            button_rect.classed("visible", false)
            button_rect.classed("invisible", true)
            button_text.classed("visible", false)
            button_text.classed("invisible", true)
        }

    }
}

function restore_buttons() {

    // Loop through the active buttons when the Build Event was started.
    for (var active_button_index in g["active_buttons"]) {

        // Get the identifier of an active button.
        var button_rect_id = g["active_buttons"][active_button_index]

        // Get the reference to the rectangle of the button.
        var button_rect = d3.select("#" + button_rect_id)

        // Unhide the rectangle of the button.
        button_rect.classed("visible", true)
        button_rect.classed("invisible", false)
    }
}

