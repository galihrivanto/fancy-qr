import { GradientType, QRCode } from "../src";

console.log('hello');
const qr = new QRCode(640);
qr.attachTo(document.getElementById('app') as HTMLElement);
qr.setText('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
qr.setOuterFinder({
    shape: 'OuterFinder.Drop',
    fill: {
        type: GradientType.Radial,
        from: 'red',
        to: 'blue'
    }
});
qr.setInnerFinder({
    shape: 'InnerFinder.Drop',
    fill: {
        type: GradientType.Radial,
        from: 'red',
        to: 'blue'
    }
})
qr.setData({
    shape: 'Data.Circle',
    fill: {
        type: GradientType.Radial,
        from: 'red',
        to: 'blue'
    }
})
