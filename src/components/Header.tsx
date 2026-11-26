import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectCartCount } from "../features/cart/cartSlice";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const getNavClass = ({ isActive }: { isActive: boolean }): string =>
  isActive ? "nav__link nav__link--active" : "nav__link";

export default function Header() {
  const cartCount = useAppSelector(selectCartCount);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logo" aria-label="ShopMini - về trang chủ">
          ShopMini
        </Link>

        <nav className="nav" aria-label="Điều hướng chính">
          <NavLink to="/" end className={getNavClass}>
            Trang chủ
          </NavLink>
          <NavLink to="/cart" className={getNavClass}>
            Giỏ hàng
            <span
              className={cartCount > 0 ? "badge" : "badge badge--empty"}
              aria-label={`${cartCount} sản phẩm trong giỏ`}
            >
              {cartCount}
            </span>
          </NavLink>
          <NavLink to="/checkout" className={getNavClass}>
            Thanh toán
          </NavLink>
        </nav>

        <div className="header__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={
              isDark
                ? "Chuyển sang giao diện sáng"
                : "Chuyển sang giao diện tối"
            }
            title={isDark ? "Giao diện sáng" : "Giao diện tối"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {user ? (
            <>
              <span className="header__user" title={user.username}>
                Xin chào, {user.username}
              </span>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={logout}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn--primary btn--sm">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
