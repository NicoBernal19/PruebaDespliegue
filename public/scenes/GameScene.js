import { colocarTorre, onTorreColocada, onTorresActualizadas, onNuevoEnemigo, onEnemigoEliminado, onNuevaOleada, onEnemigosRestantes, onTemporizadorOleada, gastarMonedas, onActualizarMonedas } from '../services/socketService.js';
import Map from '../classes/Map.js';
import Tower from '../classes/Tower.js';
import Enemy from '../classes/Enemy.js';
import EnemyManager from '../classes/EnemyManager.js';
import Decorations from '../classes/Decorations.js';
import CurrencyManager from "../classes/CurrencyManager";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Cargar recursos
        this.load.image('grass', 'assets/grass.jpg');
        this.load.image('path', 'assets/path.jpg');
        this.load.image('base', 'assets/castilloFondo.png');
        this.load.image('tower', 'assets/tower.png');
        this.load.image('enemy', 'assets/monster.png');
        this.load.image('water', 'assets/water.jpg');
        this.load.image('tree', 'assets/tree.png');
        this.load.image('rock', 'assets/rock.png');
        this.load.image('bush', 'assets/bush.png');
        this.load.image('projectile', 'assets/projectile.png');
        this.load.image('coin', 'assets/coin.png')
    }

    create() {
        this.currencyManager = new CurrencyManager(this, 100); // 100 monedas iniciales

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
                        const towerCost = 20; // Costo de cada torre
                        if (this.currencyManager.canAfford(towerCost)) {
                            if (this.tower.placeTower(col, row)) {
                                this.currencyManager.spend(towerCost);
                                colocarTorre(col, row, 'tower'); // Notificar al servidor
                                // Notificar al servidor del gasto
                                gastarMonedas(towerCost);
                            }
                        } else {
                            // Mostrar feedback de que no hay suficientes monedas
                            const feedback = this.add.text(
                                col * this.map.tileSize + this.map.tileSize / 2,
                                row * this.map.tileSize - 20,
                                '¡No hay suficientes monedas!',
                                { fontSize: '16px', fill: '#ff0000' }
                            ).setOrigin(0.5);

                            this.tweens.add({
                                targets: feedback,
                                y: feedback.y - 30,
                                alpha: 0,
                                duration: 1000,
                                onComplete: () => feedback.destroy()
                            });
                        }
                    });
                }
            }
        }
        // Escuchar actualizaciones de monedas desde el servidor
        onActualizarMonedas((amount) => {
            this.currencyManager.amount = amount;
            this.currencyManager.updateUI();
        });

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

        // Texto para mostrar la oleada actual
        this.oleadaText = this.add.text(20, 20, 'Oleada: 0', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        }).setScrollFactor(0);

        // Escuchar actualizaciones de oleada
        onNuevaOleada((oleada) => {
            console.log("Nueva oleada recibida:", oleada);
            this.enemyManager.oleadaActual = oleada;
            this.enemyManager.oleadaEnCurso = true;

            // Actualizar UI si es necesario
            if (this.oleadaText) {
                this.oleadaText.setText(`Oleada: ${oleada}`);
            }

            // Contador de enemigos restantes
            this.enemigosText = this.add.text(20, 50, 'Enemigos: 0', {
                fontSize: '24px',
                fill: '#ffffff',
                backgroundColor: '#000000'
            }).setScrollFactor(0);

            // Temporizador entre oleadas
            this.temporizadorText = this.add.text(20, 80, 'Siguiente oleada: -', {
                fontSize: '24px',
                fill: '#ffff00',
                backgroundColor: '#000000'
            }).setScrollFactor(0);

            // Escuchar eventos del servidor
            onNuevaOleada((oleada) => {
                this.oleadaActual = oleada;
                this.oleadaText.setText(`Oleada: ${oleada}`);

                // Mostrar anuncio de oleada
                const anuncio = this.add.text(
                    this.cameras.main.width / 2,
                    this.cameras.main.height / 2,
                    `¡Oleada ${oleada}!`,
                    { fontSize: '48px', fill: '#ff0000' }
                ).setOrigin(0.5);

                this.tweens.add({
                    targets: anuncio,
                    alpha: 0,
                    duration: 3000,
                    onComplete: () => anuncio.destroy()
                });
            });

            onEnemigosRestantes((cantidad) => {
                this.enemigosText.setText(`Enemigos: ${cantidad}`);
            });

            onTemporizadorOleada((segundos) => {
                if (segundos > 0) {
                    this.temporizadorText.setText(`Siguiente oleada: ${segundos}s`);
                    this.temporizadorText.setVisible(true);
                } else {
                    this.temporizadorText.setVisible(false);
                }
            });
        });
    }

    update() {
        // Actualizar la posición de los monstruos
        this.enemyManager.update();

        // Actualizar los proyectiles
        this.tower.update();
    }
}