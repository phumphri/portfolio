
var automation = {}
automation["windows"] = {}
// automation["keys"] = ["car", "top_hat", "shoe", "dog"]
// automation["keys"] = ["car"] // four
automation["keys"] = []
get_error_encountered()

// This gets the Properties and checks if any are owned by the Bank.
// Autonomous play stops when all Bank Properties are bought by the Players.
var autonomous_interval = null

// Create a limiter to avoid infinite loops.
var limiter = 0

function build_boards() {

    for (var i in automation.keys) {

        // Get the key for the next Board.
        key = automation.keys[i]

        // Collect the reference to a Board when the Board is opened.
        automation.windows[key] = window.open("./monopoly", key)

        console.log(`Created Board "${key}".`)
    }
}

function assign_players() {

    var delay = 0

    for (var i in automation.keys) {

        // Get the key for the next Board.
        var key = automation.keys[i]

        // Focus on the next Board after a delay.
        setTimeout(automation.windows[key].focus, (delay + 200))

        // Click on the Player Button heading the Player's asset column after a delay.
        setTimeout(click_the_button, (delay + 1000), key, key + "_column_button_rect_id")

        // Click on the Four Players Button on the Select Player Screen after a delay.
        // setTimeout(click_the_button, (delay + 2000), key, "four_players_button_id")
        setTimeout(click_the_button, (delay + 2000), key, "one_player_button_id")

        // Click on the Begin Button on the Select Player Screen after a delay.
        setTimeout(click_the_button, (delay + 3000), key, "begin_button_id")

        // Click on the Roll Button on the Roll Dice Screen.
        setTimeout(click_the_button, (delay + 4000), key, "roll_button_id")

        delay += 3000
    }
}

function click_the_button(key, button_id) {

    // Get a reference to the selected button on the Board.
    var button = automation.windows[key].document.getElementById(button_id)

    // Determine if the selected button was found on the Board.
    if (button == null) {

        console.log("\nError: automation.js: assign_players: click_the_button")
        console.log(`Button ${button_id} was not found.`)
        clearInterval(automation["autonomous_interval"])

    } else {

        // Click on the selected button.
        button.dispatchEvent(new Event("click"))
        console.log(`Clicked on button "${button_id}" on window "${key}".`)
    }
}

function autonomous_playing() {

    // console.log(`\nDebug: automation.js: function autonomous_playing()`)
    console.log("\nAutonomous Playing started.")

    // Running process_the_boards every second should allow the buttons on Roll Dice Screen to adjust.
    automation["autonomous_interval"] = setInterval(check_for_bank_properties, 1000)
}

function check_for_bank_properties() {

    // console.log(`\nDebug: automation.js: function check_for_bank_properties()`)

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

                    // Initialize the number of Properties owned by the Bank.
                    number_of_bank_properties = 0

                    // Get Properties by key.
                    for (var property_key in properties) {

                        // Get Property by key.
                        var property = properties[property_key]

                        // Get Property Owner.
                        var owner = property.owner

                        // Determine if the Property Owner is the Bank.
                        if ((typeof owner != "undefined") && (owner == "bank")) {

                            // Increment the number of Properties the Bank owns.
                            number_of_bank_properties += 1
                        }
                    }

                    // Determine if the Bank owns more than the minumum number of Properties.
                    if (number_of_bank_properties > 20) {

                        // Process the boards since the Bank still owns more than the minimum number of Properties
                        process_the_boards()

                    } else {

                        // Stop automation because the Bank has less than the minimum number of Properties.
                        clearInterval(automation["autonomous_interval"])
                        console.log("Finished automation.")
                    }

                } else {
                    console.log("\nError: automation.js: check_for_bank_properties: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                    clearInterval(automation["autonomous_interval"])
                }

            } else {
                console.log("\nError: automation.js: check_for_bank_properties: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                clearInterval(automation["autonomous_interval"])
            }
        }
    }

    // Send the request for asynchronous processing.
    get_properties_request.open("GET", url, true);
    get_properties_request.send();
}

