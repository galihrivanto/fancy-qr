import { FinderBasePainter } from "../finderPainter";
import { BasePainter } from "../painter";
import { IQRData, IShapeOptions, SegmentOrientation } from "../types";


export class FinderDefaultPainter extends FinderBasePainter {
    constructor(isOuter: boolean) {
        super(isOuter)
    }

    private drawDefault(ctx: CanvasRenderingContext2D, bounds: DOMRect) {
        ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height)
    }

    protected drawFinder(ctx: CanvasRenderingContext2D, encodedData: IQRData, outerBounds: DOMRect, innerBounds: DOMRect) {
        if (this.isOuter) {
            this.drawDefault(ctx, outerBounds)
        } else {
            this.drawDefault(ctx, innerBounds)
        }
    }
}

export class DataDefaultPainter extends BasePainter {
    constructor() {
        super()
    }

    paint(
        canvas: HTMLCanvasElement,
        encodedData: IQRData,
        bounds: DOMRect,
        options: IShapeOptions
    ): void {
        this.withFillPainter(canvas, options.fill, (ctx: CanvasRenderingContext2D) => {
            this.enumerateSegmentBounds(encodedData, bounds, SegmentOrientation.Vertical, (rect) => {
                ctx.rect(rect.x, rect.y, rect.width, rect.height)
            })
        })
    }
}
