import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { LocationState } from '../types';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LocationState | null;
  const redirectPath = locationState?.from?.pathname || '/';

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (username.trim() === '') {
      setError('Vui lòng nhập tên đăng nhập.');
      return;
    }

    const success = login(username, password);
    if (!success) {
      setError('Mật khẩu không đúng. Hãy thử lại với mật khẩu 123456.');
      return;
    }

    setError(null);
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="auth">
      <div className="panel">
        <h1 className="page-title">Đăng nhập</h1>
        <p className="muted">
          {redirectPath === '/checkout'
            ? 'Đăng nhập để tiếp tục thanh toán.'
            : 'Đăng nhập để mua hàng và thanh toán.'}
        </p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              name="username"
              type="text"
              className="input"
              autoComplete="username"
              value={username}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
              placeholder="Ví dụ: minhanh"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              autoComplete="current-password"
              value={password}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
              placeholder="Nhập mật khẩu"
            />
            <p className="hint">Mật khẩu để thử: 123456</p>
          </div>

          {error && (
            <p className="alert alert--error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn--primary btn--block">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
