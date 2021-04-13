function append_queue(transaction) {

    // Convert transaction object to a JSON string.
    transaction_string = JSON.stringify(transaction)
    transaction_string = transaction_string.replace("&", "ampersand")

    // Append the transaction string to the base url.
    url = "/monopoly_api?transaction="
    url += transaction_string

    // Create a request if one does not already exist.
    if (append_queue_request == undefined) {
        var append_queue_request = new XMLHttpRequest()
    }

    // Create an asynchonous listener to monitor the request.
    append_queue_request.onreadystatechange = function () {

        // The server is done with the request.
        if (this.readyState == 4) {

            // The request was successful.
            if (this.status == 200) {

                // Convert the JSON string into a javascript object.
                var response = JSON.parse(this.responseText)

                // Check response status.
                if (response.status != "Pass") {

                    console.log("\nError: append_queue.js: append_queue: onreadystatechange")
                    console.log("response.status:", response.status)
                    console.log("response.text:", response.text)
                     
                    console_trace(); set_error_encountered()
                }

            } else {
                console.log("\nError: append_queue.js: append_queue: onreadystatechange")
                console.log("this.status:", this.status)
                console.log("this.statusText:", this.statusText)
                 
                console_trace(); set_error_encountered()
            }
        }
    }

    // Send the request for asynchronous processing.
    append_queue_request.open("GET", url, true)
    append_queue_request.send()
}

