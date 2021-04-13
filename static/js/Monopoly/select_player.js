function select_player() {

    // Define dialog parameters.
    var dialog = {}
    dialog["group_id"] = "select_player_group_id"
    dialog["border_id"] = "select_player_border_id"
    dialog["text_id"] = "select_player_text_id"
    dialog["button_group_id"] = "select_player_button_group_id"
    dialog["code"] = "assign_player"
    dialog["text"] = "Click a player's blue rectangle and then a button."
    dialog["buttons"] = ["Four Players", "One Player", "Begin"]
    var active_buttons = ["Four Players", "One Player"]

    var o = document.getElementById(dialog.group_id)

    if (o == null) {
        construct_select_player_screen()
    }

    function construct_select_player_screen() {

        // Create dialog group.
        d3.select("#svg")
            .append("g")
            .attr("id", dialog.group_id)

        // Create dialog rectangle.
        d3.select("#" + dialog.group_id)
            .append("rect")
            .attr("id", dialog.border_id)

        // Set border properties.
        d3.select("#" + dialog.border_id)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", g.dialog.width)
            .attr("height", g.dialog.height)
            .attr("fill-opacity", "0.0")
            .attr("stroke", "darkgrey")
            .attr("stroke-width", 3)

        // Add text line.  Messages to the operator are presented here.
        d3.select("#" + dialog.group_id)
            .append("text")
            .attr("id", "select_screen_line_1")
            .attr("x", g.dialog.width / 2)
            .attr("y", g.dialog.height * 0.2)
            .attr("fill", "white")
            .attr("fill-opacity", "1.0")
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Click on a player (blue tile) and then click Four Players or One Player.")

        // Add text line.  Messages to the operator are presented here.
        d3.select("#" + dialog.group_id)
            .append("text")
            .attr("id", "select_screen_line_2")
            .attr("x", g.dialog.width / 2)
            .attr("y", g.dialog.height * 0.3)
            .attr("fill", "white")
            .attr("fill-opacity", "1.0")
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("")

        // Group the buttons together.
        d3.select("#" + dialog.group_id)
            .append("g")
            .attr("id", dialog.button_group_id)

        // Create each button.
        for (button_index in dialog.buttons) {

            // Get the button text.
            var button = dialog.buttons[button_index]

            // Determine the button identifier for the rectangle.
            var button_id = button.toLowerCase() + "_button_id"
            button_id = button_id.replace(" ", "_")

            /// Determine the button identifier for the text.
            var button_text_id = button.toLowerCase() + "_button_text_id"
            button_text_id = button_text_id.replace(" ", "_")

            d3.select("#" + dialog.button_group_id)
                .append("rect")
                .attr("id", button_id)
                .attr("x", () => {

                    // Find the middle of the dialog box.
                    var x = g.dialog.width * 0.05

                    // Add the width of previous buttons and the margin.
                    x += button_index * (g.dialog.button_width + g.dialog.button_margin)
                    return x
                })
                .attr("y", g.dialog.height * 0.7)
                .attr("width", g.dialog.button_width)
                .attr("height", g.dialog.button_height)
                .attr("rx", 5)
                .attr("fill-opacity", "1.0")
                .attr("fill", "Blue")
                .attr("stroke", "darkgrey")
                .attr("stroke-width", 1)
                .on("click", (d) => { process_select_player_request(d) })
                .on("mouseover", (d) => { display_button_info(d) })
                .on("mouseout", (d) => { hide_button_info(d) })

            d3.select("#" + dialog.button_group_id)
                .append("text")
                .attr("id", button_text_id)
                .attr("x", () => {

                    // Find middle of the screen.
                    var x = g.dialog.width * 0.05

                    // Add the middle of the first button.
                    x += g.dialog.button_width * 0.5

                    // Add the widths of all previous buttons.
                    x += button_index * (g.dialog.button_width + g.dialog.button_margin)

                    return x
                })
                .attr("y", (g.dialog.height * 0.7) + (g.dialog.button_height * 0.6))
                .attr("fill", "white")
                .attr("fill-opacity", "1.0")
                .attr("font-size", "12px")
                .attr("text-anchor", "middle")
                .text(button)
                .on("click", (d) => { process_select_player_request(d) })
                .on("mouseover", (d) => { display_button_info(d) })
                .on("mouseout", (d) => { hide_button_info(d) })
        }

        // To start, just display the Four Players Button.
        var active_buttons = ["Four Players", "One Player"]
        hide_expose_select_player_buttons(active_buttons)

        // Move dialog box to middle of board
        var translate = "translate(" + g.dialog.x + " " + g.dialog.y + ")"
        d3.select("#" + dialog.group_id).attr("transform", translate)
    }

    function process_select_player_request(d) {

        // Verify that the player was selected.
        // The window.name is set when user clicks on player's tile.
        if (window.name.length == 0) {

            d3.select("#select_screen_line_1").text("Oops!")
            d3.select("#select_screen_line_2").text("Click on a player (blue tile) and then click Four Players or One Player.")

            // Return to the Select Player Screen.
            return
        }

        // Create a transaction to get the player based on window.name.
        // window.name was set when the user clicked on the player's tile.
        var transaction = {}
        transaction["code"] = "get_player"
        transaction["key"] = window.name

        // Convert transaction to JSON stringl
        transaction = JSON.stringify(transaction)

        // Append the transaction to the base url.
        url = "/monopoly_api?transaction="
        url += transaction

        // Create a handle for the server request.
        if (select_player_request == undefined) {
            var select_player_request = new XMLHttpRequest()
        }

        // Create an asynchronous listener to process the server response.
        select_player_request.onreadystatechange = function () {

            // The server is done with the request.
            if (this.readyState == 4) {

                // The request was successful.
                if (this.status == 200) {

                    // Convrt the response text into a dictionary.
                    response = JSON.parse(this.responseText)

                    // The player was successfully assigned to the user.
                    if (response.status == "Pass") {

                        // Extract the Player from the response.
                        var player = response.player

                        // Extract the "bankrupt" attribute from the Player.
                        g.poorhouse[player.key] = player.bankrupt

                        // Determine that the Player is not bankrupt.
                        if (g.poorhouse[player.key] == false) {

                            // Process the button reequest and associated player.
                            process_selected_player(d, player)
                        }

                    } else {
                        console.log("\nError: select_player.js: select_player: process_select_player_request: onreadystatechange")
                        console.log("response.status:", response.status)
                        console.log("response.text:", response.text)
                         
                        console_trace(); set_error_encountered()
                    }

                } else {
                    console.log("\nError: select_player.js: select_player: process_select_player_request: onreadystatechange")
                    console.log("this.status:", this.status)
                    console.log("this.text:", this.text)
                     
                    console_trace(); set_error_encountered()
                }

                // If successful, return to the Select Player Screen with only the Begin Button displayed.
                var active_buttons = ["Begin"]
                hide_expose_select_player_buttons(active_buttons)
            }
        }

        // Send the request and wait for the valid response.
        select_player_request.open("GET", url, true)
        select_player_request.send()
    }

    function process_selected_player(d, player) {

        if ((d.target.id == "four_players_button_id") || (d.target.id == "four_players_button_text_id")) {

            var button_text = "Four Players"

        } else if ((d.target.id == "one_player_button_id") || (d.target.id == "one_player_button_text_id")) {

            var button_text = "One Player"

        } else if ((d.target.id == "begin_button_id") || (d.target.id == "begin_button_text_id")) {

            var button_text = "Begin"

        } else {
            console.log("\nError: select_player.js, select_player: process_selected_player")
            console.log("Unexpected parameter value for d.target.d:", d.target.id)
             
            console_trace(); set_error_encountered()

            // Return to the Select Player Screen.
            return
        }

        // The user selected the Begin Button.
        if (button_text == "Begin") {

            // Exit the Select Player Screen.  The Roll Dice Screen should be visible.
            process_begin_button()
            return
        }

        if (button_text == "Four Players") {

            // Exit the Select Player Screen.  The Roll Dice Screen should be visible.
            process_four_players_button(player)
            return
        }

        if (button_text == "One Player") {

            // Exit the Select Player Screen.  The Roll Dice Screen should be visible.
            process_one_player_button(player)
            return
        }
    }

    function process_begin_button() {

        // Construct the Roll Dice Screen based on the selected property.
        roll_dice()

        // Hide the Select Player Screen.
        d3.select("#" + dialog.group_id).classed('visible', false)
        d3.select("#" + dialog.group_id).classed('invisible', true)

        // Find the Roll Dice Screen
        o = document.getElementById("roll_dice_group_id")

        // Verify that the Roll Dice Screen was created.
        if (o == null) {
            console.log("\nError: select_player.js: select_player: process_selected_player")
            console.log(`Roll Dice Screen roll_dice_group_id was not created as expected.`)
             
            console_trace(); set_error_encountered()

        } else {

            // Unhide the Roll Dice Screen.
            d3.select("#" + "roll_dice_group_id").classed('visible', true)
            d3.select("#" + "roll_dice_group_id").classed('invisible', false)

            // Only expose the Roll button on the Rode Dice Screen.
            // TODO: Add a debug mode that shows the Reset Button and Go To Jail Button.
            var active_buttons = ["Roll", "Reset"]
            hide_expose_roll_dice_buttons(active_buttons)

            // Unhide the Roll Button on the Roll Dice Screen.
            d3.select("#" + "roll_button_id").classed("visible", true)
            d3.select("#" + "roll_button_id").classed("invisible", false)
            d3.select("#" + "roll_button_text_id").classed("visible", true)
            d3.select("#" + "roll_button_text_id").classed("invisible", false)
        }
    }

    function process_four_players_button(player) {

        // Create a transaction to assign the selected player to the user.
        var transaction = {}
        transaction["code"] = "set_player_assigned"
        transaction["key"] = player.key

        // Convert transaction to JSON stringl
        transaction = JSON.stringify(transaction)

        // Append the transaction to the base url.
        url = "/monopoly_api?transaction="
        url += transaction

        // Create a handle for the server request.
        if (typeof select_player_request == "undefined") {
            var select_player_request = new XMLHttpRequest()
        }

        // Create an asynchronous listener to process the server response.
        select_player_request.onreadystatechange = function () {

            var active_buttons = []

            // The server is done with the request.
            if (this.readyState == 4) {

                // The request was successful.
                if (this.status == 200) {

                    // Convrt the response text into a dictionary.
                    response = JSON.parse(this.responseText)

                    // The player was successfully assigned to the user.
                    if (response.status == "Pass") {

                        // Enable the Begin Button and hide the others.
                        active_buttons = ["Begin"]
                        d3.select("#select_screen_line_1").text("Click the Begin button to start the game.")
                        d3.select("#select_screen_line_2").text("")

                        // Update heading.
                        d3.select("h1").text("Monopoly Player " + player.name)
                        document.title = player.name

                        // Remember the player's identifier.
                        dialog.player_name = player.name

                        // Create the piece for the player and place it on "Go".
                        var dice = 0
                        move_piece(player.key, dice, use_prior_sequence = false)

                    } else {
                        console.log("\nError: select_player.js: select_player: process_four_players_button: onreadystatechange")
                        console.log("response.status:", response.status)
                        console.log("response.text:", response.text)
                         

                        d3.select("#select_screen_line_1").text(response.text)
                        d3.select("#select_screen_line_2").text("Click on a player (blue tile) and then click Four Players or One Player.")

                        // Likely the Selected Player was assigned to another user.
                        active_buttons = ["Four Players", "One Player"]
                    }

                } else {
                    console.log("\nError: select_player.js: select_player: process_four_players_button: onreadystatechange")
                    console.log("The server was done with the request but returned")
                    console.log("an unexpected status:", this.status)
                     
                    console_trace(); set_error_encountered()
                }

                // If successful, return to the Select Player Screen with only the Begin Button displayed.
                hide_expose_select_player_buttons(active_buttons)
            }
        }

        // Send the request and wait for the valid response.
        select_player_request.open("GET", url, true)
        select_player_request.send()
    }

    function process_one_player_button(player) {

        // Create a transaction to assign the selected player to the user.
        var transaction = {}
        transaction["code"] = "set_player_assigned"
        transaction["key"] = player.key

        // Convert transaction to JSON stringl
        transaction = JSON.stringify(transaction)

        // Append the transaction to the base url.
        url = "/monopoly_api?transaction="
        url += transaction

        // Create a handle for the server request.
        if (typeof select_player_request == "undefined") {
            var select_player_request = new XMLHttpRequest()
        }

        // Create an asynchronous listener to process the server response.
        select_player_request.onreadystatechange = function () {

            var active_buttons = []

            // The server is done with the request.
            if (this.readyState == 4) {

                // The request was successful.
                if (this.status == 200) {

                    // Convrt the response text into a dictionary.
                    response = JSON.parse(this.responseText)

                    // The player was successfully assigned to the user.
                    if (response.status == "Pass") {

                        // Update heading.
                        d3.select("h1").text("Monopoly Player " + player.name)
                        document.title = player.name

                        d3.select("#select_screen_line_1").text("Creating bots.")
                        d3.select("#select_screen_line_2").text("Please wait.")

                        // Remember the player's identifier.
                        dialog.player_name = player.name

                        // Create the piece for the player and place it on "Go".
                        var dice = 0
                        move_piece(player.key, dice, use_prior_sequence = false)

                        // Create the Bot objects as the other Players.
                        create_bots()

                    } else {
                        console.log("\nError: select_player.js: select_player: process_one_player_button: onreadystatechange")
                        console.log("response.status:", response.status)
                        console.log("response.text:", response.text)

                        d3.select("#select_screen_line_1").text(response.text)
                        d3.select("#select_screen_line_2").text("Click on a player (blue tile) and then click Four Players or One Player.")

                        // Likely the Selected Player was assigned to another user.
                        active_buttons = ["Four Players", "One Player"]
                    }

                } else {
                    console.log("\nError: select_player.js: select_player: process_one_player_button: onreadystatechange")
                    console.log("The server was done with the request but returned")
                    console.log("an unexpected status:", this.status)
                    console_trace(); set_error_encountered()
                }

                // If successful, return to the Select Player Screen with only the Begin Button displayed.
                hide_expose_select_player_buttons(active_buttons)
            }
        }

        // Send the request and wait for the valid response.
        select_player_request.open("GET", url, true)
        select_player_request.send()
    }

    function create_bots() {

        // Create a transaction to assign the remaining Boards to Bot objects.
        var transaction = {}
        transaction["code"] = "create_bots"
        transaction["key"] = window.name

        // Convert transaction to JSON stringl
        transaction = JSON.stringify(transaction)

        // Append the transaction to the base url.
        url = "/monopoly_api?transaction="
        url += transaction

        // Create a handle for the server request.
        if (typeof create_bots_request == "undefined") {
            var create_bots_request = new XMLHttpRequest()
        }

        // Create an asynchronous listener to process the server response.
        create_bots_request.onreadystatechange = function () {

            // Define buttons to be displayed on the Roll Dice Screen.
            var active_buttons = []

            // The server is done with the request.
            if (this.readyState == 4) {

                // The request was successful.
                if (this.status == 200) {

                    // Convrt the response text into a dictionary.
                    response = JSON.parse(this.responseText)

                    // The player was successfully assigned to the user.
                    if (response.status == "Pass") {

                        // Enable the Begin Button and hide the others.
                        active_buttons = ["Begin"]
                        d3.select("#select_screen_line_1").text("Click the Begin button to start the game.")
                        d3.select("#select_screen_line_2").text("")

                    } else {
                        console.log("\nError: select_player.js: select_player: process_one_player: onreadystatechange")
                        console.log("response.status:", response.status)
                        console.log("response.text:", response.text)

                        d3.select("#select_screen_line_1").text("Creation of bots encountered an error.")
                        d3.select("#select_screen_line_2").text(response.text)
                    }

                } else {
                    console.log("\nError: select_player.js: select_player: process_one_player: onreadystatechange")
                    console.log("The server was done with the request but returned")
                    console.log("an unexpected status:", this.status)
                    console_trace(); set_error_encountered()
                }

                // If successful, return to the Select Player Screen with only the Begin Button displayed.
                hide_expose_select_player_buttons(active_buttons)
            }
        }
        
        // Send the request and wait for the valid response.
        create_bots_request.open("GET", url, true)
        create_bots_request.send()
    }

    function display_button_info(d) {

        // Display information regarding the Four Players Button.
        if ((d.target.id == "four_players_button_id") || (d.target.id == "four_players_button_text_id")) {

            var o = document.getElementById("four_players_button_info_id")

            if (o == null) {

                d3.select("#" + dialog.button_group_id)
                    .append("text")
                    .attr("id", "four_players_button_info_id")
                    .attr("x", () => {

                        // Find middle of the screen.
                        var x = g.dialog.width * 0.05
                        return x
                    })
                    .attr("y", (g.dialog.height * 0.4))
                    .attr("fill", "Yellow")
                    .attr("fill-opacity", "1.0")
                    .attr("font-size", "14px")
                    .attr("text-anchor", "left")
                    .text('The "Four Players" button starts a game with three other players.')
            }

            d3.select("#four_players_button_info_id").classed('visible', true)
            d3.select("#four_players_button_info_id").classed('invisible', false)

            // Display information regarding the One Player Button.
        } else if ((d.target.id == "one_player_button_id") || (d.target.id == "one_player_button_text_id")) {

            var o = document.getElementById("one_player_button_info_id")

            if (o == null) {

                d3.select("#" + dialog.button_group_id)
                    .append("text")
                    .attr("id", "one_player_button_info_id")
                    .attr("x", () => {

                        // Find middle of the screen.
                        var x = g.dialog.width * 0.05
                        return x
                    })
                    .attr("y", (g.dialog.height * 0.4))
                    .attr("fill", "Yellow")
                    .attr("fill-opacity", "1.0")
                    .attr("font-size", "14px")
                    .attr("text-anchor", "left")
                    .text('The "One Player" button starts a game with three other bots.')
            }

            d3.select("#one_player_button_info_id").classed('visible', true)
            d3.select("#one_player_button_info_id").classed('invisible', false)

            // Display information regarding the Begin Button.
        } else if ((d.target.id == "begin_button_id") || (d.target.id == "begin_button_text_id")) {

            var o = document.getElementById("begin_button_info_id")

            if (o == null) {

                d3.select("#" + dialog.button_group_id)
                    .append("text")
                    .attr("id", "begin_button_info_id")
                    .attr("x", () => {

                        // Find middle of the screen.
                        var x = g.dialog.width * 0.05
                        return x
                    })
                    .attr("y", (g.dialog.height * 0.4))
                    .attr("fill", "Yellow")
                    .attr("fill-opacity", "1.0")
                    .attr("font-size", "14px")
                    .attr("text-anchor", "left")
                    .text('The "Begin" button starts the game with your choices.')
            }

            d3.select("#begin_button_info_id").classed('visible', true)
            d3.select("#begin_button_info_id").classed('invisible', false)

            // Unknown button.
        } else {

            console.log("\nError: select_player.js: select_player: display_button_info")
            console.log("Unexpected d.target.id:", d.target.id)
            console_trace(); set_error_encountered()
        }
    }

    function hide_button_info(d) {

        // Hide the information regarding the Four Players Button.
        if ((d.target.id == "four_players_button_id") || (d.target.id == "four_players_button_text_id")) {

            o = document.getElementById("four_players_button_info_id")

            if (o != null) {
                d3.select("#four_players_button_info_id").classed('visible', false)
                d3.select("#four_players_button_info_id").classed('invisible', true)

            }

            // Hide the information regarding the One Player Button.
        } else if ((d.target.id == "one_player_button_id") || (d.target.id == "one_player_button_text_id")) {

            o = document.getElementById("one_player_button_info_id")

            if (o != null) {
                d3.select("#one_player_button_info_id").classed('visible', false)
                d3.select("#one_player_button_info_id").classed('invisible', true)

            }

            // Hide the information regarding the Begin Button.
        } else if ((d.target.id == "begin_button_id") || (d.target.id == "begin_button_text_id")) {

            o = document.getElementById("begin_button_info_id")
            if (o != null) {
                d3.select("#begin_button_info_id").classed('visible', false)
                d3.select("#begin_button_info_id").classed('invisible', true)
            }

        } else {

            console.log("\nError: select_player.js: select_player: hide_button_info")
            console.log("Unexpected d.target.id:", d.target.id)
            console_trace(); set_error_encountered()
        }
    }

    function hide_expose_select_player_buttons(active_buttons) {

        // Loop through all possible buttons that can displayed on the Select Player Screen.
        for (button_index in dialog.buttons) {

            // Select the next button.
            var button = dialog.buttons[button_index]

            // Format the button identifier for the rectangle.
            var button_id = button.toLowerCase() + "_button_id"
            button_id = button_id.replace(" ", "_")

            // Format the button identifier for the text in the rectangle.
            var button_text_id = button.toLowerCase() + "_button_text_id"
            button_text_id = button_text_id.replace(" ", "_")

            // If the selected button is in the list of active buttons, then display it.
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
}
