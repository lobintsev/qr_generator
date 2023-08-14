const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
app.use(cors());

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

  if (!data) {
    return res.status(400).send('Missing data parameter');
  }

  const options = {
    type,
    errorCorrectionLevel: req.query.errorCorrectionLevel || 'medium',
    margin: parseInt(req.query.margin) || 4,
    width: parseInt(req.query.width) || undefined,
    color: {
      dark: req.query.dark || '#000000',
      light: req.query.light || '#ffffff',
    },
  };

  try {
    const qrCodeData = await generateQRCode(data, options);

    if (type === 'png') {
      res.send(qrCodeData); // Send the base64 string directly
    } else {
      res.type('image/svg+xml');
      res.send(qrCodeData); // Send as SVG
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});