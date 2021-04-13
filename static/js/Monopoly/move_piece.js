function move_piece(player_key, dice, use_prior_sequence = false) {

    // Create a transaction to get player information from the server.
    var transaction = {}
    transaction["code"] = "get_player"
    transaction["key"] = player_key

    // Convert the transaction into a JSON string.
    transaction = JSON.stringify(transaction)
    console.log("transaction:", transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an unique handle for the request.
    if (typeof get_player_request == "undefined") {
        var get_player_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    get_player_request.onreadystatechange = function () {

        // The server is done with the request.
        if (this.readyState == 4) {

            // the request was successful.
            if (this.status == 200) {

                // Convert the JSON string into a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful response.
                if (response.status == "Pass") {

                    // Extract the player from the response.
                    var player = response.player

                    // Extract the "bankrupt" attribute from the Player.
                    g.poorhouse[player.key] = player.bankrupt

                    // Determine if the Player is not in the Poorhouse.
                    if (g.poorhouse[player.key] == false) {

                        // Move the piece and update player.
                        move_piece_process(player, dice, use_prior_sequence)
                    }

                } else {
                    console.log("\nError: move_piece.js: move_piece: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: move_piece.js: move_piece: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for ansynchronous processing.
    get_player_request.open("GET", url, true)
    get_player_request.send()
}

function move_piece_process(player, dice, use_prior_sequence) {

    // Configure the piece for the player.
    g.piece = {}
    g.piece["group_id"] = player.key + "_piece_group_id"
    g.piece["border_id"] = player.key + "_piece_border_id"
    g.piece["text_id_1"] = player.key + "_piece_text_id"

    // Determine if the piece already exists.
    var o = document.getElementById(g.piece.group_id)

    // If the piece does not exist, create it.
    if (o == null) {

        // Create player piece group.
        d3.select("#svg")
            .append("g")
            .attr("id", g.piece.group_id)
            .attr("transition")

        // Create player piece border.
        d3.select("#" + g.piece.group_id)
            .append("rect")
            .attr("id", g.piece.border_id)

        // Set border properties.
        d3.select("#" + g.piece.border_id)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", g.properties.width)
            .attr("height", g.properties.height)
            .attr("fill-opacity", "0.3")
            .attr("fill", "Blue")
            .attr("stroke", "DarkGrey")
            .attr("stroke-width", 3)

        // Add the player's name.
        d3.select("#" + g.piece.group_id)
            .append("text")
            .attr("id", g.piece.text_id_1)
            .attr("x", g.properties.width / 2)
            .attr("y", "6em")
            .attr("fill", "White")
            .attr("fill-opacity", "1.0")
            .attr("font-size", "12px")
            .attr("text-anchor", "middle")
            .text(player.name)

        // Position the piece.
        var new_x = g.left_margin + (10 * g.properties.width)
        var new_y = (10 * g.properties.height)
        var translate = "translate(" + new_x + " " + new_y + ")"
        d3.select("#" + g.piece.group_id)
            .transition()
            .duration(1000)
            .attr("transform", translate)
    }

    // Other player's need to backup the other tokens so they can start from the same location as on the originating player's board.
    if (use_prior_sequence) {
        player.sequence = player.sequence - dice
        if (player.sequence < 0) {
            player.sequence = player.sequence + 40
        }
    }

    // Calculate the next location for the player's token.
    var new_sequence = player.sequence + dice

    if (new_sequence > 79) {
        console.log("\nError: move_piece.js: move_piece_process")
        console.log("new_sequence greater than 80.")
         
        console_trace(); set_error_encountered()
        return
    }

    // Delay the move so that the token does not cut the corner.
    var delay = 1500

    var community_chest_test = false

    // The player's piece is at the "Jail", the lower left corner.
    if (player.sequence == 10) {

        // Determine if the player's piece is staying on the left edge.
        if (new_sequence < 21) {

            if (community_chest_test) {new_sequence = 17}

            // The player's piece is staying on the left edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move(0, new_x, new_y)

            var start_name = g.sequences[player["sequence"]]["property"]["name"]
            var end_name = g.sequences[new_sequence]["property"]["name"]
            log(`${player["name"]} moved from ${start_name} to ${end_name}.`)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

            // The player's piece is staying on the top edge.
        } else if (new_sequence < 31) {

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move(0, new_x, new_y)

            if (community_chest_test) {new_sequence = 33}

            // The player's piece is staying on the top edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move(delay, new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 40) {

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Go To Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(delay, new_x, new_y)

            if (community_chest_test) {new_sequence = 33}

            // The player's piece is staying on the top edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move(delay, new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else {

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Go To Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The Player has rounded Go.
            new_sequence = new_sequence - 40
            if (new_sequence > 0) {
                add_balance(player, g.properties.tracts.go.salary)
            }

            if (community_chest_test) {new_sequence = 2}

            // The player's piece is staying on the bottom edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return
        }
    }

    // New piece is placed at Go, the only time dice will be zero.
    if (dice == 0) {
        var new_x = g.sequences[0]["x"]
        var new_y = g.sequences[0]["y"]
        make_the_move(0, new_x, new_y)
        return
    }

    // The player's piece is on the bottom edge.

    if (player.sequence < 11) {

        // Determine if the player's piece is staying on the bottom edge.
        if (new_sequence < 11) {

            if (community_chest_test) {new_sequence = 17}

            // The player's piece is staying on the bottom edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move(0, new_x, new_y)

            var start_name = g.sequences[player["sequence"]]["property"]["name"]
            var end_name = g.sequences[new_sequence]["property"]["name"]
            log(`${player["name"]} moved from ${start_name} to ${end_name}.`)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

            // Determine if the player's piece is staying on the left edge.
        } else if (new_sequence < 21) {

            // The player's piece is going to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move(0, new_x, new_y)

            if (community_chest_test) {new_sequence = 17}

            // The player's piece is staying on the left edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move(delay, new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

            // The player's piece is staying on the top edge.
        } else if (new_sequence < 31) {

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move(delay, new_x, new_y)

            if (community_chest_test) {new_sequence = 33}

            // The player's piece is staying on the top edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 40) {

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's piece is moving to "Go To Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move((delay * 2), new_x, new_y)

            if (community_chest_test) {new_sequence = 33}

            // The player's piece is staying on the right edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 50) {

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's piece is moving to "Go To Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // The Player has rounded Go.
            new_sequence = new_sequence - 40
            if (new_sequence > 0) {
                add_balance(player, g.properties.tracts.go.salary)
            }

            if (community_chest_test) {new_sequence = 2}

            // The Player is on the lower edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 4), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 60) {

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's piece is moving to "Go To Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move((delay * 4), new_x, new_y)

            // The Player has rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 17}

            // The Player is on the left edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 5), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 70) {

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's piece is moving to "Go To Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move((delay * 4), new_x, new_y)

            // The player's piece is moving to "Free Parking", the uppder left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move((delay * 5), new_x, new_y)

            // The Player has rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 33}

            // The Player is on the top edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 6), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else {

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's piece is moving to "Go To Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move((delay * 4), new_x, new_y)

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move((delay * 5), new_x, new_y)

            // The player's piece is moving to "Go To Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move((delay * 6), new_x, new_y)

            // The Player has rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 2}

            // The Player is on the right edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 7), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return
        }
    }

    // The player's piece is in "Free Parking", the upper left corner.
    if (player.sequence == 20) {

        // Determine if the player's piece is staying on the top edge.
        if (new_sequence < 31) {

            if (community_chest_test) {new_sequence = 33}

            // The player's piece is staying on the top edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move(0, new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

            // The player's piece is staying on the right edge.
        } else if (new_sequence < 40) {

            // The player's peice is moving to "Go to Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(0, new_x, new_y)

            if (community_chest_test) {new_sequence = 33}

            // The player's piece is staying on the right edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move(delay, new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 50) {

            // The player's peice is moving to "Go to Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(0, new_x, new_y)

            // The player's peice is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(delay, new_x, new_y)

            // The Player has rounded Go.
            new_sequence = new_sequence - 40
            if (new_sequence > 0) {
                add_balance(player, g.properties.tracts.go.salary)
            }

            if (community_chest_test) {new_sequence = 2}

            // The player's piece is staying on the bottom edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 60) {

            // The player's peice is moving to "Go to Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(0, new_x, new_y)

            // The player's peice is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's peice is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The Player has rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 17}

            // The player's piece is staying on the left edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 70) {

            // The player's peice is moving to "Go to Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(0, new_x, new_y)

            // The player's peice is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's peice is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The player's peice is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // The Player has rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 33}

            // The player's piece is staying on the top edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 4), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else {

            // The player's peice is moving to "Go to Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(0, new_x, new_y)

            // The player's peice is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's peice is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The player's peice is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // The player's peice is moving to "Go To Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move((delay * 4), new_x, new_y)

            // The Player has rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 33}

            // The player's piece is staying on the right edge
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 5), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return
        }
    }

    // The player's piece is on the left edge.
    if (player.sequence < 21) {

        // Determine if the player's piece is staying on the left edge.
        if (new_sequence < 21) {

            if (community_chest_test) {new_sequence = 17}

            // The player's piece is staying on the left edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move(0, new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

            // Determine if the player's piece is staying on the top edge.
        } else if (new_sequence < 31) {

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move(0, new_x, new_y)

            if (community_chest_test) {new_sequence = 33}

            // The player's piece is staying the top edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move(delay, new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

            // The player's peice is staying on the right edge.
        } else if (new_sequence < 40) {

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Go to Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(delay, new_x, new_y)

            if (community_chest_test) {new_sequence = 33}

            // The player's piece is staying on the right edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 50) {

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Go to Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The Player has rounded Go.
            new_sequence = new_sequence - 40
            if (new_sequence > 0) {
                add_balance(player, g.properties.tracts.go.salary)
            }

            if (community_chest_test) {new_sequence = 2}

            // The player's piece is staying on the botton edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 60) {

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Go to Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // The Player has rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 17}

            // The player's piece is staying on the left edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 4), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 70) {

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Go to Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move((delay * 4), new_x, new_y)

            // The Player has rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 33}

            // The player's piece is staying on the top edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 5), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else {

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Go to Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move((delay * 4), new_x, new_y)

            // The player's piece is moving to "Go To Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move((delay * 5), new_x, new_y)

            // The Player has rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 2}

            // The player's piece is staying on the right edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 6), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return
        }
    }

    // The player's token is at "Go to Jail", the upper right corner.
    if (player.sequence == 30) {

        // Determine if the player's piece is staying on the right edge.
        if (new_sequence < 40) {

            if (community_chest_test) {new_sequence = 33}

            // The player's token is staying on the right edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move(0, new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

            // The player's piece is staying on the bottom edge.
        } else if (new_sequence < 50) {

            // The player's token is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(0, new_x, new_y)

            // The Player rounded Go.
            new_sequence = new_sequence - 40
            if (new_sequence > 0) {
                add_balance(player, g.properties.tracts.go.salary)
            }

            if (community_chest_test) {new_sequence = 2}

            // The players piece is staying on the bottom edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move(delay, new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 60) {

            // The player's token is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(0, new_x, new_y)

            // The player's token is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move(delay, new_x, new_y)

            // The Player rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 17}

            // The players piece is staying on the left edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 70) {

            // The player's token is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(0, new_x, new_y)

            // The player's token is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's token is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The Player rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 33}

            // The players piece is staying on the top edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else {

            // The player's token is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(0, new_x, new_y)

            // The player's token is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's token is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The player's token is moving to "Go To Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // The Player rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 2}

            // The players piece is staying on the right edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 4), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return
        }
    }

    // The player's piece is on the top edge.
    if (player.sequence < 31) {

        // Determine if the player's piece is staying on the top edge.
        if (new_sequence < 31) {

            if (community_chest_test) {new_sequence = 33}

            // The player's piece is staying on the top edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move(0, new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

            // Determine if the player's piece is staying on the right edge.
        } else if (new_sequence < 40) {

            // The player's piece is moving to "Go to Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(0, new_x, new_y)

            if (community_chest_test) {new_sequence = 33}

            // The player's piece is staying on the right edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move(delay, new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

            // The player's piece is staying on the bottom edge.
        } else if (new_sequence < 50) {

            // The player's piece is moving to "Go to Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(delay, new_x, new_y)

            // The Player rounded Go.
            new_sequence = new_sequence - 40
            if (new_sequence > 0) {
                add_balance(player, g.properties.tracts.go.salary)
            }

            if (community_chest_test) {new_sequence = 17}

            // The Player is staying on the bottom edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 60) {

            // The player's piece is moving to "Go to Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The Player rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 17}

            // The Player is staying on the left edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 70) {

            // The player's piece is moving to "Go to Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // The Player rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 33}

            // The Player is staying on the top edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 4), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else {
            // The player's piece is moving to "Go to Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // The player's piece is moving to "Go To Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move((delay * 4), new_x, new_y)

            // The Player rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 17}

            // The Player is staying on the right edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 5), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return
        }
    }

    // The player's piece is on the right edge.
    if (player.sequence < 40) {

        // Determine if the player's piece is staying on the right edge.
        if (new_sequence < 40) {

            if (community_chest_test) {new_sequence = 2}

            // The player's piece is staying on the right edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move(0, new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

            // Determine if the player's piece is staying on the bottom edge.
        } else if (new_sequence < 50) {

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(0, new_x, new_y)

            // The Player rounded Go.
            new_sequence = new_sequence - 40
            if (new_sequence > 0) {
                add_balance(player, g.properties.tracts.go.salary)
            }

            if (community_chest_test) {new_sequence = 17}

            // The player's piece is staying on the lower edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move(delay, new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

            // The player's piece is staying on the left edge.
        } else if (new_sequence < 60) {

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move(delay, new_x, new_y)

            // The Player rounded Go.
            new_sequence = new_sequence - 40
            if (new_sequence > 0) {
                add_balance(player, g.properties.tracts.go.salary)
            }

            if (community_chest_test) {new_sequence = 17}

            // The player's piece is staying on the lower edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else if (new_sequence < 70) {

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The Player rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 33}

            // The player's piece is staying on the upper edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return

        } else {

            // The player's piece is moving to "Go", the lower right corner.
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(0, new_x, new_y)

            // The player's piece is moving to "Jail", the lower left corner.
            var new_x = g.sequences[10]["x"]
            var new_y = g.sequences[10]["y"]
            make_the_move(delay, new_x, new_y)

            // The player's piece is moving to "Free Parking", the upper left corner.
            var new_x = g.sequences[20]["x"]
            var new_y = g.sequences[20]["y"]
            make_the_move((delay * 2), new_x, new_y)

            // The player's piece is moving to "Go To Jail", the upper right corner.
            var new_x = g.sequences[30]["x"]
            var new_y = g.sequences[30]["y"]
            make_the_move((delay * 3), new_x, new_y)

            // The Player rounded Go.
            new_sequence = new_sequence - 40
            add_balance(player, g.properties.tracts.go.salary)

            if (community_chest_test) {new_sequence = 2}

            // The player's piece is staying on the right edge.
            var new_x = g.sequences[new_sequence]["x"]
            var new_y = g.sequences[new_sequence]["y"]
            make_the_move((delay * 4), new_x, new_y)

            // Update the player with the new sequence and process the property.
            set_player_sequence(player, new_sequence, dice)
            return
        }
    }
}

function make_the_move(delay, new_x, new_y) {

    // console.log("\nfunction make_the_move(delay, new_x, new_y)", delay, new_x, new_y)

    // Move the player's token to the new location.
    var translate = "translate(" + new_x + " " + new_y + ")"

    d3.select("#" + g.piece.group_id)
        .transition()
        .delay(delay)
        .duration(1000)
        .attr("transform", translate)
}

function set_player_sequence(player, new_sequence, dice) {

    // console.log("\nfunction set_player_sequence(player, new_sequence, dice)", player, new_sequence, dice)

    // Update the player's sequence with the new_sequence.
    var transaction = {}
    transaction["code"] = "set_player_sequence"
    transaction["key"] = player.key
    transaction["sequence"] = new_sequence

    // Convert the transaction to a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the url base.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create a unique handle for accessing the server.
    if (typeof set_player_sequence_request == "undefined") {
        var set_player_sequence_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    set_player_sequence_request.onreadystatechange = function () {

        // The server is done with this request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert reponse string into a dictionary.
                response = JSON.parse(this.responseText)

                // Check for a successful request.
                if (response.status == "Pass") {

                    // Update the local player.
                    player = response.player

                    // Process the property on which the player just landed.
                    process_sequence(player, dice)

                } else {
                    console.log("\nError: move_piece.js: set_player_sequence: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: move_piece.js: set_player_sequence: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    set_player_sequence_request.open("GET", url, true)
    set_player_sequence_request.send()
}

function update_player_sequence(player, new_sequence, command_string = null) {

    // console.log("\nfunction update_player_sequence(player, new_sequence, command_string = null)", player, new_sequence, command_string)

    // Create the transaction to update the player's information on the server with the new location.
    var transaction = {}
    transaction["code"] = "set_player_sequence"
    transaction["key"] = player.key
    transaction["sequence"] = new_sequence

    // Convert the transaction to a JSON string.
    transaction = JSON.stringify(transaction)
    console.log("transaction:", transaction)

    // Append the transaction to the url base.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create a unique handle for accessing the server.
    if (typeof update_player_sequence_request == "undefined") {
        var update_player_sequence_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    update_player_sequence_request.onreadystatechange = function () {

        // The server is done with this request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert reponse string into a dictionary.
                response = JSON.parse(this.responseText)

                // Check for a successful request.
                if (response.status == "Pass") {

                    // Check if a string of javascript commands was passed as an optional parameter.
                    if (command_string != null) {

                        // Update local copy of player.
                        player = response.player

                        // Execute the string of javascript commands.
                        eval(command_string)
                    }

                } else {
                    console.log("\nError: move_piece.js: update_player_sequence: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: move_piece.js: update_player_sequence: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    update_player_sequence_request.open("GET", url, true)
    update_player_sequence_request.send()
}

function process_sequence(player, dice) {

    // Create a transaction to get property information from the server.
    var transaction = {}
    transaction["code"] = "get_property"
    transaction["key"] = g.properties.sequence_key[player.sequence]
    transaction["hold"] = false
    console.log("transaction:", transaction)

    // Convert object into a string.
    transaction = JSON.stringify(transaction)
    console.log("transaction:", transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an unique handle for the request.
    if (typeof get_property_request == "undefined") {
        var get_property_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener for the request.
    get_property_request.onreadystatechange = function () {

        // Server is done with the request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response into a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful response.
                if (response.status == "Pass") {

                    // Extract the property from the response.
                    var property = response.property

                    // Update the global variable for current property.
                    g.current_property = property

                    // Process the property for the player.
                    process_sequence_callback(player, property, dice)

                } else {
                    console.log("\nError: move_piece.js: process_sequence: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: move_piece.js: process_sequence: onreadystatechange")
                console.log("this.status", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    get_property_request.open("GET", url, true)
    get_property_request.send()
}

function process_sequence_callback(player, property, dice) {

    // This is the Cloned Property Card currently being displayed in the Roll Dice Screen.
    var current_roll_dice_property_id = "roll_dice_property_id"

    // These are the target coordinates for the next Cloned Property Card.
    var new_x = g.dialog.x
    var new_y = g.dialog.y
    var translate = "translate(" + new_x + " " + new_y + ")"

    // Get all of the elements in the current Cloned Property Card.
    var o = d3.select("#" + current_roll_dice_property_id).selectAll("*")
    var node_list = o["_groups"][0]

    // Remove all the details of the current Cloned Property Card.
    d3.select("#" + current_roll_dice_property_id).selectAll("*").remove()

    // Remove the current Cloned Property Card.
    d3.select("#" + current_roll_dice_property_id).remove()

    // Clone the Property Card for the Property and identify it as the current Cloned Property Card.
    d3.select("#" + property.key + "_card_group_id")
        .clone(true)
        .attr("id", current_roll_dice_property_id)

    // Move the Cloned Property Card group to the display location on the Roll Dice Screen.
    d3.select("#" + current_roll_dice_property_id)
        .transition()
        .duration(1000)
        .attr("class", "visible")
        .attr("transform", translate)

    // Get all of the details of the current Cloned Property Card.
    var o = d3.select("#" + current_roll_dice_property_id).selectAll("*")

    node_list = o["_groups"][0]

    // Process the property represented by the current Cloned Property Card.
    if (property.type == "property") {

        var active_buttons = process_property_type_property(player, property)

    } else if (property.type == "railroad") {

        var active_buttons = process_property_type_railroad(player, property)

    } else if (property.type == "utility") {

        var active_buttons = process_property_type_utility(player, property, dice)

    } else if (property.type == "tax") {

        var active_buttons = process_property_type_tax(player, property)

    } else if (property.type == "go_to_jail") {

        var active_buttons = process_property_type_go_to_jail(player)

    } else if (property.type == "community_chest") {

        var active_buttons = process_property_type_community_chest(player, property)

    } else if (property.type == "chance") {

        var active_buttons = process_property_type_chance(player)

    } else if (property.type == "go") {

        var active_buttons = process_property_type_go(player, property)

    } else if (property.type == "free_parking") {

        var active_buttons = process_property_type_free_parking(player)

    } else if (property.type == "jail") {

        var active_buttons = process_property_type_jail(player)

    } else {

        var active_buttons = process_property_type_invalid(property)
    }

    // Update the buttons on the Roll Dice Screen
    hide_expose_roll_dice_buttons(active_buttons)

    // Release the property.
    release_property(property)
}

function process_property_type_property(player, property) {

    // Determine if the property is owned by the bank.
    if (property.owner == "bank") {

        // Determine if the property owned by the bank is mortgaged.
        if (property.mortgaged == true) {

            // The purchase price for mortgaged property owned by the bank is the price less mortgage.
            var purchase_price = property.price - property.mortgage
            log(`${property.name} (mortgaged) purchase price is price less mortgage.`)

        } else {

            // The property owned by the bank is not mortgaged, so it is sold at full price.
            var purchase_price = property.price
            log(`${property.name} is not mortgaged and purchase price is full price.`)
        }

        // Determine if the player can afford the property
        if (player.balance > purchase_price) {

            // Inform the player to either buy the property or start an auction.
            add_roll_dice_message("Either buy unowned property or start the bidding.")

            // Display the Buy Button and Auction Button on the Roll Dice Screen.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Buy", "Auction", "Reset"].includes(d)) { return true }
                return false
            })


        } else {

            // Inform the player that they have insufficient funds to purchase the property and must start an auction.
            add_roll_dice_message("You have insufficient funds to buy this property.;Start the bidding.")

            // Display the Auction Button only on the Roll Dice Screen.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Auction", "Reset"].includes(d)) { return true }
                return false
            })

        }

        // Determine if the Player owns the Property.
    } else if (property.owner == player.key) {

        // Deterine if the Player has rolled doubles.
        if (player.doubles > 0) {

            // The Player owns the property and has rolled doubles.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
                return false
            })

        } else {

            // The Player owns the property but did not roll doubles.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"].includes(d)) { return true }
                return false
            })
        }

        // Inform the Player that they already own the Property.
        add_roll_dice_message(`You already own ${property.name}.`)
        log(`${player.name} already owns ${property.name}.`)

        // The Property is owned by another Player.
    } else {

        // Determine if the property is mortgaged.
        if (property.mortgaged == true) {

            // Rent is zero if the Property is mortgaged.
            g.payment = 0

            // Inform the Player of the good news.
            add_roll_dice_message("No rent due.;Property is mortgaged.")
            log(`${player.name} paid no rent because ${property.name} was mortgaged.`)

            // Determine if the property has a hotel.
        } else if (property.hotels > 0) {

            // Pay hotel rent.
            g.payment = property.hotel_rent

            // Add message for the rent on the Roll Dice Screen.
            add_roll_dice_message(`Pay hotel rent of ${g.payment.toString()} to ${format_name_from_key(property.owner)} for ${property.name}.`)
            log(`${player.name} paid a hotel rent of ${g.payment.toString()} to ${format_name_from_key(property.owner)} for ${property.name}.`)

            // Determine if the property has houses.
        } else if (property.houses > 0) {

            // Pay the rent depending on the number of houses.
            g.payment = property.house_rents[property.houses - 1]

            // Add message for the rent on the Roll Dice Screen.
            add_roll_dice_message(`Pay ${property.houses.toString()} house rents of ${g.payment.toString()} to ${format_name_from_key(property.owner)} for ${property.name}.`)
            log(`${player.name} paid house rents of ${g.payment.toString()} to ${format_name_from_key(property.owner)} for ${property.name}.`)

            // Determine if the other Player owns all the Properties of that color group.
        } else if (property.double_rent == true) {

            // Rent is double when all Properties of the same color are owned by the same Player.
            g.payment = property.rent * 2

            // Inform the Player to pay the double rent.
            add_roll_dice_message(`Pay double rent of ${g.payment.toString()} to ${format_name_from_key(property.owner)} for ${property.name}.`)
            log(`${player.name} paid double rent of ${g.payment.toString()} to ${format_name_from_key(property.owner)} for ${property.name}.`)

        } else {

            // The Player does not own the property and must pay rent.
            g.payment = property.rent

            // Add message for the rent on the Roll Dice Screen.
            add_roll_dice_message(`Pay regular rent of ${g.payment.toString()} to ${format_name_from_key(property.owner)} for ${property.name}.`)
            log(`${player.name} paid regular rent of ${g.payment.toString()} to ${format_name_from_key(property.owner)} for ${property.name}.`)
        }

        // This global variable is used in roll_dice to pay the payee.
        g.payee_key = property.owner

        // The player's only option is to pay rent.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Pay", "Reset"].includes(d)) { return true }
            return false
        })
    }

    // Return focus to the Roll Dice Screen.
    return active_buttons
}

function process_property_type_railroad(player, property) {

    // console.log("\nfunction process_property_type_railroad(player, property)", player, property)

    // Determine if the Railroad is available for purchase.
    if (property.owner == "bank") {

        // Determine if the Player can afford the Railroad.
        if (player.balance > property.price) {

            // Inform the Player to either buy the Railroad or start an Auction Event.
            add_roll_dice_message("Either buy unowned railroad or start the bidding.")

            // Display the Buy Button and Auction Button on the Roll Dice Screen.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Buy", "Auction", "Reset"].includes(d)) { return true }
                return false
            })

            // The Player cannot afford the Railroad.
        } else {

            // Inform the Player that they have insufficient funds to purchase the Railroad and must start an Auction Event.
            add_roll_dice_message("You have insufficient funds to buy this railroad.;Start the bidding.")

            // Display the Auction Button only on the Roll Dice Screen.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Auction", "Reset"].includes(d)) { return true }
                return false
            })
        }

        // Determine if the Player already owns the Railroad.
    } else if (property.owner == player.key) {

        // Determine if the Player had rolled doubles.
        if (player.doubles > 0) {

            // The Player owns the Railroad and had rolled doubles.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
                return false
            })

        } else {

            // The Player owns the Railroad but did not roll doubles.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"].includes(d)) { return true }
                return false
            })
        }

        // Inform the Player that they already own the Railroad..
        add_roll_dice_message(`You already own ${property.name}.`)
        log(`${player.name} already owns ${property.name}.`)

        // Some other Player owns the Railroad and calculate the fee based on the number of Railroads owned.
    } else {

        // Determine if the Railroad is mortgaged.
        if (property.mortgaged == true) {

            // The ticket is zero if the Property is mortgaged.
            g.payment = 0

            // Determine if the owner of the current Railroad only owns this Railroad.
        } else if (property.owns == 1) {

            // Ticket for a Railroad when the owner owns only this Railroad is 25.
            g.payment = 25

            // Determine if the owner of the current Railroad owns two Railroads.
        } else if (property.owns == 2) {

            // Ticket for a Railroad when the owner owns this and another Railroad is 50.
            g.payment = 50

            // Determine if the owner of the current Railroad owns two other Railroads.
        } else if (property.owns == 3) {

            // Ticket for a Railroad when the owner owns two other Railroads is 100.
            g.payment = 100

            // Determine if the owner of the current Railroad owns all four Railroads.
        } else if (property.owns == 4) {

            // Ticket for a Railroad when the owner owns all four Railroads is 200.
            g.payment = 200

        } else {
            console.log("\nError: move_piece.js: process_property_type_railroad")
            console.log("Parameter player key:", window.name)
            console.log("Parameter property:", property)
            console.log("property.owns:", property.owns)
            console_trace(); set_error_encountered()
        }

        // Update the global variable with the payee to be used in the Pay Request.
        g.payee_key = property.owner

        // Inform the Player of the calculated fee.
        add_roll_dice_message(`Pay railroad ticket of ${g.payment.toString()} to ${format_name_from_key(property.owner)} for ${property.name}.`)
        log(`${player.name} paid railroad ticket of ${g.payment.toString()} to ${format_name_from_key(property.owner)} for ${property.name}.`)

        // The player's only option is to Pay.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Pay", "Reset"].includes(d)) { return true }
            return false
        })
    }

    // Return focus to the Roll Dice Screen.
    return active_buttons
}

