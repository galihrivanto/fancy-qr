import { BasePainter } from "./painter";
import { IQRData, IShapeOptions } from "./types";

export class FinderBasePainter extends BasePainter {
    private _isOuter: boolean;

    constructor(isOuter: boolean) {
        super()
        this._isOuter = isOuter
    }

    paint(
        canvas: HTMLCanvasElement,
        encodedData: IQRData,
        options: IShapeOptions
    ): void {
        const outerBounds = makeOuterFinderBounds(encodedData)
        const innerBounds = makeInnerFinderBounds(encodedData)

        this.withFillPainter(
            canvas,
            options.fill,
            (ctx: CanvasRenderingContext2D) => {
                // draw the first (top left) finder based on the type (outer or inner)
                this.drawFinder(ctx, encodedData, outerBounds, innerBounds);

                // draw the right top finder
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
    protected drawFinder(ctx: CanvasRenderingContext2D, encodedData: IQRData, outerBounds: DOMRect, innerBounds: DOMRect): void {
        // Implement the finder drawing logic here
    }
}

const makeOuterFinderBounds = (data: IQRData): DOMRect => {
    const outerFinderSize = data.dotSize * data.FINDER_NUM_DOTS;
    // calculate outer and inner bounds
    return new DOMRect(0, 0, outerFinderSize, outerFinderSize);
}

const makeInnerFinderBounds = (data: IQRData): DOMRect => {
    const innerFinderSize = data.dotSize * 3;
    // calculate outer and inner bounds
    return new DOMRect(0, 0, innerFinderSize, innerFinderSize);
}