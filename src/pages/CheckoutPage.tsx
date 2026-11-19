import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  clearCart,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
} from '../features/cart/cartSlice';
import { useAuth } from '../contexts/AuthContext';

interface ShippingForm {
  fullName: string;
  phone: string;
  address: string;
}

interface PlacedOrder {
  name: string;
  quantity: number;
  total: number;
}

const initialForm: ShippingForm = { fullName: '', phone: '', address: '' };
const PHONE_PATTERN = /^[0-9+\s().-]{8,15}$/;

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartCount);
  const totalPrice = useAppSelector(selectCartTotal);

  const [form, setForm] = useState<ShippingForm>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<PlacedOrder | null>(null);

  const updateField =
    (field: keyof ShippingForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const { value } = event.target;
      setForm((previous) => ({ ...previous, [field]: value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const fullName = form.fullName.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();

    if (fullName === '' || phone === '' || address === '') {
      setError('Vui lòng điền đủ họ tên, số điện thoại và địa chỉ nhận hàng.');
      return;
    }
    if (!PHONE_PATTERN.test(phone)) {
      setError('Số điện thoại chưa hợp lệ. Hãy nhập 8 đến 15 chữ số.');
      return;
    }

    setError(null);
    setOrder({ name: fullName, quantity: totalQuantity, total: totalPrice });
    dispatch(clearCart());
  };

  if (order) {
    return (
      <div className="auth">
        <div className="panel success">
          <div className="success__icon" aria-hidden="true">
            ✓
          </div>
          <h1 className="page-title">Đặt hàng thành công</h1>
          <p>
            Cảm ơn {order.name}! Đơn hàng gồm {order.quantity} sản phẩm, tổng cộng{' '}
            <strong>${order.total.toFixed(2)}</strong>, sẽ sớm được gửi tới bạn.
          </p>
          <Link to="/" className="btn btn--primary btn--block">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="center">
        <p className="center__title">Chưa có sản phẩm để thanh toán</p>
        <p>Thêm sản phẩm vào giỏ trước khi đặt hàng.</p>
        <Link to="/" className="btn btn--primary">
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <section>
      <h1 className="page-title">Thanh toán</h1>
      <p className="muted">Đặt hàng với tài khoản {user?.username}.</p>

      <div className="cart-layout">
        <form className="panel form" onSubmit={handleSubmit} noValidate>
          <h2 className="summary__title">Thông tin nhận hàng</h2>

          <div className="field">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              id="fullName"
              type="text"
              className="input"
              autoComplete="name"
              value={form.fullName}
              onChange={updateField('fullName')}
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              id="phone"
              type="tel"
              className="input"
              autoComplete="tel"
              value={form.phone}
              onChange={updateField('phone')}
            />
          </div>

          <div className="field">
            <label htmlFor="address">Địa chỉ nhận hàng</label>
            <textarea
              id="address"
              className="input"
              rows={3}
              autoComplete="street-address"
              value={form.address}
              onChange={updateField('address')}
            />
          </div>

          {error && (
            <p className="alert alert--error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn--primary btn--block">
            Đặt hàng
          </button>
        </form>

        <aside className="panel summary">
          <h2 className="summary__title">Tóm tắt đơn hàng</h2>
          <ul className="summary__list">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="summary__item">
                <span className="summary__name">
                  {product.title} <span className="muted">× {quantity}</span>
                </span>
                <span>${(product.price * quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="summary__row">
            <span>Tổng số lượng</span>
            <strong>{totalQuantity}</strong>
          </div>
          <div className="summary__row summary__row--total">
            <span>Tổng tiền</span>
            <strong>${totalPrice.toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