function process_property_type_utility(player, property, dice) {

    // console.log("\nfunction process_property_type_utility(player, property, dice)", player, property, dice)

    // Determine if the Utility is available for purchase.
    if (property.owner == "bank") {

        // Determine if the player can afford the property
        if (player.balance > property.price) {

            // Inform the Player to either buy the Utility or start an Auction Event.
            add_roll_dice_message("Either buy unowned utility or start the bidding.")

            // Display the Buy Button and Auction Button on the Roll Dice Screen.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Buy", "Auction", "Reset"].includes(d)) { return true }
                return false
            })

        } else {

            // Inform the Player that they have insufficient funds to purchase the Utility and must start an Auction Event.
            add_roll_dice_message("You have insufficient funds to buy this utility.;Start the bidding.")

            // Display the Auction Button only on the Roll Dice Screen.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Auction", "Reset"].includes(d)) { return true }
                return false
            })
        }

        // Determine if the Player already owns this Utility.
    } else if (property.owner == window.name) {

        // Determine if Player had rolled doubles.
        if (player.doubles > 0) {

            // The Player owns the Utility and had rolled doubles.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
                return false
            })

        } else {

            // The Player owns the Utility but did not roll doubles.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"].includes(d)) { return true }
                return false
            })
        }

        // Inform the Player that they already own the Utility.
        add_roll_dice_message(`You already own ${property.name}.`)
        log(`${player.name} already owns ${property.name}.`)

        // Another Player owns the Utility.
    } else {

        // Determine if the Property is mortgaged.
        if (property.mortgaged == true) {

            // The rent is zero if the Utility is mortgaged.
            g.payment = 0

            // Determine if the other Player owns both Utilities.
        } else if (property.times_ten) {

            // The bill is ten times the dice since the other Player owns both Utilities.
            g.payment = dice * 10

        } else {

            // The bill is four times the dice since the other Player only owns this Utility.
            g.payment = dice * 4
        }

        // Update the global variable used in the Pay Request.
        g.payee_key = property.owner

        // Inform the Player what needs to be paid and to whom.
        add_roll_dice_message(`Pay utility bill of ${g.payment.toString()} to ${format_name_from_key(property.owner)} for ${property.name}.`)
        log(`${palyer.name} paid utility bill of ${g.payment.toString()} to ${format_name_from_key(property.owner)} for ${property.name}.`)

        // The player's only option is to Pay.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Pay", "Reset"].includes(d)) { return true }
            return false
        })
    }

    // Return focus to the Roll Dice Screen
    return active_buttons
}

