export default class Tower {
    constructor(scene, map) {
        this.scene = scene; // Referencia a la escena de Phaser
        this.map = map;     // Referencia al mapa
    }

    // Método para colocar una torre
    placeTower(col, row) {
        if (this.map.getTileValue(row, col) === 1) {
            // Colocar la torre
            this.scene.add.image(
                col * this.map.tileSize + this.map.tileSize / 2,
                row * this.map.tileSize + this.map.tileSize / 2,
                'tower'
            )
                .setOrigin(0.5, 0.5)
                .setDisplaySize(this.map.tileSize, this.map.tileSize);

            // Marcar la casilla como ocupada
            this.map.setTileValue(row, col, 3);
        }
    }
}