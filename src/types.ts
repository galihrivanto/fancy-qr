export enum ModuleType { 
    None, // could be quite zone or background
    Data,
    OuterEye,
    InnerEye
}

/**
 * Represents a gradient with a starting color and an ending color.
 */
export interface Gradient {
    fromColor: string;
    toColor: string;
    type: 'linear' | 'radial';
}

/**
 * Represents the fill type of a module style, which can be either a string or a gradient.
 */
export type FillType = string | Gradient;

/**
 * Represents the style of a QR code module.
 */
export interface ModuleStyle {
    shape: string;
    fill: FillType;
}

/**
 * Represents the error correction level of a QR code.
 */
export type Ecc = 'L' | 'M' | 'Q' | 'H';

/**
 * Represents the overall style of a QR code.
 */
export interface Style {
    innerEye: ModuleStyle;
    outerEye: ModuleStyle;
    background: {
        fill: FillType;
    };
    module: ModuleStyle;
    logo?: string;
}

export interface IStylePainter {
    paint(): void;
}

export type IPainterFactory = (canvas: HTMLCanvasElement, style: Style, data: IQRCodeData) => IStylePainter;

/**
 * Represents the options for generating a QR code.
 */
export interface Options {
    text: string;
    ecc: Ecc;
    size: number;
    style: Style;
    quiteZone?: number;
}

/**
 * Represents the data of a generated QR code.
 */
export interface IQRCodeData {
    modules: ModuleType[][];
    size: number;
    quiteZone: number;
}

export interface IQRCodeOptions {
    size: number;
    visibleParts: string[];
}

/**
 * Represents a QR code generator interface.
 */
export interface IQRCode {
    /**
     * Sets the options for generating the QR code.
     * @param options - The options for generating the QR code.
     */
    setOptions(options: Options): void;

    /**
     * Renders the QR code to a canvas element.
     * @param canvas - The canvas element to render the QR code to.
     */
    renderToCanvas(canvas: HTMLCanvasElement): void;
}

export enum SegmentType {
    Horizontal,
    Vertical
}

export interface Segment {
    type: SegmentType,
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export interface CrossNeighbor {
    x: number,
    y: number,
    leftTopCross: boolean,
    leftBottomCross: boolean,
    rightTopCross: boolean,
    rightBottomCross: boolean 
}
