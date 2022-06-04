import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import Webcam from "react-webcam";
import "./styles.css";
import { useDispatch } from "react-redux";
import { plusCounter, showCounter } from "./modules/states";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import rootReducer from "./modules/index";
import { useSelector } from "react-redux";
import axios from "axios";

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

const downloadsFolder = require("downloads-folder");

const fileDownload = require("js-file-download");

export const PhotoBooth = () => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [localCount, setLocalCount] = useState<any | null>("0");

  useEffect(() => {
    if (localStorage.getItem("localCount") == null){
      localStorage.setItem("localCount", "0");
    }
  },[]);

  useEffect(() => {
    window.addEventListener("resize", (e) => {
      // console.log(window.outerWidth)
      setWindowWidth(window.outerWidth);
    });
  }, [window.outerWidth]);

  useEffect(() => {
    window.addEventListener("resize", (e) => {
      // console.log(window.outerHeight)
      setWindowHeight(window.outerHeight);
    });
  }, [window.outerHeight]);

  const dispatch = useDispatch();

  const onIncrease = () => dispatch(plusCounter(1));
  const count = useSelector((state: any) => state);

  function blobToFile(theBlob: any, fileName: any) {
    return new File([theBlob], fileName, {
      lastModified: new Date().getTime(),
      type: theBlob.type,
    });
  }

  async function downloadImage(imageSrc: RequestInfo) {
    const image = await fetch(imageSrc);
    const imageBlog = await image.blob();
    if (localStorage.getItem("localCount") === "0") {
      setLocalCount("0");
      localStorage.setItem("localCount", "0");
    } else {
      setLocalCount(localStorage.getItem("localCount"));
      console.log(localStorage.getItem("localCount"));
    }
    const blobFile = blobToFile(
      imageBlog,
      "photobooth" + localStorage.getItem("localCount") + ".jpg"
    );
    console.log(localStorage.getItem("localCount"));
    console.log(localCount);
    console.log(image);
    console.log(imageBlog);
    console.log(blobFile);
    const formData = new FormData();
    formData.append("file", blobFile);
    await axios({
      method: "post",
      url: "http://ec2-54-177-242-4.us-west-1.compute.amazonaws.com:5000/api/fileUpload",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // const imageURL = URL.createObjectURL(imageBlog);
    // const link = document.createElement("a");
    // link.href = imageURL;
    // link.download = "photobooth" + localStorage.getItem("localCount");
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    setLocalCount((Number(localStorage.getItem("localCount")) + 1).toString());
    localStorage.setItem(
      "localCount",
      (Number(localStorage.getItem("localCount")) + 1).toString()
    );
    localStorage.setItem("isNew", "True");
    // console.log((Number(localStorage.getItem("localCount")) + 1).toString());
  }

  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);

  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
      downloadImage(imageSrc);
    }
  }, [webcamRef]);

  const consoleLog = (e: any) => {
    if (e.code === "Enter") {
      e.preventDefault();
      capture();
      console.log(e);
      // capture();
    }
  };

  return (
    <>
      {/* <header>
        <h1>여기보세용</h1>
        {count.counter}
      </header> */}
      <>
        <div style={{ overflow: "hidden", width:"100vw", height:"100vh" }} onKeyDown={consoleLog} tabIndex={0}>
          <Webcam
            mirrored={true}
            audio={false}
            width={window.outerWidth}
            height={window.outerHeight}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        </div>
        {/* <button onClick={capture}>사진 촬영</button> */}
      </>

      {/* {url && (
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
      )} */}
    </>
  );
};
