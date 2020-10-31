function create_svg() {

    o.body = d3.select("body")

    o.svg_container = o.body.append("div")
        .attr("class", "container-fluid")
        .attr("id", "svg_container")

    o.svg_row = o.svg_container.append("div")
        .attr("class", "row")
        .attr("id", "svg_row")

    o.svg_column = o.svg_row.append("div")
        .attr("class", "col-sm-7")
        .attr("id", "svg_column")
        .attr("style", "height:" + o.svg.height)

    o.svg = o.svg_column.append("svg")
        .attr("height", o.svg.height)
        .attr("width", o.svg.width)
}

