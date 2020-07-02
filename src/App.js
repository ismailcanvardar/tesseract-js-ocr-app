import React, { useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';

function App() {
  const [image, setImage] = useState(null);
  const [ocr, setOcr] = useState(null);

  const worker = createWorker({
    logger: m => console.log(m),
  });

  const doOCR = async (e) => {
    e.preventDefault();
    setOcr("Recognizing...");
    const base64string = image.split(',')[1];
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(Buffer.from(base64string, 'base64'));
    setOcr(text);
  };

  const readImage = (e) => {
    let reader = new FileReader();

    reader.onloadend = function () {
      setImage(reader.result);
    }

    reader.readAsDataURL(e.target.files[0]);
  }

  return (
    <div className="App">
      <form onSubmit={(e) => doOCR(e)}>
        <input type="file" multiple onChange={(e) => readImage(e)} />
        <button type="submit">Recognize</button>
      </form>

      {
        image && <img style={{ height: 200, width: "auto" }} src={Buffer.from(image)} alt="uploaded-image" />
      }

      {
        ocr && (
          <p style={{ fontSize: 40 }}>{ocr}</p>
        )
      }
    </div>
  );
}

export default App;
