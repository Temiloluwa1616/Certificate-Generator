import React, { useState } from 'react';

const SheetDataFetcher = () => {
  const [sheetLink, setSheetLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [email, setEmail] = useState("")

  const extractSheetDetails = (link) => {
    try {
      // Regular expression to extract sheet ID from various Google Sheets URL formats
      const sheetIDMatch = link.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      const sheetNameMatch = link.match(/gid=(\d+)/);

      if (!sheetIDMatch) {
        throw new Error('Invalid Google Sheets link');
      }

      return {
        sheetID: sheetIDMatch[1],
        sheetName: 'Sheet1' // Default sheet name, can be modified
      };
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const fetchSheetData = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Extract sheet details from the link
      const sheetDetails = extractSheetDetails(sheetLink);
      if (!sheetDetails) {
        throw new Error('Could not extract sheet details');
      }

      const { sheetID, sheetName } = sheetDetails;
      
      
      const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
      const query = encodeURIComponent(`Select ${name}, ${role}, ${email}`);
      const url = `${base}&sheet=${sheetName}&tq=${query}`;

      
      const res = await fetch(url);
      const rep = await res.text();
      const jsO = JSON.parse(rep.substring(47, rep.length - 2));

    
      const data = jsO.table.rows.map(row => {
        const rowData = row.c.map(cell => (cell ? cell.v : null));
        return {
          name: rowData[0],
          role: rowData[1],
          email: rowData[2]
        };
      });

      console.log(data)

      // Send to backend
      const backendURL = 'https://certificate-generator-ffkp.onrender.com/api/certificate/generate-by-json';
      const backendResponse = await fetch(backendURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!backendResponse.ok) {
        throw new Error(`Backend request failed: ${backendResponse.statusText}`);
      }

      const backendResult = await backendResponse.json();
      setResult(backendResult);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fetcher-container">
  <h2 className="fetcher-title">Google Sheets Certificate Sender</h2>
  <input 
    type="text"
    value={sheetLink}
    onChange={(e) => setSheetLink(e.target.value)}
    placeholder="Paste Google Sheets link here"
    className="fetcher-input"
  />
  <input 
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Insert Name Column e.g, A"
    className="fetcher-input"
  />
  <input 
    type="text"
    value={role}
    onChange={(e) => setRole(e.target.value)}
    placeholder="Insert Role Column e.g, B"
    className="fetcher-input"
  />
  <input 
    type="text"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Insert email Column e.g, C"
    className="fetcher-input"
  />
  <button 
    onClick={fetchSheetData}
    disabled={loading}
    className="fetcher-button"
  >
    {loading ? 'Sending...' : 'Send'}
  </button>

  {error && (
    <div className="fetcher-message fetcher-error">
      Error: {error}
    </div>
  )}

  {result && (
    <div className="fetcher-message fetcher-success">
      Certificate successfully sent 
     
    </div>
  )}
</div>

  );
};

export default SheetDataFetcher;