import { QRData } from "./data";
import { Options } from "./options";
import { PainterFactory } from "./painterFactory";
import { 
    DataType,
    IPainterFactory,
    LogoPosition,
    type ILogoOptions, 
    type IQRCode, 
    type IQRData, 
    type IQROptions, 
    type IShapeOptions, 
    type Size,
} from "./types";

export class QRCode implements IQRCode {
    private _size: Size;
    private _options: IQROptions;
    private _canvas: HTMLCanvasElement;
    private _data: IQRData;
    private _painterFactory: IPainterFactory;

    constructor(size?: Size) {
        this._size = size ?? { width: 640, height: 640 };
        this._painterFactory = new PainterFactory();
        this._options = new Options();
    }

    get options(): IQROptions {
        return this._options;
    }

    set options(options: IQROptions) {
        this._options = options;
    }

    attachTo(htmlElement: HTMLElement): void {
        const canvas = document.createElement('canvas');
        canvas.width = this._size.width;
        canvas.height = this._size.height;

        htmlElement.appendChild(canvas);
        this._canvas = canvas;
    }

    setText(text: string): void {
        this._options.text = text;
        this.applyOptions();
    }

    setLogo(logo: ILogoOptions): void {
        this._options.logo = logo;
        this.applyOptions();
    }

    setOuterFinder(outerFinder: IShapeOptions): void {
        this._options.outerFinder = outerFinder;
        this.applyOptions();
    }

    setInnerFinder(innerFinder: IShapeOptions): void {
        this._options.innerFinder = innerFinder;
        this.applyOptions();
    }

    setData(data: IShapeOptions): void {
        this._options.data = data;
        this.applyOptions();
    }

    generateAssets(size: number, type: DataType): Promise<HTMLImageElement[]> {
        throw new Error("Method not implemented.");
    }   
    
    private clearCanvas(): void {
        const ctx = this._canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, this._size.width, this._size.height);
        }
    }

    private updateData(options: IQROptions): void {
        this._data = new QRData(options.text, options.ecc, {
            excludeDataForLogo: options.logo.url !== '' && options.logo.position === LogoPosition.Center
        });
        this._data.calculatePixelSize(this._size.width);
    }

    private applyOptions(): void {
        const options = this._options;
        const bounds = new DOMRect(0, 0, this._size.width, this._size.height);
        this.updateData(options);

        this.draw(bounds);
    }

    private draw(bounds: DOMRect): void {
        this.clearCanvas();

        console.log(this._options.visibleParts);
        if (this._options.visibleParts.includes(DataType.OuterFinder)) {
            console.log('outer finder');
            const painter = this._painterFactory.make(DataType.OuterFinder, this._options.outerFinder.shape);
            painter.paint(this._canvas, this._data, bounds, this._options.outerFinder);
        }

        if (this._options.visibleParts.includes(DataType.InnerFinder)) {
            console.log('inner finder')
            const painter = this._painterFactory.make(DataType.InnerFinder, this._options.innerFinder.shape);
            painter.paint(this._canvas, this._data, bounds, this._options.innerFinder);
        }

        if (this._options.visibleParts.includes(DataType.Data)) {
            const painter = this._painterFactory.make(DataType.Data, this._options.data.shape);
            painter.paint(this._canvas, this._data, bounds, this._options.data);
        }
    }
}