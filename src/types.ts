export enum ECC {
    LOW = 7,
    MEDIUM = 15,
    QUARTILE = 25,
    HIGH = 30
}

export enum DataType {
    OuterFinder,
    InnerFinder,
    Data,
    Background,
    Handle,
    None
}

export enum PositionalType {
    North,
    East,
    South,
    West,
    Middle,
    Single
}

export enum SegmentOrientation {
    Vertical,
    Horizontal
}

export enum GradientType {
    Linear,
    Radial
}

export type Size = {
    width: number
    height: number
}

export type Color = string;

export type FillType = Color | GradientColor;

export type DotPosition = {
    row: number
    col: number
    bounds: DOMRect
}

export interface GradientColor {
    from: Color
    to: Color
    type: GradientType
}

export interface IShapeOptions {
    shape: string
    fill: FillType
}

export enum LogoPosition {
    Center,
    Background
}

export interface ILogoOptions {
    url: string
    position: LogoPosition
    alpha: number
}

export interface IQROptions {
    text: string;
    outerFinder: IShapeOptions
    innerFinder: IShapeOptions
    data: IShapeOptions
    visibleParts: DataType[]
    ecc: ECC
    logo: ILogoOptions
}

export interface IPainter {
    paint(
        canvas: HTMLCanvasElement,
        encodedData: IQRData,
        bounds: DOMRect,
        options: IShapeOptions
    ): void;
}

export interface IPainterFactory {
    make(type: DataType, name: string): IPainter;
}

export interface IQRData {
    readonly FINDER_NUM_DOTS: number
    readonly QUIET_ZONE: number

    /**
     * Gets the size of the QR code.
     */
    get size(): number;

    /**
     * Gets the size of the QR code dot.
     */
    get dotSize(): number;

    /**
     * Gets the data type at a given position.
     * @param x - The x coordinate of the position.
     * @param y - The y coordinate of the position.
     */
    at(x: number, y: number): DataType;

    /**
     * Gets the positional type at a given position.
     * @param x - The x coordinate of the position.
     * @param y - The y coordinate of the position.
     */
    positionTypeAt(x: number, y: number): PositionalType;

    /**
     * Walks through the QR code data.
     * @param fn - The function to call for each position.
     */
    walk(fn: (x: number, y: number, dataType: DataType) => void): void;

    /**
     * Calculates the pixel size of the QR code.
     * @param size - The size of the QR code.
     */
    calculatePixelSize(size: number): void;
}

/**
 * Represents a QR code generator interface.
 */
export interface IQRCode {
    /**
     * Gets the data of the QR code.
     */
    get options(): IQROptions;

    /**
     * Sets the options for generating the QR code.
     * @param options - The options for generating the QR code.
     */
    set options(options: IQROptions);

    /**
     * Renders the QR code to a html element.
     * @param htmlElement - The HTML element to render the QR code to.
     */
    attachTo(htmlElement: HTMLElement): void;

    /**
     * Sets the text for the QR code.
     * @param text - The text to set for the QR code.
     */
    setText(text: string): void;

    /**
         * Sets the logo for the QR code.
     * @param logo - The logo to set for the QR code.
     */
    setLogo(logo: ILogoOptions): void;

    /**
     * Sets the outer finder for the QR code.
     * @param outerFinder - The outer finder to set for the QR code.
     */
    setOuterFinder(outerFinder: IShapeOptions): void;

    /**
     * Sets the inner finder for the QR code.
     * @param innerFinder - The inner finder to set for the QR code.
     */
    setInnerFinder(innerFinder: IShapeOptions): void;

    /**
     * Sets the data for the QR code.
     * @param data - The data to set for the QR code.
     */
    setData(data: IShapeOptions): void;

    /**
     * @param size - image target size in pixels
     * @param type - data type of the QR Code blocks {@link DataType}
     */
    generateAssets(size: number, type: DataType): Promise<HTMLImageElement[]>;
}