function process_the_boards() {

    // console.log(`\nDebug: automation.js: function process_the_boards()`)

    // Process each Board.
    for (var i in automation.keys) {

        // Check if an error was encountered.
        if (automation["error_encountered"] == true) {

            // Stop the perodic execution of the Boards.
            clearInterval(automation["autonomous_interval"])

            console.log("\nError: automation.js: process_the_boards")
            console.log("Error Encountered was true.")
            break
        }

        // Get the key of the next Board.
        var key = automation.keys[i]

        // Bypass the Portfolio window.
        if (key == "portfolio") { continue }

        // Process the Buttons on the selected Board.
        try {

            // Wait until the asynchronous processes.
            setTimeout(process_the_board(key), 2000)

            // Execute the asynchronous process gets the Error Encountered Boolean from the server.
            get_error_encountered()

        } catch (InternalError) {
            console.log("\nInterError: automation.js: process_the_boards")
            console.log("Name:", InternalError.name)
            console.log("Message:", InternalError.message)
            console.log(InternalError.stack)
            clearInterval(automation["autonomous_interval"])
            break
        }
    }
}

function process_the_board(key) {

    // console.log(`\nDebug: automation.js: function process_the_board("${key}).`)

    process_the_board_consolidate_colors(key)

}

function process_the_board_consolidate_colors(key) {

    process_the_board_sufficient_funds(key)

}

function process_the_board_sufficient_funds(key) {

    // console.log(`\nDebug: automation.js: function process_the_board_sufficient_funds(key=${key})`)

    // Check first message for insufficient funds to make a payment.
    var text_id = automation.windows[key].document.getElementById("roll_dice_screen_text_id_1").innerHTML

    if (text_id.startsWith("You have insufficient funds to make a payment")) {
        process_mortgage(key)
        return
    }

    // Define identifiers for the buttons in order of priority.
    // Moved buy from before pay to after auction, so always auction.  2021-03-12 08:07
    var button_identifiers = ["end_turn_button_id", "go_button_id",
        "jail_button_id", "buy_button_id", "pay_button_id", "roll_button_id",
        "auction_button_id", 
        "fold_auction_button_group_id",
        "collect_button_id", "collect_button_text_id", "roll_button_id", "accept_button_id"]

    while (button_identifiers.length > 0) {

        // Get the Button ID in the priority list of buttons.
        var button_id = button_identifiers.shift()

        // Get a reference to the selected button on the Board.
        var button = automation.windows[key].document.getElementById(button_id)

        // Determine if the selected button was found on the Board.
        if (button != null) {

            // Determine if the button is enabled.
            if (button.classList.contains("visible")) {

                // The Fold Auction Button Group controls the visiblity.
                if (button_id == "fold_auction_button_group_id") {

                    // The rect and text children control processing.  Click on Fold Button if an Auction Event is active.
                    button_id = "bid_auction_button_rect_id"
                    button = automation.windows[key].document.getElementById(button_id)
                }

                // Click on the selected button.
                button.dispatchEvent(new Event("click"))

                console.log("Board:", key, "Button:", button_id)

                // if (button_id == "end_turn_button_id") {
                    // console.log(`\nDebug: automation.js: process_the_board_sufficient_funds`)
                    // console.log(`pnDebug: button:", button`)
                // }

                // Stop looking for buttons when a button is found and clicked.
                break
            }
        }
    }
}

