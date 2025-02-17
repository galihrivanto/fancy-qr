<div align="center">
  <h1>Fancy QR</h1>
  ![NPM Version](https://img.shields.io/npm/v/@galihrivanto/fancy-qr)


<br />

  A QR code generator with fancy styles options.
</div>



## Why?
I was involved in a project that create QR code editor with a lot of styles options and advanced features. This project is simplified version using basic canvas2d and svg. The abstraction is inspired (copied) from the project.

This project created to be used in [board2share project](https://github.com/galihrivanto/board2share), replacing plain 3rd party qr code generator.

## Installation

```bash
npm install @galihrivanto/fancy-qr
```

## Usage

```ts
import { QRCode } from '@galihrivanto/fancy-qr';

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
qr.setData({
    shape: 'Data.Circle',
    fill: {
        type: GradientType.Radial,
        from: 'red',
        to: 'blue'
    }
});
```