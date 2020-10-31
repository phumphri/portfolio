function shuffle_array(source_array) {

    i = 0
    index_values = []
    target_array = []

    array_length = source_array.length

    while (index_values.length < array_length) {
        target_index = Math.floor(Math.random() * 5)
        if (index_values.indexOf(target_index) == -1) {
            index_values.push(target_index)
        }
        if (i++ > 100) {
            break
        }

    }

    for (index_value in index_values){
        var random_index = index_values[index_value]
        target_array.push(source_array[random_index])
    }

    return target_array

}

