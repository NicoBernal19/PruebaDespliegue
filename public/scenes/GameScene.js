import { colocarTorre, onTorreColocada, onTorresActualizadas, onNuevoEnemigo, onEnemigoEliminado } from '../services/socketService.js';
import Map from '../classes/Map.js';
import Tower from '../classes/Tower.js';
import Enemy from '../classes/Enemy.js';
import EnemyManager from '../classes/EnemyManager.js';
import Decorations from '../classes/Decorations.js';

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
        this.load.image('enemy', 'assets/monster.png');
        this.load.image('water', 'assets/water.jpg');
        this.load.image('tree', 'assets/tree.png');
        this.load.image('rock', 'assets/rock.png');
        this.load.image('bush', 'assets/bush.png');
        this.load.image('projectile', 'assets/projectile.png');
    }

    create() {
        // Crear el mapa
        this.map = new Map(this);
        this.map.create();

        // Crear el sistema de torres
        this.tower = new Tower(this, this.map);

        // Crear el sistema de enemigos
        this.enemyManager = new EnemyManager(this, this.map);

        // Crear el sistema de decoraciones
        this.decorations = new Decorations(this, this.map);

        // Añadir elementos decorativos
        this.decorations.addTree(2, 2);
        this.decorations.addTree(10, 6);
        this.decorations.addTree(3, 15);
        this.decorations.addRock(5, 5);
        this.decorations.addRock(5, 6);
        this.decorations.addRock(6, 5);
        this.decorations.addRock(7, 5);
        this.decorations.addBush(7, 19);

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
                        colocarTorre(col, row, 'tower'); // Notificar al servidor
                    });
                }
            }
        }
        // Escuchar el evento para actualizar torres
        onTorreColocada((data) => {
            const { x, y, tipo } = data;
            this.tower.placeTower(x, y); // Colocar la torre en la vista
        });

        // Escuchar el evento para recibir el estado inicial de las torres
        onTorresActualizadas((torres) => {
            torres.forEach(torre => {
                this.tower.placeTower(torre.x, torre.y); // Colocar las torres existentes
            });
        });

        // Escuchar el evento para nuevos enemigos
        onNuevoEnemigo((enemigo) => {
            this.enemyManager.addEnemy(enemigo);
        });

        // Escuchar el evento para enemigos eliminados
        onEnemigoEliminado((enemigoId) => {
            this.enemyManager.removeEnemy(enemigoId);
        });
    }

    update() {
        // Actualizar la posición de los monstruos
        this.enemyManager.update();

        // Actualizar los proyectiles
        this.tower.update();
    }
}