import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addToCart } from "../features/cart/cartSlice";
import { selectProductById } from "../features/products/productsSlice";
import type { Product } from "../types";

type DetailStatus = "loading" | "succeeded" | "notFound" | "failed";

const isProduct = (value: unknown): value is Product => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.title === "string" &&
    typeof candidate.price === "number" &&
    typeof candidate.description === "string" &&
    typeof candidate.category === "string" &&
    typeof candidate.image === "string"
  );
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const dispatch = useAppDispatch();

  const storeProduct = useAppSelector((state) =>
    selectProductById(state, productId),
  );
  const quantityInCart = useAppSelector(
    (state) =>
      state.cart.items.find((item) => item.product.id === productId)
        ?.quantity ?? 0,
  );
  const hasStoreProduct = storeProduct !== undefined;

  const [fetchedProduct, setFetchedProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<DetailStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (hasStoreProduct) {
      return undefined;
    }
    if (!Number.isInteger(productId) || productId <= 0) {
      setStatus("notFound");
      return undefined;
    }

    const controller = new AbortController();
    setStatus("loading");
    setErrorMessage(null);

    const load = async (): Promise<void> => {
      try {
        const response = await fetch(
          `https://fakestoreapi.com/products/${productId}`,
          {
            signal: controller.signal,
          },
        );
        if (!response.ok) {
          throw new Error(`Máy chủ trả về mã lỗi ${response.status}.`);
        }

        const text = await response.text();
        const data: unknown = text ? JSON.parse(text) : null;
        if (isProduct(data)) {
          setFetchedProduct(data);
          setStatus("succeeded");
        } else {
          setStatus("notFound");
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setErrorMessage(
          error instanceof Error ? error.message : "Không thể tải sản phẩm.",
        );
        setStatus("failed");
      }
    };

    void load();
    return () => controller.abort();
  }, [productId, hasStoreProduct]);

  const product: Product | null =
    storeProduct ??
    (fetchedProduct !== null && fetchedProduct.id === productId
      ? fetchedProduct
      : null);

  if (!product) {
    if (status === "loading") {
      return (
        <div className="center" role="status">
          <div className="spinner" />
          <p>Đang tải chi tiết sản phẩm...</p>
        </div>
      );
    }

    if (status === "failed") {
      return (
        <div className="alert alert--error" role="alert">
          <p className="alert__title">Không tải được sản phẩm</p>
          <p>{errorMessage ?? "Đã xảy ra lỗi không xác định."}</p>
          <Link to="/" className="btn btn--primary btn--sm">
            Quay lại trang chủ
          </Link>
        </div>
      );
    }

    return (
      <div className="center">
        <p className="center__title">Không tìm thấy sản phẩm này</p>
        <p>Sản phẩm có thể đã bị gỡ hoặc đường dẫn không đúng.</p>
        <Link to="/" className="btn btn--primary">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const handleAdd = (): void => {
    dispatch(addToCart(product));
  };

  return (
    <section>
      <Link to="/" className="back-link">
        ← Quay lại trang chủ
      </Link>

      <div className="detail">
        <div className="detail__media">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="detail__info">
          <span className="chip">{product.category}</span>
          <h1 className="detail__title">{product.title}</h1>
          <p className="detail__price">${product.price.toFixed(2)}</p>
          <p className="detail__description">{product.description}</p>

          <div className="detail__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleAdd}
            >
              Thêm vào giỏ
            </button>
            <Link to="/cart" className="btn btn--ghost">
              Xem giỏ hàng
            </Link>
          </div>

          {quantityInCart > 0 && (
            <p className="alert alert--success" role="status">
              Giỏ hàng của bạn đang có {quantityInCart} sản phẩm này.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
