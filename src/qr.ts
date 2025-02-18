import { QRData } from "./data";
import { Options } from "./options";
import { PainterFactory } from "./painterFactory";
import { 
    DataType,
    ECC,
    IPainter,
    IPainterFactory,
    LogoPosition,
    type ILogoOptions, 
    type IQRCode, 
    type IQRData, 
    type IQROptions, 
    type IShapeOptions, 
    type Size,
} from "./types";
import { Dictionary } from "@galihrivanto/dict";

export class QRCode implements IQRCode {
    private _size: Size;
    private _options: IQROptions;
    private _canvas: HTMLCanvasElement;
    private _data: IQRData;
    private _painterFactory: IPainterFactory;

    constructor(size?: number) {
        this._size = { width: size ?? 640, height: size ?? 640 };
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

    setSize(size: number): void {
        this._size = { width: size, height: size };
        this._canvas.width = size;
        this._canvas.height = size;
        this.applyOptions();
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

    generateAssets(size: number, type: DataType): Dictionary<HTMLImageElement> {
        // generate assets for the given type and size
        // return an array of images
        const assets: Dictionary<HTMLImageElement> = {};
        const data = new QRData('', ECC.MEDIUM, {});
        data.calculatePixelSize(size);

        const draw = (
            painter: IPainter,
            canvas: HTMLCanvasElement, 
            data: IQRData, 
            bounds: DOMRect, 
            name: string, 
            visible: boolean
        ) => {
            const color = visible ? '#000000' : '#aaaaaa';
            painter.paint(canvas, data, bounds, {
                shape: name,
                fill: color
            });
        }

        this._painterFactory.getNames(type).forEach(name => {
            const painter = this._painterFactory.make(type, name);
            const canvas = document.createElement('canvas');
            const bounds = new DOMRect(0, 0, size, size);
            canvas.width = size;
            canvas.height = size;

            [DataType.OuterFinder, DataType.InnerFinder, DataType.Data]
                .forEach(t => {
                    if (t !== type) {
                        const p = this._painterFactory.make(t, 'Default');
                        draw(p, canvas, data, bounds, 'Default', false);
                    } else {
                        draw(painter, canvas, data, bounds, name, true);
                    }
                });
            
            // Create and configure image element
            const img = document.createElement('img');
            img.src = canvas.toDataURL();
            assets[name] = img;
        });

        return assets;
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

        if (this._options.visibleParts.includes(DataType.OuterFinder)) {
            const painter = this._painterFactory.make(DataType.OuterFinder, this._options.outerFinder.shape);
            painter.paint(this._canvas, this._data, bounds, this._options.outerFinder);
        }

        if (this._options.visibleParts.includes(DataType.InnerFinder)) {
            const painter = this._painterFactory.make(DataType.InnerFinder, this._options.innerFinder.shape);
            painter.paint(this._canvas, this._data, bounds, this._options.innerFinder);
        }

        if (this._options.visibleParts.includes(DataType.Data)) {
            const painter = this._painterFactory.make(DataType.Data, this._options.data.shape);
            painter.paint(this._canvas, this._data, bounds, this._options.data);
        }
    }
}