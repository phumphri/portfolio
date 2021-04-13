function main() {

    // Declare global variables.
    g = {}

    // Define error state.
    g["error_encountered"] = false

    // Define Community Chest.
    get_community_chest()

    // Define Chance.
    get_chance()

    // Define dice used between functions.
    g["dice"] = 0

    // Tell Go Button to process jail request.
    g["go_to_jail"] = false

    // Determine if the svg column already exists.
    var o = document.getElementById("svg_column")

    // Add the svg column to the body if none found.
    if (o == null) {
        d3.select("body")
            .append("div")
            .attr("class", "container-fluid")
            .append("div")
            .attr("class", "row")
            .append("div")
            .attr("class", "col-sm-12")
            .attr("id", "svg_column")
    }

    // Determine SVG dimensions.
    g["svg"] = {}

    // Make the svg the same width of the column containing the svg.
    g.svg["width"] = document.getElementById("svg_column").offsetWidth

    // Make the height of the svg the height of the window less the height of the heading.
    var heading_height = document.getElementById("project_column").offsetHeight
    var window_height = window.outerHeight
    g.svg["height"] = (window_height - heading_height) * 0.95

    // Define text dimensions and button width.
    var text_dimensions = measure_text("Unmortgagex", 12)

    // Selected player.
    g["selected_player_key"] = null
    g["selected_player"] = null

    // The player keys for looping functions.
    g["player_keys"] = ["car", "top_hat", "shoe", "dog"]

    // Propertry position and information by sequence number.
    g["sequences"] = {}


    // Container of intervals that check transaction queues.
    g["intervals"] = {}
    g.intervals["car"] = null
    g.intervals["top_hat"] = null
    g.intervals["shoe"] = null
    g.intervals["dog"] = null

    // Set margins.
    g["left_margin"] = 10

    // Determine property dimensions.
    g["properties"] = {}
    g.properties["tracts"] = {}
    g.properties["sequence_key"] = {}
    g.payment = 0
    g.payee_key = null

    // Fit ten properties vertically.
    g.properties["height"] = g.svg.height / 11

    // Make the properties rectangle.
    // Starting with 1 to make them all squares.
    g.properties["width_to_height"] = 1
    g.properties["width"] = g.properties.height * g.properties.width_to_height
    // TODO:  Post g.properties.height/width to server to be accessed by bots

    // Global context variables.
    g.current_property = null
    g["active_buttons"] = []

    // Set the dialog box dimensions for multiple dialogs.
    g["dialog"] = {}
    g.dialog["x"] = (1.5 * g.properties.width)
    g.dialog["y"] = (1.5 * g.properties.height)
    g.dialog["width"] = (8 * g.properties.width)
    g.dialog["height"] = (3.5 * g.properties.height)
    g.dialog["button_height"] = text_dimensions.height * 2
    g.dialog["button_width"] = text_dimensions.width
    g.dialog["button_margin"] = 5
    g.dialog["buttons"] = ["Roll", "Buy", "Auction", "Bid", "Fold", "Trade",
        "Pay", "Collect", "Go", "Build", "Mortgage", "Unmortgage",
        "Sell", "End Turn", "Offer", "Counter", "Reject", "Accept", "Cancel", "Jail",
        "Use Card", "Reset", "Go To Jail", "Add Card"]

    // Define bank_column dimensions, shared by player columns.
    g["bank_column"] = {}
    g.bank_column["text_dimensions"] = measure_text("Mediterranean Avenue", 12)
    g.bank_column["text_height"] = g.bank_column.text_dimensions.height
    g.bank_column["id"] = "bank_column"
    g.bank_column["x"] = (g.left_margin * 2) + (11 * g.properties.width)
    g.bank_column["y"] = 0
    g.bank_column["width"] = g.bank_column.text_dimensions.width + 10
    g.bank_column["height"] = (g.bank_column.text_height * 2) * 29 + (2 * g.bank_column.text_height)
    g.bank_column["border_id"] = "bank_column_border_id"

    // Bank and Player Asset columns.
    g["asset_columns"] = {}
    g.asset_columns["bank"] = g.bank_column.x
    g.asset_columns["car"] = g.bank_column.x + g.bank_column.width
    g.asset_columns["top_hat"] = g.bank_column.x + (2 * g.bank_column.width)
    g.asset_columns["shoe"] = g.bank_column.x + (3 * g.bank_column.width)
    g.asset_columns["dog"] = g.bank_column.x + (4 * g.bank_column.width)

    // Property Icon rows.  This is populated by draw_players.
    g["rows"] = {}
    g.rows["balance"] = g.bank_column.text_height * 3
    // g.rows["transaction"] = g.bank_column.text_height * 5

    // Set the property card dimensions, shared by mutiple property cards.
    g["card"] = {}
    g.card["y"] = (6 * g.properties.height)
    g.card["x"] = (4.5 * g.properties.width)
    g.card["width"] = (2.5 * g.properties.width)
    g.card["height"] = (3.5 * g.properties.height)
    g.card["title_size"] = "22px"
    g.card["text_size"] = "14px"

    // Set the attributes for Roll Dice Event.
    g["roll"] = {}
    g.roll["in"] = false

    // Set the attributes for the Roll Dice Screen.
    g["roll_dice"] = {}
    g.roll_dice["screen"] = {}
    g.roll_dice.screen["text_id_1"] = "roll_dice_screen_text_id_1"
    g.roll_dice.screen["text_id_2"] = "roll_dice_screen_text_id_2"
    g.roll_dice.screen["text_id_3"] = "roll_dice_screen_text_id_3"
    g.roll_dice.screen["text_id_4"] = "roll_dice_screen_text_id_4"

    // Set the attributes for Auction Event.
    g["auction"] = {}
    g.auction["in"] = false
    g.auction["y"] = (6 * g.properties.height)
    g.auction["x"] = (7.0 * g.properties.width)
    g.auction["width"] = (2.5 * g.properties.width)
    g.auction["height"] = (3.5 * g.properties.height)
    g.auction["title_size"] = "22px"
    g.auction["text_size"] = "14px"
    g.auction["starter_key"] = null
    g.auction["doubles_were_rolled"] = false
    g.auction["property"] = null
    g.auction["bids"] = {}
    g.auction["highest_bid"] = 0
    g.auction["highest_bidder_key"] = null
    g.auction["number_of_folds"] = 0

    // Define the Trade Event and its initial state.
    g["trade"] = {}
    g.trade["in"] = false

    // Define the Build Event and its initial state.
    g["build"] = {}
    g.build["in"] = false
    g.build["property"] = null

    // Define the Sell Event and its initial state.
    g["sell"] = {}
    g.sell["in"] = false
    g.sell["property"] = null

    // Define the participants of the Trade Event.
    g.trade["player"] = null
    g.trade["other_player"] = null

    // Define the Monies of the Trade Event.
    g.trade["money"] = {}
    g.trade.money["player"] = 0
    g.trade.money["other_player"] = 0

    // Define the Properties of the Trade Event.
    g.trade["property"] = {}
    g.trade.property["player"] = {}
    g.trade.property.player["a"] = null
    g.trade.property.player["b"] = null
    g.trade.property.player["c"] = null
    g.trade.property["other_player"] = {}
    g.trade.property.other_player["a"] = null
    g.trade.property.other_player["b"] = null
    g.trade.property.other_player["c"] = null

    // Define Trade Screen attributes.
    g.trade.screen = {}
    g.trade.screen["id"] = "trade_screen_id";
    g.trade.screen["border"] = "trade_screen_border_id";
    g.trade.screen["text"] = "trade_screen_text_id";
    g.trade.screen["width"] = g.bank_column.width * 2
    g.trade.screen["height"] = g.bank_column.text_height * 12
    g.trade.screen["x"] = g.auction.x
    g.trade.screen["y"] = g.auction.y

    // Define Trade Screen Title attributes.
    g.trade.screen["title"] = {}
    g.trade.screen.title["x"] = g.trade.screen.width / 2
    g.trade.screen.title["y"] = g.trade.screen.height * 0.20
    g.trade.screen.title["text"] = "Trade"

    // Define Trade Screen Player Tile attributes
    g.trade.screen["player"] = {}
    g.trade.screen.player["tile"] = {}
    g.trade.screen.player.tile["id"] = "trade_screen_player_tile_id"
    g.trade.screen.player.tile["x"] = 0
    g.trade.screen.player.tile["y"] = g.bank_column.text_height * 4
    g.trade.screen.player.tile["width"] = g.bank_column.width
    g.trade.screen.player.tile["height"] = g.bank_column.text_height * 2

    // Define Trade Screen Player Money Tile attributes.
    g.trade.screen.player["money"] = {}
    g.trade.screen.player.money["id"] = "trade_screen_player_money_tile_id"
    g.trade.screen.player.money["x"] = 0
    g.trade.screen.player.money["y"] = g.bank_column.text_height * 6
    g.trade.screen.player.money["width"] = g.bank_column.width
    g.trade.screen.player.money["height"] = g.bank_column.text_height * 2

    // Define Trade Screen Player Property "a" attributes.
    g.trade.screen.player["property"] = {}
    g.trade.screen.player.property["a"] = {}
    g.trade.screen.player.property.a["id"] = "trade_screen_player_property_a_id"
    g.trade.screen.player.property.a["x"] = 0
    g.trade.screen.player.property.a["y"] = g.bank_column.text_height * 8
    g.trade.screen.player.property.a["width"] = g.bank_column.width
    g.trade.screen.player.property.a["height"] = g.bank_column.text_height * 2
    g.trade.screen.player.property.a["occupied"] = false

    // Define Trade Screen Player Property "b" attributes.
    g.trade.screen.player.property["b"] = {}
    g.trade.screen.player.property.b["id"] = "trade_screen_player_property_b_id"
    g.trade.screen.player.property.b["x"] = 0
    g.trade.screen.player.property.b["y"] = g.bank_column.text_height * 10
    g.trade.screen.player.property.b["width"] = g.bank_column.width
    g.trade.screen.player.property.b["height"] = g.bank_column.text_height * 2
    g.trade.screen.player.property.b["occupied"] = false

    // Define Trade Screen Player Property "c" attributes.
    g.trade.screen.player.property["c"] = {}
    g.trade.screen.player.property.c["id"] = "trade_screen_player_property_c_id"
    g.trade.screen.player.property.c["x"] = 0
    g.trade.screen.player.property.c["y"] = g.bank_column.text_height * 12
    g.trade.screen.player.property.c["width"] = g.bank_column.width
    g.trade.screen.player.property.c["height"] = g.bank_column.text_height * 2
    g.trade.screen.player.property.c["occupied"] = false

    // Define Trade Screen Other Player Tile attributes.
    g.trade.screen.other_player = {}
    g.trade.screen.other_player["tile"] = {}
    g.trade.screen.other_player.tile["id"] = "trade_screen_other_player_tile_id"
    g.trade.screen.other_player.tile["x"] = g.trade.screen.player.tile.width
    g.trade.screen.other_player.tile["y"] = g.trade.screen.player.tile.y
    g.trade.screen.other_player.tile["width"] = g.trade.screen.player.tile.width
    g.trade.screen.other_player.tile["height"] = g.trade.screen.player.tile.height

    // Define Trade Screen Other Player Money Tile attributes.
    g.trade.screen.other_player["money"] = {}
    g.trade.screen.other_player.money["id"] = "trade_screen_other_player_money_tile_id"
    g.trade.screen.other_player.money["x"] = g.trade.screen.other_player.tile.x
    g.trade.screen.other_player.money["y"] = g.trade.screen.player.money.y
    g.trade.screen.other_player.money["width"] = g.trade.screen.player.money.width
    g.trade.screen.other_player.money["height"] = g.trade.screen.player.money.height

    // Define Trade Screen Other Player Property "a" attributes.
    g.trade.screen.other_player["property"] = {}
    g.trade.screen.other_player.property["a"] = {}
    g.trade.screen.other_player.property.a["id"] = "trade_screen_other_player_property_a_id"
    g.trade.screen.other_player.property.a["x"] = g.trade.screen.other_player.tile.x
    g.trade.screen.other_player.property.a["y"] = g.trade.screen.player.property.a.y
    g.trade.screen.other_player.property.a["width"] = g.trade.screen.other_player.tile.width
    g.trade.screen.other_player.property.a["height"] = g.trade.screen.other_player.tile.height
    g.trade.screen.other_player.property.a["occupied"] = false

    // Define Trade Screen Other Player Property "b" attributes.
    g.trade.screen.other_player.property["b"] = {}
    g.trade.screen.other_player.property.b["id"] = "trade_screen_other_player_property_b_id"
    g.trade.screen.other_player.property.b["x"] = g.trade.screen.other_player.tile.x
    g.trade.screen.other_player.property.b["y"] = g.trade.screen.player.property.b.y
    g.trade.screen.other_player.property.b["width"] = g.trade.screen.other_player.tile.width
    g.trade.screen.other_player.property.b["height"] = g.trade.screen.other_player.tile.height
    g.trade.screen.other_player.property.b["occupied"] = false

    // Define Trade Screen Other Player Property "c" attributes.
    g.trade.screen.other_player.property["c"] = {}
    g.trade.screen.other_player.property.c["id"] = "trade_screen_other_player_property_b_id"
    g.trade.screen.other_player.property.c["x"] = g.trade.screen.other_player.tile.x
    g.trade.screen.other_player.property.c["y"] = g.trade.screen.player.property.c.y
    g.trade.screen.other_player.property.c["width"] = g.trade.screen.other_player.tile.width
    g.trade.screen.other_player.property.c["height"] = g.trade.screen.other_player.tile.height
    g.trade.screen.other_player.property.c["occupied"] = false

    // Define the Mortgage Event.
    g["mortgage"] = {}
    g.mortgage["in"] = false

    // Define the Unmortgage Event.
    g["unmortgage"] = {}
    g.mortgage["in"] = false

    // Track the number of doubles.
    g.has_rolled = false

    // The delay in milliseconds a player checks their queue for transactions.
    g.queue_interval = 1000

    // Jail, updated by move_piece and roll_dice.
    // g.jail = {}

    // Poorhouse
    g["poorhouse"] = {}
    g.poorhouse["car"] = false
    g.poorhouse["top_hat"] = false
    g.poorhouse["shoe"] = false
    g.poorhouse["dog"] = false

    // Determine if the svg exists.
    var o = document.getElementById("svg")

    // Add the svg if none were found.
    if (o == null) {
        d3.select("#svg_column")
            .append("svg")
            .attr("id", "svg")
            .attr("xmlns", "http://www.w3.org/2000/svg")
    }

    // Set the svg dimensions.
    d3.select("#svg")
        .attr("width", g.svg.width)
        .attr("height", g.svg.height)

    // Draw the board with properties.
    draw_properties(g)

    // Draw the bank and player accounts.
    draw_players(g)

    // Draw the Select Player Screen.
    select_player(g)

}

