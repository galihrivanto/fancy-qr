import type { IPainterFactory } from "../types";

const outerFinderPainters = new Map<string, IPainterFactory>();
const innerFinderPainters = new Map<string, IPainterFactory>();
const dataPainters = new Map<string, IPainterFactory>();

export function GetOuterFinderPainterFactory(name: string) : IPainterFactory {
    if (!outerFinderPainters.has(name)) {
        throw TypeError(`outer finder painter "${name}" is not available`);
    }

    return outerFinderPainters.get(name)!;
}

export function GetInnerFinderPainterFactory(name: string) : IPainterFactory {
    if (!innerFinderPainters.has(name)) {
        throw TypeError(`inner finder painter "${name}" is not available`);
    }

    return innerFinderPainters.get(name)!;
}

export function getDataPainterFactory(name: string) : IPainterFactory {
    if (!dataPainters.has(name)) {
        throw TypeError(`module painter "${name}" is not available`);
    }

    return dataPainters.get(name)!;
}

export function GetOuterFinderStyleNames() : string[] {
    return [...outerFinderPainters.keys()];
}

export function GetInnerFinderStyleNames() : string[] {
    return [...innerFinderPainters.keys()];
}

export function GetDataStyleNames() : string[] {
    return [...dataPainters.keys()];
}