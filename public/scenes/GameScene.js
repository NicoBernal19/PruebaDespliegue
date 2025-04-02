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
        this.load.image('path', 'assets/camino.png');
        this.load.image('base', 'assets/puerta.jpeg');
        this.load.image('tower', 'assets/tower.png');
        this.load.image('enemy', 'assets/monster.png');
        this.load.image('water', 'assets/agua.jpg');
        this.load.image('tree', 'assets/arbol.png');
        this.load.image('rock', 'assets/roca.png');
        this.load.image('bush', 'assets/casa.png');
        this.load.image('projectile', 'assets/projectile.png');
        this.load.image('coin', 'assets/coin.png')
        this.load.image('guardia', 'assets/guardia.png');
        this.load.image('guardia2', 'assets/guardia2.png');
        this.load.image('fondoguerra', 'assets/fondoguerra.jpg');
    }

    create() {
        // Hacer que las funciones de socket sean accesibles desde otras clases
        this.colocarTorre = colocarTorre;
        this.gastarMonedas = gastarMonedas;

        // Añadir imagen de fondo
        const background = this.add.image(0, 0, 'fondoguerra')
            .setOrigin(0, 0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Ajustar el fondo para que se mantenga en la capa inferior
        background.setDepth(-10);

        // Crear el gestor de monedas
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

        // Añadir bosque en la esquina superior izquierda
        this.decorations.addTree(0, 0);
        this.decorations.addTree(0, 1);
        this.decorations.addTree(0, 2);
        this.decorations.addTree(0, 3);
        this.decorations.addTree(1, 0);
        this.decorations.addTree(1, 1);
        this.decorations.addTree(1, 2);
        this.decorations.addTree(2, 0);
        this.decorations.addTree(2, 1);
        this.decorations.addTree(2, 2);
        this.decorations.addTree(3, 1);
        this.decorations.addTree(3, 2);
        // Añadir bosque en la parte inferior derecha
        this.decorations.addTree(9, 26);
        this.decorations.addTree(9, 27);
        this.decorations.addTree(9, 28);
        this.decorations.addTree(10, 25);
        this.decorations.addTree(10, 26);
        this.decorations.addTree(10, 27);
        this.decorations.addTree(10, 28);
        this.decorations.addTree(10, 29);
        this.decorations.addTree(11, 24);
        this.decorations.addTree(11, 25);
        this.decorations.addTree(11, 26);
        this.decorations.addTree(11, 27);
        this.decorations.addTree(11, 28);
        this.decorations.addTree(11, 29);
        this.decorations.addTree(11, 30);
        this.decorations.addTree(12, 23);
        this.decorations.addTree(12, 24);
        this.decorations.addTree(12, 25);
        this.decorations.addTree(12, 26);
        this.decorations.addTree(12, 27);
        this.decorations.addTree(12, 28);
        this.decorations.addTree(12, 29);
        this.decorations.addTree(13, 25);
        this.decorations.addTree(13, 26);
        this.decorations.addTree(13, 27);
        this.decorations.addTree(13, 28);
        // Añadir grupos de casas
        // Grupo 1 - cerca del centro
        this.decorations.addBush(4, 16);
        this.decorations.addBush(4, 17);
        this.decorations.addBush(5, 15);
        this.decorations.addBush(5, 16);
        this.decorations.addBush(5, 17);
        this.decorations.addBush(5, 18);
        this.decorations.addBush(6, 15);
        this.decorations.addBush(6, 16);
        this.decorations.addBush(6, 17);
        this.decorations.addBush(6, 18);
        this.decorations.addBush(7, 16);
        this.decorations.addBush(7, 17);
        // Grupo 2 - lado izquierdo
        this.decorations.addBush(10, 2);
        this.decorations.addBush(10, 3);
        this.decorations.addBush(11, 1);
        this.decorations.addBush(11, 2);
        this.decorations.addBush(11, 3);
        this.decorations.addBush(11, 4);
        this.decorations.addBush(12, 1);
        this.decorations.addBush(12, 2);
        this.decorations.addBush(12, 3);
        this.decorations.addBush(12, 4);
        this.decorations.addBush(13, 2);
        this.decorations.addBush(13, 3);
        this.decorations.addGuard(15,22);
        this.decorations.addGuard2(15,24);

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

        // Texto para mostrar la oleada actual (fijar a la cámara con setScrollFactor)
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

            // Contador de enemigos restantes (fijar a la cámara)
            if (!this.enemigosText) {
                this.enemigosText = this.add.text(20, 50, 'Enemigos: 0', {
                    fontSize: '24px',
                    fill: '#ffffff',
                    backgroundColor: '#000000'
                }).setScrollFactor(0);
            }

            // Temporizador entre oleadas (fijar a la cámara)
            if (!this.temporizadorText) {
                this.temporizadorText = this.add.text(20, 80, 'Siguiente oleada: -', {
                    fontSize: '24px',
                    fill: '#ffff00',
                    backgroundColor: '#000000'
                }).setScrollFactor(0);
            }

            // Mostrar anuncio de oleada (en el centro de la pantalla)
            const anuncio = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                `¡Oleada ${oleada}!`,
                { fontSize: '48px', fill: '#ff0000' }
            ).setOrigin(0.5).setScrollFactor(0);

            this.tweens.add({
                targets: anuncio,
                alpha: 0,
                duration: 3000,
                onComplete: () => anuncio.destroy()
            });

            // Actualizar texto de oleada
            this.oleadaText.setText(`Oleada: ${oleada}`);
        });

        // Escuchar eventos de enemigos restantes
        onEnemigosRestantes((cantidad) => {
            if (this.enemigosText) {
                this.enemigosText.setText(`Enemigos: ${cantidad}`);
            }
        });

        // Escuchar eventos de temporizador
        onTemporizadorOleada((segundos) => {
            if (this.temporizadorText) {
                if (segundos > 0) {
                    this.temporizadorText.setText(`Siguiente oleada: ${segundos}s`);
                    this.temporizadorText.setVisible(true);
                } else {
                    this.temporizadorText.setVisible(false);
                }
            }
        });
    }

    update() {
        // Actualizar la posición de los monstruos
        this.enemyManager.update();

        // Actualizar los proyectiles
        this.tower.update();
    }
}