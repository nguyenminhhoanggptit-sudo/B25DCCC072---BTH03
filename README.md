# ShopMini

Ứng dụng thương mại điện tử mini xây dựng bằng **React 18 + TypeScript (Vite)**. Dữ liệu sản phẩm lấy từ [FakeStore API](https://fakestoreapi.com/products).

## Công nghệ

- React 18, TypeScript (strict, **không dùng `any`**), Vite
- `react-router-dom` (routing, route được bảo vệ)
- `@reduxjs/toolkit` + `react-redux` (dữ liệu API và giỏ hàng)
- Context API (theme, đăng nhập)
- CSS thuần với CSS Variables, không dùng thư viện UI ngoài

## Chạy dự án

### Cách 1: dùng thẳng thư mục này

```bash
npm install
npm run dev
```

Mở `http://localhost:5173`. Build sản phẩm: `npm run build`, xem thử bản build: `npm run preview`.

### Cách 2: tự khởi tạo dự án Vite rồi chép mã nguồn

```bash
npm create vite@latest shopmini -- --template react-ts
cd shopmini
npm install react-router-dom @reduxjs/toolkit react-redux
# Xóa src/ mặc định, chép thư mục src/ của dự án này vào, sau đó:
npm run dev
```

## Tài khoản thử nghiệm

Đăng nhập giả lập: **tên đăng nhập bất kỳ (không để trống)** và mật khẩu **`123456`**.

## Chức năng

| Đường dẫn       | Trang               | Mô tả                                                                                      |
| --------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| `/`             | `HomePage`          | Tìm kiếm theo tên (lọc ngay khi gõ), trạng thái loading/lỗi, lưới sản phẩm responsive      |
| `/products/:id` | `ProductDetailPage` | Chi tiết sản phẩm. Lấy từ store, nếu vào thẳng URL thì gọi `fakestoreapi.com/products/:id` |
| `/cart`         | `CartPage`          | Tăng/giảm số lượng, xóa từng món, xóa cả giỏ, tổng số lượng và tổng tiền                   |
| `/login`        | `LoginPage`         | Đăng nhập, sau đó quay lại trang trước đó (`location.state.from`)                          |
| `/checkout`     | `CheckoutPage`      | Được bọc bởi `ProtectedRoute`. Form nhận hàng, nút **Đặt hàng** gọi `clearCart()`          |
| `*`             | `NotFoundPage`      | Trang 404 kèm nút về trang chủ                                                             |

Lưới sản phẩm: **1 cột** (< 640px), **2 cột** (640px đến 1024px), **4 cột** (> 1024px).

Giao diện Sáng dịu (mặc định) và Tối đổi bằng nút trên Header. Lựa chọn được lưu trong `localStorage` và gắn vào thuộc tính `data-theme` của thẻ `<html>`.

## Cấu trúc thư mục

```text
src/
├── app/
│   ├── store.ts              configureStore, RootState, AppDispatch
│   └── hooks.ts              useAppDispatch, useAppSelector
├── features/
│   ├── products/productsSlice.ts   createAsyncThunk + status/error
│   └── cart/cartSlice.ts           addToCart, removeFromCart, updateQuantity, clearCart + selectors
├── contexts/
│   ├── ThemeContext.tsx      theme, toggleTheme, useTheme
│   └── AuthContext.tsx       user, login, logout, useAuth
├── components/
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   └── ProtectedRoute.tsx
├── layouts/MainLayout.tsx    Header + <Outlet />
├── pages/                    Home, ProductDetail, Cart, Login, Checkout, NotFound
├── types/index.ts            Product, CartItem, User
├── index.css                 CSS variables (tím - xanh - trắng dịu), lưới responsive
├── App.tsx                   khai báo Routes
└── main.tsx                  Provider, ThemeProvider, AuthProvider, BrowserRouter
```

## Quản lý state: dữ liệu nào nằm ở đâu và vì sao

| Dữ liệu                                                                 | Nơi lưu       | Vị trí trong code   | Lý do                                                                                                  |
| ----------------------------------------------------------------------- | ------------- | ------------------- | ------------------------------------------------------------------------------------------------------ |
| Từ khóa tìm kiếm `query`                                                | `useState`    | `HomePage`          | Chỉ một trang dùng, bỏ đi khi rời trang, không cần chia sẻ                                             |
| Giá trị ô nhập và thông báo lỗi của form đăng nhập                      | `useState`    | `LoginPage`         | State cục bộ của form, chỉ sống trong vòng đời của form                                                |
| Form nhận hàng, lỗi form, thông tin đơn vừa đặt                         | `useState`    | `CheckoutPage`      | Dữ liệu tạm của một màn hình                                                                           |
| Hiệu ứng "Đã thêm ✓" trên nút                                           | `useState`    | `ProductCard`       | Trạng thái giao diện tạm thời của từng thẻ                                                             |
| Sản phẩm tải riêng khi vào thẳng `/products/:id`, trạng thái tải và lỗi | `useState`    | `ProductDetailPage` | Chỉ phục vụ một trang, chỉ dùng khi store chưa có dữ liệu                                              |
| Chủ đề Sáng/Tối (`theme`)                                               | Context API   | `ThemeContext`      | Toàn bộ ứng dụng cần đọc, nhưng hiếm khi đổi (chỉ khi người dùng bấm nút)                              |
| Người dùng đăng nhập (`user`)                                           | Context API   | `AuthContext`       | `Header`, `LoginPage`, `ProtectedRoute`, `CheckoutPage` đều cần, ít thay đổi                           |
| Danh sách sản phẩm, `status`, `error`                                   | Redux Toolkit | `productsSlice`     | Dữ liệu bất đồng bộ từ API. `createAsyncThunk` quản lý đủ idle/loading/succeeded/failed                |
| Giỏ hàng (`items`), tổng số lượng, tổng tiền                            | Redux Toolkit | `cartSlice`         | Cập nhật liên tục từ nhiều nơi (card, chi tiết, giỏ, checkout, badge ở Header), cần selector tính toán |

### Lý do kiến trúc

- **`useState` cho state cục bộ.** Ô tìm kiếm và các form chỉ có ý nghĩa trong một component. Đưa lên store hoặc context sẽ khiến nhiều component phải render lại mà không cần thiết.
- **Context API cho state toàn cục ít thay đổi.** Theme và thông tin đăng nhập cần có ở nhiều nơi trong cây component, nhưng chỉ đổi khi người dùng bấm nút Đổi theme hoặc Đăng nhập/Đăng xuất. Context đơn giản, không cần thêm thư viện, và việc nó làm mọi consumer render lại khi giá trị đổi là chấp nhận được vì tần suất thấp.
- **Redux Toolkit cho dữ liệu API và giỏ hàng.** Giỏ hàng thay đổi liên tục và được nhiều component đọc (badge ở Header, trang giỏ, trang thanh toán). Redux cho phép đọc đúng phần dữ liệu cần qua selector, nên component chỉ render lại khi phần đó đổi. Với dữ liệu API, `createAsyncThunk` xử lý trạng thái loading/lỗi theo một khuôn thống nhất, và dữ liệu đã tải được dùng lại giữa trang chủ và trang chi tiết mà không gọi API thêm.
- **Persist:** theme và `user` được lưu `localStorage` để giữ lại sau khi tải lại trang. Giỏ hàng chỉ lưu trong bộ nhớ theo yêu cầu đề bài.

## Luồng bảo vệ route `/checkout`

1. Người dùng chưa đăng nhập mở `/checkout`, `ProtectedRoute` gọi `<Navigate to="/login" state={{ from: location }} />`.
2. `LoginPage` đọc `location.state?.from?.pathname || "/"`.
3. Đăng nhập thành công thì `navigate(redirectPath, { replace: true })` đưa người dùng về lại `/checkout`.
