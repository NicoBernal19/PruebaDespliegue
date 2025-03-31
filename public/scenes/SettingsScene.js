export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' });
    }

    preload() {
        // Cargar la imagen de fondo para ajustes
        this.load.image('settings_background', 'assets/ajustes.jpeg');
    }

    create() {
        // Obtener dimensiones de la pantalla
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Calcular escala proporcional
        this.scaleRatio = Math.min(width / 1280, height / 720);

        // Añadir imagen de fondo
        const background = this.add.image(width / 2, height / 2, 'settings_background')
            .setDisplaySize(width, height);

        // Título
        const titleStyle = {
            font: `bold ${Math.max(24, Math.floor(36 * this.scaleRatio))}px Arial`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        };
        this.add.text(width / 2, height * 0.15, 'AJUSTES', titleStyle)
            .setOrigin(0.5);

        // Obtener estado actual de la música
        const music = this.registry.get('backgroundMusic');
        const isMusicPlaying = music && music.volume > 0;

        // Crear el botón de música
        this.createMusicToggle(width / 2, height * 0.4, isMusicPlaying);

        // Botón para volver al menú
        this.createBackButton(width / 2, height * 0.7);
    }

    createMusicToggle(x, y, initialState) {
        const music = this.registry.get('backgroundMusic');

        // Etiqueta
        this.add.text(x, y - 40, 'Música', {
            font: `bold ${Math.max(18, Math.floor(24 * this.scaleRatio))}px Arial`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Crear fondo del botón
        const button = this.add.graphics();
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = x - buttonWidth / 2;
        const buttonY = y - buttonHeight / 2;

        // Función para actualizar visual del botón
        const updateButtonVisual = (isOn) => {
            button.clear();

            // Fondo del botón
            button.fillStyle(0xA67C52, 1);
            button.lineStyle(3, 0x664433, 1);
            button.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
            button.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

            // Texto del botón
            if (this.buttonText) this.buttonText.destroy();

            this.buttonText = this.add.text(x, y, isOn ? 'ON 🔊' : 'OFF 🔇', {
                font: `bold ${Math.max(16, Math.floor(22 * this.scaleRatio))}px Arial`,
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
        };

        // Dibujar estado inicial
        updateButtonVisual(initialState);

        // Hacer interactivo
        const hitArea = new Phaser.Geom.Rectangle(buttonX, buttonY, buttonWidth, buttonHeight);
        button.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => {
                if (!music) return;

                const newState = music.volume < 0.1;

                // Actualizar el registro global con la elección del usuario
                this.registry.set('musicMutedByUser', !newState);

                if (newState) {
                    // Activar música
                    this.tweens.add({
                        targets: music,
                        volume: 0.4,
                        duration: 500
                    });
                } else {
                    // Silenciar música
                    this.tweens.add({
                        targets: music,
                        volume: 0,
                        duration: 500
                    });
                }

                // Actualizar visual
                updateButtonVisual(newState);
            });
    }

    createBackButton(x, y) {
        const buttonWidth = 180;
        const buttonHeight = 50;
        const buttonX = x - buttonWidth / 2;
        const buttonY = y - buttonHeight / 2;

        // Crear fondo del botón
        const button = this.add.graphics();
        button.fillStyle(0xA67C52, 1);
        button.lineStyle(3, 0x664433, 1);
        button.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        button.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // Texto del botón
        this.add.text(x, y, 'Volver', {
            font: `bold ${Math.max(16, Math.floor(22 * this.scaleRatio))}px Arial`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Hacer interactivo
        const hitArea = new Phaser.Geom.Rectangle(buttonX, buttonY, buttonWidth, buttonHeight);
        button.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => {
                this.scene.start('MenuScene');
            });
    }
}