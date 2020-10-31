function move_icon (icon_name, destination, delay=0) {

    // Validate icon name.
    if (o.school_names.includes(icon_name)) {
        var source = o.schools[icon_name]
    } else if (o.student_names.includes(icon_name)) {
        var source = o.students[icon_name]
    } else {
        alert("Icon name was invalid:", icon_name)
        return
    }

    var icon_id = icon_name + "_icon"

    // Create the icon.
    x = document.getElementById(icon_id)

    if (x == null) {

        var width = "5em"

        var icon = o.svg.append("g")
            .attr("id", icon_id)
        
        icon
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", "3em")
            .attr("fill-opacity", "0.8")
            .attr("stroke", "darkgrey")
            .attr("fill", "blue")
            .attr("stroke-width", 3)


        icon
            .append("text")
            .text(icon_name)
            .attr("x", "1em")
            .attr("y", "2em")
            .attr("fill", "white")
            .attr("fill-opacity", "1.0")
            .attr("font-size", () => { return o.font_size })
    } else {
        var icon = o.svg.select("#" + icon_id)
    }

    // Move the icon to the destination.
    if (o.school_names.includes(destination)) {
        var target = o.schools[destination]
    } else if (o.student_names.includes(destination)) {
        var target = o.students[destination]
    } else {
        alert("Destination was invalid:", destination)
        return
    }

    var new_x = target.docking_x
    var new_y = target.docking_y
    var translate = "translate(" + new_x + " " + new_y + ")"

    icon
        .transition()
        .delay(delay)
        .duration(1000)
        .attr("transform", translate)    
}