function process_property_type_tax(player, property) {

    // console.log("\nfunction process_property_type_tax(player, property)", player, property)

    // Reset the global variable for the Pay Request since no other Player is receiving the tax payment.
    g.payee_key = null

    // Determine if this is for Income Tax.
    if (property.key == "income_tax") {

        // Set the global payment for the Pay Button process.
        g.payment = property.tax

        // Inform the player to pay the Income Tax.
        add_roll_dice_message(`Pay income tax of ${g.payment.toString()}.`)
        log(`${player.name} paid income tax of ${g.payment.toString()}.`)

        // The Player's only option is to Pay.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Pay", "Reset"].includes(d)) { return true }
            return false
        })

        // Determine if this is for Luxury Tax.
    } else if (property.key == "luxury_tax") {

        // Set the global payment for the Pay Request.
        g.payment = property.tax

        // Inform the Player of the Luxury Tax to be paid.
        add_roll_dice_message(`Pay luxury tax of ${g.payment.toString()}.`)
        log(`${player.name} paid luxury tax of ${g.payment.toString()}.`)

        // The Player's only option is to Pay.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Pay", "Reset"].includes(d)) { return true }
            return false
        })

    } else {
        console.log("\nError: move_piece.js: process_property_type_tax")
        console.log("Invalid property.key:", property.key)
        console.log("Parameter player:", player)
        console.log("Parameter property:", property)
        console_trace(); set_error_encountered()


        // Inform the Player that an error had occurred and to check the log.
        add_roll_dice_message("Invalid tax type.  Check log.")

        // Only display the Reset Button when something bad occurs.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Reset"].includes(d)) { return true }
            return false
        })
    }

    // Return focus to the Roll Dice Screen.
    return active_buttons
}

