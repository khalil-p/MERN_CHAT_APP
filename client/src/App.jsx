import { useSelector } from "react-redux";
import "./App.css";
import { Loader } from "lucide-react";

function App() {
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  return (
    <>
      <h1 className="bg-amber-400">Hello chat app</h1>
    </>
  );
}

export default App;
