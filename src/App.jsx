import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import FileUpload from './components/FileUpload'
import { init } from './utils/googleSheet'
import React, { useEffect } from 'react';
import SheetDataFetcher from './components/SheetDataFetcher'

function App() {

  // useEffect(() => {
  //   init().then(result => {
  //     console.log('Final result:', result);
  //   });
  // }, []);

  return <div><SheetDataFetcher/></div>;
}

export default App
