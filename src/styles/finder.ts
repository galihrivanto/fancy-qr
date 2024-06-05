import { BaseStylePainter } from "../painter";
import { FillType, IQRCodeData, Style } from "../types";

export abstract class FinderStylePainter extends BaseStylePainter {
    private _innerFinder = false;
    
    constructor(canvas: HTMLCanvasElement, style: Style, data: IQRCodeData, innerFinder: boolean) {
        super(canvas, style, data);

        this._innerFinder = innerFinder;
    }

    protected get innerFinder(): boolean {
        return this._innerFinder;
    }

    abstract drawFinder(fill: FillType): void;
    
    paint(): void {
        const ctx = this.context;
        if (!ctx) return;

        let color = this._innerFinder ? this.style.innerEye.fill : this.style.outerEye.fill;

        // draw top left finder
        this.drawFinder(color);

        ctx?.rotate(Math.PI/2);
    }
}