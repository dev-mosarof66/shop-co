import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Logo } from "@/components/logo"
import {
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Zap,
  Award,
  Users,
  Package,
  Check,
  Mail,
  Monitor,
  Shirt,
  House,
  Dumbbell,
  BookOpen,
  Sparkles,
} from "lucide-react"
import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart-drawer"
import { AuthModal } from "@/components/auth-modal"
import { ProductCard } from "@/components/product-card"
import { SearchButton } from "@/components/search-button"
import { useI18n, interpolate } from "@/lib/i18n"
import { useCart } from "@/lib/cart"
import { useAuthModal } from "@/lib/auth-modal"
import { useSession, signOut } from "@/lib/auth-client"
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  type ApiProduct,
} from "@/store/api"

const testimonials = [
  {
    name: "Sarah J.",
    text: "Incredible selection and lightning-fast delivery. Already placed my third order this month!",
  },
  {
    name: "Marcus T.",
    text: "Best online shopping experience I've had. Product quality exceeded every expectation.",
  },
  {
    name: "Priya K.",
    text: "Hassle-free returns, great prices, and the customer support team is genuinely helpful.",
  },
]

const statIcons = [Users, Package, Award, Headphones] as const
const statValues = ["50K+", "12K+", "99%", "24/7"] as const

// ─── Cart button ──────────────────────────────────────────────────────────────

function CartButton() {
  const { itemCount, openCart } = useCart()
  return (
    <button
      onClick={openCart}
      aria-label={`Cart (${itemCount} items)`}
      className="relative rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
    >
      <ShoppingBag className="size-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  )
}

// ─── User menu dropdown ───────────────────────────────────────────────────────

function UserMenu({
  session,
}: {
  session: { user: { name: string | null; email: string; role?: string } }
}) {
  const [open, setOpen] = useState(false)
  const role = (session.user as any).role as string | undefined

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [open])

  const initial = session.user.name?.[0]?.toUpperCase() ?? "?"

  const isSeller = role === "vendor" || role === "admin"

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className="flex size-8 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold transition-colors hover:border-foreground/30"
        aria-label="User menu"
      >
        {initial}
      </button>
      {open && (
        <div className="absolute top-10 right-0 z-50 w-52 overflow-hidden rounded-lg border border-border bg-background shadow-lg">
          <div className="border-b border-border px-3 py-2.5">
            <p className="truncate text-xs font-medium">
              {session.user.name ?? "User"}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {session.user.email}
            </p>
          </div>
          <div className="p-1">
            {isSeller && (
              <Link
                to="/seller/dashboard"
                onClick={() => setOpen(false)}
                className="block rounded px-3 py-1.5 text-sm font-medium hover:bg-muted"
              >
                Seller Dashboard
              </Link>
            )}
            {(
              [
                ["Profile", "/profile"],
                ["My orders", "/orders"],
                ["Wishlist", "/wishlist"],
              ] as [string, string][]
            ).map(([label, to]) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="block rounded px-3 py-1.5 text-sm hover:bg-muted"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="border-t border-border p-1">
            <button
              onClick={() => void signOut()}
              className="block w-full rounded px-3 py-1.5 text-left text-sm text-destructive hover:bg-muted"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const { t } = useI18n()
  const { data: session } = useSession()
  const { open: openAuth } = useAuthModal()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-foreground"
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a
            href="#categories"
            className="transition-colors hover:text-foreground"
          >
            {t.nav.categories}
          </a>
          <a
            href="#products"
            className="transition-colors hover:text-foreground"
          >
            {t.nav.products}
          </a>
          <a href="#about" className="transition-colors hover:text-foreground">
            {t.nav.about}
          </a>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <SearchButton />
          <CartButton />
          {session ? (
            <UserMenu session={session} />
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openAuth("signIn")}
              >
                {t.nav.signIn}
              </Button>
              <Button size="sm" onClick={() => openAuth("register")}>
                {t.nav.getStarted}
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <SearchButton />
          <CartButton />
          <button
            className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 pt-2 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm">
            <a
              href="#categories"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {t.nav.categories}
            </a>
            <a
              href="#products"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {t.nav.products}
            </a>
            <a
              href="#about"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {t.nav.about}
            </a>
            <div className="flex flex-col gap-2 pt-2">
              {session ? (
                <>
                  {(
                    [
                      ["Profile", "/profile"],
                      ["My orders", "/orders"],
                      ["Wishlist", "/wishlist"],
                    ] as [string, string][]
                  ).map(([label, to]) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setOpen(false)}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {label}
                    </Link>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void signOut()
                      setOpen(false)
                    }}
                  >
                    {t.nav.signOut}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      openAuth("signIn")
                      setOpen(false)
                    }}
                  >
                    {t.nav.signIn}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      openAuth("register")
                      setOpen(false)
                    }}
                  >
                    {t.nav.getStarted}
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { t } = useI18n()
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.145 0 0) 1px,transparent 1px),linear-gradient(90deg,oklch(0.145 0 0) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Zap className="size-3" /> {t.hero.badge}
          </div>
          <h1 className="mb-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {t.hero.headline}{" "}
            <span className="text-muted-foreground">
              {t.hero.headlineMuted}
            </span>
          </h1>
          <p className="mb-10 text-base text-muted-foreground sm:text-lg">
            {t.hero.sub}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <a href="#products">
                {t.hero.cta1} <ArrowRight className="ml-1 size-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#categories">{t.hero.cta2}</a>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            {[t.hero.trust1, t.hero.trust2, t.hero.trust3].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="size-3.5 text-foreground" /> {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Value Props ──────────────────────────────────────────────────────────────

function ValueProps() {
  const { t } = useI18n()
  const items = [
    { icon: Truck, ...t.values.shipping },
    { icon: ShieldCheck, ...t.values.secure },
    { icon: RefreshCw, ...t.values.returns },
    { icon: Headphones, ...t.values.support },
  ]
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  electronics: Monitor,
  fashion: Shirt,
  home: House,
  sports: Dumbbell,
  books: BookOpen,
  beauty: Sparkles,
}

function Categories() {
  const { t } = useI18n()
  const { data: categories = [], isLoading } = useGetCategoriesQuery()


  return (
    <section id="categories" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {t.categories.eyebrow}
          </p>
          <h2 className="text-2xl font-semibold sm:text-3xl">
            {t.categories.title}
          </h2>
        </div>
        <Link
          to="/products"
          className="hidden items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
        >
          {t.categories.viewAll} <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col h-32 items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 text-center animate-pulse"
                />
            ))
          : categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] ?? Package
              return (
                <Link
                  key={cat.slug}
                  to={`/products?category=${cat.slug}`}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 text-center transition-all hover:border-foreground/20 hover:bg-muted"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-background">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {t.categories[cat.slug as keyof typeof t.categories] ??
                        cat.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {cat.productCount} items
                    </p>
                  </div>
                </Link>
              )
            })}
      </div>
    </section>
  )
}

