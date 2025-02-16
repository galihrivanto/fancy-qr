import qrcodegen from "nayuki-qr-code-generator"
import { DataType, ECC, IQRData, PositionalType } from "./types"
import QrCode = qrcodegen.QrCode

export class QRData implements IQRData {
    readonly REMOVAL_PERCENTAGE = 25;
    readonly FINDER_NUM_DOTS = 7;
    readonly QUIET_ZONE = 0;

    data: DataType[][];
    positions: PositionalType[][];
    dataSize: number;
    private _logoSpace: number;
    private _virtualDotSize: number;

    constructor(text: string, ecc?: ECC, options?: any) {
        this.positions = [];
        this.data = [];
        ecc = ecc ?? ECC.MEDIUM;
        options = options ?? {
            excludeDataForLogo: false
        }

        const encoded = qrcodegen.QrCode.encodeText(text, toEngineECC(ecc));
        const size = encoded.size;
        this.dataSize = encoded.size;

        // Calculate the space for the logo
        const space = Math.round((size * this.REMOVAL_PERCENTAGE) / 100);
        this._logoSpace = Math.round((size * this.REMOVAL_PERCENTAGE) / 100);

        const isLogoSpace = (x: number, y: number) => {
            if (!options.excludeDataForLogo) return false;
            const center = Math.floor(size / 2);
            return (x >= center - space / 2 && x < center + space / 2 && y >= center - space / 2 && y < center + space / 2);
        }

        for (let i = 0; i < encoded.size; i++) {
            this.data[i] = [];
            this.positions[i] = [];
        }

        const _isFinder = (x: number, y: number): boolean => {
            return x >= 0 && x < this.FINDER_NUM_DOTS && y >= 0 && y < this.FINDER_NUM_DOTS
            || x >= encoded.size - this.FINDER_NUM_DOTS && x < encoded.size && y >= 0 && y < this.FINDER_NUM_DOTS
            || x >= 0 && x < this.FINDER_NUM_DOTS && y >= encoded.size - this.FINDER_NUM_DOTS && y < encoded.size;
        }

        const _isInnerFinder = (x: number, y: number): boolean => {
            return x >= 1 && x < this.FINDER_NUM_DOTS - 1 && y >= 1 && y < this.FINDER_NUM_DOTS - 1
            || x >= encoded.size - this.FINDER_NUM_DOTS + 1 && x < encoded.size - 1 && y >= 1 && y < this.FINDER_NUM_DOTS - 1
            || x >= 1 && x < this.FINDER_NUM_DOTS - 1 && y >= encoded.size - this.FINDER_NUM_DOTS + 1 && y < encoded.size - 1;
        }

        for (let y = 0; y < encoded.size; y++) {
            for (let x = 0; x < encoded.size; x++) {
                const m = encoded.getModule(x, y);
                if (m) {
                    if (_isFinder(x, y)) {
                        this.data[x][y] = _isInnerFinder(x, y) ? DataType.InnerFinder : DataType.OuterFinder;
                    } else {
                        this.data[x][y] = isLogoSpace(x, y) ? DataType.None : DataType.Data;
                    }
                } else {
                    this.data[x][y] = DataType.None;
                }
            }
        }

        const isSpace = (x: number, y: number) => {
            return this.at(x, y) === DataType.Background || this.at(x, y) === DataType.None
        }

        const isData = (x: number, y: number) => {
            return this.at(x, y) === DataType.Data
        }

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (isData(x, y)) {
                    if (isSpace(x, y - 1) && isSpace(x + 1, y) && isSpace(x - 1, y) && isData(x, y + 1)) {
                        this.positions[x][y] = PositionalType.North
                    } else if (isSpace(x, y + 1) && isSpace(x + 1, y) && isSpace(x - 1, y) && isData(x, y - 1)) {
                        this.positions[x][y] = PositionalType.South
                    } else if (isSpace(x - 1, y) && isSpace(x, y + 1) && isSpace(x, y - 1) && isData(x + 1, y)) {
                        this.positions[x][y] = PositionalType.West
                    } else if (isSpace(x + 1, y) && isSpace(x, y + 1) && isSpace(x, y - 1) && isData(x - 1, y)) {
                        this.positions[x][y] = PositionalType.East
                    } else if (isSpace(x + 1, y) && isSpace(x, y + 1) && isSpace(x, y - 1) && isSpace(x - 1, y)) {
                        this.positions[x][y] = PositionalType.Single
                    } else {
                        this.positions[x][y] = PositionalType.Middle
                    }
                }
            }
        }
    }

    get size(): number {
        return this.dataSize
    }

    get logoSpace(): number {
        return this._logoSpace
    }

    get dotSize(): number {
        return this._virtualDotSize
    }

    calculatePixelSize(width: number): void {
        const totalDots = this.size + 2.0 * this.QUIET_ZONE
        this._virtualDotSize = width / totalDots
    }

    at(x: number, y: number): DataType {
        if (this.size > 0 && x >= 0 && x < this.size && y >= 0 && y < this.size) return this.data[x][y]
        return DataType.None
    }

    positionTypeAt(x: number, y: number): PositionalType {
        if (this.size > 0 && x >= 0 && x < this.size && y >= 0 && y < this.size) return this.positions[x][y]
        
        return PositionalType.Single
    }    

    walk(fn: (x: number, y: number, dataType: DataType) => void): void {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                fn(x, y, this.at(x, y))
            }
        }
    }
}

function toEngineECC(ecc: ECC): QrCode.Ecc
{
    switch (ecc) {
        case ECC.LOW:
            return QrCode.Ecc.LOW
        case ECC.MEDIUM:
            return QrCode.Ecc.MEDIUM
        case ECC.HIGH:
            return QrCode.Ecc.HIGH
        default:
            throw new Error(`Invalid ECC: ${ecc}`)
    }
}