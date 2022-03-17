import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Particles from 'react-tsparticles';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(true);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
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
    await ffmpeg.run(
      '-i',
      'catgif.mp4',
      '-t',
      '13.0',
      '-ss',
      '13.0',
      '-f',
      'gif',
      'out.gif',
    );

    // read the data gotten
    const data = ffmpeg.FS('readFile', 'out.gif');

    // create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif/' }),
    );
    setGif(url);
  };

  return ready ? (
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
                value: '#0d47a1',
              },
            },
            fpsLimit: 120,
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
                  quantity: 4,
                },
                repulse: {
                  distance: 200,
                  duration: 0.9,
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
                speed: 6,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: 'circle',
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
                <video
                  controls
                  width="250"
                  height="250"
                  style={{ objectFit: 'cover' }}
                  src={URL.createObjectURL(video)}
                ></video>
              ) : (
                <div
                  style={{
                    width: 250,
                    height: 250,
                    backgroundColor: '#a8a8a8',
                  }}
                ></div>
              )}
              <br />

              <input
                type="file"
                onChange={(e) => setVideo(e.target.files?.item(0))}
              />
            </div>

            <div
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
            </div>

            <div className="output">
              {gif ? (
                <img width="250" height="250" src={gif} />
              ) : (
                <div
                  style={{
                    width: 250,
                    height: 250,
                    backgroundColor: '#a8a8a8',
                  }}
                ></div>
              )}
              <button onClick={convertToGif}>Convert</button>
            </div>
          </main>
        </div>
      </div>
    </>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
