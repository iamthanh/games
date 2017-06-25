/* globals __DEV__ */
import Phaser from 'phaser'
import Planet from '../objects/Planet'
import PlayerShip from '../sprites/PlayerShip'

export default class extends Phaser.State {
    init() {
        console.info('Init Game state');

        // Defining some game variables/constants
        this.MAX_STARS_COUNT = 1000;
        this.GAME_BOUND_MAX_WIDTH = 2500;
        this.GAME_BOUND_MAX_HEIGHT = 2500;

        this.tick = 0;

        // Travelling speed for the player's ship
        this.spaceship_speed = 200;
        this.spaceship_turn_rate = 5; // turn rate in degrees/frame
    }

    preload() {
        game.load.image('speedship','assets/images/ships/speedship.png');
        game.load.image('weapon', 'assets/images/weapons/shmup-bullet.png');
    }

    create() {
        // Setting the total boundaries
        this.world.setBounds(0, 0, this.GAME_BOUND_MAX_WIDTH, this.GAME_BOUND_MAX_HEIGHT);
        this.camera.x = (this.GAME_BOUND_MAX_WIDTH - this.camera.width) / 2 + 20;
        this.camera.y = (this.GAME_BOUND_MAX_HEIGHT - this.camera.height) / 2 + 20;

        // Adding random stars to the game
        this.addStars(this.MAX_STARS_COUNT);

        // Adding the weapon system
        this.addWeaponSystem();

        // Add the player's spaceship
        this.player_spaceship = this.addPlayerSpaceShip();
        this.game.add.existing(this.player_spaceship)

        // Adding arcade physics
        this.physics.arcade.enable(this.player_spaceship);

        this.player_spaceship.body.drag.set(500);
        this.player_spaceship.body.maxVelocity.set(200);

        //  Tell the Weapon to track the 'player' Sprite
        //  With no offsets from the position
        //  But the 'true' argument tells the weapon to track sprite rotation
        this.weapon.trackSprite(this.player_spaceship, 0, 0, true);

        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        this.camera.follow(this.player_spaceship, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);


        //  Tell it we don't want physics to manage the rotation
        this.player_spaceship.body.allowRotation = false;
    }

    addWeaponSystem() {
        // Space bar for firing weapon
        this.fire_btn = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        // Weapons systems variables
        this.weapon = this.add.weapon(30, 'weapon');

        //  The bullet will be automatically killed when it leaves the world bounds
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        //  The speed at which the bullet is fired
        this.weapon.bulletSpeed = 600;

        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        this.weapon.fireRate = 100;

        //  Add a variance to the bullet angle by +- this value
        this.weapon.bulletAngleVariance = 2;

        // Limiting the total amount bullets allowed
        this.weapon.fireLimit = 1000;

        this.weapon.fireFrom.x = 10;
        this.weapon.fireFrom.y = 100;
    }

    addPlayerSpaceShip() {
        return new PlayerShip({
            game: this,
            x: this.world.centerX,
            y: this.world.centerY,
            asset: 'speedship'
        })
    }

    update() {
        if (this.fire_btn.isDown) {
            this.weapon.trackRotation = false;
            this.weapon.fireAngle = this.player_spaceship.angle;
            this.weapon.fire();
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
        if (__DEV__) {
            game.debug.cameraInfo(this.camera, 500, 32);
            game.debug.spriteInfo(this.player_spaceship, 100, 100);
            game.debug.spriteCoords(this.player_spaceship, 50, 700);
            this.weapon.debug();
        }
    }
}
