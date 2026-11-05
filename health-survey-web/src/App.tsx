import Toaster from "./components/toaster/Toaster";
import AppRoutes from "./navigation";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
