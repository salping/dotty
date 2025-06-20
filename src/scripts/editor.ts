export class Editor {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    grid: string[][];
    pixel_size: number;
    is_drawing: boolean;
    is_pressing_space: boolean;
    color: string;
    offsetx: number;
    offsety: number;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, height: number, width: number) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.grid = this.create_pixel_grid(height, width);

        this.pixel_size = 10;
        this.is_drawing = false;
        this.is_pressing_space = false;
        this.color = "white";
        this.offsetx = 0;
        this.offsety = 0;

        this.canvas.height = this.canvas.clientHeight;
        this.canvas.width = this.canvas.clientWidth;

        const observer = new ResizeObserver(() => this.resize_canvas());
        observer.observe(this.canvas);


        this.add_listeners();
    }

    add_listeners() {
        window.addEventListener("keypress", (e) => {
            if (e.key == "z") {
                this.pixel_size += 2;
            } else if (e.key == "x") {
                this.pixel_size -= 2;
            } else if (e.key == "r") {
                this.offsetx = 0;
                this.offsety = 0;
            } else if (e.key == " ") {
                this.is_pressing_space = true;
            }

            this.draw_pixels();
        })

        window.addEventListener("keyup", (e) => {
            if (e.key == " ") {
                this.is_pressing_space = false;
            }
        })

        this.canvas.addEventListener("pointerdown", (e) => {
            if (e.button == 0) {
                this.is_drawing = true;
                this.handle_click(e);
            }
        })

        this.canvas.addEventListener("pointermove", (e) => {
            if (this.is_drawing) {
                this.handle_click(e);
            }
        })

        this.canvas.addEventListener("pointerup", () => {
            this.is_drawing = false;
        })

        this.canvas.addEventListener("pointerleave", () => {
            this.is_drawing = false;
        })

        this.canvas.addEventListener("wheel", (e) => {
            if (this.is_pressing_space) {
                e.preventDefault();
                this.handle_zoom(e);
            } else {
                this.handle_scroll(e);
            }
        }, { passive: false })
    }

    create_pixel_grid(x: number, y: number): string[][] {
        let tmp: string[][] = [];

        for (let i = 0; i < y; i++) {
            let tmp_sub: string[] = [];
            for (let j = 0; j < x; j++) {
                tmp_sub.push("");
            }
            tmp.push(tmp_sub);
        }

        return tmp;
    }

    draw_pixels() {
        this.ctx.fillStyle = "lightgrey";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        let height = this.grid.length;
        let width = this.grid[0].length;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (this.grid[i][j] == "") {
                    this.ctx.fillStyle = "black";
                    this.ctx.fillRect(j * this.pixel_size + this.offsetx, i * this.pixel_size + this.offsety, this.pixel_size, this.pixel_size);
                } else {
                    this.ctx.fillStyle = this.grid[i][j];
                    this.ctx.fillRect(j * this.pixel_size + this.offsetx, i * this.pixel_size + this.offsety, this.pixel_size, this.pixel_size);
                }
            }
        }
    }

    set_pixel(x: number, y: number, color: string) {
        this.grid[y][x] = color;
        this.draw_pixels();
    }

    // sets the global color variable
    set_color(color: string) {
        this.color = color;
        const colorElem = document.getElementById("current-color");
        if (colorElem) {
            colorElem.style.backgroundColor = color;
        } 
    }

    handle_click(e: PointerEvent) {
        const rect = this.canvas.getBoundingClientRect();

        const process = (event: PointerEvent) => {
            const x = event.clientX - rect.left - this.offsetx;
            const y = event.clientY - rect.top - this.offsety;

            const grid_x = Math.floor(x / this.pixel_size);
            const grid_y = Math.floor(y / this.pixel_size);

            if (
                grid_x >= 0 && grid_x < this.grid[0].length &&
                grid_y >= 0 && grid_y < this.grid.length
            ) {
                this.set_pixel(grid_x, grid_y, this.color);
            }
        };

        process(e);

        for (let i of e.getCoalescedEvents()) {
            process(i);
        }

        this.draw_pixels();
    }

    handle_scroll(e: WheelEvent) {
        this.offsetx -= Math.floor(e.deltaX / 2);
        this.offsety -= Math.floor(e.deltaY / 2);

        this.draw_pixels();
    }

    handle_zoom(e: WheelEvent) {
        e.preventDefault();

        const zoomSensitivity = 0.0015; // tweak this
        let zoomChange = -e.deltaY * zoomSensitivity;

        const oldPixelSize = this.pixel_size;
        const newPixelSize = Math.min(Math.max(oldPixelSize * (1 + zoomChange), 2), 100);

        // If no change, skip
        if (newPixelSize === oldPixelSize) return;

        // Get mouse position relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate the canvas coordinates under the mouse before zoom
        const canvasX = (mouseX - this.offsetx) / oldPixelSize;
        const canvasY = (mouseY - this.offsety) / oldPixelSize;

        // Calculate new offsets so that point under mouse stays in the same place
        this.offsetx = mouseX - canvasX * newPixelSize;
        this.offsety = mouseY - canvasY * newPixelSize;

        this.pixel_size = newPixelSize;

        this.draw_pixels();
    }

    resize_canvas = () => {
        const { clientWidth, clientHeight } = this.canvas;
        if (this.canvas.width !== clientWidth || this.canvas.height !== clientHeight) {
            this.canvas.width = clientWidth;
            this.canvas.height = clientHeight;
            this.draw_pixels();
        }
    };




}