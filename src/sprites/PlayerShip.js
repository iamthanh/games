import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor({game, x, y, asset}) {
        super(game, x, y, asset)
        this.anchor.set(0.5);

        game.input.mouse.capture = true;
    }

    update() {
        // Move the space ship on mouse click down
        if (game.input.activePointer.leftButton.isDown) {
            this.rotation = game.physics.arcade.moveToPointer(this, 60, game.input.activePointer, 500);
        }
    }
}