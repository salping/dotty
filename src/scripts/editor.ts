export class Editor {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    grid: string[][];
    pixel_size: number;
    is_drawing: boolean;
    color: string;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, height: number, width: number) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.grid = this.create_pixel_grid(height, width);

        this.pixel_size = 10;
        this.is_drawing = false;
        this.color = "white";

        this.canvas.height = this.canvas.clientHeight;
        this.canvas.width = this.canvas.clientWidth;

        this.add_listeners();
    }

    add_listeners() {
        window.addEventListener("resize", () => {
            this.canvas.height = this.canvas.clientHeight;
            this.canvas.width = this.canvas.clientWidth;

            this.draw_pixels();
        })

        window.addEventListener("keypress", (e) => {
            if (e.key == "w") {
                this.pixel_size += 10;
            } else if (e.key == "s") {
                this.pixel_size -= 10;
            }

            this.draw_pixels();
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

        this.canvas.addEventListener("pointerup", (e) => {
            this.is_drawing = false;
        })

        this.canvas.addEventListener("pointerleave", () => {
            this.is_drawing = false;
        })
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let height = this.grid.length;
        let width = this.grid[0].length;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (this.grid[i][j] == "") {
                    this.ctx.fillStyle = "black";
                    this.ctx.fillRect(j * this.pixel_size, i * this.pixel_size, this.pixel_size, this.pixel_size);
                } else {
                    this.ctx.fillStyle = this.grid[i][j];
                    this.ctx.fillRect(j * this.pixel_size, i * this.pixel_size, this.pixel_size, this.pixel_size);
                }
            }
        }
    }

    set_pixel(x: number, y: number, color: string) {
        this.grid[y][x] = color;
    }

    // sets the global color variable
    set_color(color: string) {
        this.color = color;
    }

    handle_click(e: PointerEvent) {
        const rect = this.canvas.getBoundingClientRect();

        const process = (event: PointerEvent) => {
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

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

}