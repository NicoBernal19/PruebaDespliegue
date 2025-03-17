import GameScene from './scenes/GameScene.js';

// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [GameScene],
};

// Crear una instancia del juego
const game = new Phaser.Game(config);