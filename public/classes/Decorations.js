export default class Decorations {
    constructor(scene, map) {
        this.scene = scene; // Referencia a la escena de Phaser
        this.map = map;     // Referencia al mapa
    }

    // Método para agregar un árbol
    addTree(row, col) {
        // Obtener la posición en la pantalla para esta casilla
        const position = this.map.getTilePosition(row, col);

        const tree = this.scene.add.image(
            position.x,
            position.y,
            'tree'
        );
        tree.setOrigin(0.5, 0.5);
        tree.setDisplaySize(this.map.tileSize, this.map.tileSize);

        // Marcar la casilla como no disponible para torres
        this.map.setTileValue(row, col, 4); // 4 representa una casilla con un árbol
    }

    // Método para agregar una roca
    addRock(row, col) {
        // Obtener la posición en la pantalla para esta casilla
        const position = this.map.getTilePosition(row, col);

        const rock = this.scene.add.image(
            position.x,
            position.y,
            'rock'
        );
        rock.setOrigin(0.5, 0.5);
        rock.setDisplaySize(this.map.tileSize, this.map.tileSize);

        // Marcar la casilla como no disponible para torres
        this.map.setTileValue(row, col, 5); // 5 representa una casilla con una roca
    }

    // Método para agregar un arbusto
    addBush(row, col) {
        // Obtener la posición en la pantalla para esta casilla
        const position = this.map.getTilePosition(row, col);

        const bush = this.scene.add.image(
            position.x,
            position.y,
            'bush'
        );
        bush.setOrigin(0.5, 0.5);
        bush.setDisplaySize(this.map.tileSize, this.map.tileSize);

        // Marcar la casilla como no disponible para torres
        this.map.setTileValue(row, col, 6); // 6 representa una casilla con un arbusto
    }
}