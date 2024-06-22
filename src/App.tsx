import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import HomeScreen from "./screens/Home";
import RulesScreen from "./screens/Rules";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginScreen from "./screens/Login";
import AuthGuard from "./guards/AuthGuard";

export const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route element={<AuthGuard />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/rules" element={<RulesScreen />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
