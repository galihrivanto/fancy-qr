import { FinderBasePainter } from "../finderPainter";
import { IQRData } from "../types";

export class FinderCirclePainter extends FinderBasePainter {
    constructor(isOuter: boolean) {
        super(isOuter)
    }

    private drawCircle(ctx: CanvasRenderingContext2D, bounds: DOMRect) {
        const radius = bounds.width / 2
        ctx.moveTo(bounds.x, bounds.y)
        ctx.arc(bounds.x + radius, bounds.y + radius, radius, 0, 2 * Math.PI)
        ctx.closePath()
    }

    protected drawFinder(ctx: CanvasRenderingContext2D, encodedData: IQRData, outerBounds: DOMRect, innerBounds: DOMRect) {
        if (this.isOuter) {
            this.drawCircle(ctx, outerBounds)
        } else {
            this.drawCircle(ctx, innerBounds)
        }
    }
}