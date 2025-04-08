import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-blue-600 text-white">Navbar</header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
