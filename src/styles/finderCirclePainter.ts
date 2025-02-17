import { FinderBasePainter } from "../finderPainter";
import { IQRData } from "../types";

export class FinderCirclePainter extends FinderBasePainter {
    constructor(isOuter: boolean) {
        super(isOuter)
    }

    private drawCircle(ctx: CanvasRenderingContext2D, bounds: DOMRect) {
        const radius = bounds.width / 2
        ctx.beginPath()
        ctx.moveTo(bounds.x, bounds.y)
        ctx.arc(bounds.x + radius, bounds.y + radius, radius, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()
    }

    protected drawFinder(ctx: CanvasRenderingContext2D, encodedData: IQRData, outerBounds: DOMRect, innerBounds: DOMRect) {
        if (this.isOuter) {
            ctx.save()
            this.drawCircle(ctx, outerBounds)
            ctx.globalCompositeOperation = 'destination-out'
            this.drawCircle(ctx, new DOMRect(innerBounds.x - innerBounds.width / 3, innerBounds.y - innerBounds.height / 3 , innerBounds.width * 5/3, innerBounds.height * 5/3))
            ctx.restore()
        } else {
            this.drawCircle(ctx, innerBounds)
        }
    }
}