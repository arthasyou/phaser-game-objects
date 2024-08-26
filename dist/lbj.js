import { Math as PhaserMath } from 'phaser';
export class SlotMachine {
    constructor(scene, layout, imagePaths) {
        Object.defineProperty(this, "isSpinning", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "symbols", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "mask", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "imagePaths", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "layout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maskShape", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.scene = scene;
        this.layout = layout;
        this.imagePaths = imagePaths;
    }
    preload() {
        this.imagePaths.forEach((path, index) => {
            this.scene.load.image(`symbol${index}`, path);
        });
    }
    create() {
        const initialX = 300;
        const initialY = 300;
        const symbolHeight = this.scene.textures.get('symbol0').getSourceImage().height;
        this.symbols = this.layout.map((row, rowIndex) => {
            return row.map((_, colIndex) => {
                const symbol = this.scene.add.image(initialX + colIndex * 100, initialY + rowIndex * symbolHeight, this.getRandomSymbolKey());
                return symbol;
            });
        });
        // 创建遮罩
        this.maskShape = this.scene.add.graphics();
        this.maskShape.fillStyle(0xffffff);
        this.maskShape.fillRect(initialX - 50, initialY - 50, 100, this.layout.length * symbolHeight);
        this.mask = this.maskShape.createGeometryMask();
        // 应用遮罩和深度
        this.symbols.flat().forEach(symbol => {
            symbol.setMask(this.mask);
            symbol.setDepth(1);
        });
        this.scene.input.on('pointerdown', this.startSpin.bind(this));
    }
    update() {
        if (this.isSpinning) {
            this.symbols.forEach(row => {
                row.forEach(symbol => {
                    symbol.y += 20;
                    if (symbol.y >= 300 + symbol.height) {
                        const newSymbolY = symbol.y - this.layout.length * symbol.height;
                        symbol.y = newSymbolY;
                        symbol.setTexture(this.getRandomSymbolKey());
                    }
                });
            });
        }
    }
    startSpin() {
        if (!this.isSpinning) {
            this.isSpinning = true;
            setTimeout(() => {
                this.stopSpinning();
            }, 5000); // 5秒后停止
        }
    }
    stopSpinning() {
        this.isSpinning = false;
        // 确保每个符号都对齐到最近的整数位置
        this.symbols.flat().forEach(symbol => {
            const offset = symbol.y % symbol.height;
            symbol.y -= offset;
        });
        // 处理停止旋转后的逻辑
    }
    getRandomSymbolKey() {
        const randomIndex = PhaserMath.Between(0, this.imagePaths.length - 1);
        return `symbol${randomIndex}`;
    }
}
