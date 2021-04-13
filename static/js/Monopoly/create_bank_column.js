
function create_bank_column(properties) {

    // Verify that the properties parameter is defined.
    if (typeof properties == "undefined") {
        console.log("\n Error: create_bank_column.js: create_bank_column")
        console.log('Parameter "properties" was undefined.')
        console_trace(); set_error_encountered()
        return
    }

    // Verify that the properties parameter is not null.
    if (properties == null) {
        console.log("\n Error: create_bank_column.js: create_bank_column")
        console.log('Parameter "properties" was null.')         
        console_trace(); set_error_encountered()
        return
    }

    // Verify that the properties parameter is not empty.
    if (Object.keys(properties).length == 0) {
        console.log("\n Error: create_bank_column.js: create_bank_column")
        console.log('Parameter "properties" was empty.')
        console_trace(); set_error_encountered()
        return
    }

    // Add bank column.
    d3.select("#svg")
        .append("g")
        .attr("id", g.bank_column.id);

    // Create bank column border.
    d3.select("#" + g.bank_column.id)
        .append("rect")
        .attr("id", g.bank_column.border_id);

    // Set border properties.
    d3.select("#" + g.bank_column.border_id)
        .attr("x", g.bank_column.x)
        .attr("y", g.bank_column.y)
        .attr("width", g.bank_column.width)
        .attr("height", g.bank_column.height)
        .attr("fill-opacity", "0.0")
        .attr("stroke", "darkgrey")
        .attr("stroke-width", 3);

    // Add heading to the bank column.
    d3.select("#" + g.bank_column.id)
        .append("text")
        .attr("id", "g.bank_column_heading")
        .attr("x", g.bank_column.x + g.bank_column.width / 2)
        .attr("y", g.bank_column.text_height * 1.2)
        .attr("fill", "white")
        .attr("fill-opacity", "1.0")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .text("Bank");

    // Add heading to the balance row.
    d3.select("#" + g.bank_column.id)
        .append("text")
        .attr("id", "g.bank_balance_heading")
        .attr("x", g.bank_column.x + g.bank_column.width / 2)
        .attr("y", g.rows.balance)
        .attr("fill", "white")
        .attr("fill-opacity", "1.0")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .text("Assets");


    // Add property icons.
    var property_row = 1;

    for (property_key in properties) {

        var property = properties[property_key];

        if (['property', 'railroad', 'utility'].includes(property.type)) {

            // Create property tile.
            var property_icon_id = property_key + "_icon";
            d3.select("#svg")
                .append("g")
                .attr("id", property_icon_id);

            // Create property icon border.
            var property_icon_border_id = property_key + "_icon_border";
            d3.select("#" + property_icon_id)
                .append("rect")
                .attr("id", property_icon_border_id)
                .attr("class", JSON.stringify({ "owner": "bank", "mortgaged": false }))
                .on("mouseover", (d) => {

                    // Do not unhide the Property Card during an Auction Event. The Auction Event unhides the Property Card.
                    if (g.auction.in == false) {
                        var property_card_group_id = "#" + d.path[1].id + "_card_group_id";
                        var property_card_group_id = property_card_group_id.replace("_icon", "");
                        d3.select(property_card_group_id).classed('visible', true);
                        d3.select(property_card_group_id).classed('invisible', false);
                    }
                })
                .on("mouseout", (d) => {

                    // Do not hide the Propety Card during an Auction Event.  The Auction Event hides the Property Card.
                    if (g.auction.in == false) {
                        var property_card_group_id = "#" + d.path[1].id + "_card_group_id";
                        property_card_group_id = property_card_group_id.replace("_icon", "");
                        d3.select(property_card_group_id).classed('visible', false);
                        d3.select(property_card_group_id).classed('invisible', true);
                    }
                })
                .on("click", (d) => { property_icon_click(d) })


            // Set border properties.
            d3.select("#" + property_icon_border_id)
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", g.bank_column.width)
                .attr("height", g.bank_column.text_height * 2)
                .attr("fill-opacity", "1.0")
                .attr("fill", property.color)
                .attr("stroke", "darkgrey")
                .attr("stroke-width", 3);

            // Adjust font color based on the background for better contrast.
            if (property.color == "LightBlue") {
                var font_color = "Black"

            } else if (property.color == "Orange") {
                var font_color = "Black"

            } else if (property.color == "Red") {
                var font_color = "Black"

            } else if (property.color == "Yellow") {
                var font_color = "Black"

            } else {
                var font_color = "White"
            }

            // Add text to the property icon.
            d3.select("#" + property_icon_id)
                .append("text")
                .attr("id", property_key + "_icon_name")
                .attr("x", g.bank_column.width / 2)
                .attr("y", g.bank_column.text_height * 1.2)
                .attr("fill", font_color)
                .attr("fill-opacity", "1.0")
                .attr("font-size", "12px")
                .attr("text-anchor", "middle")
                .text(property.name)
                .on("mouseover", (d) => {

                    // Do not unhide the Property Card during an Auction Event.  The Auction Event unhides the Property Card.
                    if (g.auction.in == false) {
                        var property_card_group_id = "#" + d.path[1].id + "_card_group_id";
                        var property_card_group_id = property_card_group_id.replace("_icon", "");
                        d3.select(property_card_group_id).classed('visible', true);
                        d3.select(property_card_group_id).classed('invisible', false)
                    }
                })
                .on("mouseout", (d) => {

                    // Do not hide the Property Card during an Auction Event.  The Auction Event hides the Property Card.
                    if (g.auction.in == false) {
                        var property_card_group_id = "#" + d.path[1].id + "_card_group_id"
                        var property_card_group_id = property_card_group_id.replace("_icon", "");
                        d3.select(property_card_group_id).classed('visible', false);
                        d3.select(property_card_group_id).classed('invisible', true);
                    }
                })
                .on("click", (d) => { property_icon_click(d) })

            // Determine the location of the Property Icon.
            var new_x = g.bank_column.x
            var new_y = property_row * (2 * g.bank_column.text_height) + (2 * g.bank_column.text_height)
            var translate = "translate(" + new_x + " " + new_y + ")"

            // Move the Property Icon to its positioon in the asset column for the Bank.
            d3.select("#" + property_icon_id)
                .transition()
                .duration(500)
                .attr("transform", translate)

            // Add the new_y to the property_key-to-row_index lookup table.
            g.rows[property_key] = new_y

            // Next row.
            property_row++
        }
    }
}

