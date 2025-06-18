import { Editor } from "./editor";

const canvas = document.getElementById("editor") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let editor = new Editor(canvas, ctx, 32, 32);

editor.set_color("red");

editor.draw_pixels();

window.editor = editor;