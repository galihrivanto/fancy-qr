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

                // draw a rounded rect
                ctx.beginPath();
                ctx.moveTo(rect.x + offset, rect.y);
                ctx.lineTo(rect.right - offset, rect.y);
                ctx.arc(rect.right - offset, rect.y + offset, offset, -Math.PI/2, 0);
                ctx.lineTo(rect.right, rect.bottom - offset);
                ctx.arc(rect.right - offset, rect.bottom - offset, offset, 0, Math.PI/2);
                ctx.lineTo(rect.x + offset, rect.bottom);
                ctx.arc(rect.x + offset, rect.bottom - offset, offset, Math.PI/2, Math.PI);
                ctx.lineTo(rect.x, rect.y + offset);
                ctx.arc(rect.x + offset, rect.y + offset, offset, Math.PI, 3*Math.PI/2);
                ctx.fill();
            })
        }

        this.withFillPainter(canvas, options.fill, (ctx) => {
            console.log('orientation', this._orientation)
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
        const width = rect.width;
        const offset = width / 3.0;
        const centerX = rect.x + width / 2.0;

        ctx.beginPath();
        ctx.moveTo(rect.x, rect.y);
        ctx.lineTo(centerX, rect.y + offset);
        ctx.lineTo(rect.right, rect.y);
        ctx.lineTo(rect.right, rect.bottom);
        ctx.lineTo(rect.x, rect.bottom);
        ctx.closePath();
        ctx.fill();
    }

    private drawHorizontalRibbon(ctx: CanvasRenderingContext2D, rect: DOMRect) {
        const height = rect.height;
        const offset = height / 3.0;
        const centerY = rect.y + height / 2.0;

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