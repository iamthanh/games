import 'pixi'
import 'p2'
import Phaser from 'phaser'

/**
 * Import all of the states
 */
import BootState   from './states/Boot'
import SplashState from './states/Splash'
import GameState   from './states/Game'

import config from './config'

class Game extends Phaser.Game {
    constructor() {
        const docElement = document.documentElement
        const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
        const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

        // Init Phaser game object
        super(width, height, Phaser.CANVAS, 'game-container', null)

        /**
         * Adding all of the game states
         */
        this.state.add('Boot', BootState, false)
        this.state.add('Splash', SplashState, false)
        this.state.add('Game', GameState, false)

        // Start the first state, Boot
        this.state.start('Boot')
    }
}

window.game = new Game()
