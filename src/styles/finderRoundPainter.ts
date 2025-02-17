import { FinderBasePainter } from "../finderPainter";
import { IQRData } from "../types";

export class FinderRoundedSquarePainter extends FinderBasePainter {
    constructor(isOuter: boolean) {
        super(isOuter)
    }

    private drawRoundedSquare(ctx: CanvasRenderingContext2D, bounds: DOMRect) {
        const radius = bounds.width / 4
        ctx.beginPath()
        ctx.moveTo(bounds.x + radius, bounds.y)
        ctx.lineTo(bounds.right - radius, bounds.y)
        ctx.quadraticCurveTo(bounds.right, bounds.y, bounds.right, bounds.y + radius)
        ctx.lineTo(bounds.right, bounds.bottom - radius)
        ctx.quadraticCurveTo(bounds.right, bounds.bottom, bounds.right - radius, bounds.bottom)
        ctx.lineTo(bounds.x + radius, bounds.bottom)
        ctx.quadraticCurveTo(bounds.x, bounds.bottom, bounds.x, bounds.bottom - radius)
        ctx.lineTo(bounds.x, bounds.y + radius)
        ctx.quadraticCurveTo(bounds.x, bounds.y, bounds.x + radius, bounds.y)
        ctx.closePath()
        ctx.fill()
    }

    protected drawFinder(ctx: CanvasRenderingContext2D, encodedData: IQRData, outerBounds: DOMRect, innerBounds: DOMRect) {
        if (this.isOuter) {
            ctx.save()
            this.drawRoundedSquare(ctx, outerBounds)
            ctx.globalCompositeOperation = 'destination-out'
            this.drawRoundedSquare(ctx, new DOMRect(innerBounds.x - innerBounds.width / 3, innerBounds.y - innerBounds.height / 3 , innerBounds.width * 5/3, innerBounds.height * 5/3))
            ctx.restore()
        } else {
            this.drawRoundedSquare(ctx, innerBounds)
        }
    }
}