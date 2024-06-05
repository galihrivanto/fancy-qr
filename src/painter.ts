import { IQRCodeData, IStylePainter, Style } from "./types";

export abstract class BaseStylePainter implements IStylePainter {
    private _canvas: HTMLCanvasElement; 
    private _style: Style;
    private _data: IQRCodeData;

    constructor(canvas: HTMLCanvasElement, style: Style, data: IQRCodeData) {
        this._canvas = canvas;
        this._style = style;
        this._data = data;
    }

    protected get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    protected get context(): CanvasRenderingContext2D | null {
        return this._canvas.getContext("2d");
    }

    protected get style(): Style {
        return this._style;
    }

    protected get data(): IQRCodeData {
        return this._data;
    }

    abstract paint(): void;
}
