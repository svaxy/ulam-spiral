// a web worker that checks if the numeber is a prime number
onmessage = function(event) {
    let number = event.data;
    if (number == 1) {
        postMessage([true, number]);
        return;
    }

    for (let i = 2; i < number; i++) {
        if (number % i == 0) {
            postMessage([false, number]);
            return;
        }
    }

    postMessage([true, number]);
    return;
}

