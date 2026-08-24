"use client"

import { useEffect, useMemo, useState } from "react"
import Image, { type StaticImageData } from "next/image"
import { ShoppingBag, Check, X, Minus, Plus, Trash2 } from "lucide-react"

import teeFront from "@/public/store/tee-front.png"
import teeBack from "@/public/store/tee-back.png"
import hoodieMale from "@/public/store/hoodie-male.png"
import hoodieFemale from "@/public/store/hoodie-female.png"

type CartItem = {
  id: string
  name: string
  size: string
  price: number
  image: string
  quantity: number
}

type Product = {
  id: string
  name: string
  description: string
  price: number
  images: StaticImageData[]
  labels: string[]
  sizes: string[]
}

const products: Product[] = [
  {
    id: "i-prayed-tee",
    name: "I Prayed Tee",
    description:
      "A clean, everyday tee with the quiet reminder that prayer comes first. Soft cotton, embroidered front and cross design on the back.",
    price: 28,
    images: [teeFront, teeBack],
    labels: ["Front", "Back"],
    sizes: ["Adult Medium", "Adult Large"],
  },
  {
    id: "i-prayed-hoodie",
    name: "I Prayed Embroidered Hoodie",
    description:
      "A warm, heavyweight hoodie embroidered with I PRAYED. Perfect for gatherings, late nights, and everyday witness.",
    price: 48,
    images: [hoodieMale, hoodieFemale],
    labels: ["Style 1", "Style 2"],
    sizes: ["Adult Medium", "Adult Large"],
  },
]

function formatPrice(amount: number) {
  return `$${amount.toFixed(2)}`
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem("pray4me-cart")
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export default function StorePage() {
  const [cart, setCart] = useState<CartItem[]>(loadCart)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [addedId, setAddedId] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem("pray4me-cart", JSON.stringify(cart))
    } catch {
      // ignore
    }
  }, [cart])

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  )

  function addToCart(product: Product, size: string) {
    const image = product.images[0]?.src ?? ""
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.size === size
      )
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          size,
          price: product.price,
          image,
          quantity: 1,
        },
      ]
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId((current) => (current === product.id ? null : current)), 1500)
  }

  function updateQuantity(id: string, size: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  function removeFromCart(id: string, size: string) {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)))
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-brand-brown-dark sm:text-5xl">Store</h1>
          <p className="mt-2 text-lg text-brand-brown">
            Wear your faith. Every piece is made to start conversations.
          </p>
        </div>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative rounded-full bg-brand-brown p-3 text-white shadow-lg transition hover:scale-105 active:scale-95"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-6 w-6" />
          {cart.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-rose text-xs font-bold">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={addToCart}
            justAdded={addedId === product.id}
          />
        ))}
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl text-brand-brown-dark">Your Bag</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-full p-2 text-brand-brown hover:bg-brand-beige"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="card-soft text-center py-12">
                <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-brand-sand" />
                <p className="text-brand-brown">Your bag is empty.</p>
                <p className="mt-1 text-sm text-brand-sand">
                  Add an item and a size to get started.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="card-soft flex items-center gap-4"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-white">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-brand-brown-dark">
                          {item.name}
                        </p>
                        <p className="text-sm text-brand-brown">{item.size}</p>
                        <p className="text-sm font-semibold text-brand-brown-dark">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 rounded-full border border-brand-tan bg-white px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, -1)}
                            className="rounded-full p-1 hover:bg-brand-beige"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5 text-brand-brown" />
                          </button>
                          <span className="w-4 text-center text-sm text-brand-brown-dark">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, 1)}
                            className="rounded-full p-1 hover:bg-brand-beige"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5 text-brand-brown" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-brand-rose hover:text-brand-brown-dark"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-brand-tan pt-6">
                  <div className="mb-4 flex items-center justify-between text-lg font-semibold text-brand-brown-dark">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mb-6 text-sm text-brand-sand">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <button
                    disabled
                    className="btn-primary w-full"
                  >
                    Checkout coming soon
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ProductCard({
  product,
  onAdd,
  justAdded,
}: {
  product: Product
  onAdd: (product: Product, size: string) => void
  justAdded: boolean
}) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const canAdd = selectedSize !== null

  return (
    <div className="card flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-white p-4 shadow-inner">
            <Image
              src={product.images[selectedImage]}
              alt={`${product.name} - ${product.labels[selectedImage]}`}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="mt-4 flex justify-center gap-3">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 p-1 transition ${
                  selectedImage === index
                    ? "border-brand-brown"
                    : "border-transparent hover:border-brand-tan"
                }`}
                aria-label={`View ${product.labels[index]}`}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <h2 className="text-3xl text-brand-brown-dark">{product.name}</h2>
          <p className="mt-3 text-brand-brown">{product.description}</p>
          <p className="mt-4 text-2xl font-semibold text-brand-brown-dark">
            {formatPrice(product.price)}
          </p>

          <div className="mt-6">
            <p className="label">Size</p>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    selectedSize === size
                      ? "bg-brand-brown text-white shadow-md"
                      : "bg-brand-beige text-brand-brown hover:bg-brand-tan/40"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => selectedSize && onAdd(product, selectedSize)}
            disabled={!canAdd}
            className="btn-primary mt-8 w-full lg:w-auto"
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" />
                Added to bag
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                Add to bag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
