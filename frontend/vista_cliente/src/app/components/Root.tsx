import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartProvider } from "../contexts/CartContext";

export function Root() {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
