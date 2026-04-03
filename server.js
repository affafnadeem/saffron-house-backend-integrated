const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// 🌙 SAFFRON HOUSE MENU - Authentic Arabian Cuisine
const menuData = [
  {
    id: 1,
    name: "Royal Mandi",
    arabicName: "المندي الملكي",
    price: 89,
    category: "Mandi",
    imageUrl: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=500",
  },
  {
    id: 2,
    name: "Chicken Mandi",
    arabicName: "مندي دجاج",
    price: 65,
    category: "Mandi",
    imageUrl: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=500",
  },
  {
    id: 3,
    name: "Chicken Kabsa",
    arabicName: "كابسة دجاج",
    price: 59,
    category: "Kabsa",
    imageUrl: "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?w=500",
  },
  {
    id: 4,
    name: "Lamb Mandi",
    arabicName: "مندي لحم",
    price: 89,
    category: "Mandi",
    imageUrl: "https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?w=500",
  },
  {
    id: 5,
    name: "Hummus",
    arabicName: "حمص",
    price: 28,
    category: "Starters",
    imageUrl: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=500",
  },
  {
    id: 6,
    name: "Kunafa",
    arabicName: "كنافة",
    price: 42,
    category: "Desserts",
    imageUrl: "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?w=500",
  },
  {
    id: 7,
    name: "Arabic Coffee",
    arabicName: "قهوة عربية",
    price: 15,
    category: "Beverages",
    imageUrl: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?w=500",
  }
];

// GET /catalog - Returns all menu items
app.get("/catalog", (req, res) => {
  res.json({
    success: true,
    count: menuData.length,
    products: menuData,
  });
});

// POST /order - Receives order from customer
app.post("/order", (req, res) => {
  const orderDetails = req.body;

  console.log("\n========== NEW ORDER AT SAFFRON HOUSE ==========");
  console.log("Customer:", orderDetails.customerName);
  console.log("Table Number:", orderDetails.tableNumber);
  console.log("Items:", JSON.stringify(orderDetails.items, null, 2));
  console.log("Total: AED", orderDetails.total);
  console.log("Time:", new Date().toLocaleString());
  console.log("================================================\n");

  res.json({
    success: true,
    message: "Order received successfully! Thank you for choosing Saffron House",
    order: orderDetails,
  });
});

// Home route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Saffron House</title>
        <style>
            body { font-family: Arial; background: #1a1a2e; color: white; text-align: center; padding: 50px; }
            h1 { color: #D4AF37; }
            .menu { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 30px; }
            .item { background: #16213e; padding: 20px; border-radius: 10px; width: 250px; }
            .price { color: #D4AF37; font-size: 24px; }
            button { background: #D4AF37; color: #1a1a2e; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px; }
        </style>
    </head>
    <body>
        <h1>🌙 Saffron House</h1>
        <p>Authentic Arabian Cuisine</p>
        <div class="menu" id="menu"></div>
        <div id="cart" style="margin-top: 30px;"></div>
        <script>
            let cart = [];
            async function loadMenu() {
                const res = await fetch('/catalog');
                const data = await res.json();
                const menuDiv = document.getElementById('menu');
                data.products.forEach(item => {
                    menuDiv.innerHTML += '<div class="item"><h3>' + item.name + '</h3><p>' + item.arabicName + '</p><p class="price">AED ' + item.price + '</p><button onclick="addToCart(' + item.id + ')">Add to Cart</button></div>';
                });
            }
            function addToCart(id) { cart.push(id); updateCart(); }
            function updateCart() { document.getElementById('cart').innerHTML = '<h2>Cart: ' + cart.length + ' items</h2><button onclick="checkout()">Checkout</button>'; }
            function checkout() { alert('Order placed! Check server console.'); cart = []; updateCart(); }
            loadMenu();
        </script>
    </body>
    </html>
  `);
});

// Start server
app.listen(3000, () => {
  console.log("\n==========================================");
  console.log("  SAFFRON HOUSE RESTAURANT SERVER");
  console.log("==========================================");
  console.log("Server running on http://localhost:" + 3000);
  console.log("Catalog API: http://localhost:" + 3000 + "/catalog");
  console.log("Open in browser: http://localhost:" + 3000);
  console.log("==========================================\n");
});