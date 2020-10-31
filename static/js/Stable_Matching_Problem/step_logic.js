function step_logic() {

    // Check every school has a student.
    var stable = true
    for (var i in o.schools) {
        var school = o.schools[i]
        try {
            if (school.student == null) {
                stable = false
                break
            }
        } catch (err) {
            console.log(" ")
            console.log("i:", i, "school:", school)
            console.log("o.schools:", o.schools)
            console.log("err.message:", err.message)
            return
        }
    }


    if (stable == true) {
        document.getElementById("explanation").innerHTML = "A stable solution was found.  No further steps would change the results."
        return
    }

    document.getElementById("explanation").innerHTML = "placeholder"

    for (var i in o.school_names) {
        var school_name = o.school_names[i]
        var school = o.schools[school_name]
        var student = school.student
        if (student == null) {
            var preferred_student_name = school.students.shift()
            var preferred_student = o.students[preferred_student_name]

            // If the student has yet to select a school, they accept the first offer.
            if (preferred_student.school == null) {
                school.student = preferred_student_name
                preferred_student.school = school_name
                move_icon(school_name, preferred_student_name)
                move_icon(preferred_student_name, school_name, 1000)
                s = "<ul>"
                s += "<li>" + school_name + " made an offer to  " + preferred_student_name + ".</li>"
                s += "<li>Since the student has yet to accept an offer, it must accept this offer.</li>"
                s += "<li>The student for " + school_name + " is set to " + preferred_student_name + ".</li>"
                s += "<li>The school for " + preferred_student_name + " is set to " + school_name + ".</li>"
                s += "<li>The student is removed from the preferred list of the school since it has been visted.</li>"
                s += "</ul>"
                document.getElementById("explanation").innerHTML = s
                return
            }

            var previous_school_name = preferred_student.school

            var index_of_previous_offer = preferred_student.schools.indexOf(previous_school_name)
            var index_of_current_offer = preferred_student.schools.indexOf(school_name)


            if (index_of_current_offer < index_of_previous_offer) {
                o.schools[previous_school_name].student = null
                school.student = preferred_student_name
                preferred_student.school = school_name
                move_icon(previous_school_name, previous_school_name)
                move_icon(preferred_student_name, school_name, 1000)
                move_icon(school_name, preferred_student_name, 2000)
                s = "<ul>"
                // s += "<li>Boffo</li>"
                s += "<li>" + school_name + " made an offer to " + preferred_student_name + ".</li>"
                s += "<li>" + preferred_student_name + " already has accepted an offer from " + previous_school_name + ".</li>"
                s += "<li>However, " + school_name + " is preferable to the offer from " + previous_school_name + ".</li>"
                s += "<li>" + preferred_student_name + " recinds the offer from " + previous_school_name + ".</li>"
                s += "<li>" + preferred_student_name + " accepts the offer from " + school_name + ".</li>"
                s += "<li>The student for " + previous_school_name + " is set to null.</li>"
                s += "<li>The student for " + school_name + " is set to " + preferred_student_name + ".</li>"
                s += "<li>The school for " + preferred_student_name + " is set to " + school_name + ".</li>"
                s += "</ul>"
                document.getElementById("explanation").innerHTML = s
                return
            }
            
            s = "<ul>"
            // s += "<li>Bummer</li>"
            s += "<li>" + school_name + " made an offer to " + preferred_student_name + ".</li>"
            s += "<li>" + preferred_student_name + " already has accepted an offer from " + previous_school_name + ".</li>"
            s += "<li>However, " + previous_school_name + " is preferable to the offer from " + school_name + ".</li>"
            s += "<li>The offer from " + school_name + " is rejected.</li>"
            s += "<li>" + preferred_student_name + " is removed from the school's preferred student list since it was visited.</li>"
            s += "<li> The student for " + school_name + " remains null.</li>"
            s += "</ul>"
            document.getElementById("explanation").innerHTML = s
            return
        }
    }



}
