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

    // // Colores para cada tipo de casilla
    // const colors = {
    //     0: 0x666666, // Camino (gris)
    //     1: 0x00ff00, // Espacio vacío (verde)
    //     2: 0xff0000, // Base (rojo)
    // };

    // // Dibujar el mapa
    // for (let row = 0; row < map.length; row++) {
    //     for (let col = 0; col < map[row].length; col++) {
    //         const tile = this.add.rectangle(
    //             col * tileSize + tileSize / 2, // Posición X
    //             row * tileSize + tileSize / 2, // Posición Y
    //             tileSize, // Ancho
    //             tileSize, // Alto
    //             colors[map[row][col]] // Color
    //         );
    //         tile.setOrigin(0.5); // Centrar el rectángulo
    //     }
    // }

    // Dibujar el mapa con texturas
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            let texture;
            switch (map[row][col]) {
                case 0:
                    texture = 'path'; // Camino
                    break;
                case 1:
                    texture = 'grass'; // Espacio vacío
                    break;
                case 2:
                    texture = 'base'; // Base
                    break;
            }
            this.add.image(col * tileSize, row * tileSize, texture)
                .setOrigin(0, 0)
                .setDisplaySize(tileSize, tileSize); // Escalar la imagen
        }
    }
}