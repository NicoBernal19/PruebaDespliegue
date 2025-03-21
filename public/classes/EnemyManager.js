import Enemy from './Enemy.js';

export default class EnemyManager {
    constructor(scene, map) {
        this.scene = scene; // Referencia a la escena de Phaser
        this.map = map;     // Referencia al mapa
        this.enemies = [];  // Lista de monstruos
        // this.path = this.createPath(); // Generar la ruta
        // this.wave = 1;      // Número de monstruos por oleada
    }

    addEnemy(enemigo) {
        const path = this.map.createPath(); // Usar createPath() de Map
        const enemy = new Enemy(this.scene, path, enemigo.id);
        this.enemies.push(enemy);
    }

    removeEnemy(enemigoId) {
        const enemy = this.enemies.find(e => e.id === enemigoId);
        if (enemy) {
            enemy.destroy();
            this.enemies = this.enemies.filter(e => e.id !== enemigoId);
        }
    }

    // Método para actualizar la posición de los monstruos
    update() {
        this.enemies.forEach(enemy => enemy.update());
    }
}