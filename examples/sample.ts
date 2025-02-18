import { DataType, GradientType, QRCode } from "../src";

let innerFinderShape: string = 'InnerFinder.Drop';
let outerFinderShape: string = 'OuterFinder.Drop';
let dataShape: string = 'Data.Circle';

const qr = new QRCode(480);
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
    document.getElementById('outer-finder')?.appendChild(assetElement);
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
    document.getElementById('inner-finder')?.appendChild(assetElement);
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
    document.getElementById('data')?.appendChild(assetElement);
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

const generateCode = () => {
    const code = document.getElementById('code-output');
    if (code) {
        const codeText = `
const qr = new QRCode(480);
qr.attachTo(document.getElementById('preview') as HTMLElement);

qr.setText('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
qr.setOuterFinder({
    shape: ${outerFinderShape},
    fill: {
        type: GradientType.Radial,
        from: 'red',
        to: 'blue'
    }
});
qr.setInnerFinder({
    shape: ${innerFinderShape},
    fill: {
        type: GradientType.Radial,
        from: 'red',
        to: 'blue'
    }
qr.setData({
    shape: ${dataShape},
    fill: {
        type: GradientType.Radial,
        from: 'red',
        to: 'blue'
    }
})`

        code.innerHTML = codeText;
    }


}

const preview = () => {
    qr.setOuterFinder({
        shape: outerFinderShape,
        fill: {
            type: GradientType.Radial,
            from: 'red',
            to: 'blue'
        }
    });
    qr.setInnerFinder({
        shape: innerFinderShape,
        fill: {
            type: GradientType.Radial,
            from: 'red',
            to: 'blue'
        }
    })
    qr.setData({
        shape: dataShape,
        fill: {
            type: GradientType.Radial,
            from: 'red',
            to: 'blue'
        }
    })
}

preview();
generateCode();



