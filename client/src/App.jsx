import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { getUser, setOnlineUsers } from "./store/slices/authSlice";
import { connectSocket, disconnetSocket } from "./lib/socket";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
function App() {
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser);
  }, [getUser]);

  useEffect(() => {
    if (authUser) {
      const socket = connectSocket(authUser._id);

      socket.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });
    }

    return () => disconnetSocket();
  }, [authUser]);

  if (isCheckingAuth && !authUser) {
    <div className="flex justify-center items-center">
      <Loader className="size-10 animate-spin" />
    </div>;
  }
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/register"
            element={!authUser ? <Register /> : <Navigate to={"/"} />}
          />
          <Route
            path="/login"
            element={!authUser ? <Login /> : <Navigate to={"/"} />}
          />
          <Route
            path="/profile"
            element={authUser ? <Profile /> : <Navigate to={"/login"} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
