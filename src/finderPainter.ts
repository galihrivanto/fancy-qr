import { BasePainter } from "./painter";
import { IQRData, IShapeOptions } from "./types";

export class FinderBasePainter extends BasePainter {
    protected isOuter: boolean;

    constructor(isOuter: boolean) {
        super()
        this.isOuter = isOuter
    }

    private getCenter(rect: DOMRect): {
        x: number
        y: number
    } {
        return {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
        }
    }

    paint(
        canvas: HTMLCanvasElement,
        encodedData: IQRData,
        bounds: DOMRect,
        options: IShapeOptions
    ): void {
        const outerBounds = makeOuterFinderBounds(bounds, encodedData)
        const innerBounds = makeInnerFinderBounds(bounds, encodedData)

        this.withFillPainter(
            canvas,
            options.fill,
            (ctx: CanvasRenderingContext2D) => {
                // draw the first (top left) finder based on the type (outer or inner)
                this.drawFinder(ctx, encodedData,structuredClone(outerBounds), structuredClone(innerBounds));

                // TODO: draw the right top finder and bottom left finder
            }
        )
    }

    /*
     * Overridden in descendant painters to draw the main finder shape
     * @param ctx
     * @param encodedData
     * @param outerBounds
     * @param innerBounds
     * @protected
     */
    protected drawFinder(ctx: CanvasRenderingContext2D, encodedData: IQRData, outerBounds: DOMRect, innerBounds: DOMRect): void {}
}

const makeOuterFinderBounds = (bounds: DOMRect, data: IQRData): DOMRect => {
    const outerFinderSize = data.dotSize * data.FINDER_NUM_DOTS;
    // calculate outer and inner bounds
    return new DOMRect(bounds.x, bounds.y, outerFinderSize, outerFinderSize);
}

const makeInnerFinderBounds = (bounds: DOMRect, data: IQRData): DOMRect => {
    const innerFinderSize = data.dotSize * 3;
    // calculate outer and inner bounds
    return new DOMRect(bounds.x + data.dotSize * 2, bounds.y + data.dotSize * 2, innerFinderSize, innerFinderSize);
}