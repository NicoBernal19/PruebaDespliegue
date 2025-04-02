export default class Enemy {
    constructor(scene, path, id) {
        this.scene = scene; // Referencia a la escena de Phaser
        this.path = path;   // Ruta que el monstruo debe seguir
        this.currentPoint = 0; // Índice del punto actual en la ruta
        this.id = id || Date.now(); // Identificador único

        // Crear el sprite del monstruo en el primer punto del camino
        this.sprite = this.scene.add.sprite(
            this.path[0].x,
            this.path[0].y,
            'enemy'
        );

        // Escalar el sprite al tamaño de las casillas
        this.sprite.setDisplaySize(this.scene.map.tileSize, this.scene.map.tileSize);
    }

    // Este método ya no se usa para mover, solo para limpiar enemigos eliminados
    update() {
        // No actualizamos el movimiento aquí, ahora viene del servidor
    }

    // Método para actualizar la posición según los datos del servidor
    updatePosition(x, y, currentPoint) {
        // Convertir coordenadas del servidor a coordenadas de pantalla
        const screenX = this.scene.map.offsetX + (x * this.scene.map.scale);
        const screenY = this.scene.map.offsetY + (y * this.scene.map.scale);

        this.sprite.x = screenX;
        this.sprite.y = screenY;
        this.currentPoint = currentPoint;
    }

    // Método para eliminar al monstruo
    destroy() {
        this.sprite.destroy();
    }
}