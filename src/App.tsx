import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import "./styles.css";
import { PhotoBooth } from "./photoBooth";
import { Gallery } from "./gallery";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user"
};

export const App = () => {
	return (
		<div className='App'>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<PhotoBooth />}></Route>
					<Route path="/gallery" element={<Gallery />}></Route>
					{/* <Route path="*" element={<NotFound />}></Route> */}
				</Routes>
			</BrowserRouter>
		</div>
	);
};