function process_mortgage(key) {

    // console.log(`\nDebug: automation.js: function process_mortgage(key=${key})`)

    // Define identifiers of Properties for looping through Property Icons.
    var property_identifiers = ["mediterranean_avenue",
        "baltic_avenue",
        "reading_railroad",
        "oriental_avenue",
        "vermont_avenue",
        "connecticut_avenue",
        "st_charles_place",
        "electric_company",
        "states_avenue",
        "virginia_avenue",
        "pennsylvania_railroad",
        "st_james_place",
        "tennessee_avenue",
        "new_york_avenue",
        "kentucky_avenue",
        "indiana_avenue",
        "illinois_avenue",
        "b_o_railroad",
        "atlantic_avenue",
        "ventnor_avenue",
        "water_works",
        "marvin_gardens",
        "pacific_avenue",
        "north_carolina_avenue",
        "pennsylvania_avenue",
        "short_line_railroad",
        "park_place",
        "boardwalk"]

    // Define a local variable to hold a Property Icon found in a search of Properties.
    var property_icon = null

    // Define a local variable to hold the identifier used in the search of Properties.
    var property_identifier = null

    // Loop through the identifiers of Properties.
    for (property_identifier_index in property_identifiers) {

        // Initialize the local variable to hold a Property Icon.
        property_icon = null

        // Get the next Property identifier for the list.
        property_identifier = property_identifiers[property_identifier_index]

        // Format the Property Icon identifier.
        property_icon_border_id = property_identifier + "_icon_border"

        // Get the Property Icon.
        property_icon = automation.windows[key].document.getElementById(property_icon_border_id)

        // If the Property Icon is not found, continue with the next Property Icon.
        if (property_icon == null) {

            console.log(`Property Icon "${property_icon_border_id}" was not found.`)
            continue
        }

        // Extract the class dictionary from the Property Icon.
        if (!(property_icon.hasAttribute("class"))) {

            continue
        }

        var property_class = JSON.parse(property_icon.getAttribute("class"))

        if (property_class == null) {

            continue
        }

        if (property_class === "") {

            continue
        }

        // If the Property (Icon) is not owned by the Player (window.name), continue with the next Property Icon.
        if (property_class.owner != key) {

            continue
        }

        // If the Property (Icon) is mortgaged, continue with the next Property Icon.
        if (property_class.mortgaged == "true") {

            continue
        }

        // The current Property Icon will be mortgaged.
        break
    }

    // Check if a Property Icon was found.
    if (property_icon == null) {

        console.log("\nError: automation.js: process_the_board")
        console.log("No Property Icons were found that were not mortgaged.")
        console.log("The check for net worth should have caught this. The code is in the Pay Button.")
        clearInterval(automation["autonomous_interval"])
        return

        // A Property Icon was found.
    } else {

        // To start mortgage of a Property, first click on the Mortgage Button.
        click_the_button(key, "mortgage_button_id")

        // Then, click on a Property Icon.
        click_the_button(key, property_icon_border_id)

        // Click the Pay Button to either make a payment or do this mortgage code again.
        click_the_button(key, "pay_button_id")

        // Property was mortgaged and payment was attempted.  
        // If funds are still insufficient to make the payment, this code will be processed again.
        // Automation is finished with this Board for now.
        return
    }
}

function infinite_playing() {

    automation.keys.push("portfolio")
    automation.windows["portfolio"] = window.open('', 'portfolio')

    // Running process_the_boards every second should allow the buttons on Roll Dice Screen to adjust.
    automation["autonomous_interval"] = setInterval(process_the_boards, 2000)
}

function get_error_encountered() {

    // console.log(`\nDebug: automation.js: function get_error_encountered()`)

    // Create a transaction to get the Error Encountered Boolean.
    var transaction = {}
    transaction["code"] = "get_error_encountered"

    // Convert transaction to JSON stringl
    transaction = JSON.stringify(transaction)

    // Append the transaction to the base url.
    url = "/monopoly_api?transaction="
    url += transaction

    // Create a handle for the server request.
    if (typeof get_error_encountered == "undefined") {
        var get_error_encountered = new XMLHttpRequest()
    }

    // Create an asynchronous listener to process the server response.
    get_error_encountered.onreadystatechange = function () {

        // The server is done with the request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response text into a dictionary.
                var response = JSON.parse(this.responseText)

                if (response.status == "Pass") {

                    automation["error_encountered"] = response.error_encountered

                    if (response.error_encountered == true) {
                        console.log("\nError:  automation.js: get_error_encountered: onreadystatechange")
                        console.log("response.error_encountered:", response.error_encountered)
                        console.trace()
                        clearInterval(automation["autonomous_interval"])
                    }

                    // console.log('Debug: automation["error_encountered"]:', automation["error_encountered"])
                
                } else {
                    console.log("\nError: main.js: get_error_encountered: onreadychange")
                    console.log("response:", response)
                    console.trace()
                    clearInterval(automation["autonomous_interval"])

                }

            } else {
                console.log("\nError: main.js: get_error_encountered: onreadychange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                console.trace()
                clearInterval(automation["autonomous_interval"])
            }
        }
    }

    // Send the request and wait for the valid response.
    get_error_encountered.open("GET", url, true)
    get_error_encountered.send()
}



