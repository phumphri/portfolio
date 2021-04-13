function draw_properties() {

    // Construct a get_properties request.
    if (typeof get_properties_request == "undefined") {
        var get_properties_request = new XMLHttpRequest()
    }

    // Create the transactions with url.
    url = '/monopoly_api?transaction={"code":"get_properties"}'

    // Construct an asynchronous listener, monitoring the sent request.
    get_properties_request.onreadystatechange = function () {

        // Server is done with the request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the response string into a javascript object.
                response = JSON.parse(this.responseText)

                // Check for a successful request.
                if (response.status == "Pass") {

                    // Poplulate the global variable with the current properties.
                    g.properties.tracts = response.properties

                    // Create the board with the properties.
                    draw_properties_callback()

                    // Create the Lawyer Card.
                    create_lawyer_card()

                    // Create the jail.
                    create_jail()

                    // Create events.
                    create_events()

                } else {
                    console.log("\nError: draw_properties.js: draw_properties: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: draw_properties.js: draw_properties: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    get_properties_request.open("GET", url, true);
    get_properties_request.send();

    function draw_properties_callback() {

        // Use the property key as the group id.
        for (property_key in g.properties.tracts) {

            // Get a property.
            var property = g.properties.tracts[property_key]

            // Populate the sequence-to-key lookup.
            g.properties.sequence_key[property.sequence] = property.key

            // Create property group.
            d3.select("#svg")
                .append("g")
                .attr("id", property_key)

            // Create property border.
            var border_id = property_key + "_border"
            d3.select("#" + property_key)
                .append("rect")
                .attr("id", border_id)
                .on("mouseover", (d) => {

                    // Only display the property card if no event is in progress (auction, trade, bankruptcy).
                    if ((g.auction.in == false) && (g.trade.in == false)) {
                        var property_card_group_id = "#" + d.path[1].id + "_card_group_id"
                        d3.select(property_card_group_id).classed('visible', true)
                        d3.select(property_card_group_id).classed('invisible', false)
                    }
                })
                .on("mouseout", (d) => {

                    // Only hide the property card if no event is in progress (auction, trade, bankruptcy).
                    if ((g.auction.in == false) && (g.trade.in == false)) {
                        var property_card_group_id = "#" + d.path[1].id + "_card_group_id"
                        d3.select(property_card_group_id).classed('visible', false)
                        d3.select(property_card_group_id).classed('invisible', true)
                    }
                })

            // Set border properties.
            d3.select("#" + border_id)
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", g.properties.width)
                .attr("height", g.properties.height)
                .attr("fill-opacity", "0.0")
                .attr("stroke", "darkgrey")
                .attr("stroke-width", 3)

            if (property.type == "property") {

                // Create color rectangle if none found.
                var color_id = property_key + "_color"
                d3.select("#" + property_key)
                    .append("rect")
                    .attr("id", color_id)

                // Define the location and orientation of the color rectangle
                // base on the property row and column.
                var color_x = 0
                var color_y = 0

                if (property.row == 0) {
                    var color_y = g.properties.height * 0.8
                    var color_width = g.properties.width
                    var color_height = g.properties.height * 0.2
                }

                else if (property.column == 0) {
                    var color_x = g.properties.width * 0.8
                    var color_width = g.properties.width * 0.2
                    var color_height = g.properties.height
                }

                else if (property.column == 10) {
                    var color_width = g.properties.width * 0.2
                    var color_height = g.properties.height
                }

                else {
                    var color_width = g.properties.width
                    var color_height = g.properties.height * 0.2
                }

                // Set color rectangle properties.
                d3.select("#" + color_id)
                    .attr("x", color_x)
                    .attr("y", color_y)
                    .attr("width", color_width)
                    .attr("height", color_height)
                    .attr("fill-opacity", "1.0")
                    .attr("fill", property.color)
                    .attr("stroke", "darkgrey")
                    .attr("stroke-width", 3)


                // House 1
                if (color_width > color_height) {
                    var house_x = color_x + 8
                    var house_y = color_y + 2
                    var house_width = color_height - 4
                    var house_height = color_height - 4
                } else {
                    var house_x = color_x + 2
                    var house_y = color_y + 8
                    var house_width = color_width - 4
                    var house_height = color_width - 4
                }

                d3.select("#" + property_key)
                    .append("rect")
                    .attr("id", property_key + "_house_1")
                    .attr("x", house_x)
                    .attr("y", house_y)
                    .attr("width", house_width)
                    .attr("height", house_height)
                    .attr("class", "invisible")
                    .attr("fill-opacity", "1.0")
                    .attr("fill", "DarkGreen")
                    .attr("stroke", "darkgrey")
                    .attr("stroke-width", 3)

                // House 2
                if (color_width > color_height) {
                    var house_x = house_x + house_width + 6
                    var house_y = house_y
                } else {
                    var house_x = house_x
                    var house_y = house_y + house_height + 6
                }
                d3.select("#" + property_key)
                    .append("rect")
                    .attr("id", property_key + "_house_2")
                    .attr("x", house_x)
                    .attr("y", house_y)
                    .attr("width", house_width)
                    .attr("height", house_height)
                    .attr("class", "invisible")
                    .attr("fill-opacity", "1.0")
                    .attr("fill", "DarkGreen")
                    .attr("stroke", "darkgrey")
                    .attr("stroke-width", 3)

                // House 3
                if (color_width > color_height) {
                    var house_x = house_x + house_width + 6
                    var house_y = house_y
                } else {
                    var house_x = house_x
                    var house_y = house_y + house_width + 6
                }
                d3.select("#" + property_key)
                    .append("rect")
                    .attr("id", property_key + "_house_3")
                    .attr("x", house_x)
                    .attr("y", house_y)
                    .attr("width", house_width)
                    .attr("height", house_height)
                    .attr("class", "invisible")
                    .attr("fill-opacity", "1.0")
                    .attr("fill", "DarkGreen")
                    .attr("stroke", "darkgrey")
                    .attr("stroke-width", 3)

                // House 4
                if (color_width > color_height) {
                    var house_x = house_x + house_width + 6
                    var house_y = house_y
                } else {
                    var house_x = house_x
                    var house_y = house_y + house_height + 6
                }
                d3.select("#" + property_key)
                    .append("rect")
                    .attr("id", property_key + "_house_4")
                    .attr("x", house_x)
                    .attr("y", house_y)
                    .attr("width", house_width)
                    .attr("height", house_height)
                    .attr("class", "invisible")
                    .attr("fill-opacity", "1.0")
                    .attr("fill", "DarkGreen")
                    .attr("stroke", "darkgrey")
                    .attr("stroke-width", 3)

                // Hotel
                if (color_width > color_height) {
                    var house_x = color_x + (color_width / 4)
                    var house_y = color_y + 2
                    var house_width = (color_width / 2)
                    var house_height = color_height - 4
                } else {
                    var house_x = color_x + 2
                    var house_y = color_y + (color_height / 4)
                    var house_width = color_width - 4
                    var house_height = (color_height / 2)
                }

                d3.select("#" + property_key)
                    .append("rect")
                    .attr("id", property_key + "_hotel")
                    .attr("x", house_x)
                    .attr("y", house_y)
                    .attr("width", house_width)
                    .attr("height", house_height)
                    .attr("class", "invisible")
                    .attr("fill-opacity", "1.0")
                    .attr("fill", "DarkRed")
                    .attr("stroke", "darkgrey")
                    .attr("stroke-width", 3)

                // Determine the length of the property name.
                var text_width_and_height = measure_text(property.name, 12)
                var text_width = text_width_and_height.width * 1.2

                // If the width of the property name exceeds the width of
                // the property rectangle, put the last word on a second line.
                if (text_width > g.properties.width) {

                    var last_space = property.name.lastIndexOf(" ")
                    var first_line = property.name.substr(0, last_space)
                    var second_line = property.name.substr(last_space + 1)

                } else {

                    var first_line = property.name
                    var second_line = null
                }

                // Add the first line of the property name to the property rectangle.
                d3.select("#" + property_key)
                    .append("text")
                    .attr("x", g.properties.width / 2)
                    .attr("y", "4em")
                    .attr("fill", "White")
                    .attr("fill-opacity", "1.0")
                    .attr("font-size", "12px")
                    .attr("text-anchor", "middle")
                    .text(first_line)
                    .on("mouseover", (d) => {

                        // Do not unhide the Property Card during an Auction Event.  Auction Event unhides the Property Card.
                        if (g.auction.in == false) {
                            var property_card_group_id = "#" + d.path[1].id + "_card_group_id"
                            d3.select(property_card_group_id).classed('visible', true)
                            d3.select(property_card_group_id).classed('invisible', false)
                        }
                    })
                    .on("mouseout", (d) => {

                        // Do not hide the Property Card during an Auction Event.  Auction Event hides the Property Card.
                        if (g.auction.in == false) {
                            var property_card_group_id = "#" + d.path[1].id + "_card_group_id"
                            d3.select(property_card_group_id).classed('visible', false)
                            d3.select(property_card_group_id).classed('invisible', true)
                        }
                    })

                // If necessary, add a second line of property name.
                if (second_line != null)
                    d3.select("#" + property_key)
                        .append("text")
                        .attr("class", "property_name")
                        .attr("x", g.properties.width / 2)
                        .attr("y", "5em")
                        .attr("fill", "White")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", "12px")
                        .attr("text-anchor", "middle")
                        .text(second_line)
                        .on("mouseover", (d) => {

                            if (g.auction.in == false) {
                                var property_card_group_id = "#" + d.path[1].id + "_card_group_id"
                                d3.select(property_card_group_id).classed('visible', true)
                                d3.select(property_card_group_id).classed('invisible', false)
                            }
                        })
                        .on("mouseout", (d) => {
                            if (g.auction.in == false) {
                                var property_card_group_id = "#" + d.path[1].id + "_card_group_id"
                                d3.select(property_card_group_id).classed('visible', false)
                                d3.select(property_card_group_id).classed('invisible', true)
                            }
                        })

            } else {

                // For non-color property, determine the width of the name.
                var text_width_and_height = measure_text(property.name, 12)
                var text_width = text_width_and_height.width * 1.2

                // If the name of the non-color property exeeds the width of 
                // the non-color property, place the last word on a second line.
                if (text_width > g.properties.width) {
                    var last_space = property.name.lastIndexOf(" ")
                    var first_line = property.name.substr(0, last_space)
                    var second_line = property.name.substr(last_space + 1)
                } else {
                    var first_line = property.name
                    var second_line = null
                }

                // Add the first line of non-color property name to the 
                // non-color property rectangle.
                if (property.type == "community_chest") {
                    var text_color = "Yellow"
                } else if (property.type == "chance") {
                    text_color = "Orange"
                } else {
                    text_color = "White"
                }
                d3.select("#" + property_key)
                    .append("text")
                    .attr("class", "property_name")
                    .attr("x", g.properties.width / 2)
                    .attr("y", "4em")
                    .attr("fill", text_color)
                    .attr("fill-opacity", "1.0")
                    .attr("font-size", "12px")
                    .attr("text-anchor", "middle")
                    .text(first_line)
                    .on("mouseover", (d) => {

                        // Do not unhide the Property Card during an Auction Event.  The Auction Event unhides the Property Card.
                        if (g.auction.in == false) {
                            var property_card_group_id = "#" + d.path[1].id + "_card_group_id"
                            d3.select(property_card_group_id).classed('visible', true)
                            d3.select(property_card_group_id).classed('invisible', false)
                        }
                    })
                    .on("mouseout", (d) => {

                        // Do not hide the Property Card during an Auction Event.  The Auction Event hides the Property Card.
                        if (g.auction.in == false) {
                            var property_card_group_id = "#" + d.path[1].id + "_card_group_id"
                            d3.select(property_card_group_id).classed('visible', false)
                            d3.select(property_card_group_id).classed('invisible', true)
                        }
                    })

                // If necessary, add the second line.
                if (second_line != null)
                    d3.select("#" + property_key)
                        .append("text")
                        .attr("class", "property_name")
                        .attr("x", g.properties.width / 2)
                        .attr("y", "5em")
                        .attr("fill", text_color)
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", "12px")
                        .attr("text-anchor", "middle")
                        .text(second_line)
                        .on("mouseover", (d) => {

                            // Do not unhide the Property Card during an Auction Event.  The Auction Event unhides the Property Card.
                            if (g.auction.in == false) {
                                var property_card_group_id = "#" + d.path[1].id + "_card_group_id"
                                d3.select(property_card_group_id).classed('visible', true)
                                d3.select(property_card_group_id).classed('invisible', false)
                            }
                        })
                        .on("mouseout", (d) => {

                            // Do not hide the Property Card during an Auction Event.  The Auction Event hides the Property Card.
                            if (g.auction.in == false) {
                                var property_card_group_id = "#" + d.path[1].id + "_card_group_id"
                                d3.select(property_card_group_id).classed('visible', false)
                                d3.select(property_card_group_id).classed('invisible', true)
                            }
                        })

            }

            // Tansition the property rectangle based on row and column properties.
            var row = property.row
            var col = property.column

            if (row == 0) {
                var new_x = g.left_margin + (col * g.properties.width)
                var new_y = 0
            }

            else if (col == 0) {
                var new_x = g.left_margin
                var new_y = (row * g.properties.width)
            }

            else if (col == 10) {
                var new_x = g.left_margin + (col * g.properties.width)
                var new_y = (row * g.properties.width)
            }

            else if (row == 10) {
                var new_x = g.left_margin + (col * g.properties.width)
                var new_y = (row * g.properties.height)
            }

            else {
                console.log("\nError: draw_properties.js: draw_properties: draw_properties_callback:")
                console.log("Unexpected row or col encountered: row:", row, "col:", col)
                 
                console_trace(); set_error_encountered()
            }

            // Move the property group to the calculated location.
            var translate = "translate(" + new_x + " " + new_y + ")"
            d3.select("#" + property_key).attr("transform", translate)

            // Update the global container of properties.
            var sequence = property.sequence
            g.sequences[sequence] = { "x": new_x, "y": new_y, "property": property }

            create_card(property_key, property)
        }

        function create_card(property_key, property) {

            var property_card_group_id = property_key + "_card_group_id"

            // Create the card group.
            d3.select("#svg")
                .append("g")
                .attr("id", property_card_group_id)

            // Create a boundary for the group.
            d3.select("#" + property_card_group_id)
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", g.card.width)
                .attr("height", g.card.height)
                .attr("fill-opacity", "0.0")
                .attr("stroke", "darkgrey")
                .attr("stroke-width", 3)

            if (property.type == "property") {

                // Add color rectangle.
                d3.select("#" + property_card_group_id)
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", g.card.width)
                    .attr("height", g.card.height * 0.1)
                    .attr("fill-opacity", "1.0")
                    .attr("fill", property.color)
                    .attr("stroke", "darkgrey")
                    .attr("stroke-width", 3)

                // Add property name.
                d3.select("#" + property_card_group_id)
                    .append("text")
                    .attr("x", g.card.width / 2)
                    .attr("y", "3em")
                    .attr("fill", "white")
                    .attr("fill-opacity", "1.0")
                    .attr("font-size", g.card.title_size)
                    .attr("text-anchor", "middle")
                    .text(property.name)

                // Add property rent.
                d3.select("#" + property_card_group_id)
                    .append("text")
                    .attr("x", g.card.width / 2)
                    .attr("y", "8em")
                    .attr("fill", "white")
                    .attr("fill-opacity", "1.0")
                    .attr("font-size", g.card.text_size)
                    .attr("text-anchor", "middle")
                    .text("Rent " + property.rent)

                // Add rent for one house.
                d3.select("#" + property_card_group_id)
                    .append("text")
                    .attr("x", g.card.width / 2)
                    .attr("y", "10em")
                    .attr("fill", "white")
                    .attr("fill-opacity", "1.0")
                    .attr("font-size", g.card.text_size)
                    .attr("text-anchor", "middle")
                    .text("With 1 House: " + property.house_rents[0])

                // Add rent for two houses.
                d3.select("#" + property_card_group_id)
                    .append("text")
                    .attr("x", g.card.width / 2)
                    .attr("y", "12em")
                    .attr("fill", "white")
                    .attr("fill-opacity", "1.0")
                    .attr("font-size", g.card.text_size)
                    .attr("text-anchor", "middle")
                    .text("With 2 Houses: " + property.house_rents[1])

                // Add rent for three houses.
                d3.select("#" + property_card_group_id)
                    .append("text")
                    .attr("x", g.card.width / 2)
                    .attr("y", "14em")
                    .attr("fill", "white")
                    .attr("fill-opacity", "1.0")
                    .attr("font-size", g.card.text_size)
                    .attr("text-anchor", "middle")
                    .text("With 3 Houses: " + property.house_rents[2])

                // Add rent for four houses.
                d3.select("#" + property_card_group_id)
                    .append("text")
                    .attr("x", g.card.width / 2)
                    .attr("y", "16em")
                    .attr("fill", "white")
                    .attr("fill-opacity", "1.0")
                    .attr("font-size", g.card.text_size)
                    .attr("text-anchor", "middle")
                    .text("With 4 Houses: " + property.house_rents[3])

                // Add rent for a hotel.
                d3.select("#" + property_card_group_id)
                    .append("text")
                    .attr("x", g.card.width / 2)
                    .attr("y", "18em")
                    .attr("fill", "white")
                    .attr("fill-opacity", "1.0")
                    .attr("font-size", g.card.text_size)
                    .attr("text-anchor", "middle")
                    .text("Hotel: " + property.hotel_rent)

                // Add mortgage value.
                d3.select("#" + property_card_group_id)
                    .append("text")
                    .attr("x", g.card.width / 2)
                    .attr("y", "20em")
                    .attr("fill", "white")
                    .attr("fill-opacity", "1.0")
                    .attr("font-size", g.card.text_size)
                    .attr("text-anchor", "middle")
                    .text("Mortgage Value: " + property.mortgage)

                // Add price.
                d3.select("#" + property_card_group_id)
                    .append("text")
                    .attr("x", g.card.width / 2)
                    .attr("y", "22em")
                    .attr("fill", "white")
                    .attr("fill-opacity", "1.0")
                    .attr("font-size", g.card.text_size)
                    .attr("text-anchor", "middle")
                    .text("Price: " + property.price)


            } else {

                if (property.type == "community_chest") {
                    var text_color = "Yellow"
                } else if (property.type == "chance") {
                    text_color = "Orange"
                } else {
                    text_color = "White"
                }

                // Add non-property name.
                d3.select("#" + property_card_group_id)
                    .append("text")
                    .attr("x", g.card.width / 2)
                    .attr("y", "2em")
                    .attr("fill", text_color)
                    .attr("fill-opacity", "1.0")
                    .attr("font-size", g.card.title_size)
                    .attr("text-anchor", "middle")
                    .text(property.name)

                if (property.type == "go") {

                    // Add salary for go.
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", g.card.width / 2)
                        .attr("y", "6em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "middle")
                        .text("Collect Salary: " + property.salary)

                } else if (property.type == "tax") {

                    if (property.key == "income_tax") {

                        // Add tax for income tax
                        d3.select("#" + property_card_group_id)
                            .append("text")
                            .attr("x", g.card.width / 2)
                            .attr("y", "6em")
                            .attr("fill", "white")
                            .attr("fill-opacity", "1.0")
                            .attr("font-size", g.card.text_size)
                            .attr("text-anchor", "middle")
                            .text("Pay Income Tax 200")

                    } else if (property.key == "luxury_tax") {

                        // Add tax for luxury tax
                        d3.select("#" + property_card_group_id)
                            .append("text")
                            .attr("x", g.card.width / 2)
                            .attr("y", "6em")
                            .attr("fill", "white")
                            .attr("fill-opacity", "1.0")
                            .attr("font-size", g.card.text_size)
                            .attr("text-anchor", "middle")
                            .text("Pay Luxury Tax 100")

                    } else {
                        console.log("\nError: draw_properties.js: draw_properties: draw_properties_callback: create_card:")
                        console.log("Invalid property.key for property.type == 'tax':", property.key)
                         
                        console_trace(); set_error_encountered()
                    }

                } else if (property.type == "railroad") {

                    // Add rent for a single railroad owned.
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", g.card.width / 2)
                        .attr("y", "6em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "middle")
                        .text("Rent 25")

                    // Add rent for two railroads owned.
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", g.card.width / 2)
                        .attr("y", "8em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "middle")
                        .text("If two railroads are owned: 50")

                    // Add rent for three railroads owned.
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", g.card.width / 2)
                        .attr("y", "10em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "middle")
                        .text("If three railroads are owned: 100")

                    // Add rent for four railroads owned.
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", g.card.width / 2)
                        .attr("y", "12em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "middle")
                        .text("If four railroads are owned:  200")

                    // Add price.
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", g.card.width / 2)
                        .attr("y", "14em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "middle")
                        .text("Price: " + property.price)


                } else if (property.type == "utility") {

                    // Add first instruction line for an utility.
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", 20)
                        .attr("y", "6em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "left")
                        .text("If one Utility is owned, rent is")

                    // Add second instruction line for an utility.
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", 20)
                        .attr("y", "7em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "left")
                        .text("4 times amount shown on dice.")

                    // Add third instruction line for an utility.
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", 20)
                        .attr("y", "9em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "left")
                        .text("If both Utilities are owned, then")

                    // Add fourth instruction for an utility.
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", 20)
                        .attr("y", "10em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "left")
                        .text("rent is 10 times amount shown")

                    // Add fifth instruction for an utility.
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", 20)
                        .attr("y", "11em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "left")
                        .text("on dice.")

                    // Add price.
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", g.card.width / 2)
                        .attr("y", "13em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "middle")
                        .text("Price: " + property.price)

                } else if (property.type == "go_to_jail") {

                    // Add first instruction line for going to jail
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", g.card.width / 2)
                        .attr("y", "6em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "middle")
                        .text("Go to jail.")

                    // Add second instruction line for going to jail
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", g.card.width / 2)
                        .attr("y", "8em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "middle")
                        .text("Do not pass Go.")

                    // Add third instruction line for going to jail
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", g.card.width / 2)
                        .attr("y", "10em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "middle")
                        .text("Do not collect 200.")

                } else if (property.type == "jail") {

                    // Just visiting jail.
                    d3.select("#" + property_card_group_id)
                        .append("text")
                        .attr("x", g.card.width / 2)
                        .attr("y", "6em")
                        .attr("fill", "white")
                        .attr("fill-opacity", "1.0")
                        .attr("font-size", g.card.text_size)
                        .attr("text-anchor", "middle")
                        .text("Just visiting.")

                } else if (property.type == "community_chest") {

                    create_community_chest_card(property_card_group_id)

                } else if (property.type == "chance") {

                    create_chance_card(property_card_group_id)
                }
            }

            var new_x = g.card.x
            var new_y = g.card.y
            var translate = "translate(" + new_x + " " + new_y + ")"
            d3.select("#" + property_card_group_id).attr("transform", translate)

            d3.select("#" + property_card_group_id).classed('visible', false)
            d3.select("#" + property_card_group_id).classed('invisible', true)
        }
    }

    function create_community_chest_card(property_card_group_id) {

        // Create the first text line for a Community Chest Card.
        d3.select("#" + property_card_group_id)
            .append("text")
            .attr("id", "community_chest_line_1")
            .attr("x", 20)
            .attr("y", "6em")
            .attr("fill", "Yellow")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.card.text_size)
            .attr("text-anchor", "left")
            .text(" ")

        // Create the second text line for a Community Chest Card.
        d3.select("#" + property_card_group_id)
            .append("text")
            .attr("id", "community_chest_line_2")
            .attr("x", 20)
            .attr("y", "8em")
            .attr("fill", "Yellow")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.card.text_size)
            .attr("text-anchor", "left")
            .text(" ")

        // Create the third text line for a Community Chest Card.
        d3.select("#" + property_card_group_id)
            .append("text")
            .attr("id", "community_chest_line_3")
            .attr("x", 20)
            .attr("y", "10em")
            .attr("fill", "Yellow")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.card.text_size)
            .attr("text-anchor", "left")
            .text(" ")

        // Create the fourth text line for a Community Chest Card.
        d3.select("#" + property_card_group_id)
            .append("text")
            .attr("id", "community_chest_line_4")
            .attr("x", 20)
            .attr("y", "12em")
            .attr("fill", "Yellow")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.card.text_size)
            .attr("text-anchor", "left")
            .text(" ")

    }

    function create_chance_card(property_card_group_id) {

        // Create the first text line for a Chance Card.
        d3.select("#" + property_card_group_id)
            .append("text")
            .attr("id", "chance_line_1")
            .attr("x", 20)
            .attr("y", "6em")
            .attr("fill", "Orange")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.card.text_size)
            .attr("text-anchor", "left")
            .text(" ")

        // Create the second text line for a Chance Card.
        d3.select("#" + property_card_group_id)
            .append("text")
            .attr("id", "chance_line_2")
            .attr("x", 20)
            .attr("y", "8em")
            .attr("fill", "Orange")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.card.text_size)
            .attr("text-anchor", "left")
            .text(" ")

        // Create the third text line for a Chance Card.
        d3.select("#" + property_card_group_id)
            .append("text")
            .attr("id", "chance_line_3")
            .attr("x", 20)
            .attr("y", "10em")
            .attr("fill", "Orange")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.card.text_size)
            .attr("text-anchor", "left")
            .text(" ")

        // Create the fourth text line for a Chance Card.
        d3.select("#" + property_card_group_id)
            .append("text")
            .attr("id", "chance_line_4")
            .attr("x", 20)
            .attr("y", "12em")
            .attr("fill", "Orange")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.card.text_size)
            .attr("text-anchor", "left")
            .text(" ")
    }

    function create_lawyer_card() {

        var id = "lawyer_card_group_id"

        // Create the Lawyer Card group.
        d3.select("#svg")
            .append("g")
            .attr("id", id)

        // Create a boundary for the Lawyer Card group
        d3.select("#" + id)
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", g.card.width)
            .attr("height", g.card.height)
            .attr("fill-opacity", "0.0")
            .attr("stroke", "darkgrey")
            .attr("stroke-width", 3)

        // Add a title for the Lawyer Card group.
        d3.select("#" + id)
            .append("text")
            .attr("x", g.card.width / 2)
            .attr("y", "2em")
            .attr("fill", "White")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.card.title_size)
            .attr("text-anchor", "middle")
            .text("Your Lawyer Says")

        // Add first instruction line for an utility.
        d3.select("#" + id)
            .append("text")
            .attr("x", 20)
            .attr("y", "6em")
            .attr("fill", "White")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.card.text_size)
            .attr("text-anchor", "left")
            .text("You can use a 'Get Out OF Jail'")

        // Add second instruction line for an utility.
        d3.select("#" + id)
            .append("text")
            .attr("x", 20)
            .attr("y", "7em")
            .attr("fill", "White")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.card.text_size)
            .attr("text-anchor", "left")
            .text("card if you have one.")

        // Add third instruction line for an utility.
        d3.select("#" + id)
            .append("text")
            .attr("x", 20)
            .attr("y", "9em")
            .attr("fill", "White")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.card.text_size)
            .attr("text-anchor", "left")
            .text("You can pay the fine of 50 to get")

        // Add fourth instruction for an utility.
        d3.select("#" + id)
            .append("text")
            .attr("x", 20)
            .attr("y", "10em")
            .attr("fill", "White")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.card.text_size)
            .attr("text-anchor", "left")
            .text("out of jail immediately.")

        // Add fifth instruction for an utility.
        d3.select("#" + id)
            .append("text")
            .attr("x", 20)
            .attr("y", "12em")
            .attr("fill", "White")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.card.text_size)
            .attr("text-anchor", "left")
            .text("You have three chances to")

        // Add price.
        d3.select("#" + id)
            .append("text")
            .attr("x", 20)
            .attr("y", "13em")
            .attr("fill", "White")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.card.text_size)
            .attr("text-anchor", "left")
            .text("roll doubles.")

        var new_x = g.card.x
        var new_y = g.card.y
        var translate = "translate(" + new_x + " " + new_y + ")"
        d3.select("#" + id).attr("transform", translate)

        d3.select("#" + id).classed('visible', false)
        d3.select("#" + id).classed('invisible', true)
    }

    function create_jail() {

        d3.select("#svg")
            .append("text")
            .attr("id", "jail_poorhouse")
            .attr("x", g.left_margin + (2.5 * g.properties.width))
            .attr("y", (7.4 * g.properties.height))
            .attr("fill", "White")
            .attr("fill-opacity", "1.0")
            .attr("font-size", g.auction.title_size)
            .attr("text-anchor", "middle")
            .text("Jail / Poorhouse")

        for (key_index in g.player_keys) {

            var key = g.player_keys[key_index]

            var cell_g = key + "_cell_g"
            var cell_border = key + "_cell_border"

            // Create property group.
            d3.select("#svg")
                .append("g")
                .attr("id", cell_g)

            // Create property border.
            d3.select("#" + cell_g)
                .append("rect")
                .attr("id", cell_border)
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", g.properties.width)
                .attr("height", g.properties.height)
                .attr("fill-opacity", "0.0")
                .attr("stroke", "darkgrey")
                .attr("stroke-width", 3)

            if (key == "car") {
                var new_x = g.left_margin + (1.5 * g.properties.width)
                var new_y = (7.5 * g.properties.height)

            } else if (key == "top_hat") {
                var new_x = g.left_margin + (2.5 * g.properties.width)
                var new_y = (7.5 * g.properties.height)

            } else if (key == "shoe") {
                var new_x = g.left_margin + (1.5 * g.properties.width)
                var new_y = (8.5 * g.properties.height)

            } else if (key == "dog") {
                var new_x = g.left_margin + (2.5 * g.properties.width)
                var new_y = (8.5 * g.properties.height)

            } else {
                console.log("\nError: draw_properties.js: draw_properties: create_jail")
                console.log("Unexpected key:", key)
                 
                console_trace(); set_error_encountered()
            }

            // Move the cell to the calculated location.
            var translate = "translate(" + new_x + " " + new_y + ")"
            d3.select("#" + cell_g).attr("transform", translate)
        }
    }

    function create_events() {

        create_auction_screen()

        create_trade_screen()
    }
}

function format_name_from_key(key) {

    try {
        var name = key.replace("_", " ")
        name = name.replace("_", " ")
        name = name.replace("_", " ")
        name = name.replace("_", " ")
        name = name.replace("_", " ")

    } catch (err) {
        console.log("\nError: draw_properties.js: format_name_from_key")
        console.log("parameter player_key:", player_key)
        console.log("err.message:", err.message)
         
        console_trace(); set_error_encountered()
    }

    name = name.split(" ")
        .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
        .join(" ")

    return name
}























