function create_schools() {


    school_groups = o.svg
        .selectAll(".school_group")
        .data(o.school_names)
        .enter()
        .append("g")
        .attr("class", "school_group")
        .attr("id", (d) => { return d })

    if (true) {
        school_groups
            .append("rect")
            .attr("class", "school_rectangle")
            .attr("x", (d) => { return o.schools[d].x })
            .attr("y", (d) => { return o.schools[d].y })
            .attr("width", (d) => { return o.schools[d].width })
            .attr("height", (d) => { return o.schools[d].height })
            .attr("fill-opacity", "0.0")
            .attr("stroke", "darkgrey")
            .attr("stroke-width", 3)
    }
    if (true) {
        school_groups
            .append("text")
            .attr("class", "school_name")
            .attr("x", (d) => { return o.schools[d].x + (o.schools[d].width / 2) })
            .attr("y", (d,) => { return o.schools[d].y + (2 * o.font_size) })
            .attr("fill", "white")
            .attr("fill-opacity", "1.0")
            .attr("font-size", o.font_size)
            .attr("text-anchor", "middle")
            .text(function (d) { return d })
    }

    if (true) {
        for (var j in o.school_names) {
            var school_name = o.school_names[j]
            o.svg.select("#" + school_name)
                .selectAll(".student_name")
                .data(() => { return o.schools[school_name].students })
                .enter()
                .append("text")
                .attr("class", "student_name")
                .attr("x", (d, i) => { return o.schools[school_name].x + 10 })
                .attr("y", (d, i) => { return o.schools[school_name].y + (i * o.font_size) + (o.font_size * 4) })
                .attr("fill", "white")
                .attr("fill-opacity", "1.0")
                .attr("font-size", () => { return o.font_size })
                .text((d) => { return d })

            move_icon(school_name, school_name)
        }


    }
}