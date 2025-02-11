import { FinderBasePainter } from "../finderPainter";
import { IQRData } from "../types";

export class FinderRoundedSquarePainter extends FinderBasePainter {
    constructor(isOuter: boolean) {
        super(isOuter)
    }

    private drawRoundedSquare(ctx: CanvasRenderingContext2D, bounds: DOMRect) {
        const radius = bounds.width / 4
        ctx.moveTo(bounds.x, bounds.y)
        ctx.lineTo(bounds.right - radius, bounds.y)
        ctx.quadraticCurveTo(bounds.right, bounds.y, bounds.right, bounds.y + radius)
        ctx.lineTo(bounds.right, bounds.bottom)
        ctx.lineTo(bounds.x + radius, bounds.bottom)
        ctx.quadraticCurveTo(bounds.x, bounds.bottom, bounds.x, bounds.bottom - radius)
        ctx.closePath()
    }

    protected drawFinder(ctx: CanvasRenderingContext2D, encodedData: IQRData, outerBounds: DOMRect, innerBounds: DOMRect) {
        if (this.isOuter) {
            this.drawRoundedSquare(ctx, outerBounds)
        } else {
            this.drawRoundedSquare(ctx, innerBounds)
        }
    }
}