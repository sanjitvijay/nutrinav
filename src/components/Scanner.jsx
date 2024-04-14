import * as SDCCore from 'scandit-web-datacapture-core';
import * as SDCBarcode from 'scandit-web-datacapture-barcode';
import { useEffect } from 'react';

const licenseKey = "AkjUozLmFnsDOOOyBDn77iIxYoXuBI5/oiQC1QgjqD/oXmRdL2apfmhA7WMSbODeXiCG6IdBaqUIQf0HHS16Nfojx06dS/aRd0YUVK0b/50oF7jXqjEq6z87XzSXQHhOx+SfXLtv7Eb1nG/V1HYOC7NmLvA5muDR7yOJfeZWw9W28CUCdVQbvVRn73UjgJPeCsT7+kZUc+vcFNrFaNNyCD0NIZ+FJgrR6QcUgxDjA71O59wnqXR22nrnK3d9ZUSJbslEvWop+p7B7Zhfk4tGAHBw/iSrsk0RIp6gZPVPGg8bVO488X7JRzPYv1M3yp1C0/x+mt7ZPaFykxqSXsBouVlIXUIjKYsj3rHYDbhNAmBkwZy9wVoG7M9T9/eY40Mh+WntZRLHd4q1tGbvnQoU3NrC4sf0BXhS/klYhzMvWdMk+PrroKGzbyaofcrpa7PlD6/AXqGTmZMdje+w0H49YDTBh6RAgTnxQCD8hlvPmw2Qihe+82lmTHnNpxPjGS3vWd9HeTEnjaEwgCTt/2pzKB3yJflz7RTg5C6ANVZznYoQ8vgKK3Zdm5ydlJWy0K6KAkUwDwxzhoS4AnIBK7DesWqq4zaIggR7pH9INmH84MrHoaesjUnF6PIDSycq+viLbXGkGfiS6DOcHBGPwSMmbiJYrXNLs79cr9s8HPItit0dzD1iHJxpwxkLlc7haG1EUtFxYsuSt+cVMxty/gLVVRdQrGl4zg2UG0nsCKLhD5m5ghiHRq6RYqs/0IsxM2SkhHEtq+enVcn6HOjJ0/nAdRCUt/Nt1gsKZzwiZGbQ";

 const Scanner = () => {
   useEffect(() => {
     async function runScanner() {
       await SDCCore.configure({
       licenseKey: licenseKey,
       libraryLocation: process.env.PUBLIC_URL + '/node_modules/scandit-web-datacapture-barcode/build/engine',
       moduleLoaders: [SDCBarcode.barcodeCaptureLoader()]
     });

     const context = await SDCCore.DataCaptureContext.create();

     const camera = SDCCore.Camera.default;
     await context.setFrameSource(camera);

     const settings = new SDCBarcode.BarcodeCaptureSettings();
     settings.enableSymbologies([
       SDCBarcode.Symbology.Code128,
       SDCBarcode.Symbology.Code39,
       SDCBarcode.Symbology.QR,
       SDCBarcode.Symbology.EAN8,
       SDCBarcode.Symbology.UPCE,
       SDCBarcode.Symbology.EAN13UPCA
     ]);

     const symbologySetting = settings.settingsForSymbology(SDCBarcode.Symbology.Code39);
     symbologySetting.activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

     const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(context, settings);
     await barcodeCapture.setEnabled(false);

     barcodeCapture.addListener({
       didScan: async (barcodeCapture, session) => {
         await barcodeCapture.setEnabled(false);
         const barcode = session.newlyRecognizedBarcodes[0];
         const symbology = new SDCBarcode.SymbologyDescription(barcode.symbology);
         showResult(barcode.data, symbology.readableName);
         await barcodeCapture.setEnabled(true);
       },
     });

     const view = await SDCCore.DataCaptureView.forContext(context);
     view.connectToElement(document.getElementById("data-capture-view"));
     view.addControl(new SDCCore.CameraSwitchControl()); 

     const barcodeCaptureOverlay = 
       await SDCBarcode.BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
       barcodeCapture,
       view,
       SDCBarcode.BarcodeCaptureOverlayStyle.Frame
     );

     const viewfinder = new SDCCore.RectangularViewfinder(
       SDCCore.RectangularViewfinderStyle.Square,
       SDCCore.RectangularViewfinderLineStyle.Light
     );

     await barcodeCaptureOverlay.setViewfinder(viewfinder); 

     await camera.switchToDesiredState(SDCCore.FrameSourceState.On);
     await barcodeCapture.setEnabled(true);
  }

  function showResult(data, symbology) {
    alert("Scanned: "+data+" "+symbology);
  }

  runScanner().catch((error) => {
    console.error(error);
    alert(error);
    });
  }, []);

  return(
    <div id="data-capture-view"></div>
  )

};

export default Scanner;