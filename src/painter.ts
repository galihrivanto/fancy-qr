import { IQRData, IPainter, IShapeOptions, SegmentOrientation, DataType, DotPosition, PositionalType, FillType, Color, GradientColor, GradientType } from "./types";

export abstract class BasePainter implements IPainter {
    constructor() {}

    /**
     * Enumerates the dot bounds
     * @param data - The QR data
     * @param filter - The data type to filter
     * @param cb - The callback function
     */
    protected enumerateDotBounds(
        data: IQRData,
        bounds: DOMRect,
        filter: DataType,
        cb: (rect: DOMRect) => void
    ) {
        const dotSize = data.dotSize;
        const offsetX = bounds.x;
        const offsetY = bounds.y;

        data.walk((col, row, dataType) => {
            if (dataType === filter) {
                const rect = new DOMRect(col * dotSize + offsetX, row * dotSize + offsetY, dotSize, dotSize)
                cb(rect)
            }
        })
    }  

    /**
     * Enumerates the cross connections between dots
     * @param data - The QR data
     * @param cb - The callback function
     */
    protected enumerateCrossConnections(
        data: IQRData,
        bounds: DOMRect,
        cb: (from: DotPosition, to: DotPosition, columnOffset: number) => void
    ) {
        const dotSize = data.dotSize;
        const offsetX = bounds.x;
        const offsetY = bounds.y;

        for (let row = 0; row < data.size; row++) {
            for (let col = 0; col < data.size; col++) {
                if (data.at(col, row) === DataType.Data) {
                    const fromRect = new DOMRect(col * dotSize, row * dotSize, dotSize, dotSize)
                    let connected = false
                    if (data.at(col + 1, row + 1) === DataType.Data) {
                        connected = true
                        const toRect = new DOMRect(
                            (col + 1) * dotSize + offsetX,
                            (row + 1) * dotSize + offsetY,
                            dotSize,
                            dotSize
                        )

                        cb({ row, col, bounds: fromRect }, { row: row + 1, col: col + 1, bounds: toRect }, 1)
                    }

                    if (data.at(col - 1, row + 1) === DataType.Data) {
                        connected = true
                        const toRect = new DOMRect(
                            (col - 1) * dotSize + offsetX,
                            (row + 1) * dotSize + offsetY,
                            dotSize,
                            dotSize
                        )

                        cb({ row, col, bounds: fromRect }, { row: row + 1, col: col - 1, bounds: toRect }, -1)
                    }
                
                    if (!connected) {
                        cb({ row, col, bounds: fromRect }, { row, col, bounds: fromRect }, 0)
                    }
                }
            }
        }
    }

    /**
     * @param data - The QR data
     * @param orientation - The orientation of the segments
     * @param cb - The callback function
     */
    protected enumerateSegmentBounds(
        data: IQRData,
        bounds: DOMRect,
        orientation: SegmentOrientation,
        cb: (rect: DOMRect) => void
    ): void {
        const dotSize = data.dotSize;
        const offsetX = bounds.x;
        const offsetY = bounds.y;

        if (orientation === SegmentOrientation.Horizontal) {
            for (let row = 0; row < data.size; row++) {
                for (let col = 0; col < data.size; col++) {
                    if (data.at(col, row) === DataType.Data) {
                        const start = col;
                        while (data.at(++col, row) === DataType.Data) {
                        }
                        const length = col - start;
                        const left = start * dotSize + offsetX;
                        const top = row * dotSize + offsetY;

                        const rect = new DOMRect(left, top, length * dotSize, dotSize)

                        cb(rect)
                    }
                }
            } 
        } else {
            for (let col = 0; col < data.size; col++) {
                for (let row = 0; row < data.size; row++) {
                    if (data.at(col, row) === DataType.Data) {
                        const start = row;
                        while (data.at(col, ++row) === DataType.Data) {
                        }
                        const length = row - start;
                        const left = col * dotSize + offsetX;
                        const top = start * dotSize + offsetY;

                        const rect = new DOMRect(left, top, dotSize, length * dotSize)

                        cb(rect)
                    }
                }
            }
        }
    }

    protected enumeratePositionalBounds(
        data: IQRData,
        bounds: DOMRect,
        cb: (rect: DOMRect, pos: PositionalType) => void
    ) {
        const dotSize = data.dotSize;
        const offset = bounds.x;
        data.walk((col, row, dataType) => {
            if (dataType === DataType.Data) {
                const rect = new DOMRect(col * dotSize + offset, row * dotSize + offset, dotSize, dotSize)
                cb(rect, data.positionTypeAt(col, row))
            }
        })
    }

    /**
     * Draws the QR code on the canvas
     * @param canvas - The canvas element
     * @param encodedData - The encoded QR data
     * @param bounds - The bounds of the QR code
     * @param options - The shape options
     * @param fill - The fill type
     */
    protected withFillPainter(
        canvas: HTMLCanvasElement,
        fill: FillType,
        cb: (ctx: CanvasRenderingContext2D) => void
    ) {
        const ctx = canvas.getContext('2d');
        if (ctx === null) return;

        const isGradient = (fill: FillType): fill is GradientColor => {
            return (fill as GradientColor) !== undefined;
        }

        if (isGradient(fill)) {
            const gradientFill = fill as GradientColor;
            if (gradientFill.type === GradientType.Linear) {
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, gradientFill.from);
                gradient.addColorStop(1, gradientFill.to);
                ctx.fillStyle = gradient;
            } else {
                const gradient = ctx.createRadialGradient(0, 0, 0, canvas.width, canvas.height, canvas.width);
                gradient.addColorStop(0, gradientFill.from);
                gradient.addColorStop(1, gradientFill.to);
                ctx.fillStyle = gradient;
            }
        } else {
            ctx.fillStyle = fill;
        }

        cb(ctx);
    }

    /**
     * Draws the QR code on the canvas
     * @param canvas - The canvas element
     * @param encodedData - The encoded QR data
     * @param bounds - The bounds of the QR code
     * @param options - The shape options
     * @param fill - The fill type
     */
    abstract paint(
        canvas: HTMLCanvasElement,
        encodedData: IQRData,
        bounds: DOMRect,
        options: IShapeOptions
    ): void;
}
