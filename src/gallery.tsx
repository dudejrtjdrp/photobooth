import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import "./styles.css";
import { useDispatch } from "react-redux";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import rootReducer from "./modules/index";
import { useSelector } from "react-redux";
import axios from "axios";
import "./gallery.css";

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

export const Gallery = () => {
  const dispatch = useDispatch();
  const [photoCount, setPhotoCount] = useState(0);

  useEffect(() => {
    axios
    .get("http://ec2-54-177-242-4.us-west-1.compute.amazonaws.com:5000/api/fileUpload")
    .then((Response) => {
      console.log(Response.data);
      setResponseArray(Response.data.result.reverse());
      setPhotoCount(Response.data.result.length)
    })
    .catch((Error) => {
      console.log(Error);
    });
  });

  const count = useSelector((state: any) => state.counter);

  const store = createStore(rootReducer, composeWithDevTools());
  console.log(store.getState());

  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
      console.log(count);
    }
  }, [webcamRef]);

  const [responseArray, setResponseArray] = useState([]);
  useEffect(() => {
    setInterval(() => {
      // const localStorageValue = [{ name: "object2" }]; //JSON.parse(localStorage.getItem("objects"));
      if (localStorage.getItem("isNew") === "True") {
        // getObjectsList(localStorageValue);
        console.log("True");
        localStorage.setItem("isNew", "False");

        axios
          .get("http://localhost:5000/fileUpload")
          .then((Response) => {
            console.log(Response.data);
            setResponseArray(Response.data.result.reverse());
            setPhotoCount(Response.data.result.length)
          })
          .catch((Error) => {
            console.log(Error);
          });
      }
    }, 1000);
  }, []);

  function importAll(r: any) {
    let images: any = {};
    r.keys().forEach((item: any, index: any) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  }
  const images = importAll(
    require["context"]("./assets", false, /\.(png|jpe?g|svg)$/)
  );

  const consoleLog = (e: any) => {
    if (e.code === "Enter") {
      e.preventDefault();
      console.log(e);
      // capture();
    }
  };

  return (
    <>
    {photoCount}
    <div className="image-grid">
        {responseArray.map((item) => (
            <img src={item}></img>
        ))}
        </div>
    </>
  );
};
