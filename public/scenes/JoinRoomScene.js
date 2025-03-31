import { joinRoom } from '../services/socketService.js';

export default class JoinRoomScene extends Phaser.Scene {
    constructor() {
        super({ key: 'JoinRoomScene' });
        this.inputCode = ''; // Código ingresado por el usuario
    }

    preload() {
        // Cargar imagen de fondo
        this.load.image('join_background', 'assets/sala.jpeg');
    }

    create() {
        // Obtener dimensiones de la pantalla
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Calcular escala proporcional
        this.scaleRatio = Math.min(width / 1280, height / 720);

        // Añadir imagen de fondo
        const background = this.add.image(width / 2, height / 2, 'join_background')
            .setDisplaySize(width, height);

        // Título
        const titleStyle = {
            font: `bold ${Math.max(24, Math.floor(36 * this.scaleRatio))}px Arial`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        };
        this.add.text(width / 2, height * 0.15, 'UNIRSE A SALA', titleStyle)
            .setOrigin(0.5);

        // Instrucción
        this.add.text(width / 2, height * 0.25, 'Introduce el código de la sala:', {
            font: `${Math.max(18, Math.floor(24 * this.scaleRatio))}px Arial`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Campo de entrada del código
        const inputFieldWidth = 300;
        const inputFieldHeight = 60;
        const inputFieldX = width / 2 - inputFieldWidth / 2;
        const inputFieldY = height * 0.35;

        // Fondo del campo de entrada
        const inputBackground = this.add.graphics();
        inputBackground.fillStyle(0x222222, 0.8);
        inputBackground.fillRect(inputFieldX, inputFieldY, inputFieldWidth, inputFieldHeight);
        inputBackground.lineStyle(3, 0xffffff, 1);
        inputBackground.strokeRect(inputFieldX, inputFieldY, inputFieldWidth, inputFieldHeight);

        // Texto que mostrará el código ingresado
        this.codeText = this.add.text(width / 2, inputFieldY + inputFieldHeight / 2, '', {
            font: `bold ${Math.max(24, Math.floor(32 * this.scaleRatio))}px monospace`,
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Mensaje de error (inicialmente oculto)
        this.errorMessage = this.add.text(width / 2, height * 0.47, '', {
            font: `${Math.max(16, Math.floor(18 * this.scaleRatio))}px Arial`,
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setVisible(false);

        // Crear teclado virtual para códigos
        this.createVirtualKeyboard(width, height);

        // Botón para unirse a la sala con el código ingresado
        this.createButton(
            width * 0.85,
            height * 0.9, // Posición ajustada para que no se superponga al teclado
            'Unirse',
            () => this.joinRoom()
        );

        // Botón para volver
        this.createButton(
            width * 0.15,
            height * 0.9,
            'Volver',
            () => this.scene.start('LobbyScene')
        );
    }

    createVirtualKeyboard(width, height) {
        const keys = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
            'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
            'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
            'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'  // ⌫ es la tecla de retroceso
        ];

        const keySize = Math.min(50, width * 0.05);
        const keySpacing = Math.min(10, width * 0.01);
        const keyboardWidth = keySize * 10 + keySpacing * 9;  // 10 teclas en la fila más larga
        const keyboardX = width / 2 - keyboardWidth / 2;
        const keyboardY = height * 0.5; // Ajustado a 0.5 de la altura

        // Crear las teclas
        let currentX = keyboardX;
        let currentY = keyboardY;
        let keysInRow = 10;  // Primera fila tiene 10 teclas

        keys.forEach((key, index) => {
            // Cambiar de fila cuando sea necesario
            if (index === 10) {  // Segunda fila empieza después de la tecla 10
                currentX = keyboardX;
                currentY += keySize + keySpacing;
                keysInRow = 10;
            } else if (index === 20) {  // Tercera fila empieza después de la tecla 20
                currentX = keyboardX + keySize / 2;  // Centrar las teclas
                currentY += keySize + keySpacing;
                keysInRow = 9;
            } else if (index === 29) {  // Cuarta fila empieza después de la tecla 29
                currentX = keyboardX + keySize;  // Centrar las teclas
                currentY += keySize + keySpacing;
                keysInRow = 8;
            }

            // Crear el fondo de la tecla
            const keyBackground = this.add.graphics();
            keyBackground.fillStyle(0xaaaaaa, 1);
            keyBackground.fillRoundedRect(currentX, currentY, keySize, keySize, 5);
            keyBackground.lineStyle(2, 0x000000, 1);
            keyBackground.strokeRoundedRect(currentX, currentY, keySize, keySize, 5);

            // Texto de la tecla
            const keyText = this.add.text(currentX + keySize / 2, currentY + keySize / 2, key, {
                font: `${Math.max(14, Math.floor(16 * this.scaleRatio))}px Arial`,
                fill: '#000000'
            }).setOrigin(0.5);

            // Hacer la tecla interactiva
            const keyInteractive = this.add.rectangle(currentX + keySize / 2, currentY + keySize / 2, keySize, keySize)
                .setInteractive()
                .on('pointerdown', () => {
                    if (key === '⌫') {
                        // Borrar último carácter
                        this.inputCode = this.inputCode.slice(0, -1);
                    } else if (this.inputCode.length < 6) {
                        // Añadir carácter si no hay más de 6
                        this.inputCode += key;
                    }
                    // Actualizar texto
                    this.codeText.setText(this.inputCode);
                    // Ocultar mensaje de error si hay
                    this.errorMessage.setVisible(false);
                });

            // Avanzar a la siguiente posición
            currentX += keySize + keySpacing;

            // Cambio visual al pulsar
            keyInteractive.on('pointerdown', () => {
                keyBackground.clear();
                keyBackground.fillStyle(0x888888, 1);
                keyBackground.fillRoundedRect(keyInteractive.x - keySize / 2, keyInteractive.y - keySize / 2, keySize, keySize, 5);
                keyBackground.lineStyle(2, 0x000000, 1);
                keyBackground.strokeRoundedRect(keyInteractive.x - keySize / 2, keyInteractive.y - keySize / 2, keySize, keySize, 5);
            });

            keyInteractive.on('pointerup', () => {
                keyBackground.clear();
                keyBackground.fillStyle(0xaaaaaa, 1);
                keyBackground.fillRoundedRect(keyInteractive.x - keySize / 2, keyInteractive.y - keySize / 2, keySize, keySize, 5);
                keyBackground.lineStyle(2, 0x000000, 1);
                keyBackground.strokeRoundedRect(keyInteractive.x - keySize / 2, keyInteractive.y - keySize / 2, keySize, keySize, 5);
            });

            keyInteractive.on('pointerout', () => {
                keyBackground.clear();
                keyBackground.fillStyle(0xaaaaaa, 1);
                keyBackground.fillRoundedRect(keyInteractive.x - keySize / 2, keyInteractive.y - keySize / 2, keySize, keySize, 5);
                keyBackground.lineStyle(2, 0x000000, 1);
                keyBackground.strokeRoundedRect(keyInteractive.x - keySize / 2, keyInteractive.y - keySize / 2, keySize, keySize, 5);
            });
        });
    }

    createButton(x, y, text, callback) {
        const buttonWidth = 220;
        const buttonHeight = 50;
        const buttonX = x - buttonWidth / 2;
        const buttonY = y - buttonHeight / 2;

        // Crear fondo del botón
        const button = this.add.graphics();
        button.fillStyle(0xA67C52, 1);
        button.lineStyle(3, 0x664433, 1);
        button.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        button.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // Agregar borde interior
        const borderThickness = Math.max(1, Math.floor(2 * this.scaleRatio));
        const borderOffset = Math.max(2, Math.floor(3 * this.scaleRatio));
        button.lineStyle(borderThickness, 0xD4A76A, 1);
        button.strokeRect(
            buttonX + borderOffset,
            buttonY + borderOffset,
            buttonWidth - (borderOffset * 2),
            buttonHeight - (borderOffset * 2)
        );

        // Texto del botón
        this.add.text(x, y, text, {
            font: `bold ${Math.max(16, Math.floor(22 * this.scaleRatio))}px Arial`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Hacer interactivo
        const hitArea = new Phaser.Geom.Rectangle(buttonX, buttonY, buttonWidth, buttonHeight);
        button.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => {
                // Efecto de botón presionado
                button.clear();
                button.fillStyle(0x7A5C32, 1);
                button.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
                button.lineStyle(3, 0x664433, 1);
                button.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

                // Llamar al callback después de un pequeño retraso
                this.time.delayedCall(150, callback);
            })
            .on('pointerover', () => {
                // Efecto hover
                button.clear();
                button.fillStyle(0xBB9062, 1);
                button.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
                button.lineStyle(3, 0x664433, 1);
                button.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
                button.lineStyle(borderThickness, 0xD4A76A, 1);
                button.strokeRect(
                    buttonX + borderOffset,
                    buttonY + borderOffset,
                    buttonWidth - (borderOffset * 2),
                    buttonHeight - (borderOffset * 2)
                );
            })
            .on('pointerout', () => {
                // Restaurar estado normal
                button.clear();
                button.fillStyle(0xA67C52, 1);
                button.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
                button.lineStyle(3, 0x664433, 1);
                button.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
                button.lineStyle(borderThickness, 0xD4A76A, 1);
                button.strokeRect(
                    buttonX + borderOffset,
                    buttonY + borderOffset,
                    buttonWidth - (borderOffset * 2),
                    buttonHeight - (borderOffset * 2)
                );
            });
    }

    async joinRoom() {
        // Validar que el código tenga el formato correcto
        if (this.inputCode.length !== 6) {
            this.showError('El código debe tener 6 caracteres');
            return;
        }

        try {
            // Intentar unirse a la sala usando el servicio de socket
            const roomData = await joinRoom(this.inputCode);

            // Si tiene éxito, ir a la sala
            this.scene.start('RoomCreationScene', {
                isJoining: true,
                roomCode: roomData.roomCode
            });
        } catch (error) {
            // Mostrar mensaje de error
            this.showError(error.message || 'Error al unirse a la sala');
        }
    }

    showError(message) {
        this.errorMessage.setText(message);
        this.errorMessage.setVisible(true);
    }
}