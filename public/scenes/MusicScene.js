export default class MusicScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MusicScene' });
    }

    preload() {
        this.load.audio('background_music', 'assets/musicaDeFondo.m4a');
    }

    create() {
        // Verificar si ya existe una instancia de música
        let music = this.registry.get('backgroundMusic');

        // Si no existe, crearla
        if (!music) {
            // Preparar la música e iniciarla silenciada
            music = this.sound.add('background_music', {
                volume: 0,  // Iniciar con volumen 0
                loop: true
            });

            // Reproducir inmediatamente (permitido porque está silenciado)
            music.play();

            // Guardar referencia en el registro global
            this.registry.set('backgroundMusic', music);

            // Inicializar el estado de silenciado por usuario como falso
            this.registry.set('musicMutedByUser', false);

            // Crear un evento global para activar el audio
            this.game.events.once('global-interaction', () => {
                // Solo aumentar el volumen si el usuario no lo silenció intencionalmente
                if (!this.registry.get('musicMutedByUser')) {
                    this.tweens.add({
                        targets: music,
                        volume: 0.4,
                        duration: 1000
                    });
                }
            });
        }

        // Asegurarse de que la música siga reproduciéndose si la escena se reinicia
        if (music.isPaused) {
            music.resume();
        }
    }
}