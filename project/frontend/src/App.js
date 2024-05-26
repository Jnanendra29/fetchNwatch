import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chart from "./components/Chart";
import Stat from "./components/Stat";
import Table from "./components/Table";
import Nopage from "./components/Nopage";
import { useState } from "react";

function App() {
  const [month, setMonth] = useState("March");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Table month={month} setMonth={setMonth} />}
          />
          <Route path="/stat" element={<Stat month={month}/>} />
          <Route path="/chart" element={<Chart month={month} />} />
          <Route path="*" element={<Nopage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
