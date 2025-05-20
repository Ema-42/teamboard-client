import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
