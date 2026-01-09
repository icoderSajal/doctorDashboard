// import React, { useContext, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import Dashboard from "./components/Dashboard";
// import Login from "./components/Login";
// import AddNewDoctor from "./components/AddNewDoctor";
// import Messages from "./components/Messages";
// import Doctors from "./components/Doctors";
// import { Context } from "./main";
// import axios from "axios";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Sidebar from "./components/Sidebar";
// import AddNewAdmin from "./components/AddNewAdmin";
// import "./App.css";

// const App = () => {
//   const { isAuthenticated, setIsAuthenticated, admin, setAdmin } =
//     useContext(Context);

//   // useEffect(() => {
//   //   const fetchUser = async () => {
//   //     try {
//   //       const response = await axios.get(
//   //         "https://doctorathomeserver.vercel.app/api/v1/user/admin/me",
//   //         {
//   //           withCredentials: true,
//   //         }
//   //       );
//   //       alert(setIsAuthenticated(true), " ",setAdmin(response.data.user);)
//   //       setIsAuthenticated(true);
//   //       setAdmin(response.data.user);
//   //     } catch (error) {
//   //       setIsAuthenticated(false);
//   //       setAdmin({});
//   //     }
//   //   };
//   //   fetchUser();
//   // }, [isAuthenticated]);


//   useEffect(() => {
//   const fetchUser = async () => {
//     try {
//       const response = await axios.get(
//         "https://doctorathomeserver.vercel.app/api/v1/user/admin/me",
//         { withCredentials: true }
//       );
//       setIsAuthenticated(true);
//       setAdmin(response.data.user);
//     } catch (error) {
//       setIsAuthenticated(false);
//       setAdmin({});
//     }
//   };
//   fetchUser();
// }, []); // ✅ correct

//   return (
//     <Router>
//       <Sidebar />
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/doctor/addnew" element={<AddNewDoctor />} />
//         <Route path="/admin/addnew" element={<AddNewAdmin />} />
//         <Route path="/messages" element={<Messages />} />
//         <Route path="/doctors" element={<Doctors />} />
//       </Routes>
//       <ToastContainer position="top-center" />
//     </Router>
//   );
// };

// export default App;



import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewDoctor from "./components/AddNewDoctor";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import AddNewAdmin from "./components/AddNewAdmin";
import Sidebar from "./components/Sidebar";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(Context);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setAdmin } =
    useContext(Context);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(
          "https://doctorathomeserver.vercel.app/api/v1/user/admin/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setAdmin(res.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    fetchAdmin();
  }, []); // IMPORTANT: run only once

  return (
    <Router>
      {isAuthenticated && <Sidebar />}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/addnew"
          element={
            <ProtectedRoute>
              <AddNewDoctor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/addnew"
          element={
            <ProtectedRoute>
              <AddNewAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;

