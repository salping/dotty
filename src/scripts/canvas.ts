import { Editor } from "./editor";

const canvas = document.getElementById("editor") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const palette_select = document.getElementById("palette");
const tooltip = document.getElementById("tooltip");
const selected_color = document.getElementById("current-color");

function handle_color_change(e: Event) {
    const currentColor = document.getElementById("selected-color");
    if (currentColor) {
        currentColor.id = "";
    }

    e.currentTarget!.id = "selected-color"

    let col = e.currentTarget!.getAttribute("dotty-color");

    editor.set_color(col);

    hexInput.value = col;
    rInput.value = hexToRgb(col)?.r.toString()!;
    bInput.value = hexToRgb(col)?.b.toString()!;
    gInput.value = hexToRgb(col)?.g.toString()!;

    preview.style.backgroundColor = col;
}

function add_color(col: string) {
    palette.push(col)
}

let editor = new Editor(canvas, ctx, 8, 8);

editor.set_color("coral");

editor.draw_pixels();

window.editor = editor;

let palette = ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff"];
editor.set_color(palette[0] ? palette[0] : "#ffffff")

palette.forEach((e) => {
    let child = document.createElement("div");
    child.className = "palette-color";
    child.setAttribute("dotty-color", e);
    child.style.backgroundColor = e;
    child.addEventListener("click", (e) => handle_color_change(e));
    palette_select?.appendChild(child);

    child.addEventListener("mouseenter", () => {
        if (tooltip) {
            tooltip.innerText = `${e}\n${ntc.name(e)[1]}`;
            tooltip.style.display = "block";
            tooltip.style.opacity = "1";
        }
    })

    child.addEventListener("mousemove", (e) => {
        if (tooltip) {
            const mouseEvent = e as MouseEvent;

            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;

            const padding = 10; // Distance from cursor

            let left = mouseEvent.pageX + padding;
            let top = mouseEvent.pageY + padding;

            const maxLeft = window.innerWidth - tooltipWidth - padding;
            const maxTop = window.innerHeight - tooltipHeight - padding;

            if (left > maxLeft) left = mouseEvent.pageX - tooltipWidth - padding;
            if (top > maxTop) top = mouseEvent.pageY - tooltipHeight - padding;

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        }
    });


    child.addEventListener("mouseleave", () => {
        if (tooltip) {
            tooltip.style.display = "none";
            tooltip.style.opacity = "0";
        }
    })
})

console.log(selected_color);

if (selected_color) {
    selected_color.addEventListener("mouseenter", () => {
        if (tooltip) {
            tooltip.innerText = `${editor.color}\n${ntc.name(editor.color)[1]}`;
            tooltip.style.display = "block";
            tooltip.style.opacity = "1";
        }
    })

    selected_color.addEventListener("mousemove", (e) => {
        if (tooltip) {
            const mouseEvent = e as MouseEvent;

            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;

            const padding = 10; // Distance from cursor

            let left = mouseEvent.pageX + padding;
            let top = mouseEvent.pageY + padding;

            const maxLeft = window.innerWidth - tooltipWidth - padding;
            const maxTop = window.innerHeight - tooltipHeight - padding;

            if (left > maxLeft) left = mouseEvent.pageX - tooltipWidth - padding;
            if (top > maxTop) top = mouseEvent.pageY - tooltipHeight - padding;

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        }
    });

    selected_color.addEventListener("mouseleave", () => {
        if (tooltip) {
            tooltip.style.display = "none";
            tooltip.style.opacity = "0";
        }
    })
}

if (palette_select && palette_select.firstElementChild) {
    (palette_select.firstElementChild as HTMLElement).id = "selected-color";
}

// Setup picker elements
const pickerButton = document.getElementById("current-color") as HTMLButtonElement;
const popup = document.getElementById("color-picker-popup") as HTMLDivElement;
const preview = document.getElementById("picker-preview") as HTMLDivElement;
const rInput = document.getElementById("picker-r") as HTMLInputElement;
const gInput = document.getElementById("picker-g") as HTMLInputElement;
const bInput = document.getElementById("picker-b") as HTMLInputElement;
const hexInput = document.getElementById("picker-hex") as HTMLInputElement;

// Current color state
let currentColor = hexToRgb(editor.color) ?? { r: 255, g: 0, b: 128 };

function rgbToHex(r: number, g: number, b: number): string {
    return (
        "#" +
        [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
    );
}

function hexToRgb(hex: string) {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!match) return null;
    return {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16)
    };
}

function updateColorPickerUI() {
    const hex = rgbToHex(currentColor.r, currentColor.g, currentColor.b);
    const rgb = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;

    pickerButton.style.backgroundColor = rgb;
    preview.style.backgroundColor = rgb;
    rInput.value = String(currentColor.r);
    gInput.value = String(currentColor.g);
    bInput.value = String(currentColor.b);
    hexInput.value = hex;

    editor.set_color(hex);
}

// Sliders update logic
[rInput, gInput, bInput].forEach((input) => {
    input.addEventListener("input", () => {
        currentColor = {
            r: parseInt(rInput.value),
            g: parseInt(gInput.value),
            b: parseInt(bInput.value)
        };
        updateColorPickerUI();
    });
});

// Hex input
hexInput.addEventListener("change", () => {
    const rgb = hexToRgb(hexInput.value);
    if (rgb) {
        currentColor = rgb;
        updateColorPickerUI();
    }
});


pickerButton.addEventListener("click", () => {
    popup.classList.toggle("hidden");
})

// Tooltip on custom picker
pickerButton.addEventListener("mouseenter", () => {
    if (tooltip) {
        tooltip.innerText = `${editor.color}\n${ntc.name(editor.color)[1]}`;
        tooltip.style.display = "block";
        tooltip.style.opacity = "1";
    }
});
pickerButton.addEventListener("mousemove", (e) => {
    const me = e as MouseEvent;
    const padding = 10;
    tooltip.style.left = `${me.pageX + padding}px`;
    tooltip.style.top = `${me.pageY + padding}px`;
});
pickerButton.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
    tooltip.style.opacity = "0";
});

// Set initial state
updateColorPickerUI();
