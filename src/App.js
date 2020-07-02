import React, { useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';
import "./App.css";

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
    <div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <form onSubmit={(e) => doOCR(e)}>
          <input name="file" id="file" type="file" multiple onChange={(e) => readImage(e)} class="inputfile" />
          {
            image !== null ? <button className="recognize" type="submit">Recognize</button>
            :
            <label for="file">Browse</label>
          }
        </form>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        {
          image ?
            (
              <img style={{ height: 200, width: "auto", borderRadius: 20 }} src={Buffer.from(image)} alt="uploaded-image" />
            )
            :
            (<p>No photo available.</p>)

        }
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 20, paddingLeft: 35, paddingRight: 35 }}>
        {
          ocr && (
            <p style={{ fontSize: 25, textAlign: "center" }}>{ocr}</p>
          )
        }
      </div>
    </div>
  );
}

export default App;
