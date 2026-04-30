export const sellerData = {
  profile: {
    id: "store_001",
    storeName: "Toko Bang Deel",
    ownerName: "Bang Doel",
    email: "bangdoelshop@gmail.com",
    password: "user123",
    address: "Jl Mulyorejo Surabaya Timur",
    avatarUrl: "/assets/images/mu-logo.png",
    isOpen: true,
    financials: {
      activeTransaction: 327025000,
      currentBalance: 10000000
    },
    activities: {
      needProcessing: 5,
      waitingConfirmation: 12,
      serviceIssues: 0,
      beingCancelled: 13,
      shipping: 13,
      outOfStock: 0
    },
    performance: {
      totalBuyers: 142,
      completedOrders: 320,
      cancelledOrders: 5
    }
  },
  
  orders: [
    {
      id: "order_001",
      invoice: "INV/20261024/XYZ/98765",
      buyerUsername: "Ryandar123",
      status: "Perlu Diproses",
      createdAt: "2026-10-24T14:30:00Z",
      items: [
        {
          productId: 1,
          productName: "Pupuk Organik Berkualitas | Bang Doel Shop",
          category: "Pupuk",
          price: 51000,
          quantity: 2,
          imageUrl: "/asset/images/item/item1.jpg"
        }
      ],
      totalAmount: 102000
    },
    {
      id: "order_002",
      invoice: "INV/20261025/XYZ/98766",
      buyerUsername: "BudiPetani",
      status: "Menunggu Konfirmasi",
      createdAt: "2026-10-25T09:15:00Z",
      items: [
        {
          productId: 5,
          productName: "Cangkul Baja Asli Anti Karat | Perkakas Tani Jaya",
          category: "Alat-Pertanian",
          price: 120000,
          quantity: 1,
          imageUrl: "/asset/images/item/4.jpg"
        }
      ],
      totalAmount: 120000
    }
  ],
  
  reviews: {
    summary: {
      averageRating: 4.8,
      totalReviews: 135,
      ratingBreakdown: {
        "5": 100,
        "4": 30,
        "3": 5,
        "2": 0,
        "1": 0
      }
    },
    list: [
      {
        id: "rev_001",
        reviewerName: "Ryandar Anugrah",
        reviewerAvatar: "/assets/avatars/user1.png",
        rating: 5,
        productId: 5,
        productBought: "Cangkul Baja Asli Anti Karat | Perkakas Tani Jaya",
        comment: "Baja asli, sangat kuat dipakai mencangkul.",
        createdAt: "2026-03-30T10:30:00Z"
      },
      {
        id: "rev_002",
        reviewerName: "Irzaq Akmal Alhaqqy",
        reviewerAvatar: "/assets/avatars/user2.png",
        rating: 4,
        productId: 2,
        productBought: "Bibit Padi Ciherang Unggul | Tani Jaya",
        comment: "Bibit tumbuh dengan baik, pengiriman cepat.",
        createdAt: "2026-03-28T15:45:00Z"
      }
    ]
  }
};