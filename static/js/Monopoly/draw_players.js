function draw_players() {

    // Start the process by getting the properties.
    get_properties()
}

function get_properties() {
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

                    // Get Players.
                    get_players(properties)

                } else {
                    console.log("\nError: draw_players.js: draw_players: get_properties: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: draw_players.js: draw_players: get_properties: onreadystatechange")
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

function get_players(properties) {

    if (typeof properties == "undefined") {
        console.log("\nError: draw_players.js: get_players")
        console.log('Parameter "properties" was undefined.')
         
        console_trace(); set_error_encountered()
        return
    }

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

                    // Construct the players and properties.
                    process_properties_and_players(properties, players)

                } else {
                    console.log("\nError: draw_players.js: get_players: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    console.log("Parameter properties:", properties)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: draw_players.js: get_players: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console.log("Parameter properties:", properties)
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    get_players_request.open("GET", url, true);
    get_players_request.send();
}

function process_properties_and_players(properties, players) {

    if (typeof process_properties_and_players == "undefined") {
        console.log("\nError: draw_players.js: process_properties_and_players")
        console.log('Parameter "properties" was undefined.')
        console_trace(); set_error_encountered()
        return
    }

    if (typeof players == "undefined") {
        console.log("\nError: draw_players.js: process_properties_and_players")
        console.log('Parameter "players" was undefined.')
        console_trace(); set_error_encountered()
        return
    }
    create_player_asset_columns(players)

    create_bank_column(properties)
}

function create_player_asset_columns(players) {

    if (typeof players == "undefined") {
        console.log("\nError: draw_players.js: create_player_asset_columns")
        console.log('Parameter "players" was undefined.')
        console_trace(); set_error_encountered()
        return
    }

    if (players == null) {
        console.log("\nError: draw_players.js: create_player_asset_columns")
        console.log('Parameter "players" was null.')
        console_trace(); set_error_encountered()
        return
    }

    if (Object.keys(players).length == 0) {
        console.log("\nError: draw_players.js: create_player_asset_columns")
        console.log('Parameter "players" was empty.')
        console_trace(); set_error_encountered()
        return
    }

    for (player_key in players) {

        var player = players[player_key]

        create_player_asset_column(player)
    }
}

function create_player_asset_column(player) {

    // Verify that the parameter "player" is defined.
    if (typeof player == "undefined") {

        console.log("\nError: draw_players.js: create_player_asset_column")
        console.log('Parameter "player" was undefined.')
        console_trace(); set_error_encountered()
        return
    }

    // Vertify that the parameter "player" is not null
    if (player == null) {

        console.log("\nError: draw_players.js: create_player_asset_column")
        console.log('Parameter "player" was null.')
        console_trace(); set_error_encountered()
        return
    }

    // Vertify that the key attribute of the player is not null.
    if (player.key == null) {

        console.log("\nError: draw_players.js: create_player_asset_column")
        console.log('Key of parameter "player" was null.')
        console.log("Player:", player)
        console_trace(); set_error_encountered()
        return
    }

    // Define player_asset_column dimensions.
    var player_asset_column = {}
    player_asset_column["id"] = player.key + "_column"
    player_asset_column["x"] = g.asset_columns[player.key]
    player_asset_column["y"] = 0
    player_asset_column["width"] = g.bank_column.width
    player_asset_column["height"] = g.bank_column.height
    player_asset_column["border_id"] = player.key + "_column_border_id"
    player_asset_column["balance_id"] = player.key + "_column_balance_id"
    player_asset_column["text_height"] = g.bank_column.text_height

    player_asset_column["button"] = {}
    player_asset_column.button["id"] = player.key + "_column_button_group_id"
    player_asset_column.button["rect"] = player.key + "_column_button_rect_id"
    player_asset_column.button["text"] = player.key + "_column_button_text_id"

    // Create Player Column.
    d3.select("#svg")
        .append("g")
        .attr("id", player_asset_column.id)

    // Append Player Column Border.
    d3.select("#" + player_asset_column.id)
        .append("rect")
        .attr("id", player_asset_column.border_id)

    // Set the Player Column Border attributes.
    d3.select("#" + player_asset_column.border_id)
        .attr("x", player_asset_column.x)
        .attr("y", player_asset_column.y)
        .attr("width", player_asset_column.width)
        .attr("height", player_asset_column.height)
        .attr("fill-opacity", "0.0")
        .attr("stroke", "darkgrey")
        .attr("stroke-width", 3)

    // Create the Player Column Button Group.
    d3.select("#" + player_asset_column.id)
        .append("g")
        .attr("id", player_asset_column.button.id)

    // Append rect to the Player Column Button Group.
    d3.select("#" + player_asset_column.button.id)
        .append("rect")
        .attr("id", player_asset_column.button.rect)

    // Set the rect attributes for the Player Column Button Group.
    d3.select("#" + player_asset_column.button.rect)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", player_asset_column.width)
        .attr("height", player_asset_column.text_height * 2)
        .attr("fill-opacity", "1.0")
        .attr("fill", "Blue")
        .attr("stroke", "darkgrey")
        .attr("stroke-width", 3)
        .style("pointer-events", "visible")
        .on("click", () => {player_asset_column_click(player)})

    // Add text to the Player Column Button Group.
    d3.select("#" + player_asset_column.button.id)
        .append("text")
        .attr("id", player_asset_column.button.text)
        .attr("x", player_asset_column.width / 2)
        .attr("y", player_asset_column.text_height * 1.2)
        .attr("fill", "white")
        .attr("fill-opacity", "1.0")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .style("pointer-events", "visible")
        .text(player.name)
        .on("click", () => {player_asset_column_click(player)})

    // Move the Player Column Button Group into the Player Column
    var new_x = player_asset_column.x
    var new_y = player_asset_column.y
    var translate = "translate(" + new_x + " " + new_y + ")"

    d3.select("#" + player_asset_column.button.id)
        .transition()
        .duration(1000)
        .attr("class", "visible")
        .attr("transform", translate)

    // Create a balance border.
    d3.select("#" + player_asset_column.id)
        .append("rect")
        .attr("id", player_key + "_balance_field")
        .attr("x", player_asset_column.x)
        .attr("y", player_asset_column.text_height * 2)
        .attr("width", player_asset_column.width)
        .attr("height", player_asset_column.text_height * 2)
        .attr("fill-opacity", "0.0")
        .attr("stroke", "darkgrey")
        .attr("stroke-width", 3)

    // Add balance amount.
    d3.select("#" + player_asset_column.id)
        .append("text")
        .attr("id", player_asset_column.balance_id)
        .attr("x", player_asset_column.x + player_asset_column.width / 2)
        .attr("y", player_asset_column.text_height * 3.2)
        .attr("fill", "white")
        .attr("fill-opacity", "1.0")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .text(player.balance)
}

function player_asset_column_click(player) {

    // Verify that the player variable is defined.
    if (typeof player == "undefined") {

        console.log('\nError: draw_players.js: create_player_asset_column (rect): on("click") callback')
        console.log('Variable "player" was undefined.')
         
        console_trace(); set_error_encountered()
        return
    }

    // Verify that the player variable is not null.
    if (player == null) {

        console.log('\nError: draw_players.js: create_player_asset_column (rect): on("click") callback')
        console.log('Variable "player" was null.')
         
        console_trace(); set_error_encountered()
        return
    }

    // Determine if the key attribute of the player is null.
    if (player.key == null) {

        // Determine if the id attribute of the player is not null.
        if (player.id != null) {

            // Use the id attribute as the key for the player.
            player.key = player.id

        } else {

            console.log('\nError: draw_players.js: create_player_asset_column: on("click") callback')
            console.log('The key and identifier of the parameter "player" was null.')
            console.log("player:", player)
             
            console_trace(); set_error_encountered()
            return
        }
    }

    // Clicking on the rectangle of a Player Button will assign the Player to this Board (window.name).
    // window.name needs to be set once.
    // Trade Event, amoung other functions, used window.name.
    if (typeof window.name == "undefined") {

        // Assign the window to the player.
        window.name = player.key

        // Check if a player has yet to be assigned to this window.
    } else if (window.name == "") {

        // Assign the window to the player.
        window.name = player.key
    }

    // Determine if a Trade Event is active when clicking the Player Button in the asset column.
    if (g.trade.in == true) {

        // Bypass this player if it is the same player that started the Trade Event.
        if (g.trade.player.key != player.key) {

            // The user selected the other player by clicking the Player Button of the player that did not start the Trade Event.
            move_other_player_to_trade_screen(player)

            // Display only the Offer Button on the Roll Dice Screen.
            var active_buttons = g.dialog.buttons.filter((d) => {
                if (["Offer", "Cancel", "Reset"].includes(d)) { return true }
                return false
            })

            // Update the buttons on the Roll Dice Screen.
            hide_expose_roll_dice_buttons(active_buttons)
        }
    }
}

function move_other_player_to_trade_screen(player) {

    if (typeof player == "undefined") {
        console.log("\nError: draw_players.js: move_other_player_to_trade_screen")
        console.log('Parameter "player" was undefined.')
        console_trace(); set_error_encountered()
        return
    }

    if (player == null) {
        console.log("\nError: draw_players.js: move_other_player_to_trade_screen")
        console.log('Parameter "player" was null.')
        console_trace(); set_error_encountered()
        return
    }

    if (player.key == null) {
        console.log("\nError: draw_players.js: move_other_player_to_trade_screen")
        console.log('Key of parameter "player" was null.')
        console.log("player:", player)
        console_trace(); set_error_encountered()
        return
    }

    // The Player selected by clicking on the button of the Player will be the Other Player.
    g.trade.other_player = player

    // Create the parameters to move the clone of the Other Player.
    var new_x = g.auction.x + g.bank_column.width
    var new_y = g.auction.y + g.bank_column.text_height * 4
    var translate = "translate(" + new_x + " " + new_y + ")"

    // Construct the identifier for the tile of the Other Player.
    var player_asset_column = {}
    player_asset_column["button"] = {}
    player_asset_column.button["id"] = g.trade.other_player.key + "_column_button_group_id"

    // Clone the button of the Other Player and re-identify it as the Trade Other Player Button.
    d3.select("#" + player_asset_column.button.id)
        .clone(true)
        .attr("id", "trade_other_player_button_id")

    // Remove the identifier from the rectangle of the Trade Other Player Button.  
    d3.select("#trade_other_player_button_id")
        .select("#" + g.trade.other_player.key + "_column_button_rect_id")
        .attr("id", null)

    // Remove the identifier from the text of the Trade Other Player Button..
    d3.select("#trade_other_player_button_id")
        .select("#" + g.trade.other_player.key + "_column_button_text_id")
        .attr("id", null)

    // Move the Trade Other Player Button to the Trade Screen.
    d3.select("#trade_other_player_button_id")
        .transition()
        .duration(1000)
        .attr("class", "visible")
        .attr("transform", translate)
}

