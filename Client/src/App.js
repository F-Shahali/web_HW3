import './App.css';
import './style.css';
import HomePage from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import {Route, BrowserRouter as Router, Routes, useNavigate, Navigate} from 'react-router-dom';
import {useCallback, useEffect, useState} from "react";
import SafeRouting from "./Components/SafeRouting";

const App= () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const setAuth = boolean => {
        setIsAuthenticated(boolean);
    };

    return (
        <Router>
            <Routes>
                <Route element={<SafeRouting Authenticated={isAuthenticated} />}>
                    <Route path="/notes" element={<Dashboard setAuth={setAuth}/>} />
                </Route>
                <Route path="/" element={<HomePage setAuth={setAuth}/>} />
            </Routes>
        </Router>
  );
}

// async function inAuthenticatedState(port, setIsAuthenticated){
//     try {
//         const res = await fetch(`http://localhost:${port}/auth/is-verify`,
//             {
//                 method: 'GET',
//                 headers: {"token": localStorage.token}
//             }
//         );
//
//         const response = await res.json();
//         console.log("y", response);
//         if (response)
//             setIsAuthenticated(true);
//
//     }catch (err){
//         console.log(err.message);
//     }
// }




export default App;
