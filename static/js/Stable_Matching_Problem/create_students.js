function create_students() {


    student_groups = o.svg
        .selectAll(".student_group")
        .data(o.student_names)
        .enter()
        .append("g")
        .attr("class", "student_group")
        .attr("id", (d) => { return d })

    if (true) {
        student_groups
            .append("rect")
            .attr("class", "student_rectangle")
            .attr("x", (d) => { return o.students[d].x })
            .attr("y", (d) => { return o.students[d].y })
            .attr("width", (d) => { return o.students[d].width })
            .attr("height", (d) => { return o.students[d].height })
            .attr("fill-opacity", "0.0")
            .attr("stroke", "darkgrey")
            .attr("stroke-width", 3)
    }
    if (true) {
        student_groups
            .append("text")
            .attr("class", "student_name")
            .attr("x", (d) => { return o.students[d].x + (o.students[d].width / 2) })
            .attr("y", (d,) => { return o.students[d].y + (2 * o.font_size) })
            .attr("fill", "white")
            .attr("fill-opacity", "1.0")
            .attr("font-size", o.font_size)
            .attr("text-anchor", "middle")
            .text(function (d) { return d })
    }

    if (true) {
        for (var j in o.student_names) {
            var student_name = o.student_names[j]
            o.svg.select("#" + student_name)
                .selectAll(".school_name")
                .data(() => { return o.students[student_name].schools })
                .enter()
                .append("text")
                .attr("class", "school_name")
                .attr("x", (d,i) => { return o.students[student_name].x + 10})
                .attr("y", (d,i) => { return o.students[student_name].y + ( i * o.font_size)  + (o.font_size * 4) })
                .attr("fill", "white")
                .attr("fill-opacity", "1.0")
                .attr("font-size", () => { return o.font_size })
                .text((d) => { return d })
            
            move_icon(student_name, student_name)
        }


    }
}