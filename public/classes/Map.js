export default class Map {
    constructor(scene) {
        this.scene = scene; // Referencia a la escena de Phaser
        this.baseTileSize = 60; // Tamaño base fijo de cada casilla
        this.map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 1, 1, 1, 4, 4, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        ];

        // Calcular dimensiones totales del mapa
        this.mapWidth = this.map[0].length;
        this.mapHeight = this.map.length;

        // Calcular el tamaño de las casillas y la posición basado en el ancho del dispositivo
        this.calculateMapDimensions();

        // Escuchar el evento de cambio de tamaño de pantalla
        this.scene.scale.on('resize', this.handleResize, this);
    }

    // Método para calcular dimensiones del mapa
    calculateMapDimensions() {
        const gameWidth = this.scene.scale.width;
        const gameHeight = this.scene.scale.height;

        // Calcular el factor de escala para que el mapa completo quepa en la pantalla
        // Dejamos un margen del 5% en cada lado
        const scaleX = (gameWidth * 0.9) / (this.mapWidth * this.baseTileSize);
        const scaleY = (gameHeight * 0.9) / (this.mapHeight * this.baseTileSize);

        // Usar el factor de escala más pequeño para mantener la proporción
        this.scale = Math.min(scaleX, scaleY);

        // Calcular el tamaño de casilla escalado
        this.tileSize = this.baseTileSize * this.scale;

        // Calcular las coordenadas de inicio para centrar el mapa
        this.offsetX = (gameWidth - (this.mapWidth * this.tileSize)) / 2;
        this.offsetY = (gameHeight - (this.mapHeight * this.tileSize)) / 2;
    }

    // Manejar el redimensionamiento de la pantalla
    handleResize() {
        this.calculateMapDimensions();
        this.create();
    }

    // Método para crear el mapa
    create() {
        // Limpiar el mapa existente si lo hay
        this.clearMap();

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
                    case 7:
                        texture = 'guardia';
                        break;
                    case 8:
                        texture = 'guardia2';
                        break;
                    default:
                        texture = 'grass'; // Casillas con decoraciones siguen mostrando grass
                }

                // Calcular la posición con el offset para centrar el mapa
                const x = this.offsetX + (col * this.tileSize);
                const y = this.offsetY + (row * this.tileSize);

                const tile = this.scene.add.image(x, y, texture)
                    .setOrigin(0, 0)
                    .setDisplaySize(this.tileSize, this.tileSize);

                // Si es grass, hacer interactivo
                if (this.map[row][col] === 1) {
                    tile.setInteractive();
                    // Guardar referencia a fila y columna para usar en el evento
                    tile.row = row;
                    tile.col = col;

                    tile.on('pointerdown', () => {
                        const towerCost = 20; // Costo de cada torre
                        if (this.scene.currencyManager.canAfford(towerCost)) {
                            if (this.scene.tower.placeTower(col, row)) {
                                this.scene.currencyManager.spend(towerCost);
                                this.scene.colocarTorre(col, row, 'tower'); // Notificar al servidor
                                // Notificar al servidor del gasto
                                this.scene.gastarMonedas(towerCost);
                            }
                        } else {
                            // Mostrar feedback de que no hay suficientes monedas
                            const feedback = this.scene.add.text(
                                x + this.tileSize / 2,
                                y - 20,
                                '¡No hay suficientes monedas!',
                                { fontSize: '16px', fill: '#ff0000' }
                            ).setOrigin(0.5);

                            this.scene.tweens.add({
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
    }

    // Método para limpiar el mapa existente
    clearMap() {
        // Eliminar todas las imágenes del mapa de la escena
        const children = this.scene.children.getChildren();
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].texture &&
                ['path', 'grass', 'base', 'water'].includes(children[i].texture.key)) {
                children[i].destroy();
            }
        }
    }

    // Método para obtener la posición en pantalla de una casilla
    getTilePosition(row, col) {
        return {
            x: this.offsetX + (col * this.tileSize) + (this.tileSize / 2),
            y: this.offsetY + (row * this.tileSize) + (this.tileSize / 2)
        };
    }

    // Método para generar la ruta de los enemigos
    createPath() {
        const path = [];
        const rows = this.map.length;
        const cols = this.map[0].length;

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
            // Obtener posición en pantalla para este punto
            const position = this.getTilePosition(currentRow, currentCol);

            // Agregar la posición a la ruta
            path.push({ x: position.x, y: position.y });

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