import axios from "axios";

const SHEET_URL =
  "https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Sheet1!A1:C"; // Replace YOUR_SHEET_ID

const API_KEY = "YOUR_GOOGLE_API_KEY";

export const fetchGoogleSheetData = async () => {
  try {
    const response = await axios.get(`${SHEET_URL}?key=${API_KEY}`);
    const rows = response.data.values;
    return rows.map(([name, email, role]) => ({ name, email, role })); // Adjust indices as needed
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    return [];
  }
};
