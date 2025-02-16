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
            // Top bar
            ctx.rect(
                outerBounds.x,
                outerBounds.y,
                outerBounds.width,
                innerBounds.y - outerBounds.y
            );
            
            // Bottom bar
            ctx.rect(
                outerBounds.x,
                innerBounds.y + innerBounds.height,
                outerBounds.width,
                (outerBounds.y + outerBounds.height) - (innerBounds.y + innerBounds.height)
            );
            
            // Left bar
            ctx.rect(
                outerBounds.x,
                innerBounds.y,
                innerBounds.x - outerBounds.x,
                innerBounds.height
            );
            
            // Right bar
            ctx.rect(
                innerBounds.x + innerBounds.width,
                innerBounds.y,
                (outerBounds.x + outerBounds.width) - (innerBounds.x + innerBounds.width),
                innerBounds.height
            );
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
                console.log('rect', rect);
                ctx.rect(rect.x, rect.y, rect.width, rect.height)
            })
        })
    }
}
