// ScannerPage.js
import React from 'react';
import BarcodeScanner from '../components/dammit';

const ScannerPage = () => {
  return (
    <div>
      <h1>Scan Barcodes or QR Codes</h1>
      <BarcodeScanner />
    </div>
  );
};

export default ScannerPage;