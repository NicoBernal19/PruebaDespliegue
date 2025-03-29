import {dispararProyectil} from "../services/socketService";
import Projectile from "./Projectile";

export default class Tower {
    constructor(scene, map) {
        this.scene = scene; // Referencia a la escena de Phaser
        this.map = map;     // Referencia al mapa
        this.range = 100;  // Rango de ataque de la torre
        this.projectiles = []; // Lista de proyectiles activos
        this.cooldown = 5000; // Tiempo de espera entre disparos (en ms)
        this.lastShot = 0;  // Tiempo del último disparo
        this.towers = [];   // Lista de torres colocadas
    }

    // Método para colocar una torre
    placeTower(col, row) {
        if (this.map.getTileValue(row, col) === 1) {
            // Primero crear la base de pasto (si no existe ya)
            const grass = this.scene.add.image(
                col * this.map.tileSize + this.map.tileSize / 2,
                row * this.map.tileSize + this.map.tileSize / 2,
                'grass'
            )
                .setOrigin(0.5, 0.5)
                .setDisplaySize(this.map.tileSize, this.map.tileSize)
                .setAlpha(0.8); // Hacer el pasto un poco transparente

            // Luego crear la torre encima
            const tower = this.scene.add.image(
                col * this.map.tileSize + this.map.tileSize / 2,
                row * this.map.tileSize + this.map.tileSize / 2,
                'tower'
            )
                .setOrigin(0.5, 0.5)
                .setDisplaySize(this.map.tileSize, this.map.tileSize);

            // Marcar la casilla como ocupada
            this.map.setTileValue(row, col, 3);

            // Agregar la torre a la lista
            this.towers.push({
                sprite: tower,
                base: grass, // Guardar referencia a la base de pasto
                lastShot: 0
            });

            // Iniciar el sistema de disparo para esta torre
            this.scene.time.addEvent({
                delay: 500, // Verificar cada 100 ms
                callback: () => this.updateTower(tower),
                loop: true
            });
        }
    }

    // Método para actualizar el estado de la torre
    updateTower(tower) {
        const now = this.scene.time.now;
        const towerData = this.towers.find(t => t.sprite === tower);

        // Verificar si la torre puede disparar
        if (now - this.lastShot < this.cooldown) return;

        // Buscar enemigos dentro del rango
        const enemyManager = this.scene.enemyManager;
        const target = enemyManager.enemies.find(enemy => {
            const dx = enemy.sprite.x - tower.x;
            const dy = enemy.sprite.y - tower.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= this.range;
        });

        if (target) {
            // Disparar un proyectil
            const projectile = new Projectile(this.scene, tower.x, tower.y, target);
            this.projectiles.push(projectile);

            // Notificar al servidor sobre el disparo
            dispararProyectil(tower.x, tower.y, target.sprite.texture.key);

            // Actualizar el tiempo del último disparo
            towerData.lastShot = now;
        }
    }

    // Método para actualizar los proyectiles
    update() {
        this.projectiles.forEach(projectile => projectile.update());
        this.projectiles = this.projectiles.filter(projectile => projectile.sprite.active);
    }
}