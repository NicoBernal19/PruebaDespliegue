import Enemy from './Enemy.js';
import { onEnemyPositionUpdated, onEnemyReachedBase } from '../services/socketService.js';

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

        // Escuchar actualizaciones de posición desde el servidor
        onEnemyPositionUpdated((data) => {
            const { id, x, y, currentPoint } = data;
            const enemy = this.enemies.find(e => e.id === id);
            if (enemy) {
                enemy.updatePosition(x, y, currentPoint);
            }
        });

        // Escuchar cuando un enemigo llega a la base
        onEnemyReachedBase((enemyId) => {
            this.removeEnemy(enemyId);
            // Aquí podrías añadir lógica para reducir vidas o puntos
        });
    }

    addEnemy(enemigo) {
        const path = this.map.createPath(); // Obtener la ruta del cliente
        const enemy = new Enemy(this.scene, path, enemigo.id);

        // Guardar información de oleada si existe
        if (enemigo.oleada) {
            enemy.oleada = enemigo.oleada;
        }

        // Si el servidor proporciona una posición inicial, usarla
        if (enemigo.x !== undefined && enemigo.y !== undefined) {
            enemy.sprite.x = enemigo.x;
            enemy.sprite.y = enemigo.y;
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

    // El método update ahora solo verifica enemigos eliminados
    update() {
        // Ya no actualizamos el movimiento aquí
        this.enemies = this.enemies.filter(e => e.sprite.active);
        this.verificarFinOleada();
    }
}