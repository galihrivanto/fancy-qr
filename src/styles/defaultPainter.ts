import { FinderBasePainter } from "../finderPainter";
import { BasePainter } from "../painter";
import { IQRData, IShapeOptions, SegmentOrientation } from "../types";


export class FinderDefaultPainter extends FinderBasePainter {
    constructor(isOuter: boolean) {
        super(isOuter)
    }

    protected drawFinder(ctx: CanvasRenderingContext2D, encodedData: IQRData, outerBounds: DOMRect, innerBounds: DOMRect) {
        if (this.isOuter) {
            ctx.fillRect(outerBounds.x, outerBounds.y, outerBounds.width, outerBounds.height);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillRect(innerBounds.x - innerBounds.width / 3, innerBounds.y - innerBounds.height / 3 , innerBounds.width * 5/3, innerBounds.height * 5/3);
            ctx.globalCompositeOperation = 'source-over';
        } else {
            ctx.fillRect(innerBounds.x, innerBounds.y, innerBounds.width, innerBounds.height);
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
            this.enumerateSegmentBounds(encodedData, bounds, SegmentOrientation.Horizontal, (rect) => {
                ctx.fillRect(rect.x, rect.y, rect.width + 0.5, rect.height + 0.5)
            })
        })
    }
}
