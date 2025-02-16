import { BasePainter } from "../painter";
import { DataType, IQRData, IShapeOptions } from "../types";

export class DataDiamondPainter extends BasePainter {
    constructor() {
        super()
    }

    private drawDiamond(ctx: CanvasRenderingContext2D, rect: DOMRect) {
        const size = rect.width;
        const offset = size / 2.0;

        ctx.beginPath();
        ctx.moveTo(rect.x + offset, rect.y);
        ctx.lineTo(rect.right, rect.top + offset);
        ctx.lineTo(rect.x + offset, rect.bottom);
        ctx.lineTo(rect.x, rect.top + offset);
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
            this.enumeratePositionalBounds(encodedData, bounds, (rect, type) => {
                this.drawDiamond(ctx, rect);
            });
        })
    }
}

export class DataCrossPainter extends BasePainter {
    constructor() {
        super()
    }

    private drawCross(ctx: CanvasRenderingContext2D, rect: DOMRect) {
        const offset = rect.width / 2.0;
        const smallStep = rect.width / 8;
        const largeStep = rect.width / 3;

        ctx.beginPath();
        ctx.moveTo(rect.x + offset, rect.y);
        ctx.lineTo(rect.right - largeStep, rect.y + smallStep);
        ctx.lineTo(rect.right - largeStep, rect.y + largeStep);
        ctx.lineTo(rect.right - smallStep, rect.y + largeStep);
        ctx.lineTo(rect.right, rect.y + offset);
        ctx.lineTo(rect.right - smallStep, rect.bottom - largeStep);
        ctx.lineTo(rect.right - largeStep, rect.bottom - largeStep);
        ctx.lineTo(rect.right - largeStep, rect.bottom - smallStep);
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
            this.enumeratePositionalBounds(encodedData, bounds, (rect, type) => {
                this.drawCross(ctx, rect);
            });
        })
    }
}

export class DataCirclePainter extends BasePainter {
    constructor() {
        super()
    }

    private drawCircle(ctx: CanvasRenderingContext2D, rect: DOMRect) {
        const offset = rect.width / 2.0;
        ctx.beginPath();
        ctx.arc(rect.x + offset, rect.y + offset, offset - 1, 0, 2 * Math.PI);
        ctx.fill();
    }

    paint(
        canvas: HTMLCanvasElement,
        encodedData: IQRData,
        bounds: DOMRect,
        options: IShapeOptions
    ): void {
        this.withFillPainter(canvas, options.fill, (ctx) => {
            this.enumerateDotBounds(encodedData, bounds, DataType.Data, (rect) => {
                this.drawCircle(ctx, rect);
            });
        })
    }
}

export class DataBeehivePainter extends BasePainter {
    constructor() {
        super()
    }

    private drawBeehive(ctx: CanvasRenderingContext2D, rect: DOMRect) {
        const offset = rect.width / 2.0;
        ctx.beginPath();
        ctx.moveTo(rect.x + offset, rect.y);
        ctx.lineTo(rect.right - offset, rect.y + offset);
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
            this.enumerateDotBounds(encodedData, bounds, DataType.Data, (rect) => {
                this.drawBeehive(ctx, rect);
            });
        })
    }
}

export class DataCircuitPainter extends BasePainter {
    private readonly _withPad: boolean

    constructor(withPad?: boolean) {
        super()
        this._withPad = withPad ?? false
    }

    paint(
        canvas: HTMLCanvasElement,
        encodedData: IQRData,
        bounds: DOMRect,
        options: IShapeOptions
    ): void {
        this.withFillPainter(canvas, options.fill, (ctx) => {
            this.enumerateCrossConnections(encodedData, bounds, (from, to, columnOffset) => {
                const offset = from.bounds.width / 4
                if (this._withPad) {
                    from.bounds = PadRect(from.bounds, offset / 2, offset / 2)
                    to.bounds = PadRect(to.bounds, offset / 2, offset / 2)
                }

                switch (columnOffset) {
                    case -1:
                        ctx.beginPath();
                        ctx.moveTo(from.bounds.left, from.bounds.top);
                        ctx.lineTo(from.bounds.right, from.bounds.top);
                        ctx.lineTo(from.bounds.right, from.bounds.bottom);
                        ctx.lineTo(from.bounds.x + offset, from.bounds.bottom);
                        ctx.lineTo(to.bounds.right, to.bounds.top + offset);
                        ctx.lineTo(to.bounds.right, to.bounds.bottom);
                        ctx.lineTo(to.bounds.x, to.bounds.bottom);
                        ctx.lineTo(to.bounds.left, to.bounds.top);
                        ctx.lineTo(to.bounds.right - offset, to.bounds.top);
                        ctx.lineTo(from.bounds.left, from.bounds.bottom - offset);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case 0:
                        ctx.beginPath();
                        ctx.moveTo(from.bounds.x, from.bounds.y);
                        ctx.lineTo(from.bounds.right, from.bounds.top);
                        ctx.lineTo(from.bounds.right, from.bounds.bottom);
                        ctx.lineTo(to.bounds.left, to.bounds.bottom);
                        ctx.lineTo(to.bounds.left, to.bounds.top);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case 1:
                        ctx.beginPath();
                        ctx.moveTo(from.bounds.left, from.bounds.top);
                        ctx.lineTo(from.bounds.right, from.bounds.top);
                        ctx.lineTo(from.bounds.right, from.bounds.bottom - offset);
                        ctx.lineTo(to.bounds.left + offset, to.bounds.top);
                        ctx.lineTo(to.bounds.right, to.bounds.top);
                        ctx.lineTo(to.bounds.right, to.bounds.bottom);
                        ctx.lineTo(to.bounds.left, to.bounds.bottom);
                        ctx.lineTo(to.bounds.left, to.bounds.top + offset);
                        ctx.lineTo(from.bounds.right - offset, from.bounds.bottom);
                        ctx.lineTo(from.bounds.left, from.bounds.bottom);
                        ctx.closePath();
                        ctx.fill();
                        break;
                }
            });
        })
    }
}

const PadRect = (rect: DOMRect, dx: number, dy: number): DOMRect => {
    return new DOMRect(rect.x + dx, rect.y + dy, rect.width - dx * 2, rect.height - dy * 2)
}