function measure_text(pText, pFontSize, pStyle) {

    var lDiv = document.createElement('div');

    document.body.appendChild(lDiv);

    if (pStyle != null) {
        lDiv.style = pStyle;
    }
    lDiv.style.fontSize = "" + pFontSize + "px";
    lDiv.style.position = "absolute";
    lDiv.style.left = -1000;
    lDiv.style.top = -1000;

    lDiv.innerHTML = pText;

    var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
    };

    document.body.removeChild(lDiv);
    lDiv = null;

    return lResult;
}

function get_community_chest() {

    // Create a transaction to get the next Community Chest Card.
    var transaction = {}
    transaction["code"] = "get_community_chest"

    // Convert transaction to JSON stringl
    transaction = JSON.stringify(transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create a handle for the server request.
    if (typeof get_community_chest_request == "undefined") {
        var get_community_chest_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to process the server response.
    get_community_chest_request.onreadystatechange = function () {

        // The server is done with the request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response text into a dictionary.
                var response = JSON.parse(this.responseText)

                // Assign the response to the global variable Community Chest.
                g["community_chest"] = response

            } else {
                console.log("\nError: process_community_chest_event.js: process_community_chest_event: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request and wait for the valid response.
    get_community_chest_request.open("GET", url, true)
    get_community_chest_request.send()
}

function get_chance() {

    // Create a transaction to get the next Community Chest Card.
    var transaction = {}
    transaction["code"] = "get_chance"

    // Convert transaction to JSON stringl
    transaction = JSON.stringify(transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create a handle for the server request.
    if (typeof get_chance_request == "undefined") {
        var get_chance_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to process the server response.
    get_chance_request.onreadystatechange = function () {

        // The server is done with the request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response text into a dictionary.
                var response = JSON.parse(this.responseText)

                // Assign the response to the global variable Community Chest.
                g["chance"] = response

            } else {
                console.log("\nError: process_chance_event.js: process_chance_event: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request and wait for the valid response.
    get_chance_request.open("GET", url, true)
    get_chance_request.send()
}

function set_error_encountered(error_encountered = true) {

    // Update the global varible to stop local processing.
    g.error_encountered = error_encountered

    // Update the Error Encountered on the server.  It will be accessed by the automation functions.
    var transaction = {}
    transaction["code"] = "set_error_encountered"
    transaction["error_encountered"] = error_encountered
    transaction["source"] = window.name

    // Convert the transaction to a JSON string.
    transaction = JSON.stringify(transaction)

    // Append the transaction to the url base.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create a unique handle for accessing the server.
    if (typeof set_error_encountered_request == "undefined") {
        var set_error_encountered_request = new XMLHttpRequest()
    }

    // Create an asynchronous listener to monitor the request.
    set_error_encountered_request.onreadystatechange = function () {

        // The server is done with this request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert reponse string into a dictionary.
                response = JSON.parse(this.responseText)

                // Check for a successful request.
                if (response.status != "Pass") {

                    console.log("\nError: move_piece.js: set_error_encountered:onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                }

            } else {
                console.log("\nError: move_piece.js: set_error_encountered:onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    set_error_encountered_request.open("GET", url, true)
    set_error_encountered_request.send()
}

