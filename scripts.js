document.addEventListener('DOMContentLoaded', function(){
    let startPosLeft =  window.innerWidth / 2;
    let startPosTop = window.innerHeight / 2;
    let startNoInput = document.getElementById('startnumber');
    let endNoInput = document.getElementById('endnumber');

    // set default values in HTML inputs
    startNoInput.value = app.startNumber;
    endNoInput.value = app.endNumber;


    document.getElementById('button-run').addEventListener('click', function(){
        app.startTime = Date.now();
        app.updateStatusMessage('Running...');
        app.startNumber = parseInt(startNoInput.value);
        app.endNumber = parseInt(endNoInput.value);
        app.initState();
        app.addNextNumber(app.startNumber-1, startPosLeft, startPosTop)
    });
});

const app = {
    startNumber: 1,
    endNumber: 31**2,
    elementWidth: 34,
    elementHeight: 32,
    elementMargin: 5,
    container: document.getElementById('app'),
    primeNumberColor: '#d79045',
    startTime: 0,
}

app.initState = function() {
    // set variables to init state
    app.addLeft = 2;
    app.addRight = 1
    app.addDown = 2;
    app.addUp = 1;
    app.addedCount = 0;
    app.direction = 'right';

    // recreate app div to remove numbers
    document.body.removeChild(app.container);
    app.container = document.createElement('div');
    app.container.setAttribute('id', 'app');
    document.body.appendChild(app.container);
}

app.updateStatusMessage = function(message) {
    document.getElementById('message').innerHTML = message;
}

app.addNextNumber = async function(lastNumber, positionLeft, positionTop) {
    let nextNumber = lastNumber + 1;
    let el = document.createElement('div');
    el.classList.add('number');
    el.setAttribute('id', 'n-' + nextNumber);
    el.style.left = positionLeft + "px";
    el.style.top = positionTop + "px";
    el.innerHTML = nextNumber;
    app.container.appendChild(el);

    app.isPrimeNumber(nextNumber);

    if (nextNumber < app.endNumber) {
        // find next position
        let newLeft;
        let newTop;

        if (app.direction == 'right') {
            if (app.addedCount < app.addRight) {
                //console.log(nextNumber + ' go right');
                newLeft = positionLeft + app.elementWidth + app.elementMargin;
                newTop = positionTop;
            } else {
                app.direction = 'up';
                app.addedCount = 0;
                app.addRight = app.addRight + 2;
                newLeft = positionLeft;
                newTop = positionTop - app.elementHeight - app.elementMargin;
            }
        } else if (app.direction == 'up') {
            if (app.addedCount < app.addUp) {
                //console.log(nextNumber + ' go up');
                newLeft = positionLeft;
                newTop = positionTop - app.elementHeight - app.elementMargin;
            } else {
                app.direction = 'left';
                app.addedCount = 0;
                app.addUp = app.addUp + 2;
                newLeft = positionLeft - app.elementWidth - app.elementMargin;
                newTop = positionTop;
            }
        } else if (app.direction == 'left') {
            if (app.addedCount < app.addLeft) {
                //console.log('go left');
                newLeft = positionLeft - app.elementWidth - app.elementMargin;
                newTop = positionTop;
            } else {
                app.direction = 'down';
                app.addedCount = 0;
                app.addLeft = app.addLeft + 2;
                newLeft = positionLeft;
                newTop = positionTop + app.elementHeight + app.elementMargin;
            }
        } else if (app.direction == 'down') {
            if (app.addedCount < app.addDown) {
                //console.log('go down');
                newLeft = positionLeft;
                newTop = positionTop + app.elementHeight + app.elementMargin;
            } else {
                app.direction = 'right';
                app.addedCount = 0;
                app.addDown = app.addDown + 2;
                newLeft = positionLeft + app.elementWidth + app.elementMargin;
                newTop = positionTop;
            }
        }

        app.addedCount++;
        app.addNextNumber(nextNumber, newLeft, newTop);
    } else {
        let countNumbers = app.container.getElementsByClassName('number').length;
        app.updateStatusMessage('Added ' + countNumbers + ' numbers');
    }
}

app.isPrimeNumber = function(number) {
    if (window.Worker) {
        app.numberWorker.postMessage(number);
    } else {
        alert('Your browser is not supported');
    }
}

// define a web worker for calculating prime numbers
app.numberWorker = new Worker('primeNumber.js');
app.numberWorker.onmessage = function(event) {
//    console.log(event.data[0]); // true if this is a prime number
//    console.log(event.data[1]); // the number

    // if number is a prime number
    if (event.data[0] === true) {
        let el = document.getElementById('n-' + event.data[1]);
        el.classList.add('prime-number');
        el.style.backgroundColor = app.primeNumberColor;
    }

    // if number is the last number, print stats.
    if (event.data[1] == app.endNumber) {
        let countPrimeNumbers = app.container.getElementsByClassName('prime-number').length;
        let runTime = Date.now() - app.startTime;
        app.updateStatusMessage('Found ' + countPrimeNumbers + ' prime numbers in ' + Math.floor(runTime / 1000) + ' seconds');

    }
};
app.numberWorker.onerror = function(event) {
    console.log('Web worker error ', event);
}

