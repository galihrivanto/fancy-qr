import { BasePainter } from "../painter";
import { IQRData, IShapeOptions, SegmentOrientation } from "../types";

export class DataRoundLinePainter extends BasePainter {
    private _orientation?: SegmentOrientation;
    
    constructor(orientation?: SegmentOrientation) {
        super()
        this._orientation = orientation
    }

    paint(
        canvas: HTMLCanvasElement,
        encodedData: IQRData,
        bounds: DOMRect,
        options: IShapeOptions
    ): void {
        const drawFn = (ctx: CanvasRenderingContext2D, orientation: SegmentOrientation) => {
            this.enumerateSegmentBounds(encodedData, bounds, orientation, (rect) => {
                const size = orientation === SegmentOrientation.Vertical ? rect.width : rect.height;
                const offset = size / 2.0;
                const h = rect.width - 2 * offset;
                const v = rect.height - 2 * offset;

                ctx.beginPath();
                ctx.moveTo(rect.x + offset, rect.y);
                ctx.lineTo(rect.x + offset + h, rect.y);
                ctx.arcTo(rect.x + rect.width, rect.y + offset, rect.x + rect.width - offset, rect.y + offset, 45);
                ctx.lineTo(rect.x + rect.width - offset, rect.y + rect.height - offset);
                ctx.arcTo(rect.x + offset, rect.y + rect.height, rect.x + offset, rect.y + rect.height - offset, 45);
                ctx.lineTo(rect.x + offset, rect.y + offset);
                ctx.closePath();
                ctx.stroke();
            })
        }

        this.withFillPainter(canvas, options.fill, (ctx) => {
            if (this._orientation === undefined) {
                drawFn(ctx, SegmentOrientation.Vertical);
                drawFn(ctx, SegmentOrientation.Horizontal);
            } else {
                drawFn(ctx, this._orientation);
            }
        })
    }
}

export class DataArrowLinePainter extends BasePainter {
    constructor() {
        super()
    }

    private drawVerticalArrowLine(ctx: CanvasRenderingContext2D, rect: DOMRect) {
        const offset = rect.width / 2.0;
        ctx.beginPath();
        ctx.moveTo(rect.x, rect.y + offset);
        ctx.lineTo(rect.x + offset, rect.y);
        ctx.lineTo(rect.right, rect.y + offset);
        ctx.lineTo(rect.right, rect.bottom - offset);
        ctx.lineTo(rect.right - offset, rect.bottom);
        ctx.lineTo(rect.x, rect.bottom - offset);
        ctx.closePath();
        ctx.fill();
    }

    private drawHorizontalArrowLine(ctx: CanvasRenderingContext2D, rect: DOMRect) {
        const offset = rect.height / 2.0;
        ctx.beginPath();
        ctx.moveTo(rect.x, rect.y + offset);
        ctx.lineTo(rect.x + offset, rect.y);
        ctx.lineTo(rect.right - offset, rect.y);
        ctx.lineTo(rect.right, rect.y + offset);
        ctx.lineTo(rect.right - offset, rect.bottom);
        ctx.lineTo(rect.x + offset, rect.bottom);
        ctx.closePath();
        ctx.fill();
    }

    paint(
        canvas: HTMLCanvasElement,
        encodedData: IQRData,
        bounds: DOMRect,
        options: IShapeOptions
    ): void {
        this.withFillPainter(canvas, options.fill, (ctx) => {
            this.enumerateSegmentBounds(encodedData, bounds, SegmentOrientation.Vertical, (rect) => {
                this.drawVerticalArrowLine(ctx, rect);
            });

            this.enumerateSegmentBounds(encodedData, bounds, SegmentOrientation.Horizontal, (rect) => {
                this.drawHorizontalArrowLine(ctx, rect);
            });
        });
    }
}

export class DataRibbonLinePainter extends BasePainter {
    private _orientation?: SegmentOrientation;

    constructor(orientation?: SegmentOrientation) {
        super()
        this._orientation = orientation
    }

    private drawVerticalRibbon(ctx: CanvasRenderingContext2D, rect: DOMRect) {
        const offset = rect.height / 3.0;
        const centerX = rect.x + rect.width / 2.0;
        ctx.beginPath();
        ctx.moveTo(rect.x, rect.y);
        ctx.lineTo(rect.right, rect.y);
        ctx.lineTo(rect.right - offset, centerX);
        ctx.lineTo(rect.right, rect.bottom);
        ctx.lineTo(rect.x + offset, centerX);
        ctx.closePath();
    }

    private drawHorizontalRibbon(ctx: CanvasRenderingContext2D, rect: DOMRect) {
        const offset = rect.width / 3.0;
        const centerY = rect.y + rect.height / 2.0;

        ctx.beginPath();
        ctx.moveTo(rect.x, rect.y);
        ctx.lineTo(rect.right, rect.y);
        ctx.lineTo(rect.right - offset, centerY);
        ctx.lineTo(rect.right, rect.bottom);
        ctx.lineTo(rect.x, rect.bottom);
        ctx.lineTo(rect.x + offset, centerY);
        ctx.closePath();
        ctx.fill();
    }

    paint(
        canvas: HTMLCanvasElement,
        encodedData: IQRData,
        bounds: DOMRect,
        options: IShapeOptions
    ): void {
        this.withFillPainter(canvas, options.fill, (ctx) => {
            if (this._orientation === SegmentOrientation.Vertical) {  
                this.enumerateSegmentBounds(encodedData, bounds, SegmentOrientation.Vertical, (rect) => {
                    this.drawVerticalRibbon(ctx, rect);
                });
            } else {    
                this.enumerateSegmentBounds(encodedData, bounds, SegmentOrientation.Horizontal, (rect) => {
                    this.drawHorizontalRibbon(ctx, rect);
                });
            }
        })
    }
}