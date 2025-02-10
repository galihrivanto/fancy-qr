import type { DataType, ILogoOptions, IQRCode, IQROptions, IShapeOptions, Size } from "./types";

export class QRCode implements IQRCode {
    private _size: Size;
    private _options: IQROptions;

    constructor(size?: Size) {
        this._size = size ?? { width: 640, height: 640 };
    }

    get options(): IQROptions {
        throw new Error("Method not implemented.");
    }

    set options(options: IQROptions) {
        throw new Error("Method not implemented.");
    }

    attachTo(htmlElement: HTMLElement): void {
        throw new Error("Method not implemented.");
    }

    setText(text: string): void {
        throw new Error("Method not implemented.");
    }

    setLogo(logo: ILogoOptions): void {
        throw new Error("Method not implemented.");
    }

    setOuterFinder(outerFinder: IShapeOptions): void {
        throw new Error("Method not implemented.");
    }

    setInnerFinder(innerFinder: IShapeOptions): void {
        throw new Error("Method not implemented.");
    }

    setData(data: IShapeOptions): void {
        throw new Error("Method not implemented.");
    }

    generateAssets(size: number, type: DataType): Promise<HTMLImageElement[]> {
        throw new Error("Method not implemented.");
    }    
}