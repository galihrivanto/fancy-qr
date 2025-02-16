import { QRCode } from "../src";

console.log('hello');
const qr = new QRCode();
qr.attachTo(document.getElementById('app') as HTMLElement);
qr.setText('Hello, world!');
qr.setOuterFinder({
    shape: 'OuterFinder.Petal',
    fill: '#000000'
});
