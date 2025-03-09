import { DataType, GradientType, QRCode } from "../src";

let innerFinderShape: string = 'InnerFinder.Drop';
let outerFinderShape: string = 'OuterFinder.Drop';
let dataShape: string = 'Data.Circle';
let innerFinderGradientType: GradientType = GradientType.Radial;
let outerFinderGradientType: GradientType = GradientType.Radial;
let dataGradientType: GradientType = GradientType.Radial;
let innerFinderGradientFrom: string = '#ff0000';
let innerFinderGradientTo: string = '#0000ff';
let outerFinderGradientFrom: string = '#ff0000';
let outerFinderGradientTo: string = '#0000ff';
let dataGradientFrom: string = '#ff0000';
let dataGradientTo: string = '#0000ff';


const size = calculateQrSize(512);
const qr = new QRCode(size);
qr.attachTo(document.getElementById('preview') as HTMLElement);
qr.setText('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');

// generate assets
Object.entries(qr.generateAssets(128, DataType.OuterFinder)).forEach(([name, asset]) => {
    const assetElement = document.createElement('a');
    assetElement.href = '#';
    assetElement.appendChild(asset);
    assetElement.dataset.name = name;
    asset.classList.add('hover:bg-blue-600');
    assetElement.addEventListener('click', () => {
        outerFinderShape = name;
        preview();
        generateCode();
    });
    document.querySelector('#outer-finder .grid')?.appendChild(assetElement);
});

Object.entries(qr.generateAssets(128, DataType.InnerFinder)).forEach(([name, asset]) => {
    const assetElement = document.createElement('a');
    assetElement.href = '#';
    assetElement.appendChild(asset);
    assetElement.dataset.name = name;
    asset.classList.add('hover:bg-blue-600');
    assetElement.addEventListener('click', () => {
        innerFinderShape = name;
        preview();
        generateCode();
    });
    document.querySelector('#inner-finder .grid')?.appendChild(assetElement);
});

Object.entries(qr.generateAssets(128, DataType.Data)).forEach(([name, asset]) => {
    const assetElement = document.createElement('a');
    assetElement.href = '#';
    assetElement.appendChild(asset);
    assetElement.dataset.name = name;
    asset.classList.add('hover:bg-blue-600');
    assetElement.addEventListener('click', () => {
        dataShape = name;
        preview();
        generateCode();
    });
    document.querySelector('#data .grid')?.appendChild(assetElement);
});

document.querySelector('#outer-finder #gradient-type')?.addEventListener('change', (event) => {
    outerFinderGradientType = toGradientType(event.target?.value as string);
    preview();
    generateCode();
});

document.querySelector('#inner-finder #gradient-type')?.addEventListener('change', (event) => {
    innerFinderGradientType = toGradientType(event.target?.value as string);
    preview();
    generateCode();
});

document.querySelector('#data #gradient-type')?.addEventListener('change', (event) => {
    dataGradientType = toGradientType(event.target?.value as string);
    preview();
    generateCode();
});

document.querySelectorAll('#asset-tabs .tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      // Remove active state from all tabs
      document.querySelectorAll('#asset-tabs .tab-btn').forEach(btn => {
        btn.dataset.active = 'false';
      });
      document.querySelectorAll('#asset-tabs .tab-content').forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('block');
      });
      
      // Set active state for clicked tab
      button.dataset.active = 'true';
      const tabId = button.getAttribute('data-tab');
      const tabContent = document.getElementById(tabId);
      if (tabContent) {
        tabContent.classList.remove('hidden');
        tabContent.classList.add('block');
      }
    });
});

document.querySelectorAll('#preview-tabs .tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      // Remove active state from all tabs
      document.querySelectorAll('#preview-tabs .tab-btn').forEach(btn => {
        btn.dataset.active = 'false';
      });
      document.querySelectorAll('#preview-tabs .tab-content').forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('block');
      });
      
      // Set active state for clicked tab
      button.dataset.active = 'true';
      const tabId = button.getAttribute('data-tab');
      const tabContent = document.getElementById(tabId);
      if (tabContent) {
        tabContent.classList.remove('hidden');
        tabContent.classList.add('block');
      }
    });
});

function generateCode() {
    const code = document.getElementById('code-output');
    if (code) {
        const codeText = `
import { QRCode, GradientType } from '@galihrivanto/fancy-qr';

const qr = new QRCode(480);
qr.attachTo(document.getElementById('preview') as HTMLElement);

qr.setText('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
qr.setOuterFinder({
    shape: ${outerFinderShape},
    fill: {
        type: ${toGradientStringType(outerFinderGradientType)},
        from: '${outerFinderGradientFrom}',
        to: '${outerFinderGradientTo}'
    }
});
qr.setInnerFinder({
    shape: ${innerFinderShape},
    fill: {
        type: ${toGradientStringType(innerFinderGradientType)},
        from: '${innerFinderGradientFrom}',
        to: '${innerFinderGradientTo}'
    }
qr.setData({
    shape: ${dataShape},
    fill: {
        type: ${toGradientStringType(dataGradientType)},
        from: '${dataGradientFrom}',
        to: '${dataGradientTo}'
    }
})`

        code.innerHTML = codeText;
    }
}

function toGradientType(type: string): GradientType {
    return type === 'linear' ? GradientType.Linear : GradientType.Radial;
}

function toGradientStringType(type: GradientType): string {
    return type === GradientType.Linear ? 'GradientType.Linear' : 'GradientType.Radial';
}

function preview (){
    qr.setOuterFinder({
        shape: outerFinderShape,
        fill: {
            type: outerFinderGradientType,
            from: outerFinderGradientFrom,
            to: outerFinderGradientTo
        }
    });
    qr.setInnerFinder({
        shape: innerFinderShape,
        fill: {
            type: innerFinderGradientType,
            from: innerFinderGradientFrom,
            to: innerFinderGradientTo
        }
    })
    qr.setData({
        shape: dataShape,
        fill: {
            type: dataGradientType,
            from: dataGradientFrom,
            to: dataGradientTo
        }
    })
}

function calculateQrSize (maxSize: number) {
    const panelSize = document.getElementById('preview')?.clientWidth ?? 0;

    return Math.min(
        panelSize - 20,
        maxSize
    );
}

window.addEventListener('resize', () => {
    const qrSize = calculateQrSize(480);
    qr.setSize(qrSize);
    preview();
    generateCode();
});

preview();
generateCode();



