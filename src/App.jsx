import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: true })


function App() {

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load()
    setReady(true)
  }

  useEffect(() => {
    load()
  }, [])

  const convertToGif = async () => {
    // read the file that we stored
    ffmpeg.FS('writeFile', 'catgif.mp4', await fetchFile(video))

    // run a native CLI ffmpeg command
    await ffmpeg.run('-i', 'catgif.mp4', '-t', '13.0', '-ss', '13.0', '-f', 'gif', 'out.gif')

    // read the data gotten
    const data = ffmpeg.FS('readFile', 'out.gif')

    // create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif/' }))
    setGif(url)
  }

  return ready ? (
    <div className="App">
      {video &&
        <video controls
          width="250"
          src={URL.createObjectURL(video)} >
        </video>
      }

      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

      <button onClick={convertToGif} >Convert</button>

      {gif &&
        <img
          width="250"
          src={gif} />
      }
    </div>
  ) :
    (
      <p>Loading...</p>
    )
}

export default App;
