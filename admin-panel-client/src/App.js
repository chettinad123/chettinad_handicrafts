import './App.css';
import { Outlet } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import ScrollToTop from "../src/helpers/ScrollToTop";

function App() {

  return (
    <>
    <ScrollToTop />
      <main>
        <Outlet />
      </main>
      {/* Toast Notifications */}
       <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

    </>
  );
}

export default App;