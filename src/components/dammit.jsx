import React, { useEffect } from 'react';
import { BrowserBarcodeReader } from '@zxing/library'; // Importing BrowserBarcodeReader directly

const BarcodeScanner = () => {
    useEffect(() => {
        // Define custom constraints
        const constraints = {
            video: { 
                facingMode: "environment",
                width: { ideal: 500 },    // Example width constraint
                height: { ideal: 500 },    // Example height constraint
                frameRate: { ideal: 30 },  // Example frame rate constraint
                focusMode: { ideal: 'continuous' } // Example focus mode constraint
            }
        };

        // Access the device's camera with custom constraints
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                // Display camera feed in video element
                var videoElement = document.getElementById('barcodeScanner');
                videoElement.srcObject = stream;
            })
            .catch(function(err) {
                console.error('Error accessing camera: ', err);
            });

        // Initialize barcode scanner
        const codeReader = new BrowserBarcodeReader(); // Using BrowserBarcodeReader directly

        // Listen for barcode scans
        codeReader.decodeFromVideoDevice(undefined, 'barcodeScanner', (result, err) => {
            if (result) {
                // Display scanned barcode number
                document.getElementById('barcodeResult').innerText = result.text;
            }
            if (err) {
                console.error('Barcode scan error: ', err);
            }
        });
    }, []);

    return (
        <div>
            <video id="barcodeScanner" width="100%" height="auto" autoPlay></video>
            <div id="barcodeResult"></div>
        </div>
    );
};

export default BarcodeScanner;
