function create_commands() {

    o.command_column = o.svg_row.append("div")
        .attr("class", "col-sm-5")
        .attr("id", "command_column")

    o.command_table = o.command_column.append("table")
        .attr("class", "table")
        .attr("id", "command_table")

    o.command_heading = o.command_table.append("thead")
        .attr("id", "command_heading")
        .append("tr")
    o.command_heading.append("th").text("Command")
    o.command_heading.append("th").text("Action")

    o.command_tbody = o.command_table.append("tbody")
        .attr("id", "command_body")

    o.step_tr = o.command_tbody.append("tr")
        .attr("id", "step_tr")
    o.step_tr.append("td")
        .append("button")
        .attr("type", "button")
        .text("Step")
        .on('click', () => {
            step_logic()
        })
    o.step_tr.append("td")
        .text("Next step of the Gale-Shapley Algorithm.")

    o.reset_tr = o.command_tbody.append("tr")
        .attr("id", "reset_tr")
    o.reset_tr.append("td")
        .append("button")
        .attr("type", "button")
        .text("Reset")
        .on('click', () => {

            // Shuffle the preferred students for each school.
            for (var i in o.schools) {
                var school = o.schools[i]
                school.students = shuffle_array(o.student_names)
            }

            // Update the sudents displayed for each school.
            for (var i in o.school_names) {
                var school_name = o.school_names[i]
                o.svg.select("#" + school_name)
                    .selectAll(".student_name")
                    .data(() => { return o.schools[school_name].students })
                    .text((d) => { return d })
            }

            // Shuffle the preferred schools for each student.
            for (var i in o.students) {
                var student = o.students[i]
                student.schools = shuffle_array(o.school_names)
            }

            // Update the preferred schools displayed for each student.
            for (var i in o.student_names) {
                var student_name = o.student_names[i]
                o.svg.select("#" + student_name)
                    .selectAll(".school_name")
                    .data(() => { return o.students[student_name].schools })
                    .text((d) => { return d })
            }

            // Move the school icons back to the schools.
            for (var school_index in o.school_names) {
                school_name = o.school_names[school_index]
                move_icon(school_name, school_name)
            }

            // Move the student icons back to the students.
            for (var student_index in o.student_names) {
                student_name = o.student_names[student_index]
                move_icon(student_name, student_name)

            var s = "Gale-Shapley Algorithm"
            s += "<ul>"
            s += "<li>Each school extends and offer to the the most preferred student in its list.</li>"
            s += "<li>If the student has yet to select a school, they accept the first offer.</li>"
            s += "<li>If the student has already accepted a previous offer, but the current offer is from a more preferred school, "
            s += "the previous offer is recinded and the new offer is accepted.</li>"
            s += "<li>If the student has already accepted a previous offer from a more preferred school, the current offer is rejected "
            s += "and the student is removed from the school's list of preferred students</li>"
            s += "<li>The process continues until every school has a student that accepted their offer.</li>"
            s += "</ul>"
            s += "Note that the school usually settle for a lower preferred student while the student usually a higher preferred school."
            document.getElementById("explanation").innerHTML = s  
            
            }

            for (var i in o.schools) {
                o.schools[i].student = null
            }

            for (var i in o.students) {
                o.students[i].school = null
            }

        })

    o.reset_tr.append("td")
        .text("Reset the problem with random preferences.")


    var explanation_fieldset = o.command_column.append("fieldset")

    explanation_fieldset.append("legend").text("Explanation")

    o.explanation = explanation_fieldset
        .append("p")
        .attr("id", "explanation")
    var s = "Gale-Shapley Algorithm"
    s += "<ul>"
    s += "<li>Each school extends and offer to the the most preferred student in its list.</li>"
    s += "<li>If the student has yet to select a school, they accept the first offer.</li>"
    s += "<li>If the student has already accepted a previous offer, but the current offer is from a more preferred school, "
    s += "the previous offer is recinded and the new offer is accepted.</li>"
    s += "<li>If the student has already accepted a previous offer from a more preferred school, the current offer is rejected "
    s += "and the student is removed from the school's list of preferred students</li>"
    s += "<li>The process continues until every school has a student that accepted their offer.</li>"
    s += "</ul>"
    s += "Note that the school usually settle for a lower preferred student while the student usually a higher preferred school."

    document.getElementById("explanation").innerHTML = s
    
    var instruction_fieldset = o.command_column.append("fieldset")

    instruction_fieldset.append("legend").text("Instructions")

    o.instruction = instruction_fieldset
        .append("p")
        .attr("id", "instructions")
    
    var s = "<ul>"
    s += "<li>Schools on the left have a list of preferable students and a tile.</li>"
    s += "<li>When a student is assigned to a shcool, its tile is moved to the school, and the school tile is moved to the student.</li>"
    s += "<li>Click on the Step button to start the algorithm.</li>"
    s += "<li>The results of the first step will appear in the Explanation section..</li>"
    s += "<li>The tiles that move indicate which school aceepts a student and which school the student intends to matriculate.</li>"
    s += "<li>Continue clicking the Step button while watching the tiles and reading the explanations.</li>"
    s += "<li>No further changes will be made when a stable matching is achived and reported in the Explanation section.</li>"
    s += "<li>Clicking the Reset button restores the tiles and shuffles the preferences.</li>"
    s += "</ul>"

    document.getElementById("instructions").innerHTML = s

 




}
