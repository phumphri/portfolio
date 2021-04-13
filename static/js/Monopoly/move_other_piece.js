function move_other_piece(details) {

    // Verify that parameter "details" was defined.
    if (typeof details == "undefined") {
        console.log("\nError: move_other_piece.js: move_other_piece")
        console.log('Parameter "details" was undefined.')
         
        console_trace(); set_error_encountered()
        return
    }

    // Verify that parameter "details" was not null.
    if (details == null) {
        console.log("\nError: move_other_piece.js: move_other_piece")
        console.log('Parameter "details" was null.')
         
        console_trace(); set_error_encountered()
        return
    }

    // Extract the key of the target Player from the details parameter.
    var player_key = details.target_player_key

    // Extract the dice variable from the details parameter.
    var dice = details.dice

    // Set the default value of variable "use_prior_sequence" to false.
    if (typeof details.use_prior_sequence == "undefined") {
        var use_prior_sequence = false

    } else if (details.use_prior_sequence == null) {
        var use_prior_sequence = false

    } else {
        var use_prior_sequence = details.use_prior_sequence
    }

    // Create a transaction to get Player information from the server.
    var transaction = {}
    transaction["code"] = "get_player"
    transaction["key"] = player_key

    // Convert the transaction into a string.
    transaction = JSON.stringify(transaction)

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

                    // Extract the Player from the response.
                    var player = response.player

                    // Extract "bankrupt" attribute from Player.
                    g.poorhouse[player.key] = player.bankrupt

                    // Verify that the Player is not bankrupt.
                    if (g.poorhouse[player.key] == false) {

                        // Move the piece and update the Player.
                        move_other_piece_process(player, dice, use_prior_sequence)
                    }

                } else {
                    console.log("\nError: move_other_piece.js: move_other_piece: get_player_request: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: move_other_piece.js: move_other_piece: get_player_request: onreadystatechange")
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

function move_other_piece_process(player, dice, use_prior_sequence) {

    // Configure the piece for the player.
    g.piece = {}
    g.piece["group_id"] = player.key + "_piece_group_id"
    g.piece["border_id"] = player.key + "_piece_border_id"
    g.piece["text_id"] = player.key + "_piece_text_id"

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
            .attr("id", g.piece.text_id)
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

    // Calculate the next location for the player's piece.
    var new_sequence = player.sequence + dice

    // Delay the move so that the token does not cut the corner.
    var delay = 1500

    try {

        // New piece at Go, the only time dice value will be zero.  
        if (dice == 0) {
            var new_x = g.sequences[0]["x"]
            var new_y = g.sequences[0]["y"]
            make_the_move(0, new_x, new_y)
            return
        }

        // Determine if the player's piece needs to go to their jail cell.
        if (new_sequence == 30) {

            // Incarcerate the player and put the player's piece in a jail cell.
            log(`${player.name} landed on GO TO Jail.`)
            process_jail_request(player)
                
            var start_name = g.sequences[player["sequence"]]["property"]["name"]
            var end_name = g.sequences[new_sequence]["property"]["name"]
            log(`${player["name"]} moved from ${start_name} to ${end_name}.`)

            return
    }

        // The player's piece is at the "Jail", the lower left corner.
        if (player.sequence == 10) {

            // Determine if the player's piece is stopping on the left edge or the top edge.
            if (new_sequence < 21) {

                // The player's piece is stoping on the left edge.
                var new_x = g.sequences[new_sequence]["x"]
                var new_y = g.sequences[new_sequence]["y"]
                make_the_move(0, new_x, new_y)
                
                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_sequence]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return

            } else {

                // The player's piece is moving to "Free Parking", the upper left corner.
                var new_x = g.sequences[20]["x"]
                var new_y = g.sequences[20]["y"]
                make_the_move(0, new_x, new_y)

                // The player's piece is stopping on the top edge.
                var new_x = g.sequences[new_sequence]["x"]
                var new_y = g.sequences[new_sequence]["y"]
                make_the_move(delay, new_x, new_y)

                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_sequence]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return
            }
        }

        // Determine if the player's piece is on the bottom edge.
        if (player.sequence < 11) {

            // Determine if the player's piece is stopping on the botton edge.
            if (new_sequence < 11) {

                // The player's piece is staying on the bottom edge.
                var new_x = g.sequences[new_sequence]["x"]
                var new_y = g.sequences[new_sequence]["y"]
                make_the_move(0, new_x, new_y)

                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_sequence]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return

            } else if (new_sequence < 21) {

                // The player's piece is moving to the "Jail", the lower left corner.
                var new_x = g.sequences[10]["x"]
                var new_y = g.sequences[10]["y"]
                make_the_move(0, new_x, new_y)

                // The player's is staying on the left edge.
                var new_x = g.sequences[new_sequence]["x"]
                var new_y = g.sequences[new_sequence]["y"]
                make_the_move(delay, new_x, new_y)
                
                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_sequence]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return

            } else if (new_sequence < 31) {

                // The player's piece is moving to the "Jail", the lower left corner.
                var new_x = g.sequences[10]["x"]
                var new_y = g.sequences[10]["y"]
                make_the_move(0, new_x, new_y)

                // The player's piece is moving to "Free Parking", the upper left corner.
                var new_x = g.sequences[20]["x"]
                var new_y = g.sequences[20]["y"]
                make_the_move(delay, new_x, new_y)

                // The player's piece is staying on the top edge.
                var new_x = g.sequences[new_sequence]["x"]
                var new_y = g.sequences[new_sequence]["y"]
                make_the_move((delay * 2), new_x, new_y)
                
                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_sequence]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return

            } else if (new_sequence < 40) {

                // The player's piece is moving to the "Jail", the lower left corner.
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

                // The player's piece is staying on the right edge.
                var new_x = g.sequences[new_sequence]["x"]
                var new_y = g.sequences[new_sequence]["y"]
                make_the_move((delay * 3), new_x, new_y)
                
                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_sequence]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return

            } else {
                // The player's piece is moving to the "Jail", the lower left corner.
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

                // Who knows?
                var new_x = g.sequences[new_sequence - 40]["x"]
                var new_y = g.sequences[new_sequence - 40]["y"]
                make_the_move((delay * 5), new_x, new_y)
                
                var new_seq = new_sequence - 40
                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_seq]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return

            }
        }

        // The player's piece is in "Free Parking", the upper left corner.
        if (player.sequence == 20) {

            // Determine if the player's piece is staying on the top edge.
            if (new_sequence < 31) {

                // The player's piece is statying on the top edge
                var new_x = g.sequences[new_sequence]["x"]
                var new_y = g.sequences[new_sequence]["y"]
                make_the_move(0, new_x, new_y)
                
                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_sequence]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return

            } else if (new_sequence < 40) {

                // The player's piece is moving to "Go to Jail", the upper right corner.
                var new_x = g.sequences[30]["x"]
                var new_y = g.sequences[30]["y"]
                make_the_move(0, new_x, new_y)

                // The player's piece is staying on the right edge.
                var new_x = g.sequences[new_sequence]["x"]
                var new_y = g.sequences[new_sequence]["y"]
                make_the_move(delay, new_x, new_y)
                
                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_sequence]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return

            } else {

                // The player's piece is moving to "Go to Jail", the upper right corner.
                var new_x = g.sequences[30]["x"]
                var new_y = g.sequences[30]["y"]
                make_the_move(0, new_x, new_y)

                // The player's piece is moving to "Go ", the lower right corner.
                var new_x = g.sequences[0]["x"]
                var new_y = g.sequences[0]["y"]
                make_the_move(delay, new_x, new_y)

                // Who knows?
                var new_x = g.sequences[new_sequence - 40]["x"]
                var new_y = g.sequences[new_sequence - 40]["y"]
                make_the_move((delay * 2), new_x, new_y)
                
                var new_seq = new_sequence - 40

                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_seq]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return
                
            }
        }

        // The player's piece is on the left edge.
        if (player.sequence < 21) {

            // Determine if the player's piece is staying on the left edge.
            if (new_sequence < 21) {

                // The player's piece is staying on the left edge.
                var new_x = g.sequences[new_sequence]["x"]
                var new_y = g.sequences[new_sequence]["y"]
                make_the_move(0, new_x, new_y)
                
                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_sequence]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return

                // Determine if player's piece is staying on the top edge.
            } else if (new_sequence < 31) {

                // The player's piece is moving to "Free Parking", the upper left corner.
                var new_x = g.sequences[20]["x"]
                var new_y = g.sequences[20]["y"]
                make_the_move(0, new_x, new_y)

                // The player's piece is staying on the top edge.
                var new_x = g.sequences[new_sequence]["x"]
                var new_y = g.sequences[new_sequence]["y"]
                make_the_move(delay, new_x, new_y)
                
                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_sequence]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return

            } else if (new_sequence < 40) {

                // The player's piece is moving to "Free Parking", the upper left corner.
                var new_x = g.sequences[20]["x"]
                var new_y = g.sequences[20]["y"]
                make_the_move(0, new_x, new_y)

                // The player's piece is moving to "Go to Jail", the upper right corner.
                var new_x = g.sequences[30]["x"]
                var new_y = g.sequences[30]["y"]
                make_the_move(delay, new_x, new_y)

                // The player's piece is staying on the right edge.
                var new_x = g.sequences[new_sequence]["x"]
                var new_y = g.sequences[new_sequence]["y"]
                make_the_move((delay * 2), new_x, new_y)
                
                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_sequence]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
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

                // Who knows?
                var new_x = g.sequences[new_sequence - 40]["x"]
                var new_y = g.sequences[new_sequence - 40]["y"]
                make_the_move((delay * 4), new_x, new_y)
                
                var new_seq = new_sequence - 40

                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_seq]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return
            }
        }

        // The player's piece is at "Go to Jail", the upper right corner.
        if (player.sequence == 30) {

            // Determine if the player's piece is staying on the right edge.
            if (new_sequence < 40) {

                // The player's piece is staying on the right edge.
                var new_x = g.sequences[new_sequence]["x"]
                var new_y = g.sequences[new_sequence]["y"]
                make_the_move(0, new_x, new_y)
                return

            } else {

                // The player's piece is moving to "Go", the lower right corner.
                var new_x = g.sequences[0]["x"]
                var new_y = g.sequences[0]["y"]
                make_the_move(0, new_x, new_y)

                // The player's piece is staying on the lower edge.
                var new_x = g.sequences[new_sequence - 40]["x"]
                var new_y = g.sequences[new_sequence - 40]["y"]
                make_the_move((delay * 2), new_x, new_y)
                
                var new_seq = new_sequence - 40

                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_seq]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return
            }
        }

        // The player's piece is on the top edge.
        if (player.sequence < 31) {

            // Determine if the player's piece is staying on the top edge.
            if (new_sequence < 31) {

                // The player's piece is staying on the top edge.
                var new_x = g.sequences[new_sequence]["x"]
                var new_y = g.sequences[new_sequence]["y"]
                make_the_move(0, new_x, new_y)
                return

            } else if (new_sequence < 40) {

                // The player's piece is moving to "Go to Jail", the upper right corner.
                var new_x = g.sequences[30]["x"]
                var new_y = g.sequences[30]["y"]
                make_the_move(0, new_x, new_y)

                // The player's piece is staying on the right edge.
                var new_x = g.sequences[new_sequence]["x"]
                var new_y = g.sequences[new_sequence]["y"]
                make_the_move(delay, new_x, new_y)
                
                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_sequence]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
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

                // The player's piece is staying on the bottom edge.                
                var new_x = g.sequences[new_sequence - 40]["x"]
                var new_y = g.sequences[new_sequence - 40]["y"]
                make_the_move((delay * 2), new_x, new_y)
                
                var new_seq = new_sequence - 40

                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_seq]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return
            }
        }

        // The player's piece is on the right edge.
        if (player.sequence < 40) {

            // Determine if the player's piece is staying on the right edge.
            if (new_sequence < 40) {

                // The player's piece is staying on the right edge.
                var new_x = g.sequences[new_sequence]["x"]
                var new_y = g.sequences[new_sequence]["y"]
                make_the_move(0, new_x, new_y)
                
                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_sequence]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return

            } else if (new_sequence < 50) {

                // The player's piece is moving to "Go", the lower right corner.
                var new_x = g.sequences[0]["x"]
                var new_y = g.sequences[0]["y"]
                make_the_move(0, new_x, new_y)

                // The player's piece is staying on the lower edge.
                var new_x = g.sequences[new_sequence - 40]["x"]
                var new_y = g.sequences[new_sequence - 40]["y"]
                make_the_move((delay * 2), new_x, new_y)
                
                var new_seq = new_sequence - 40

                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_seq]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return

            } else {

                // The player's piece is moving to "Go", the lower right corner.
                var new_x = g.sequences[0]["x"]
                var new_y = g.sequences[0]["y"]
                make_the_move(0, new_x, new_y)

                // The player's token is moving to the "Jail", the lower left corner.
                var new_x = g.sequences[10]["x"]
                var new_y = g.sequences[10]["y"]
                make_the_move((delay * 2), new_x, new_y)

                // The player's token is moving along the left edge.
                var new_x = g.sequences[new_sequence - 40]["x"]
                var new_y = g.sequences[new_sequence - 40]["y"]
                make_the_move((delay * 3), new_x, new_y)
                
                var new_seq = new_sequence - 40

                var start_name = g.sequences[player["sequence"]]["property"]["name"]
                var end_name = g.sequences[new_seq]["property"]["name"]
                log(`${player["name"]} moved from ${start_name} to ${end_name}.`)
    
                return
            }
        }

    } catch (err) {
        console.log("\nError: move_other_piece.js: move_other_piece")
        console.log("err.message:", err.message)
        console.log("player:", player)
        console.log("new_sequence:", new_sequence)
        console.log("g.sequences:", g.sequences)
         
        console_trace(); set_error_encountered()
        return
    }
}


