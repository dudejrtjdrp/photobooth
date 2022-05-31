import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import "./styles.css";
import { useDispatch } from "react-redux";
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import rootReducer from "./modules/index";
import { useSelector } from 'react-redux'

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user"
};

export const Gallery = () => {

  const dispatch = useDispatch();
  
  const count = useSelector((state:any) => state.counter);
  
  const store = createStore(rootReducer, composeWithDevTools());
  console.log(store.getState())


  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
      console.log(count)
    }
  }, [webcamRef]);

  
  function importAll(r:any) {
    let images:any = {};
    r.keys().forEach((item:any, index:any) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  }
  const images = importAll(
    require['context']("./assets", false, /\.(png|jpe?g|svg)$/)
  );

  console.log(images)

  return (
    <>
      <header>
        <h1>{count}</h1>
      </header>
      {isCaptureEnable || (
        <button onClick={() => setCaptureEnable(true)}>촬영하기</button>
      )}
      {isCaptureEnable && (
        <>
          <div>
            <button onClick={() => setCaptureEnable(false)}>닫기</button>
          </div>
          <div>
            <Webcam
              mirrored={true}
              audio={false}
              width={540}
              height={360}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </div>
          <button onClick={capture}>사진 촬영</button>
        </>
      )}
      {url && (
        <>
          <div>
            <button
              onClick={() => {
                setUrl(null);
              }}
            >
              다시 찍기
            </button>
          </div>
          <div>
            <img src={url} alt="Screenshot" />
          </div>
        </>
      )}
    </>
  );
};