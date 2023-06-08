import { Route, Routes } from "react-router-dom";
import classes from "./App.module.css";
import Auth from "./pages/Auth/Auth";
import Home from "./pages/Home/Home";


function App() {


  return (
    <div className={classes.container}>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
