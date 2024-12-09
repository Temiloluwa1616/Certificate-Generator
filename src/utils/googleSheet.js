const sheetID2 = '1RU6wyewj0D73YUARsqW20yz8Yf4MxcB6UC_a41QvKDI';
const base = `https://docs.google.com/spreadsheets/d/${sheetID2}/gviz/tq?`;
const sheetName = 'Certificate Owners';
const query = encodeURIComponent('Select *');
const url = `${base}&sheet=${sheetName}&tq=${query}`;
const backendURL = 'https://certificate-generator-ffkp.onrender.com/api/certificate/generate-by-json'; // Correct API endpoint

const data = [];

export const init = async function () {
  try {
    console.log('Fetching Google Sheets data...');
    const res = await fetch(url);
    const rep = await res.text();
    const jsO = JSON.parse(rep.substring(47, rep.length - 2));
    console.log('Data fetched:', jsO.table);

    jsO.table.rows.forEach(row => {
      const rowData = row.c.map(cell => (cell ? cell.v : null)); 

      
      const name = rowData[0]; 
      const role = rowData[1]; 
      const email = rowData[2];

    
      data.push({ name, role, email });

    });

    console.log('Processed data:', data);

    console.log('Sending data to backend...');
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
    console.log('Backend response:', backendResult);
    return backendResult;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
};
