import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function MainLayout() {
  return (
    <div className="app">
      <Header />
      <main className="main container">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">© {new Date().getFullYear()} ShopMini. Dữ liệu sản phẩm từ FakeStore API.</div>
      </footer>
    </div>
  );
}
