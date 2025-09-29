

class PixelArtEditor {
            constructor() {
                this.gridSize = 24;
                this.pixelSize = 20;
                this.currentColor = '#000000';
                this.currentTool = 'draw';
                this.isDrawing = false;
                this.canvas = null;
                this.pixelData = {};
                
                this.colors = [
                    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
                    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
                    '#FFC0CB', '#A52A2A', '#808080', '#90EE90', '#87CEEB'
                ];
                
                this.init();
            }
            
            init() {
                this.createColorPalette();
                this.createCanvas();
                this.setupEventListeners();
            }
            
            createColorPalette() {
                const palette = document.getElementById('colorPalette');
                
                this.colors.forEach((color, index) => {
                    const swatch = document.createElement('div');
                    swatch.className = 'color-swatch';
                    swatch.style.backgroundColor = color;
                    if (index === 0) swatch.classList.add('active');
                    
                    swatch.addEventListener('click', () => {
                        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                        swatch.classList.add('active');
                        this.currentColor = color;
                    });
                    
                    palette.appendChild(swatch);
                });
            }
            
            createCanvas() {
                const container = document.getElementById('pixelCanvas');
                container.innerHTML = '';
                
                const canvas = document.createElement('div');
                canvas.style.display = 'grid';
                canvas.style.gridTemplateColumns = `repeat(${this.gridSize}, ${this.pixelSize}px)`;
                canvas.style.gridTemplateRows = `repeat(${this.gridSize}, ${this.pixelSize}px)`;
                canvas.style.gap = '1px';
                canvas.style.padding = '10px';
                canvas.style.backgroundColor = '#ddd';
                canvas.style.border = '2px solid #999';
                canvas.style.userSelect = 'none';
                
                this.pixelData = {};
                
                for (let y = 0; y < this.gridSize; y++) {
                    for (let x = 0; x < this.gridSize; x++) {
                        const pixel = document.createElement('div');
                        pixel.style.width = `${this.pixelSize}px`;
                        pixel.style.height = `${this.pixelSize}px`;
                        pixel.style.backgroundColor = '#ffffff';
                        pixel.style.border = '1px solid #eee';
                        pixel.style.cursor = 'crosshair';
                        pixel.dataset.x = x;
                        pixel.dataset.y = y;
                        
                        // Mouse events for drawing
                        pixel.addEventListener('mousedown', (e) => this.startDrawing(e, x, y));
                        pixel.addEventListener('mouseenter', (e) => this.continuDrawing(e, x, y));
                        pixel.addEventListener('mouseup', () => this.stopDrawing());
                        
                        // Touch events for mobile
                        pixel.addEventListener('touchstart', (e) => {
                            e.preventDefault();
                            this.startDrawing(e, x, y);
                        });
                        
                        pixel.addEventListener('touchmove', (e) => {
                            e.preventDefault();
                            const touch = e.touches[0];
                            const element = document.elementFromPoint(touch.clientX, touch.clientY);
                            if (element && element.dataset.x !== undefined) {
                                this.continuDrawing(e, parseInt(element.dataset.x), parseInt(element.dataset.y));
                            }
                        });
                        
                        canvas.appendChild(pixel);
                    }
                }
                
                container.appendChild(canvas);
                this.canvas = canvas;
                
                // Global mouse up to stop drawing
                document.addEventListener('mouseup', () => this.stopDrawing());
            }
            
            startDrawing(e, x, y) {
                this.isDrawing = true;
                this.drawPixel(x, y);
            }
            
            continuDrawing(e, x, y) {
                if (this.isDrawing) {
                    this.drawPixel(x, y);
                }
            }
            
            stopDrawing() {
                this.isDrawing = false;
            }
            
            drawPixel(x, y) {
                const pixel = this.canvas.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                if (!pixel) return;
                
                if (this.currentTool === 'draw') {
                    pixel.style.backgroundColor = this.currentColor;
                    this.pixelData[`${x},${y}`] = this.currentColor;
                } else if (this.currentTool === 'erase') {
                    pixel.style.backgroundColor = '#ffffff';
                    delete this.pixelData[`${x},${y}`];
                }
            }
            
            clearCanvas() {
                this.pixelData = {};
                const pixels = this.canvas.querySelectorAll('[data-x]');
                pixels.forEach(pixel => {
                    pixel.style.backgroundColor = '#ffffff';
                });
            }
            
            saveDesign() {
                const design = {
                    gridSize: this.gridSize,
                    pixelData: this.pixelData,
                    timestamp: new Date().toISOString()
                };
                
                const dataStr = JSON.stringify(design, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                
                const link = document.createElement('a');
                link.href = url;
                link.download = 'tamagotchi-design.json';
                link.click();
                
                URL.revokeObjectURL(url);
                alert('Design saved! You can load it later.');
            }
            
            loadExampleDesign() {
                // Create a simple smiley face example
                const example = {
                    // Eyes
                    '7,8': '#000000', '9,8': '#000000',
                    '14,8': '#000000', '16,8': '#000000',
                    // Smile
                    '8,14': '#000000', '9,15': '#000000', '10,16': '#000000',
                    '11,16': '#000000', '12,16': '#000000', '13,15': '#000000', '14,14': '#000000',
                    // Face outline
                    '6,6': '#000000', '7,5': '#000000', '8,4': '#000000', '9,4': '#000000',
                    '10,4': '#000000', '11,4': '#000000', '12,4': '#000000', '13,4': '#000000',
                    '14,5': '#000000', '15,6': '#000000', '16,7': '#000000', '17,8': '#000000',
                    '17,9': '#000000', '17,10': '#000000', '17,11': '#000000', '17,12': '#000000',
                    '16,13': '#000000', '15,14': '#000000', '6,13': '#000000', '5,12': '#000000',
                    '5,11': '#000000', '5,10': '#000000', '5,9': '#000000', '5,8': '#000000', '6,7': '#000000'
                };
                
                this.clearCanvas();
                
                Object.entries(example).forEach(([coord, color]) => {
                    const [x, y] = coord.split(',').map(Number);
                    this.pixelData[coord] = color;
                    const pixel = this.canvas.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                    if (pixel) {
                        pixel.style.backgroundColor = color;
                    }
                });
            }
            
            setupEventListeners() {
                document.getElementById('drawTool').addEventListener('click', () => {
                    this.currentTool = 'draw';
                    document.getElementById('drawTool').classList.add('active');
                    document.getElementById('eraseTool').classList.remove('active');
                });
                
                document.getElementById('eraseTool').addEventListener('click', () => {
                    this.currentTool = 'erase';
                    document.getElementById('eraseTool').classList.add('active');
                    document.getElementById('drawTool').classList.remove('active');
                });
                
                document.getElementById('clearBtn').addEventListener('click', () => {
                    if (confirm('Clear all pixels?')) {
                        this.clearCanvas();
                    }
                });
                
                document.getElementById('gridSize').addEventListener('change', (e) => {
                    this.gridSize = parseInt(e.target.value);
                    this.createCanvas();
                });
                
                document.getElementById('saveBtn').addEventListener('click', () => {
                    this.saveDesign();
                });
                
                document.getElementById('loadBtn').addEventListener('click', () => {
                    this.loadExampleDesign();
                });
            }
        }
 // Wait for DOM to be ready before initializing
document.addEventListener('DOMContentLoaded', () => {
    const editor = new PixelArtEditor();
});       
