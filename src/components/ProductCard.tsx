import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState<boolean>(false);

  useEffect(() => {
    if (!added) {
      return undefined;
    }
    const timer = window.setTimeout(() => setAdded(false), 1200);
    return () => window.clearTimeout(timer);
  }, [added]);

  const handleAdd = (): void => {
    dispatch(addToCart(product));
    setAdded(true);
  };

  const detailPath = `/products/${product.id}`;

  return (
    <article className="card">
      <Link to={detailPath} className="card__media" aria-label={`Xem chi tiết ${product.title}`}>
        <img src={product.image} alt={product.title} loading="lazy" />
      </Link>

      <div className="card__body">
        <span className="chip">{product.category}</span>
        <h3 className="card__title" title={product.title}>
          {product.title}
        </h3>
        <p className="card__price">${product.price.toFixed(2)}</p>

        <div className="card__actions">
          <Link to={detailPath} className="btn btn--ghost btn--sm">
            Xem chi tiết
          </Link>
          <button type="button" className="btn btn--primary btn--sm" onClick={handleAdd}>
            {added ? 'Đã thêm ✓' : 'Thêm vào giỏ'}
          </button>
        </div>
      </div>
    </article>
  );
}
