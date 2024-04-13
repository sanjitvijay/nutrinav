import * as SDCCore from 'scandit-web-datacapture-core';
import * as SDCBarcode from 'scandit-web-datacapture-barcode';
import { useEffect } from 'react';

const licenseKey = "AkjUozLmFnsDOOOyBDn77iIxYoXuBI5/oiQC1QgjqD/oXmRdL2apfmhA7WMSbODeXiCG6IdBaqUIQf0HHS16Nfojx06dS/aRd0YUVK0b/50oF7jXqjEq6z87XzSXQHhOx+SfXLtv7Eb1nG/V1HYOC7NmLvA5muDR7yOJfeZWw9W28CUCdVQbvVRn73UjgJPeCsT7+kZUc+vcFNrFaNNyCD0NIZ+FJgrR6QcUgxDjA71O59wnqXR22nrnK3d9ZUSJbslEvWop+p7B7Zhfk4tGAHBw/iSrsk0RIp6gZPVPGg8bVO488X7JRzPYv1M3yp1C0/x+mt7ZPaFykxqSXsBouVlIXUIjKYsj3rHYDbhNAmBkwZy9wVoG7M9T9/eY40Mh+WntZRLHd4q1tGbvnQoU3NrC4sf0BXhS/klYhzMvWdMk+PrroKGzbyaofcrpa7PlD6/AXqGTmZMdje+w0H49YDTBh6RAgTnxQCD8hlvPmw2Qihe+82lmTHnNpxPjGS3vWd9HeTEnjaEwgCTt/2pzKB3yJflz7RTg5C6ANVZznYoQ8vgKK3Zdm5ydlJWy0K6KAkUwDwxzhoS4AnIBK7DesWqq4zaIggR7pH9INmH84MrHoaesjUnF6PIDSycq+viLbXGkGfiS6DOcHBGPwSMmbiJYrXNLs79cr9s8HPItit0dzD1iHJxpwxkLlc7haG1EUtFxYsuSt+cVMxty/gLVVRdQrGl4zg2UG0nsCKLhD5m5ghiHRq6RYqs/0IsxM2SkhHEtq+enVcn6HOjJ0/nAdRCUt/Nt1gsKZzwiZGbQ";

  const Scanner = () => {
    useEffect(() => {
        async function runScanner() {

            // Configure and load the library using your license key. The passed parameter represents the location of the wasm
            // file, which will be fetched asynchronously. You must `await` the returned promise to be able to continue.
            await SDCCore.configure({
                licenseKey: licenseKey,
                libraryLocation: process.env.PUBLIC_URL + '/engine',
                moduleLoaders: [SDCBarcode.barcodeCaptureLoader()]
            });

            // Create the data capture context.
            const context = await SDCCore.DataCaptureContext.create();

            // Try to use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
            // default and must be turned on to start streaming frames to the data capture context for recognition.
            const camera = SDCCore.Camera.default;
            await context.setFrameSource(camera);

            // The barcode capturing process is configured through barcode capture settings,
            // they are then applied to the barcode capture instance that manages barcode recognition.
            const settings = new SDCBarcode.BarcodeCaptureSettings();

            // The settings instance initially has all types of barcodes (symbologies) disabled. For the purpose of this
            // sample we enable a very generous set of symbologies. In your own app ensure that you only enable the
            // symbologies that your app requires as every additional enabled symbology has an impact on processing times.
            settings.enableSymbologies([
                SDCBarcode.Symbology.Code128,
                SDCBarcode.Symbology.Code39,
                SDCBarcode.Symbology.QR,
                SDCBarcode.Symbology.EAN8,
                SDCBarcode.Symbology.UPCE,
                SDCBarcode.Symbology.EAN13UPCA
            ]);

            // Some linear/1D barcode symbologies allow you to encode variable-length data. By default, the Scandit
            // Data Capture SDK only scans barcodes in a certain length range. If your application requires scanning of one
            // of these symbologies, and the length is falling outside the default range, you may need to adjust the "active
            // symbol counts" for this symbology. This is shown in the following few lines of code for one of the
            // variable-length symbologies.
            const symbologySetting = settings.settingsForSymbology(SDCBarcode.Symbology.Code39);
            symbologySetting.activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

            // Create a new barcode capture mode with the settings from above.
            const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(context, settings);
            // Disable the barcode capture mode until the camera is accessed.
            await barcodeCapture.setEnabled(false);

            // Register a listener to get informed whenever a new barcode got recognized.
            barcodeCapture.addListener({
                didScan: async (barcodeCapture, session) => {

                    // Handle scanned data according to your needs here. 
                    await barcodeCapture.setEnabled(false);
                    const barcode = session.newlyRecognizedBarcodes[0];
                    const symbology = new SDCBarcode.SymbologyDescription(barcode.symbology);

                    console.log("session", session);

                    showResult(barcode.data, symbology.readableName);
                    await barcodeCapture.setEnabled(true);

                },
            });

            // To visualize the ongoing barcode capturing process on screen, set up a data capture view that renders the
            // camera preview. The view must be connected to the data capture context.
            const view = await SDCCore.DataCaptureView.forContext(context);

            // Connect the data capture view to the rendered HTML element.
            view.connectToElement(document.getElementById("data-capture-view"));

            // Add a control to be able to switch cameras.
            view.addControl(new SDCCore.CameraSwitchControl());

            // Add a barcode capture overlay to the data capture view to render the location of captured barcodes on top of
            // the video preview. This is optional, but recommended for better visual feedback.    
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

            // Switch the camera on to start streaming frames.
            // The camera is started asynchronously and will take some time to completely turn on.
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