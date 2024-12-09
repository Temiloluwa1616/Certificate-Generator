import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import * as XLSX from 'xlsx';

const FileUpload = ({ storage, firestore }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState([]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const processExcelFile = async (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      for (const { Name, Email, Course } of jsonData) {
        // Generate certificate for each user
        await generateCertificate(Name, Course, Email);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const generateCertificate = async (name, course, email) => {
    // Create a canvas for the certificate
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    const templateImage = new Image();
    templateImage.src = '/path-to-certificate-template.png'; // Replace with your actual template path
    templateImage.onload = async () => {
      ctx.drawImage(templateImage, 0, 0, 1200, 800);
      ctx.font = 'bold 40px Arial';
      ctx.fillText(name, 600, 400);
      ctx.fillText(course, 600, 500);

      // Convert canvas to Blob
      canvas.toBlob(async (blob) => {
        const storageRef = ref(storage, `certificates/${name}_certificate.png`);
        await uploadBytes(storageRef, blob);

        const certificateURL = await getDownloadURL(storageRef);

        // Save data to Firestore
        const docRef = await addDoc(collection(firestore, 'certificates'), {
          name,
          email,
          course,
          certificateURL,
        });

        // Update the status
        setStatus((prevStatus) => [
          ...prevStatus,
          { name, email, status: 'Certificate Uploaded', certificateURL },
        ]);

        // Optional: Send email via Firebase Functions (or manual email API)
        console.log(`Certificate generated for ${name}: ${certificateURL}`);
      });
    };
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file.');
    await processExcelFile(file);
  };

  return (
    <div>
      <h1>Upload Excel File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <h2>Status</h2>
      <ul>
        {status.map((result, index) => (
          <li key={index}>
            {result.name} ({result.email}): {result.status} - 
            <a href={result.certificateURL} target="_blank" rel="noopener noreferrer">View Certificate</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
