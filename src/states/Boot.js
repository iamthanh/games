import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
    init() {
        console.info('Init Boot state');
        this.stage.backgroundColor = '#000000'
        this.fontsReady = false
        this.fontsLoaded = this.fontsLoaded.bind(this)
    }

    preload() {
        WebFont.load({
            google: {
                families: ['Bangers']
            },
            active: this.fontsLoaded
        })

        let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', {
            font: '16px Arial',
            fill: '#dddddd',
            align: 'center'
        })
        text.anchor.setTo(0.5, 0.5)



        this.load.image('loaderBg', './assets/images/loader-bg.png')
        this.load.image('loaderBar', './assets/images/loader-bar.png')
    }

    render() {
        // Start the Splash state once the fonts are ready
        if (this.fontsReady) {
            this.state.start('Splash')
        }
    }

    fontsLoaded() {
        this.fontsReady = true
    }
}
