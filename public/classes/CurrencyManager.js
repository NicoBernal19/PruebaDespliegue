export default class CurrencyManager {
    constructor(scene, initialAmount = 100) {
        this.scene = scene;
        this.amount = initialAmount;
        this.container = null;
        this.createUI();
    }

    createUI() {
        // Eliminar elementos previos si existen
        if (this.container) this.container.destroy();

        // Crear un contenedor para agrupar todos los elementos
        this.container = this.scene.add.container(
            this.scene.cameras.main.width - 20,
            50
        ).setScrollFactor(0).setDepth(1000);

        // Fondo del panel con bordes redondeados
        const bg = this.scene.add.graphics()
            .fillStyle(0x000000, 0.7)
            .fillRoundedRect(-200, -25, 200, 50, 10);

        // Icono de moneda (asegúrate de tener 'coin' en tus assets)
        const coinIcon = this.scene.add.image(-160, 0, 'coin')
            .setScale(0.7)
            .setOrigin(0.5);

        // Efecto brillo para el icono
        const shine = this.scene.add.graphics()
            .fillStyle(0xFFFFFF, 0.3)
            .fillEllipse(-160, -10, 25, 10);

        // Texto de monedas con estilo mejorado
        const text = this.scene.add.text(-120, 0, this.amount.toString(), {
            fontSize: '28px',
            fill: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0, 0.5);

        // Añadir sombra al texto
        const textShadow = this.scene.add.text(-120, 2, this.amount.toString(), {
            fontSize: '28px',
            fill: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5).setAlpha(0.6);

        // Agregar todos los elementos al contenedor
        this.container.add([bg, coinIcon, shine, textShadow, text]);

        // Guardar referencias para actualización
        this.coinIcon = coinIcon;
        this.text = text;
        this.textShadow = textShadow;
    }

    updateUI() {
        if (this.text) {
            const amountStr = this.amount.toString();
            this.text.setText(amountStr);
            this.textShadow.setText(amountStr);

            // Animación al cambiar
            this.scene.tweens.add({
                targets: [this.coinIcon, this.text],
                scale: 1.1,
                duration: 100,
                yoyo: true,
                ease: 'Sine.easeOut'
            });

            // Efecto de parpadeo para cambios grandes
            if (this.lastAmount && Math.abs(this.amount - this.lastAmount) > 20) {
                this.scene.tweens.add({
                    targets: this.text,
                    alpha: 0.3,
                    duration: 80,
                    yoyo: true,
                    repeat: 2
                });
            }
            this.lastAmount = this.amount;
        }
    }

    canAfford(cost) {
        return this.amount >= cost;
    }

    spend(cost) {
        if (this.canAfford(cost)) {
            this.amount -= cost;
            this.updateUI();
            return true;
        }
        return false;
    }

    add(amount) {
        this.amount += amount;
        this.updateUI();
    }
}