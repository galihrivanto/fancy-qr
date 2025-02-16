import { FinderBasePainter } from "../finderPainter"
import { IQRData } from "../types"

export class FinderPetalPainter extends FinderBasePainter {
    constructor(isOuter: boolean) {
        super(isOuter)
    }

    private drawPetal(
        ctx: CanvasRenderingContext2D, 
        bounds: DOMRect
    ) {
        const radius = bounds.width / 3
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
            this.drawPetal(ctx, outerBounds)
        } else {
            this.drawPetal(ctx, innerBounds)
        }
    }
}

export class FinderDropPainter extends FinderPetalPainter {
    constructor(isOuter: boolean) {
        super(isOuter)
    }

    private drawDrop(ctx: CanvasRenderingContext2D, bounds: DOMRect) {
        const radius = bounds.width / 3
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
            this.drawDrop(ctx, outerBounds)
        } else {
            this.drawDrop(ctx, innerBounds)
        }
    }
}

