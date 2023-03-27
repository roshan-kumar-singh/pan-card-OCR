const Tesseract = require('tesseract.js');
const Jimp = require('jimp');


const inputFilePath = "C:\Users\ROSHAN KUMAR SINGH\Documents\Downloads\Screenshot (1554).png";

const idType = 'panCard';

function extractDetails(ocrOutput) {
  const namePattern = /name\s*:\s*([a-z\s]+)\s*\n/i;
  const fatherNamePattern = /father['’]?s?\s*name\s*:\s*([a-z\s]+)\s*\n/i;
  const dobPattern = /dob\s*:\s*(\d{2}\/\d{2}\/\d{4})/i;
  const idNumberPattern = /(pan\s*card|aadhar\s*card|driving\s*license)\s*:\s*([a-z0-9]+)/i;

  const nameMatch = ocrOutput.match(namePattern);
  const fatherNameMatch = ocrOutput.match(fatherNamePattern);
  const dobMatch = ocrOutput.match(dobPattern);
  const idNumberMatch = ocrOutput.match(idNumberPattern);

  const details = {
    idType,
    idNumber: idNumberMatch ? idNumberMatch[2].toUpperCase() : null,
    info: {
      name: nameMatch ? nameMatch[1] : null,
      fatherName: fatherNameMatch ? fatherNameMatch[1] : null,
      dob: dobMatch ? dobMatch[1] : null,
    },
  };

  return details;
}

Jimp.read(inputFilePath)
  .then(image => {
    image
      .greyscale()
      .contrast(1)
      .normalize();

    return Tesseract.recognize(image, { lang: 'eng' });
  })
  .then(ocrOutput => {
    const details = extractDetails(ocrOutput.data.text);

    console.log(JSON.stringify(details, null, 2));
  })
  .catch(error => {
    console.error(error);
  });