// ─── Products ─────────────────────────────────────────────────────────────────

const BADGE_LABELS: Record<string, string> = {
  bestSeller: "Best Seller",
  new: "New",
  sale: "Sale",
}

function FeaturedProducts() {
  const { t } = useI18n()
  const { data } = useGetProductsQuery({ featured: true, limit: 4 })
  const products: ApiProduct[] = data?.data ?? []

  console.log("Fetched featured products:", data)

  return (
    <section id="products" className="bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {t.products.eyebrow}
            </p>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              {t.products.title}
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            {t.products.viewAll} <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              badgeLabel={p.badge ? BADGE_LABELS[p.badge] : null}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function Stats() {
  const { t } = useI18n()
  const labels = [
    t.stats.customers,
    t.stats.products,
    t.stats.satisfaction,
    t.stats.support,
  ]
  return (
    <section id="about" className="border-y border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {statValues.map((value, i) => {
            const Icon = statIcons[i]
            return (
              <div
                key={value}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted">
                  <Icon className="size-4" />
                </div>
                <p className="text-2xl font-semibold">{value}</p>
                <p className="text-xs text-muted-foreground">{labels[i]}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const { t } = useI18n()
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <p className="mb-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {t.testimonials.eyebrow}
        </p>
        <h2 className="text-2xl font-semibold sm:text-3xl">
          {t.testimonials.title}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {testimonials.map((item) => (
          <div
            key={item.name}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-3.5 fill-foreground text-foreground"
                />
              ))}
            </div>
            <p className="flex-1 text-sm leading-relaxed">"{item.text}"</p>
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {t.testimonials.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

function Newsletter() {
  const { t } = useI18n()
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background">
              <Mail className="size-4" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-semibold">{t.newsletter.title}</h2>
          <p className="mb-8 text-sm text-muted-foreground">
            {t.newsletter.desc}
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder={t.newsletter.placeholder}
              className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            />
            <Button type="submit">
              {t.newsletter.cta} <ArrowRight className="ml-1 size-4" />
            </Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            {t.newsletter.disclaimer}
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const { t } = useI18n()
  const year = String(new Date().getFullYear())
  const sections = [
    {
      heading: t.footer.shop,
      items: [
        { label: t.footer.newArrivals, to: "/products" },
        { label: t.footer.bestSellers, to: "/products" },
        { label: t.footer.sale, to: "/products" },
        { label: t.footer.allProducts, to: "/products" },
      ],
    },
    {
      heading: t.footer.company,
      items: [
        { label: t.footer.about, to: null },
        { label: t.footer.careers, to: null },
        { label: t.footer.blog, to: null },
        { label: t.footer.press, to: null },
      ],
    },
    {
      heading: t.footer.support,
      items: [
        { label: t.footer.helpCenter, to: null },
        { label: t.footer.returns, to: null },
        { label: t.footer.shipping, to: null },
        { label: t.footer.trackOrder, to: null },
      ],
    },
    {
      heading: t.footer.legal,
      items: [
        { label: t.footer.privacy, to: null },
        { label: t.footer.terms, to: null },
        { label: t.footer.cookies, to: null },
      ],
    },
  ]
  return (
    <footer className="bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="mb-3 flex items-center gap-2 font-semibold">
              <Logo size="sm" />
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
            <div className="mt-4 flex items-center gap-3">
              {(
                [
                  ["Twitter", FaTwitter],
                  ["Instagram", FaInstagram],
                  ["GitHub", FaGithub],
                ] as [string, React.ElementType][]
              ).map(([label, Icon]) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          {sections.map(({ heading, items }) => (
            <div key={heading}>
              <p className="mb-3 text-xs font-semibold tracking-widest uppercase">
                {heading}
              </p>
              <ul className="space-y-2">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    {to ? (
                      <Link
                        to={to}
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        href="#"
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>{interpolate(t.footer.copyright, { year })}</p>
          <p>{t.footer.crafted}</p>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <main>
        <Hero />
        <ValueProps />
        <Categories />
        <FeaturedProducts />
        <Stats />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer />
      <AuthModal />
    </div>
  )
}
