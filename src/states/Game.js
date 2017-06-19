/* globals __DEV__ */
import Phaser from 'phaser'
import Planet from '../objects/Planet'

export default class extends Phaser.State {
    init() {
        console.info('Init Game state');
        this.MAX_STARS_COUNT = 500;
    }

    preload() {
    }

    create() {
       this.addStars(this.MAX_STARS_COUNT);
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
            x: Math.floor(Math.random() * (game.width - 1)),
            y: Math.floor(Math.random() * (game.height - 1))
        }
    }

    /**
     * Get a random shade of white/black for the color of the stars
     */
    getRandomStarColor() {
        var val = Math.floor(Math.random() * (255 - 1));
        var hex = val.toString(16);
        hex = hex.length == 1 ? "0" + hex : hex;

        return "0x" + hex + hex + hex;
    }

    /**
     *
     */
    getRandomStarSize() {
        return Math.floor(Math.random() * (6 - 1));
    }

    render() {
        if (__DEV__) {
            // this.game.debug.spriteInfo(this.mushroom, 32, 32)
        }
    }
}
