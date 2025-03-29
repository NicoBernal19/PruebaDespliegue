import Enemy from './Enemy.js';

export default class EnemyManager {
    constructor(scene, map) {
        this.scene = scene; // Referencia a la escena de Phaser
        this.map = map;     // Referencia al mapa
        this.enemies = [];  // Lista de monstruos
        this.oleadaActual = 0;
        this.oleadaEnCurso = false;

        // Escuchar eventos de oleadas
        this.scene.events.on('nueva-oleada', (oleada) => {
            this.oleadaActual = oleada;
            this.oleadaEnCurso = true;
            console.log(`Oleada ${oleada} iniciada`);
        });
    }

    addEnemy(enemigo) {
        const path = this.map.createPath(); // Usar createPath() de Map
        const enemy = new Enemy(this.scene, path, enemigo.id);
        // Guardar información de oleada si existe
        if (enemigo.oleada) {
            enemy.oleada = enemigo.oleada;
        }
        this.enemies.push(enemy);
    }


    // Método para manejar el fin de oleada
    verificarFinOleada() {
        const enemigosActivos = this.enemies.filter(e => e.sprite.active);
        if (enemigosActivos.length === 0 && this.oleadaEnCurso) {
            this.scene.events.emit('oleada-completada');
            this.oleadaEnCurso = false;
        }
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
        this.enemies = this.enemies.filter(e => e.sprite.active);
        this.verificarFinOleada();
    }
}