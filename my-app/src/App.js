import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./Home";


function App() {
  return (
    <Router>
     
        <Routes>
          <Route
            path="/"
            element={<Home/>}
            
          />
         
        </Routes>
   
    </Router>
  );
}

export default App;
