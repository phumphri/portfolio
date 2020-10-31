function declare_global_variables() {

    // Container for global variables.
    o = {}

    // Define school and student names.
    o.school_names = ["UCLA","USC","UCSB","UCI","USD"]
    o.student_names = ["Adam", "Barbara", "Charles", "Debra", "Edward"]

    // Global font size.
    o.font_size_px = "12px"
    o.font_size = 12

    // Dimensions for schools and students.
    o.school_dimensions = {"x":10, "y":10, "width":150, "height":150}
    o.student_dimensions = {"x":310, "y":10, "width":150, "height":150}
    o.vertical_spacing = 1.1

    // Dimensions for the svg based on schools and students.
    o.svg = {}
    o.svg.height = o.school_dimensions.height * (o.school_names.length + 1)
    o.svg.width = o.student_dimensions.x + o.student_dimensions.width + 10

    // Dimensions for each school and associated icon.
    o.schools = {}
    o.school_icons = {}

    for (var i in o.school_names) {

        var school_name = o.school_names[i]

        o.schools[school_name] = {
            x: o.school_dimensions.x,
            y: o.school_dimensions.y + (i * o.school_dimensions.height * o.vertical_spacing),
            width: o.school_dimensions.width,
            height: o.school_dimensions.height,
            students: shuffle_array(o.student_names),
            student: null,
            docking_x: o.school_dimensions.x + (o.school_dimensions.width / 2),
            docking_y: o.school_dimensions.y + (i * o.school_dimensions.height * o.vertical_spacing) + (o.school_dimensions.height / 2)
        }

    }

    // Dimensions for each student and associated icon.
    o.students = {}
    o.student_icons = {}

    for (var i in o.student_names) {

        var student_name = o.student_names[i]

        o.students[student_name] = {
            x: o.student_dimensions.x,
            y: o.student_dimensions.y + (i * o.student_dimensions.height * o.vertical_spacing),
            width: o.student_dimensions.width,
            height: o.student_dimensions.height,
            schools: shuffle_array(o.school_names),
            school: null,
            docking_x: o.student_dimensions.x + (o.student_dimensions.width / 2),
            docking_y: o.student_dimensions.y + (i * o.student_dimensions.height * o.vertical_spacing) + (o.student_dimensions.height / 2)
        }

    }

    console.log(" ")
    console.log("o:")
    console.log(o)

 
}
