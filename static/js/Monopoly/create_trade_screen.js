function create_trade_screen() {

    // Create the event group.
    d3.select("#svg")
        .append("g")
        .attr("id", g.trade.screen.id);

    // Create a boundary for the event group.
    d3.select("#" + g.trade.screen.id)
        .append("rect")
        .attr("id", g.trade.screen.border)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", g.trade.screen.width)
        .attr("height", g.trade.screen.height)
        .attr("fill-opacity", "0.0")
        .attr("stroke", "darkgrey")
        .attr("stroke-width", 3);

    // Add the title to the event.
    d3.select("#" + g.trade.screen.id)
        .append("text")
        .attr("id", g.trade.screen.text)
        .attr("x", g.trade.screen.title.x)
        .attr("y", g.trade.screen.title.y)
        .attr("fill", "White")
        .attr("fill-opacity", "1.0")
        .attr("font-size", g.auction.title_size)
        .attr("text-anchor", "middle")
        .text(g.trade.screen.title.text);

    // Add the player tile.
    d3.select("#" + g.trade.screen.id)
        .append("rect")
        .attr("id", g.trade.screen.player.tile.id)
        .attr("x", g.trade.screen.player.tile.x)
        .attr("y", g.trade.screen.player.tile.y)
        .attr("width", g.trade.screen.player.tile.width)
        .attr("height", g.trade.screen.player.tile.height)
        .attr("fill-opacity", "0.0")
        .attr("stroke", "darkgrey")
        .attr("stroke-width", 3);


// Start adding foreign object for Player Money.

    // Determine the sizes of the text.
    var text_dimensions = measure_text("Your Bid: 1,000", g.auction.text_size)
    var your_bid_width = text_dimensions.width
    var text_height = text_dimensions.height

    // Append a Foreign Object to the Auction Screen.
    var fo = d3.select("#" + g.trade.screen.id)
        .append("foreignObject")
        .attr("id", g.trade.screen.player.money.id)
        .attr("x", g.trade.screen.player.money.x + 10)
        .attr("y", g.trade.screen.player.money.y + 5)
        .attr("width", g.trade.screen.player.money.width)
        .attr("height", g.trade.screen.player.money.height)

    // Append HTML to the Foreign Object.
    var fo_html = fo.append("xhtml:html")
        .attr("xmlns", "http://www.w3.org/1999/xhtml")

    // Append a label to the HTML.
    var fo_label = fo_html.append("label")
        .attr("style", "color:yellow; font-size:12px")
        .text("Money:")

    // Bind the Trade Player Amount to the label for this field.
    fo_label.append("input")
        .attr("id", "trade_player_amount")
        .attr("type", "number")
        .attr("value", 0)
        .attr("min", 0)
        .attr("max", 999)
        .attr("step", 10)
        .attr("style", "color:yellow; background-color:black; font-size:12px; text-align:right")
        .on("change", () => {

            // Get the money from the Trade Screen for the Player.
            var value = document.getElementById("trade_player_amount").value

            // Limit the offer to the balance of the Player.
            if (value > g.trade.player.balance) {
                g.trade.money.player = g.trade.player.balance
                document.getElementById("trade_player_amount").value = g.trade.player.balance
            } else {
                g.trade.money.player = value
            }

            // Reset the money offered by the Other Player in the Trade Event and Trade Screen.
            document.getElementById("trade_other_player_amount").value = 0
            g.trade.money.other_player = 0
        })

// End adding foreign object for Player Money.

    // Add the Trade Player Property "a".
    d3.select("#" + g.trade.screen.id)
        .append("rect")
        .attr("id", g.trade.screen.player.property.a.id)
        .attr("x", g.trade.screen.player.property.a.x)
        .attr("y", g.trade.screen.player.property.a.y)
        .attr("width", g.trade.screen.player.property.a.width)
        .attr("height", g.trade.screen.player.property.a.height)
        .attr("fill-opacity", "0.0")
        .attr("stroke", "darkgrey")
        .attr("stroke-width", 3);

    // Add the Trade Player Property "b".
    d3.select("#" + g.trade.screen.id)
        .append("rect")
        .attr("id", g.trade.screen.player.property.b.id)
        .attr("x", g.trade.screen.player.property.b.x)
        .attr("y", g.trade.screen.player.property.b.y)
        .attr("width", g.trade.screen.player.property.b.width)
        .attr("height", g.trade.screen.player.property.b.height)
        .attr("fill-opacity", "0.0")
        .attr("stroke", "darkgrey")
        .attr("stroke-width", 3);

    // Add the Trade Player Property "c".
    d3.select("#" + g.trade.screen.id)
        .append("rect")
        .attr("id", g.trade.screen.player.property.c.id)
        .attr("x", g.trade.screen.player.property.c.x)
        .attr("y", g.trade.screen.player.property.c.y)
        .attr("width", g.trade.screen.player.property.c.width)
        .attr("height", g.trade.screen.player.property.c.height)
        .attr("fill-opacity", "0.0")
        .attr("stroke", "darkgrey")
        .attr("stroke-width", 3);

    // Add the other player tile.
    d3.select("#" + g.trade.screen.id)
        .append("rect")
        .attr("id", g.trade.screen.other_player.tile.id)
        .attr("x", g.trade.screen.other_player.tile.width)
        .attr("y", g.trade.screen.other_player.tile.y)
        .attr("width", g.trade.screen.other_player.tile.width)
        .attr("height", g.trade.screen.other_player.tile.height)
        .attr("fill-opacity", "0.0")
        .attr("stroke", "darkgrey")
        .attr("stroke-width", 3)


// Start adding foreign object for Other Player Money.

    // Determine the sizes of the text.
    var text_dimensions = measure_text("Your Bid: 1,000", g.auction.text_size)
    var your_bid_width = text_dimensions.width
    var text_height = text_dimensions.height

    // Append a Foreign Object to the Auction Screen.
    var fo = d3.select("#" + g.trade.screen.id)
        .append("foreignObject")
        .attr("id", g.trade.screen.other_player.money.id)
        .attr("x", g.trade.screen.other_player.money.x + 10)
        .attr("y", g.trade.screen.other_player.money.y + 5)
        .attr("width", g.trade.screen.other_player.money.width)
        .attr("height", g.trade.screen.other_player.money.height)

    // Append HTML to the Foreign Object.
    var fo_html = fo.append("xhtml:html")
        .attr("xmlns", "http://www.w3.org/1999/xhtml")

    // Append a label to the HTML.
    var fo_label = fo_html.append("label")
        .attr("style", "color:yellow; font-size:12px")
        .text("Money:")

    // Bind the Trade Other Player Amount to the label for this field.
    fo_label.append("input")
        .attr("id", "trade_other_player_amount")
        .attr("type", "number")
        .attr("value", 0)
        .attr("min", 0)
        .attr("max", 999)
        .attr("step", 10)
        .attr("style", "color:yellow; background-color:black; font-size:12px; text-align:right")
        .on("change", () => {

            // Get the money from the Trade Screen for the Other Player.
            var value = document.getElementById("trade_other_player_amount").value

            // Limit the offer to the balance of the Other Player.
            if (value > g.trade.other_player.balance) {
                g.trade.money.other_player = g.trade.other_player.balance
                document.getElementById("trade_other_player_amount").value = g.trade.other_player.balance
            } else {
                g.trade.money.other_player = value
            }

            // Reset the money offered by the Player in the Trade Event and Trade Screen.
            document.getElementById("trade_player_amount").value = 0
            g.trade.money.player = 0
        })

// End adding foreign object for Player Money.

    // Add the Trade Other Player Property "a".
    d3.select("#" + g.trade.screen.id)
        .append("rect")
        .attr("id", g.trade.screen.other_player.property.a.id)
        .attr("x", g.trade.screen.other_player.property.a.x)
        .attr("y", g.trade.screen.other_player.property.a.y)
        .attr("width", g.trade.screen.other_player.property.a.width)
        .attr("height", g.trade.screen.other_player.property.a.height)
        .attr("fill-opacity", "0.0")
        .attr("stroke", "darkgrey")
        .attr("stroke-width", 3);

    // Add the Trade Other Player Property "b".
    d3.select("#" + g.trade.screen.id)
        .append("rect")
        .attr("id", g.trade.screen.other_player.property.b.id)
        .attr("x", g.trade.screen.other_player.property.b.x)
        .attr("y", g.trade.screen.other_player.property.b.y)
        .attr("width", g.trade.screen.other_player.property.b.width)
        .attr("height", g.trade.screen.other_player.property.b.height)
        .attr("fill-opacity", "0.0")
        .attr("stroke", "darkgrey")
        .attr("stroke-width", 3);

    // Add the Trade Other Player Property "c".
    d3.select("#" + g.trade.screen.id)
        .append("rect")
        .attr("id", g.trade.screen.other_player.property.c.id)
        .attr("x", g.trade.screen.other_player.property.c.x)
        .attr("y", g.trade.screen.other_player.property.c.y)
        .attr("width", g.trade.screen.other_player.property.c.width)
        .attr("height", g.trade.screen.other_player.property.c.height)
        .attr("fill-opacity", "0.0")
        .attr("stroke", "darkgrey")
        .attr("stroke-width", 3);

    // Move the Trade Screen to the same posistion as the card in the Auction Screen.
    var new_x = g.trade.screen.x
    var new_y = g.trade.screen.y
    var translate = "translate(" + new_x + " " + new_y + ")"
    d3.select("#" + g.trade.screen.id).attr("transform", translate)

    d3.select("#" + g.trade.screen.id).classed('visible', false)
    d3.select("#" + g.trade.screen.id).classed('invisible', true)
}
