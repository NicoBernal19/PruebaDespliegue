export default class Enemy {
    constructor(scene, path, id) {
        this.scene = scene; // Referencia a la escena de Phaser
        this.path = path;   // Ruta que el monstruo debe seguir
        this.currentPoint = 0; // Índice del punto actual en la ruta
        this.speed = 1 * scene.map.scale; // Velocidad ajustada a la escala
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

    // Método para mover al monstruo
    update() {
        if (this.currentPoint < this.path.length - 1) {
            const nextPoint = this.path[this.currentPoint + 1];
            const dx = nextPoint.x - this.sprite.x;
            const dy = nextPoint.y - this.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > this.speed) {
                this.sprite.x += (dx / distance) * this.speed;
                this.sprite.y += (dy / distance) * this.speed;
            } else {
                this.sprite.x = nextPoint.x;
                this.sprite.y = nextPoint.y;
                this.currentPoint++;
            }
        } else {
            // El monstruo llegó a la base
            this.scene.events.emit('enemyReachedBase', this);
            this.destroy();
        }
    }

    // Método para eliminar al monstruo
    destroy() {
        this.sprite.destroy();
    }
}