import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Particles from 'react-tsparticles';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [video, setVideo] = useState();
  const [bgColor, setbgColor] = useState('#0d47a1');
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg
      .load()
      .then((value) => {
        console.log(value);
        setReady(true);
      })
      .catch((err) => {
        console.log(err);
        setbgColor('#f58b67');
        setReady(false);
        setError(true)
      });
  };

  useEffect(() => {
    load();

    return () => {};
  }, []);

  const particlesInit = (main) => {
    console.log(main);

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
  };

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const convertToGif = async () => {
    // read the file that we stored
    ffmpeg.FS('writeFile', 'catgif.mp4', await fetchFile(video));

    // run a native CLI ffmpeg command
    await ffmpeg
      .run(
        '-i',
        'catgif.mp4',
        '-t',
        '13.0',
        '-ss',
        '13.0',
        '-f',
        'gif',
        'out.gif',
      )
      .then(() => {
        setbgColor('#86f567');
      })
      .catch(() => {
        setbgColor('#f58b67');
      });

    // read the data gotten
    const data = ffmpeg.FS('readFile', 'out.gif');

    // create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif/' }),
    );
    setGif(url);
  };

  const openFileSelect = () => {
    if (ready) {
      document.getElementById('video_file_upload')?.click();
    }
  };

  return (
    <>
      <div
        style={{
          zIndex: -10,
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
        }}
      >
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: bgColor,
              },
            },
            fpsLimit: 50,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: 'push',
                },
                onHover: {
                  enable: true,
                  mode: 'repulse',
                },
                resize: true,
              },
              modes: {
                bubble: {
                  distance: 400,
                  duration: 5,
                  opacity: 0.8,
                  size: 40,
                },
                push: {
                  quantity: 2,
                },
                repulse: {
                  distance: 100,
                  duration: 30,
                },
              },
            },
            particles: {
              color: {
                value: '#ffffff',
              },
              links: {
                color: '#ffffff',
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: 'none',
                enable: true,
                outMode: 'bounce',
                random: false,
                speed: 3,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 30,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: 'square',
              },
              size: {
                random: true,
                value: 5,
              },
            },
            detectRetina: true,
          }}
        />
      </div>

      <div style={{}} className="App">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <main
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: 'auto',
              alignSelf: 'center',
            }}
          >
            <div className="input">
              {video ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <video
                    controls
                    width="250"
                    height="250"
                    style={{ objectFit: 'cover', borderRadius: 10 }}
                    src={URL.createObjectURL(video)}
                  ></video>
                  <button onClick={() => openFileSelect()}>Choose Video</button>
                </div>
              ) : (
                <div className="empty-input" onClick={() => openFileSelect()}>
                  <div>
                    {ready ? 'Click to select a video' : 'Loading FFMPEG...'}{' '}
                  </div>
                </div>
              )}
              <br />

              <input
                id="video_file_upload"
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files?.item(0))}
              />
            </div>

            <div
              className="middle"
              style={{
                height: '250px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '10px',
              }}
            >
              <code className="code" style={{ fontSize: 50 }}>
                Gifer
              </code>
              <br />
              <small style={{}}>Video to Gif File converter</small>
              <br />
              {video && <button onClick={convertToGif}>Convert</button>}
              {error && <div style={{backgroundColor: "red", borderRadius:10, padding: "3px"}}>Error</div> }
            </div>

            <div className="output">
              {gif ? (
                <img width="250" height="250" src={gif} />
              ) : (
                <div className="empty-input">
                  <div>Your output will be displayed here</div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
