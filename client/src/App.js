import { Routes, Redirect, Route } from "react-router-dom";
import "./App.css";
import Button from "./components/Button/Button";
import Layout from "./components/Layout/Layout";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
function App() {
  // const [data, setData] = useState(null);

  // useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" exact></Route>
        <Route path="/login" exact element={<LoginPage />}></Route>
        <Route path="/signup" exact element={<SignupPage />}></Route>
        <Route path="/dashboard" exact element={<Button>Hello</Button>}></Route>
      </Routes>
    </Layout>
  );
}

export default App;
