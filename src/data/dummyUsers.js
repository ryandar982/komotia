// Sesuaikan path import ini dengan lokasi file productDummy Anda
import { dummyProducts } from './dummyProducts'; 

// Membuat fungsi helper kecil agar kodenya lebih rapi
const getProduct = (id) => dummyProducts.find(product => product.id === id);

export const dummyBuyerData = {
  userProfile: {
    username: "ryandar",
    fullName: "Ryandar Anugrah Fajr",
    membership: "Member Silver",
    avatarUrl: "/assets/images/avatar-dummy.png",
    email: "ryandar@email.com",
    phone: "081234567890",
    mainAddress: "Jl. Ketintang Baru No. 123, Gayungan, Kota Surabaya",
    walletBalance: 10000000,
  },
  dashboardSummary: {
    waitingForPayment: 5,
    shipping: 12,
    cancelingProcess: 0,
    completed: 0,
    activeTransactionValue: 327020,
  },
  waitingForPaymentList: [
    {
      id: "inv-001",
      invoiceNumber: "INV/20260407/001",
      totalAmount: 250000,
      dueDate: "08 Apr 2026, 10:45 WIB",
      status: "Belum Dibayar"
    }
  ],
  orderHistory: [
    {
      orderId: "ORD-998877",
      status: "Sedang Dikirim",
      orderDate: "06 Apr 2026",
      items: [
        {
          productId: getProduct(2).id,
          productName: getProduct(2).name,
          quantity: 1,
          price: getProduct(2).price
        }
      ],
      totalOrderAmount: getProduct(2).price * 1 // Harga dikali quantity
    }
  ],
  shoppingCart: {
    selectedAddress: {
      id: "addr-1",
      recipientName: "Ryandar Anugrah Fajar",
      phone: "(+62) 812-3456-7890",
      fullAddress: "Jl. Ketintang Baru No. 123, Gayungan, Kota Surabaya, Jawa Timur 60231",
      isMainAddress: true
    },
    stores: [
      {
        storeId: "store-001",
        storeName: getProduct(7).seller, 
        isSelected: true,
        products: [
          {
            cartItemId: "cart-item-1",
            productId: getProduct(7).id,
            productName: getProduct(7).name,
            imageUrl: getProduct(7).image,
            originalPrice: getProduct(7).price,
            discountPercentage: 0,
            finalPrice: getProduct(7).price,
            selectedCourier: "JNE Reguler",
            quantity: 2,
            stockAvailable: 45,
            notesToSeller: "",
            isSelected: true
          }
        ]
      },
      {
        storeId: "store-002",
        storeName: getProduct(6).seller,
        isSelected: true,
        products: [
          {
            cartItemId: "cart-item-2",
            productId: getProduct(6).id,
            productName: getProduct(6).name,
            imageUrl: getProduct(6).image,
            originalPrice: getProduct(6).price,
            discountPercentage: 0,
            finalPrice: getProduct(6).price,
            selectedCourier: "J&T Express",
            quantity: 1,
            stockAvailable: 120,
            notesToSeller: "",
            isSelected: true
          }
        ]
      }
    ],
    summary: {
      totalSelectedQuantity: 3,
      // Kalkulasi otomatis berdasarkan data produk
      totalItemsOriginalPrice: (getProduct(7).price * 2) + (getProduct(6).price * 1),
      totalDiscount: 0,
      grandTotal: (getProduct(7).price * 2) + (getProduct(6).price * 1)
    }
  },
  reviews: {
    waitingForReview: [
      {
        productId: getProduct(11).id,
        productName: getProduct(11).name,
        variant: "5kg",
        imageUrl: getProduct(11).image,
        orderCompletedDate: "05 Apr 2026"
      }
    ],
    reviewHistory: [
      {
        reviewId: "rev-01",
        productId: getProduct(15).id,
        productName: getProduct(15).name,
        variant: "1 Pack",
        imageUrl: getProduct(15).image,
        rating: 5,
        reviewDate: "01 Apr 2026",
        reviewText: "Kualitas benih sangat bagus, pengiriman cepat dan packaging aman. Mantap Komotia!"
      }
    ]
  }
};
export const dummyUser3Data = {
  userProfile: {
    username: "bangdoel",
    fullName: "Bang Doel",
    membership: "Member Bronze",
    avatarUrl: "/assets/images/avatar-bangdoel.png",
    email: "bangdoel@email.com",
    phone: "085678901234",
    mainAddress: "Jl. Merdeka No. 45, Sidoarjo, Jawa Timur",
    walletBalance: 500000,
  },
  dashboardSummary: {
    waitingForPayment: 0,
    shipping: 1,
    cancelingProcess: 0,
    completed: 15,
    activeTransactionValue: 120000,
  },
  waitingForPaymentList: [],
  orderHistory: [
    {
      orderId: "ORD-112233",
      status: "Selesai",
      orderDate: "01 Apr 2026",
      items: [
        {
          productId: 5, // Sesuai ID 5
          productName: "Cangkul Baja Asli Anti Karat | Perkakas Tani Jaya",
          quantity: 1,
          price: 120000
        }
      ],
      totalOrderAmount: 120000
    }
  ],
  shoppingCart: {
    selectedAddress: {
      id: "addr-2",
      recipientName: "Surti",
      phone: "085678901234",
      fullAddress: "Jl. Merdeka No. 45, Sidoarjo, Jawa Timur",
      isMainAddress: true
    },
    stores: [
      {
        storeId: "store-003",
        storeName: "Safety Tani Store", // Sesuai seller ID 19
        isSelected: true,
        products: [
          {
            cartItemId: "cart-item-3",
            productId: 19, // Sesuai ID 19
            productName: "Sarung Tangan Berkebun Karet Anti Air | Safety Tani Store",
            imageUrl: "/asset/images/item/18.jpg",
            originalPrice: 12000,
            discountPercentage: 0,
            finalPrice: 12000,
            selectedCourier: "J&T Express",
            quantity: 2,
            stockAvailable: 15,
            notesToSeller: "",
            isSelected: true
          }
        ]
      }
    ],
    summary: {
      totalSelectedQuantity: 2,
      totalItemsOriginalPrice: 24000, // 12.000 * 2
      totalDiscount: 0,
      grandTotal: 24000
    }
  },
  reviews: {
    waitingForReview: [],
    reviewHistory: []
  }
};

export const dummyUsers = [
  {
    id: 1,
    username: "admin",
    password: "password123",
    name: "Admin Komotia",
    role: "admin"
  },
  {
    id: 2,
    username: "ryandar",
    password: "user123",
    name: "Ryandar Anugrah Fajr",
    role: "user",
    dashboardData: dummyBuyerData
  },
  {
    id: 3,
    username: "bangdoel",
    password: "user123",
    name: "Bang Doel",
    role: "user",
    dashboardData: dummyUser3Data
  }
];