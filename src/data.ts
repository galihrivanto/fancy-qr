import qrcodegen from "nayuki-qr-code-generator";
import { CrossNeighbor, IQRCodeData, ModuleType, Segment, SegmentType } from "./types";

export class QRCodeData implements IQRCodeData {
    private _text: string;
    private _ecc: string;
    private _data: ModuleType[][];
    private _size: number;
    private _quiteZone: number;

    constructor(text: string, ecc: string, quiteZone: number = 4) {
        this._text = text;
        this._ecc = ecc;
        this._quiteZone = quiteZone;
        this._size = size;

        this._generate();
    }
    
    get modules(): ModuleType[][] {
        return this._data;
    }

    get size(): number {
        return this._data.length;
    }

    get quiteZone(): number {
        return this._quiteZone;
    }

    async setText(text: string): Promise<void> {
        this._text = text;
        await this._generate();
    }

    async setEcc(ecc: string): Promise<void> {
        this._ecc = ecc;
        await this._generate();
    }

    get data(): ModuleType[][] {
        return this._data;
    }

    findSegments(type: SegmentType, fn: (segment: Segment) => void): void {
        let segmenting = false;
        let startX: number = 0;
        let startY: number = 0;
        let lastX: number = 0;
        let lastY: number = 0;

        if (type === SegmentType.Horizontal) {
            for (let y = 0; y < this._data.length; y++) {
                for (let x = 0; x < this._data[y].length; x++) {
                    if (this._data[y][x] === ModuleType.Data) {
                        if (!segmenting) {
                            segmenting = true;
                            startX = x;
                            startY = y;
                        }
                    } else {
                        if (segmenting) {
                            segmenting = false;
                            lastX = x - 1;
                            lastY = y;
                            fn({ type: type, startX: startX, startY: startY, endX: lastX, endY: lastY });
                        }
                    }
                }
            }
        } else {
            for (let x = 0; x < this._data[0].length; x++) {
                for (let y = 0; y < this._data.length; y++) {
                    if (this._data[y][x] === ModuleType.Data) {
                        if (!segmenting) {
                            segmenting = true;
                            startX = y;
                            startY = x;
                        }
                    } else {
                        if (segmenting) {
                            segmenting = false;
                            lastX = y - 1;
                            lastY = x;
                            fn({ type: type, startX: startX, startY: startY, endX: lastX, endY: lastY });
                        }
                    }
                }
            }
        }
    }

    findCrossNeighbors(fn: (cross: CrossNeighbor) => void): void {
        for (let y = 0; y < this._data.length; y++) {
            for (let x = 0; x < this._data[y].length; x++) {
                if (this._data[y][x] === ModuleType.Data) {
                    if (y > 0 && y < this._data.length - 1 && x > 0 && x < this._data[y].length - 1) {
                        fn({
                            x: x,
                            y: y,
                            rightTopCross: this._data[y - 1][x] === ModuleType.Data && this._data[y][x + 1] === ModuleType.Data,
                            leftTopCross: this._data[y - 1][x] === ModuleType.Data && this._data[y][x - 1] === ModuleType.Data,
                            leftBottomCross: this._data[y + 1][x] === ModuleType.Data && this._data[y][x - 1] === ModuleType.Data,
                            rightBottomCross: this._data[y + 1][x] === ModuleType.Data && this._data[y][x + 1] === ModuleType.Data
                        })
                    }
                }
            }
        }
    }

    findLogoSegment(fn: (segment: Segment) => void): void {
        // logo size either 7 or 8 cell length
        const logoStartIndex = this._size % 2 ? (this._size / 2) - 4 : Math.floor(this._size / 2) - 3;
        const logoEndIndex = this._size % 2 ? (this._size / 2) + 3 : Math.ceil(this._size / 2) + 3;

        fn({
            type: SegmentType.Horizontal,
            startX: logoStartIndex,
            startY: logoStartIndex,
            endX: logoEndIndex,
            endY: logoEndIndex
        });
    }
    
    private async _generate(): Promise<void> {
        const qrcodegen = (await import("nayuki-qr-code-generator")).default;
        const segments = qrcodegen.QrSegment.makeSegments(this._text);
        
        let ecc: qrcodegen.QrCode.Ecc = qrcodegen.QrCode.Ecc.LOW;
        switch (this._ecc) {
            case "M":
                ecc = qrcodegen.QrCode.Ecc.MEDIUM;
                break;
            case "Q":
                ecc = qrcodegen.QrCode.Ecc.QUARTILE;
                break;
            case "H":
                ecc = qrcodegen.QrCode.Ecc.HIGH;
                break;
        }

        function innerEye(x: number, y: number, size: number): boolean {
            return ((x > 0 && y > 0) && (x < 6 && y < 6)) // top left
            || (x > (size - 7) && y > 0 && (x < (size - 1) && y < 6)) // top right
            || (x > 0 && y > (size - 7)) && (x < 6 && y < (size -1))
        }

        function eye(x: number, y: number, size: number): boolean {
            return ((x >= 0 && y >= 0) && (x <= 6 && y <= 6)) // top left
            || (x >= (size - 7) && y >= 0 && (x <= (size - 1) && y <= 6)) // top right
            || (x >= 0 && y >= (size - 7)) && (x <= 6 && y <= (size -1))
        }

        function moduleByPixel(fill: boolean, x: number, y: number): ModuleType {
            if (!fill) return ModuleType.None;

            if (innerEye(x, y, this._size)) {
                return ModuleType.InnerEye;
            } else if (eye(x, y, this._size)) {
                return ModuleType.OuterEye;
            } else {
                return ModuleType.Data;
            }
        }

        // encode segments into a QR code
        const qr = qrcodegen.QrCode.encodeSegments(segments, ecc, qrcodegen.QrCode.MIN_VERSION, qrcodegen.QrCode.MAX_VERSION, -1, false);
        this._size = qr.size;

        // enrich data by determine style parts
        this._data = [];

        for (let y = 0; y < qr.size; y++) {
            for (let x = 0; x < qr.size; x++) {
                const fill = qr.getModule(x, y);
                this._data[y][x] = moduleByPixel(fill, x, y);
            }
        }
    }
}