import Map from '../classes/Map.js';
import Tower from '../classes/Tower.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Cargar recursos
        this.load.image('grass', 'assets/grass.jpg');
        this.load.image('path', 'assets/path.jpg');
        this.load.image('base', 'assets/castilloFondo.png');
        this.load.image('tower', 'assets/torre.png');
    }

    create() {
        // Crear el mapa
        this.map = new Map(this);
        this.map.create();

        // Crear el sistema de torres
        this.tower = new Tower(this, this.map);

        // Hacer las casillas de grass interactivas
        for (let row = 0; row < this.map.map.length; row++) {
            for (let col = 0; col < this.map.map[row].length; col++) {
                if (this.map.getTileValue(row, col) === 1) {
                    const tile = this.add.image(col * this.map.tileSize, row * this.map.tileSize, 'grass')
                        .setOrigin(0, 0)
                        .setDisplaySize(this.map.tileSize, this.map.tileSize)
                        .setInteractive();

                    tile.on('pointerdown', () => {
                        this.tower.placeTower(col, row);
                    });
                }
            }
        }
    }
}