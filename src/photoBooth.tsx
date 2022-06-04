import { useRef, useCallback, useEffect, useLayoutEffect } from "react";
import useState from "react-usestateref";
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
import ReactLoading from "react-loading";

import "./photoBooth.css";

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

export const PhotoBooth = () => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isLoading, setIsLoading, isLoadingRef] = useState(false);
  const [photoCount, setPhotoCount, photoCountRef] = useState<any | null>(0);

  useEffect(() => {
    if (localStorage.getItem("isNew") == null) {
      localStorage.setItem("isNew", "False");
      setIsLoading(false);
    }
    axios
      .get(
        "http://ec2-54-177-242-4.us-west-1.compute.amazonaws.com:5000/api/fileUpload"
      )
      .then((Response) => {
        console.log(Response.data);
        setPhotoCount(Response.data.count);
      })
      .catch((Error) => {
        console.log(Error);
      });
  }, []);

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

  function blobToFile(theBlob: any, fileName: any) {
    return new File([theBlob], fileName, {
      lastModified: new Date().getTime(),
      type: theBlob.type,
    });
  }

  async function downloadImage(imageSrc: RequestInfo) {
    const image = await fetch(imageSrc);
    const imageBlog = await image.blob();

    const blobFile = blobToFile(
      imageBlog,
      "photobooth" + (Number(photoCountRef.current) + 1) + ".jpg"
    );
    const formData = new FormData();
    formData.append("file", blobFile);
    await axios({
      method: "post",
      url: "http://ec2-54-177-242-4.us-west-1.compute.amazonaws.com:5000/api/fileUpload",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((Response) => {
      console.log(Response.data);
      setPhotoCount(Response.data.count)
      localStorage.setItem("isNew", "True");
      setIsLoading(false);
    });

    // const imageURL = URL.createObjectURL(imageBlog);
    // const link = document.createElement("a");
    // link.href = imageURL;
    // link.download = "photobooth" + localStorage.getItem("localCount");
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // console.log((Number(localStorage.getItem("localCount")) + 1).toString());
  }

  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);

  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string>("");
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
      downloadImage(imageSrc);
    }
  }, [webcamRef]);

  // const consoleLog = (e: any) => {
  //   if (e.code === "Enter" && localStorage.getItem("isNew") === "False") {
  //     e.preventDefault();
  //     capture();
  //     console.log(e);
  //     // capture();
  //   }
  // };

  useEffect(() => {
    const keyDownHandler = (event: any) => {
      if (event.key === "Enter") {
        if (isLoadingRef.current == true) {
          event.preventDefault();
        } else if (isLoadingRef.current === false) {
          setIsLoading(true);
          capture();
        }
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <>
          <div className="loading">
            <img className="imgsrc" src={url}></img>
            <ReactLoading className="loadingBar" type="spin" color="#fff" />
          </div>
        </>
      )}

      <div
        style={{ overflow: "hidden", width: "100vw", height: "100vh" }}
        // onKeyDown={consoleLog}
        // tabIndex={0}
      >
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
    </>
  );
};
