const express = require('express');
const QRCode = require('qrcode');
const app = express();

const generateQRCode = async (data, options = {}) => {
  try {
    if (options.type === 'png') {
      return QRCode.toDataURL(data, { ...options, type: 'image/png' });
    } else {
      // Default to SVG if no type or an unrecognized type is specified
      return QRCode.toString(data, { ...options, type: 'svg' });
    }
  } catch (err) {
    console.error(err);
    throw new Error('Failed to generate QR code');
  }
};

app.get('/qr', async (req, res) => {
    const data = req.query.data;
    const type = req.query.type; // "png" or "svg"
  
    // Extract other options from the query parameters
    const options = {
      errorCorrectionLevel: req.query.errorCorrectionLevel || 'medium',
      margin: parseInt(req.query.margin) || 4,
      width: parseInt(req.query.width) || undefined,
      color: {
        dark: req.query.dark || '#000000',
        light: req.query.light || '#ffffff',
      },
    };
  
    if (!data) {
      return res.status(400).send('Missing data parameter');
    }
  
    try {
      const qrCodeData = await generateQRCode(data, { type, ...options });
      if (type === 'png') {
        res.type('image/png');
        const base64Image = qrCodeData.split(';base64,').pop();
        res.send(Buffer.from(base64Image, 'base64'));
      } else {
        res.type('image/svg+xml');
        res.send(qrCodeData);
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

app.listen( () => {
  
});