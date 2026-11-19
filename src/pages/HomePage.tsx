import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from '../features/products/productsSlice';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const filteredProducts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (keyword === '') {
      return products;
    }
    return products.filter((product) => product.title.toLowerCase().includes(keyword));
  }, [products, query]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleRetry = (): void => {
    void dispatch(fetchProducts());
  };

  return (
    <section>
      <div className="hero">
        <h1 className="hero__title">Tìm món đồ bạn cần, thêm vào giỏ trong một chạm</h1>
        <p className="hero__subtitle">
          Quần áo, trang sức, đồ điện tử. Gõ tên sản phẩm để lọc ngay trên danh sách.
        </p>
      </div>

      <div className="toolbar">
        <div className="search">
          <span className="search__icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            className="input search__input"
            placeholder="Tìm sản phẩm theo tên..."
            value={query}
            onChange={handleSearchChange}
            aria-label="Tìm sản phẩm theo tên"
          />
        </div>
        {status === 'succeeded' && (
          <p className="toolbar__count">
            {filteredProducts.length} / {products.length} sản phẩm
          </p>
        )}
      </div>

      {(status === 'idle' || status === 'loading') && (
        <div className="center" role="status">
          <div className="spinner" />
          <p>Đang tải danh sách sản phẩm...</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="alert alert--error" role="alert">
          <p className="alert__title">Không tải được sản phẩm</p>
          <p>{error ?? 'Đã xảy ra lỗi không xác định.'}</p>
          <button type="button" className="btn btn--primary btn--sm" onClick={handleRetry}>
            Tải lại
          </button>
        </div>
      )}

      {status === 'succeeded' && filteredProducts.length === 0 && (
        <div className="center">
          <p className="center__title">Không có sản phẩm nào khớp với "{query.trim()}"</p>
          <p>Thử một từ khóa khác, ví dụ "shirt", "ring" hoặc "backpack".</p>
        </div>
      )}

      {status === 'succeeded' && filteredProducts.length > 0 && (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