function process_property_type_go_to_jail(player) {

    log(`${player.name} needs to click the Jail Button to surrender to the authorities.`)



    // Inform the Player that they must go to Jail.
    add_roll_dice_message("Go to jail.")

    // The Player's only option is to go to Jail.
    var active_buttons = g.dialog.buttons.filter((d) => {
        if (["Jail", "Reset"].includes(d)) { return true }
        return false
    })

    // Return focus to the Roll Dice Screen.
    return active_buttons
}

function add_get_out_of_jail_card(player) {

    var transaction = {}
    transaction["code"] = "add_get_out_of_jail_card"
    transaction["key"] = player["key"]

    // Convert the transaction to a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the url base.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an asynchronous request for setting the Player.
    if (typeof add_get_out_of_jail_card_request == "undefined") {
        var add_get_out_of_jail_card_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    add_get_out_of_jail_card_request.onreadystatechange = function () {

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

                    console.log("\nError: move_piece.js: set_player_in_jail: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                }

            } else {

                console.log("\nError: move_piece.js: set_player_in_jail: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the asynchronous request to the server.
    add_get_out_of_jail_card_request.open("GET", url, true)
    add_get_out_of_jail_card_request.send()
}

function set_player_in_jail(player) {

    var transaction = {}
    transaction["code"] = "set_player_in_jail"
    transaction["key"] = player["key"]

    // Convert the transaction to a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the url base.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an asynchronous request for setting the Player.
    if (typeof set_player_in_jail_request == "undefined") {
        var set_player_in_jail_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    set_player_in_jail_request.onreadystatechange = function () {

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

                    console.log("\nError: move_piece.js: set_player_in_jail: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                }

            } else {

                console.log("\nError: move_piece.js: set_player_in_jail: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the asynchronous request to the server.
    set_player_in_jail_request.open("GET", url, true)
    set_player_in_jail_request.send()
}

function set_player_out_of_jail(player, card_used=false) {

    var transaction = {}
    transaction["code"] = "set_player_out_of_jail"
    transaction["key"] = player["key"]
    transaction["card_used"] = card_used

    // Convert the transaction to a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the url base.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an asynchronous request for setting the Player.
    if (typeof set_player_out_of_jail_request == "undefined") {
        var set_player_out_of_jail_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    set_player_out_of_jail_request.onreadystatechange = function () {

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

                    console.log("\nError: move_piece.js: set_player_out_of_jail: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                }

            } else {

                console.log("\nError: move_piece.js: set_player_out_of_jail: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the asynchronous request to the server.
    set_player_out_of_jail_request.open("GET", url, true)
    set_player_out_of_jail_request.send()
}

function process_property_type_community_chest(player) {

    // console.log("\nfunction process_property_type_community_chest(player)", player)

    // Process the Community Chest Event and return active buttons.
    active_buttons = process_community_chest_event(player)

    // Return focus to the Roll Dice Screen.
    return active_buttons
}

function process_property_type_chance(player) {

    // console.log("\nfunction process_property_type_chance(player)", player)

    // Process the Chance Event and return active buttons.
    active_buttons = process_chance_event(player)

    // Return focus to the Roll Dice Screen.
    return active_buttons
}

function process_property_type_go(player, property) {

    // console.log("\nfunction process_property_type_go(player, property)", player, property)

    // Update the global payment to be used in the Collect Request.
    g.payment = property.salary

    // Inform the Player they landed on Go and must collect 200.
    add_roll_dice_message(`You landed on Go.;Collect ${g.payment.toString()}.`)
    log(`${player.name} landed on Go and ollected ${g.payment.toString()}.`)

    // Limit the player to the Collect Button.
    var active_buttons = g.dialog.buttons.filter((d) => {
        if (["Collect", "Reset"].includes(d)) { return true }
        return false
    })

    // Return focus to the Roll Dice Screen.
    return active_buttons
}

function process_property_type_free_parking(player) {

    // console.log("\nfunction process_property_type_free_parking(player)", player)

    // Inform the Player that they landed in Free Parking.
    add_roll_dice_message("Relax.  You landed on Free Parking.")
    log(`${player.name} is relaxing in Free Parking.`)

    // Determine if the Player had rolled doubles.
    if (player.doubles > 0) {

        // The Player had rolled doubles.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
            return false
        })

    } else {

        // The Player did not roll doubles and must take another action or End Turn.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"].includes(d)) { return true }
            return false
        })
    }

    // Return focus to the Roll Dice Screen.
    return active_buttons
}

function process_property_type_jail(player) {

    // console.log("\nfunction process_property_type_jail(player)", player)

    // Inform the Player that they landed in the lobby of the Jail.
    add_roll_dice_message("Relax.  Just visiting with Erroll.")
    log(`${player.name} is just visiting with Erroll in jail.`)

    // Determine if the Player had rolled doubles.
    if (player.doubles > 0) {

        // The Player had rolled doubles and can roll again.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Roll", "Trade", "Build", "Mortgage", "Unmortgage", "Sell", "Reset"].includes(d)) { return true }
            return false
        })

    } else {

        // The Player did not roll doubles and must take another action or End Turn.
        var active_buttons = g.dialog.buttons.filter((d) => {
            if (["Trade", "Build", "Mortgage", "Unmortgage", "Sell", "End Turn", "Reset"].includes(d)) { return true }
            return false
        })
    }

    // Return focus to the Roll Dice Screen.
    return active_buttons
}

function process_property_type_invalid(property) {

    console.log("\nError: move_piece.js: process_property_type_invalid")
    console.log("property:", property)
    console_trace(); set_error_encountered()

    // Inform the Player of an error.
    add_roll_dice_message(`Invalid property.type:  ${property.type}.`)

    // Restrict the player when something bad happens.
    var active_buttons = g.dialog.buttons.filter((d) => {
        if (["Reset"].includes(d)) { return true }
        return false
    })

    // Return focus to the Roll Dice Screen.
    return active_buttons
}

function release_property(property) {

    // console.log("\nfunction release_property(property)", property)

    // Create a transaction to release the Property.  
    // This is necessary for multiple asynchronous transactions potentially updating the same property.
    var transaction = {}
    transaction["code"] = "release_property"
    transaction["key"] = property.key
    transaction["hold"] = false
    transaction = JSON.stringify(transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create an unique handle for the request.
    if (typeof release_property_request == "undefined") {
        var release_property_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener for the request.
    release_property_request.onreadystatechange = function () {

        // Server is done with the request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response into a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful response.
                if (response.status != "Pass") {

                    console.log("\nError: move_piece.js: release_property: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: move_piece.js: release_property: onreadystatechange")
                console.log("this.status", this.status)
                console.log("this.statusText:", this.statusText)
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    release_property_request.open("GET", url, true)
    release_property_request.send()
}
