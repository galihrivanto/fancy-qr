import { DataType, ECC, ILogoOptions, IQROptions, IShapeOptions } from "./types";
import { GradientType, LogoPosition } from "./types";

export class Options implements IQROptions {
    text: string;
    outerFinder: IShapeOptions;
    innerFinder: IShapeOptions;
    data: IShapeOptions;
    visibleParts: DataType[];
    ecc: ECC;
    logo: ILogoOptions;

    constructor() {
        this.text = '';
        this.logo = {
            url: '',
            position: LogoPosition.Center,
            alpha: 1
        };

        this.outerFinder = {
            shape: 'Default',
            fill: {
                from: '#000000',
                to: '#000000',
                type: GradientType.Linear
            }
        }

        this.innerFinder = {
            shape: 'Default',
            fill: {
                from: '#000000',
                to: '#000000',
                type: GradientType.Linear
            }
        }

        this.data = {
            shape: 'Default',
            fill: {
                from: '#000000',
                to: '#000000',
                type: GradientType.Linear
            }
        }

        this.visibleParts = [
            DataType.OuterFinder,
            DataType.InnerFinder,
            DataType.Data
        ]

        this.ecc = ECC.MEDIUM;
    }
}