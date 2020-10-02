class Game {

    constructor() {
        this._objects = [];
        this._player = new Enemy(this);
        this._enemy = new Enemy(this);
        this._ball = new Ball(this);
        // Frametime of the simulation -> 1000/FPS
        this.__MS_PER_UPDATE = 20;
        this._lag = 0.0;
        this._setup();
    }

    _setup() {
        this._enemy._setRight();
        this.addObject(this._enemy);
        this._player._setLeft();
        this.addObject(this._player);
        this.addObject(this._ball);
    }

    start() {
        window.requestAnimationFrame(timeStamp => {
            this._prevTime = timeStamp;
            this._gameloop(timeStamp);
        });
    }

    /**
     * Main game loop running the game
     * Inspired by: https://gameprogrammingpatterns.com/game-loop.html
     *
     * @param timeStamp timestamp when entering the loop
     * @private
     */
    _gameloop(timeStamp) {
        let currentTime = timeStamp;
        let elapsedTime = currentTime - this._prevTime;
        this._prevTime = currentTime;
        this._lag += elapsedTime;

        while (this._lag > this.__MS_PER_UPDATE) {
            this._update();
            this._lag -= this.__MS_PER_UPDATE;
        }
        this._draw((this._lag / this.__MS_PER_UPDATE));

        window.requestAnimationFrame((timeStamp) => this._gameloop(timeStamp));

    }

    addObject(gameObject) {
        this._objects.push(gameObject);
    }

    _update() {
        this._objects.forEach(o => {
            if(o.update != null) {
                o.update();
            }
        });
    }


    _draw(lagCoef) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        this._objects.forEach(o => {
            if(o.draw != null) {
                o.draw(lagCoef);
            }
        });
    }
}
