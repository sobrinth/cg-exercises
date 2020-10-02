let key = {
    _pressed: {},
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
}

function isDown(keycode) {
    return key._pressed[keycode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
    console.log("KeyPressed: " + event.keyCode)
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}