/* globals __DEV__ */
import Phaser from 'phaser'
import Planet from '../objects/Planet'

export default class extends Phaser.State {
    init() {
        console.info('Init Game state');

        // Defining some game variables/constants
        this.MAX_STARS_COUNT = 1000;
        this.GAME_BOUND_MAX_WIDTH = 2500;
        this.GAME_BOUND_MAX_HEIGHT = 2500;

        this.cursors = game.input.keyboard.createCursorKeys();
    }

    preload() {
        game.load.image('speedship','assets/images/ships/speedship.png');
    }

    create() {
        // Setting the total boundaries
        this.world.setBounds(0, 0, this.GAME_BOUND_MAX_WIDTH, this.GAME_BOUND_MAX_HEIGHT);
        this.addStars(this.MAX_STARS_COUNT);

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.player = this.add.sprite(this.world.centerX, this.world.centerY, 'speedship');
        this.physics.p2.enable(this.player);

        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        this.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    }

    update() {
        this.player.body.setZeroVelocity();

        if (this.cursors.up.isDown) {
            this.player.body.moveUp(300)
        } else if (this.cursors.down.isDown) {
            this.player.body.moveDown(300);
        }

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -300;
        } else if (this.cursors.right.isDown) {
            this.player.body.moveRight(300);
        }
    }

    /**
     * Generating and populating stars in the sky
     * @param max_stars
     */
    addStars(max_stars) {
        for (var i = 0; i < this.MAX_STARS_COUNT; i++) {
            this.drawStar(this.getRandomPosition(), this.getRandomStarSize(), this.getRandomStarColor());
        }
    }

    drawStar(star_position, star_size, star_color) {
        // Create the star using graphic's circle
        var star = game.add.graphics(star_position.x, star_position.y);
        star.lineStyle(0);
        star.beginFill(star_color, 1);
        star.drawCircle(0, 0, star_size);
        star.endFill();
    }

    getRandomPosition() {
        /** Using the game's width and height to get the random location */
        return {
            x: Math.floor(Math.random()*(this.GAME_BOUND_MAX_WIDTH+1)),
            y: Math.floor(Math.random()*(this.GAME_BOUND_MAX_HEIGHT+1))
        }
    }

    /** Get a random color for a star which will be either a shade of black/white or red/blue */
    getRandomStarColor() {
        // Choosing random between shade of black/white or red/blue
        var colorType = Math.floor(Math.random()*75);

        // 1/75 chance to be blue
        if (colorType == 74) {
            return "0x6666f7";
        }
        // 1/75 chance to be red/orange
        else if (colorType == 73) {
            return "0xff7c7c";
        }
        // 73/75 chance to be white <-> black
        else {
            var val = Math.floor(Math.random() * (255 + 1));
            var hex = val.toString(16);
            hex = hex.length == 1 ? "0" + hex : hex;

            return "0x" + hex + hex + hex;
        }
    }

    /**
     *
     */
    getRandomStarSize() {
        return Math.floor(Math.random() * (5) + 1);
    }

    render() {
        game.debug.cameraInfo(this.camera, 500, 32);
        if (__DEV__) {
            // this.game.debug.spriteInfo(this.mushroom, 32, 32)
        }
    }
}
