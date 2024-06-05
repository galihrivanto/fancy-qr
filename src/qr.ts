import { IQRCode, IQRCodeOptions, Options } from "./types";

export class QRCode implements IQRCode {
    private _options: Options;
    private _canvas: HTMLCanvasElement;
    private _size: number;
    private _visibleParts: string[];

    constructor(options: IQRCodeOptions) {
        this._size = options.size;
        this._visibleParts = options.visibleParts;
        this._options = this.defaultOptions;
    }

    private get defaultOptions(): Options {
        return {
            text: "",
            ecc: "M",
            size: 256,
            style: {
                innerEye: {
                    fill: "black",
                    shape: "default"
                },
                outerEye: {
                    fill: "black",
                    shape: "default"
                },
                background: {
                    fill: "white"
                },
                module: {
                    fill: "black",
                    shape: "default"
                }
            }
        };
    }

    setOptions(options: Options): void {
        throw new Error("Method not implemented.");
    }

    renderToCanvas(canvas: HTMLCanvasElement): void {
        this._canvas = canvas;
    }

    private render(): void {
        throw new Error("Method not implemented.");
    }
}