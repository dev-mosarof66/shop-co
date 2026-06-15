import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"

import "./index.css"
import App from "./App.tsx"
import { store } from "@/store/index.ts"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { I18nProvider } from "@/lib/i18n.tsx"
import { CartProvider } from "@/lib/cart.tsx"
import { WishlistProvider } from "@/lib/wishlist.tsx"
import { OrdersProvider } from "@/lib/orders.tsx"
import { AuthModalProvider } from "@/lib/auth-modal.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <I18nProvider>
          <OrdersProvider>
            <WishlistProvider>
              <CartProvider>
                <AuthModalProvider>
                  <App />
                </AuthModalProvider>
              </CartProvider>
            </WishlistProvider>
          </OrdersProvider>
        </I18nProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
)
