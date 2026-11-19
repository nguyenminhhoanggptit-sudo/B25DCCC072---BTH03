import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  clearCart,
  removeFromCart,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from '../features/cart/cartSlice';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartCount);
  const totalPrice = useAppSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="center">
        <p className="center__title">Giỏ hàng đang trống</p>
        <p>Chọn vài sản phẩm ở trang chủ để bắt đầu mua sắm.</p>
        <Link to="/" className="btn btn--primary">
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <section>
      <div className="page-head">
        <h1 className="page-title">Giỏ hàng</h1>
        <button type="button" className="btn btn--danger btn--sm" onClick={() => dispatch(clearCart())}>
          Xóa toàn bộ giỏ
        </button>
      </div>

      <div className="cart-layout">
        <ul className="cart-list">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="cart-item">
              <Link to={`/products/${product.id}`} className="cart-item__media">
                <img src={product.image} alt={product.title} />
              </Link>

              <div className="cart-item__info">
                <Link to={`/products/${product.id}`} className="cart-item__title">
                  {product.title}
                </Link>
                <p className="cart-item__unit">${product.price.toFixed(2)} / sản phẩm</p>
              </div>

              <div className="qty" role="group" aria-label={`Số lượng ${product.title}`}>
                <button
                  type="button"
                  className="qty__btn"
                  onClick={() => dispatch(updateQuantity({ productId: product.id, delta: -1 }))}
                  aria-label="Giảm số lượng"
                >
                  −
                </button>
                <span className="qty__value" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="qty__btn"
                  onClick={() => dispatch(updateQuantity({ productId: product.id, delta: 1 }))}
                  aria-label="Tăng số lượng"
                >
                  +
                </button>
              </div>

              <p className="cart-item__total">${(product.price * quantity).toFixed(2)}</p>

              <button
                type="button"
                className="btn btn--danger btn--sm"
                onClick={() => dispatch(removeFromCart(product.id))}
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>

        <aside className="panel summary">
          <h2 className="summary__title">Tóm tắt đơn hàng</h2>
          <div className="summary__row">
            <span>Tổng số lượng</span>
            <strong>{totalQuantity}</strong>
          </div>
          <div className="summary__row summary__row--total">
            <span>Tổng tiền</span>
            <strong>${totalPrice.toFixed(2)}</strong>
          </div>
          <Link to="/checkout" className="btn btn--primary btn--block">
            Tiến hành thanh toán
          </Link>
          <Link to="/" className="btn btn--ghost btn--block">
            Tiếp tục mua sắm
          </Link>
        </aside>
      </div>
    </section>
  );
}
