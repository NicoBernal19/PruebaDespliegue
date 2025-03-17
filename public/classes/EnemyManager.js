import Enemy from './Enemy.js';

export default class EnemyManager {
    constructor(scene, map) {
        this.scene = scene; // Referencia a la escena de Phaser
        this.map = map;     // Referencia al mapa
        this.enemies = [];  // Lista de monstruos
        this.path = this.createPath(); // Generar la ruta
        this.wave = 1;      // Número de monstruos por oleada
    }

    // Método para generar la ruta
    createPath() {
        const path = [];
        const rows = this.map.map.length;
        const cols = this.map.map[0].length;
        const tileSize = this.map.tileSize;

        // Encontrar el punto de inicio (primera casilla de tipo 0)
        let startRow = -1;
        let startCol = -1;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (this.map.map[row][col] === 0) {
                    startRow = row;
                    startCol = col;
                    break;
                }
            }
            if (startRow !== -1) break;
        }

        // Si no se encontró un punto de inicio, retornar una ruta vacía
        if (startRow === -1 || startCol === -1) return path;

        // Seguir el camino desde el punto de inicio
        let currentRow = startRow;
        let currentCol = startCol;
        let previousRow = -1;
        let previousCol = -1;

        while (true) {
            // Agregar la posición actual a la ruta
            path.push({ x: currentCol * tileSize + tileSize / 2, y: currentRow * tileSize + tileSize / 2 });

            // Verificar si llegamos a la base (casilla de tipo 2)
            if (this.map.map[currentRow][currentCol] === 2) break;

            // Buscar la siguiente casilla en el camino
            let nextRow = -1;
            let nextCol = -1;

            // Verificar las casillas adyacentes (arriba, abajo, izquierda, derecha)
            if (currentRow > 0 && this.map.map[currentRow - 1][currentCol] === 0 && (currentRow - 1 !== previousRow || currentCol !== previousCol)) {
                nextRow = currentRow - 1;
                nextCol = currentCol;
            } else if (currentRow < rows - 1 && this.map.map[currentRow + 1][currentCol] === 0 && (currentRow + 1 !== previousRow || currentCol !== previousCol)) {
                nextRow = currentRow + 1;
                nextCol = currentCol;
            } else if (currentCol > 0 && this.map.map[currentRow][currentCol - 1] === 0 && (currentRow !== previousRow || currentCol - 1 !== previousCol)) {
                nextRow = currentRow;
                nextCol = currentCol - 1;
            } else if (currentCol < cols - 1 && this.map.map[currentRow][currentCol + 1] === 0 && (currentRow !== previousRow || currentCol + 1 !== previousCol)) {
                nextRow = currentRow;
                nextCol = currentCol + 1;
            }

            // Si no se encontró una siguiente casilla, salir del bucle
            if (nextRow === -1 || nextCol === -1) break;

            // Actualizar la posición actual y la anterior
            previousRow = currentRow;
            previousCol = currentCol;
            currentRow = nextRow;
            currentCol = nextCol;
        }

        return path;
    }

    // Método para generar oleadas de monstruos
    spawnEnemies() {
        setInterval(() => {
            for (let i = 0; i < this.wave; i++) {
                const enemy = new Enemy(this.scene, this.path);
                this.enemies.push(enemy);
            }
            this.wave++; // Aumentar el número de monstruos en la siguiente oleada
        }, 5000); // Generar una oleada cada 5 segundos
    }

    // Método para actualizar la posición de los monstruos
    update() {
        this.enemies.forEach(enemy => enemy.update());
    }
}