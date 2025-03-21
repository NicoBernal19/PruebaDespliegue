export default class Map {
    constructor(scene) {
        this.scene = scene; // Referencia a la escena de Phaser
        this.tileSize = 60; // Tamaño de cada casilla
        this.map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 1, 1, 1, 4, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
    }

    // Método para crear el mapa
    create() {
        for (let row = 0; row < this.map.length; row++) {
            for (let col = 0; col < this.map[row].length; col++) {
                let texture;
                switch (this.map[row][col]) {
                    case 0:
                        texture = 'path';
                        break;
                    case 1:
                        texture = 'grass';
                        break;
                    case 2:
                        texture = 'base';
                        break;
                    case 4:
                        texture = 'water';
                        break;
                    default:
                        texture = 'grass'; // Casillas con decoraciones siguen mostrando grass
                }
                this.scene.add.image(col * this.tileSize, row * this.tileSize, texture)
                    .setOrigin(0, 0)
                    .setDisplaySize(this.tileSize, this.tileSize);
            }
        }
    }

    // Método para generar la ruta de los enemigos
    createPath() {
        const path = [];
        const rows = this.map.length;
        const cols = this.map[0].length;
        const tileSize = this.tileSize;

        // Encontrar el punto de inicio (primera casilla de tipo 0)
        let startRow = -1;
        let startCol = -1;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (this.map[row][col] === 0) {
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
            if (this.map[currentRow][currentCol] === 2) break;

            // Buscar la siguiente casilla en el camino
            let nextRow = -1;
            let nextCol = -1;

            // Verificar las casillas adyacentes (arriba, abajo, izquierda, derecha)
            if (currentRow > 0 && this.map[currentRow - 1][currentCol] === 0 && (currentRow - 1 !== previousRow || currentCol !== previousCol)) {
                nextRow = currentRow - 1;
                nextCol = currentCol;
            } else if (currentRow < rows - 1 && this.map[currentRow + 1][currentCol] === 0 && (currentRow + 1 !== previousRow || currentCol !== previousCol)) {
                nextRow = currentRow + 1;
                nextCol = currentCol;
            } else if (currentCol > 0 && this.map[currentRow][currentCol - 1] === 0 && (currentRow !== previousRow || currentCol - 1 !== previousCol)) {
                nextRow = currentRow;
                nextCol = currentCol - 1;
            } else if (currentCol < cols - 1 && this.map[currentRow][currentCol + 1] === 0 && (currentRow !== previousRow || currentCol + 1 !== previousCol)) {
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

    // Método para obtener el valor de una casilla
    getTileValue(row, col) {
        return this.map[row][col];
    }

    // Método para marcar una casilla como ocupada
    setTileValue(row, col, value) {
        this.map[row][col] = value;
    }
}