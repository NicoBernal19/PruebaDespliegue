export default class Decorations {
    constructor(scene, map) {
        this.scene = scene; // Referencia a la escena de Phaser
        this.map = map;     // Referencia al mapa
    }

    // Método para agregar un árbol
    addTree(row, col) {
        const tree = this.scene.add.image(
            col * this.map.tileSize + this.map.tileSize / 2,
            row * this.map.tileSize + this.map.tileSize / 2,
            'tree'
        );
        tree.setOrigin(0.5, 0.5);
        tree.setDisplaySize(this.map.tileSize, this.map.tileSize);

        // Marcar la casilla como no disponible para torres
        this.map.setTileValue(row, col, 4); // 4 representa una casilla con un árbol
    }

    // Método para agregar una roca
    addRock(row, col) {
        const rock = this.scene.add.image(
            col * this.map.tileSize + this.map.tileSize / 2,
            row * this.map.tileSize + this.map.tileSize / 2,
            'rock'
        );
        rock.setOrigin(0.5, 0.5);
        rock.setDisplaySize(this.map.tileSize, this.map.tileSize);

        // Marcar la casilla como no disponible para torres
        this.map.setTileValue(row, col, 5); // 5 representa una casilla con una roca
    }

    // Método para agregar un arbusto
    addBush(row, col) {
        const bush = this.scene.add.image(
            col * this.map.tileSize + this.map.tileSize / 2,
            row * this.map.tileSize + this.map.tileSize / 2,
            'bush'
        );
        bush.setOrigin(0.5, 0.5);
        bush.setDisplaySize(this.map.tileSize, this.map.tileSize);

        // Marcar la casilla como no disponible para torres
        this.map.setTileValue(row, col, 6); // 6 representa una casilla con un arbusto
    }
}