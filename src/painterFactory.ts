import { 
    DataArrowLinePainter, 
    DataBeehivePainter, 
    DataCirclePainter, 
    DataCircuitPainter, 
    DataCrossPainter, 
    DataDefaultPainter, 
    DataDiamondPainter, 
    DataRibbonLinePainter, 
    DataRoundLinePainter, 
    FinderCirclePainter, 
    FinderDefaultPainter, 
    FinderDropPainter, 
    FinderPetalPainter, 
    FinderRoundedSquarePainter, 
    FinderStarPainter
} from "./styles";
import { 
    DataType, 
    IPainter, 
    IPainterFactory, 
    IQRData, 
    IShapeOptions, 
    SegmentOrientation 
} from "./types";

class BlankPainter implements IPainter {
    paint(
        canvas: HTMLCanvasElement,
        encodedData: IQRData,
        bounds: DOMRect,
        options: IShapeOptions
    ): void {
        // do nothing
    }
}

type StyleFactory = {
    name: string
    factory: () => IPainter
}

export class PainterFactory implements IPainterFactory {
    private _outerFinderPainters: StyleFactory[] = []
    private _innerFinderPainters: StyleFactory[] = []
    private _dataPainters: StyleFactory[] = []

    constructor() {
        const make = (_name: string, _factory: () => IPainter): StyleFactory => {
            return {
                name: _name,
                factory: _factory
            }
        }

        this._outerFinderPainters = [
            make('Default', () => new FinderDefaultPainter(true)),
            make('OuterFinder.Petal', () => new FinderPetalPainter(true)),
            make('OuterFinder.Drop', () => new FinderDropPainter(true)),
            make('OuterFinder.Circle', () => new FinderCirclePainter(true)),
            make('OuterFinder.RoundedSquare', () => new FinderRoundedSquarePainter(true)),
            make('OuterFinder.Diamond', () => new FinderStarPainter(true, 4)),
            make('OuterFinder.SixStar', () => new FinderStarPainter(true, 6)),
            make('OuterFinder.EightStar', () => new FinderStarPainter(true, 8)),
            make('OuterFinder.TenStar', () => new FinderStarPainter(true, 10)),
        ]

        this._innerFinderPainters = [
            make('Default', () => new FinderDefaultPainter(false)),
            make('InnerFinder.Petal', () => new FinderPetalPainter(false)),
            make('InnerFinder.Drop', () => new FinderDropPainter(false)),
            make('InnerFinder.Circle', () => new FinderCirclePainter(false)),
            make('InnerFinder.RoundedSquare', () => new FinderRoundedSquarePainter(false)),
            make('InnerFinder.Diamond', () => new FinderStarPainter(false, 4)),
            make('InnerFinder.SixStar', () => new FinderStarPainter(false, 6)),
            make('InnerFinder.EightStar', () => new FinderStarPainter(false, 8)),
            make('InnerFinder.TenStar', () => new FinderStarPainter(false, 10)),
        ]

        this._dataPainters = [
            make('Default', () => new DataDefaultPainter()),
            make('Data.VLine', () => new DataRoundLinePainter(SegmentOrientation.Vertical)),
            make('Data.HLine', () => new DataRoundLinePainter(SegmentOrientation.Horizontal)),
            make('Data.VHLine', () => new DataRoundLinePainter()),
            make('Data.Arrow', () => new DataArrowLinePainter()),
            make('Data.VRibbon', () => new DataRibbonLinePainter(SegmentOrientation.Vertical)),
            make('Data.HRibbon', () => new DataRibbonLinePainter(SegmentOrientation.Horizontal)),
            make('Data.Diamond', () => new DataDiamondPainter()),
            make('Data.Circle', () => new DataCirclePainter()),
            make('Data.Cross', () => new DataCrossPainter()),
            make('Data.Beehive', () => new DataBeehivePainter()),
            make('Data.CircuitStandard', () => new DataCircuitPainter()),
            make('Data.CircuitPadded', () => new DataCircuitPainter(true)),
        ]
    }

    getNames(type: DataType): string[] {
        if (type === DataType.OuterFinder) return this._outerFinderPainters.map((meta) => meta.name)

        if (type === DataType.InnerFinder) return this._innerFinderPainters.map((meta) => meta.name)

        if (type === DataType.Data) return this._dataPainters.map((meta) => meta.name)

        return []
    }

    make(type: DataType, name: string): IPainter {
        switch (type) {
            case DataType.OuterFinder:
                return this.getFactory(this._outerFinderPainters, name).call(this)
            case DataType.InnerFinder:
                return this.getFactory(this._innerFinderPainters, name).call(this)
            case DataType.Data:
                return this.getFactory(this._dataPainters, name).call(this)
        }
        
        console.warn(`Invalid request for ${type}`)
        return new BlankPainter()
    }

    private getFactory(metas: StyleFactory[], name: string): () => IPainter {
        const meta = metas.find((meta) => meta.name.toLowerCase() === name.toLowerCase())
        if (meta === undefined) {
            return () => new BlankPainter()
        }

        return meta.factory
    }
}