function property_icon_click(d) {

    // Determine if a Trade Event is in progress.
    if (g.trade.in == true) {

        // Clone the Property Icon and move the clone to the Trade Screen.
        clone_and_move_property_icon_to_trade_screen(d)
    }

    // Determine if a Build Event is active.
    if (g.build.in == true) {

        // Add a house or hotel if possible.
        build_house_or_hotel(d)

        // Globally indicate that the Mortgage Event is not active.
        g.build.in = false

        // Restore the buttons on the Roll Dice Screen at the time when the Build Event started.
        restore_buttons()
    }

    // Determine if a Sell Event is active.
    if (g.sell.in == true) {

        // Add a house or hotel if possible.
        sell_house_or_hotel(d)

        // Globally indicate that the Mortgage Event is not active.
        g.sell.in = false

        // Restore the buttons on the Roll Dice Screen at the time when the Build Event started.
        restore_buttons()
    }

    // Determine if a Mortgage Event is active.
    if (g.mortgage.in == true) {

        // Update the mortgage attribute of the Property to "true".
        property_mortgaged = "true"

        // Set the mortgaged attribute of Property to True.
        update_property_mortgaged(d, property_mortgaged)

        // Globally indicate that the Mortgage Event is not active.
        g.mortgage.in = false
    }

    // Determine if an Unmortgage Event is active.
    if (g.unmortgage.in == true) {

        // Update the mortgage attribute of the Property to "false".
        property_mortgaged = "false"

        // Set the mortgaged attribute of Property to True.
        update_property_mortgaged(d, property_mortgaged)

        // Globally indicate that the Unmortgage Event is not active.
        g.unmortgage.in = false
    }
}

