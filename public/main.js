// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth, // Ancho del canvas igual al ancho de la ventana
    height: window.innerHeight, // Alto del canvas igual al alto de la ventana
    scene: {
        preload: preload,
        create: create,
    },
};

// Crear una instancia del juego
const game = new Phaser.Game(config);

// Función para cargar recursos
function preload() {
    // Cargar imágenes o assets si es necesario
    this.load.image('grass', 'assets/grass.jpg'); // Textura para espacios vacíos
    this.load.image('path', 'assets/path.jpg');   // Textura para el camino
    this.load.image('base', 'assets/castilloFondo.png');   // Textura para la base
    this.load.image('tower', 'assets/torre.png'); // Imagen de la torre
}

// Función para crear el mapa
function create() {
    // Tamaño de cada casilla del mapa
    const tileSize = 60;

    // Definir el mapa como una matriz
    const map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    // Dibujar el mapa
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            let texture;
            switch (map[row][col]) {
                case 0:
                    texture = 'path';
                    break;
                case 1:
                    texture = 'grass';
                    break;
                case 2:
                    texture = 'base';
                    break;
            }
            const tile = this.add.image(col * tileSize, row * tileSize, texture)
                .setOrigin(0, 0)
                .setDisplaySize(tileSize, tileSize);

            // Hacer las casillas de grass interactivas
            if (map[row][col] === 1) {
                tile.setInteractive(); // Hacer la casilla interactiva
                tile.on('pointerdown', () => {
                    placeTower.call(this, col, row); // Usar call para pasar el contexto correcto
                });
            }
        }
    }

    // Función para colocar una torre
    function placeTower(col, row) {
        // Verificar si ya hay una torre en esta casilla
        if (map[row][col] === 1) {
            // Colocar la torre
            this.add.image(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, 'tower')
                .setOrigin(0.5, 0.5)
                .setDisplaySize(tileSize, tileSize);

            // Marcar la casilla como ocupada (por ejemplo, con un valor 3)
            map[row][col] = 3;
        }
    }
}