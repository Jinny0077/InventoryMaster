import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProListing } from "./ProListing";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Product Management Page</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProListing />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
