import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { Catalog } from "./pages/Catalog";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Confirmation } from "./pages/Confirmation";
import { Orders } from "./pages/Orders";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "catalogo", Component: Catalog },
      { path: "producto/:id", Component: ProductDetail },
      { path: "carrito", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "confirmacion", Component: Confirmation },
      { path: "ordenes", Component: Orders },
    ],
  },
]);
