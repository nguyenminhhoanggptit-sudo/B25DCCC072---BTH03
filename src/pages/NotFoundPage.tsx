import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="center notfound">
      <p className="notfound__code">404</p>
      <p className="center__title">Trang này không tồn tại</p>
      <p>Đường dẫn bạn mở có thể đã đổi hoặc gõ chưa đúng.</p>
      <Link to="/" className="btn btn--primary">
        Về trang chủ
      </Link>
    </div>
  );
}
