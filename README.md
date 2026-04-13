# 🌙 SAFFRON HOUSE - Restaurant Food Ordering System

## System with Backend

---

## 📋 Overview

Saffron House is a full-stack restaurant food ordering system that allows customers to browse authentic Arabian cuisine, add items to cart, and place orders. The system includes a backend server with REST APIs, a web interface, and a React Native mobile application.

---

## 🍽️ Menu Items

| ID | Name | Arabic Name | Price (AED) | Category |
|----|------|-------------|-------------|----------|
| 1 | Royal Mandi | المندي الملكي | 89 | Mandi |
| 2 | Chicken Mandi | مندي دجاج | 65 | Mandi |
| 3 | Chicken Kabsa | كابسة دجاج | 59 | Kabsa |
| 4 | Lamb Mandi | مندي لحم | 89 | Mandi |
| 5 | Hummus | حمص | 28 | Starters |
| 6 | Kunafa | كنافة | 42 | Desserts |
| 7 | Arabic Coffee | قهوة عربية | 15 | Beverages |

---

## 🚀 Features

- View all menu items with images and prices
- Add items to shopping cart
- Increase/decrease item quantities
- Remove items from cart
- Enter customer name and table number
- Place orders with confirmation
- Server logs all orders to console

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- React Native
- TypeScript
- HTML/CSS

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /catalog | Returns all menu items |
| POST | /order | Places an order |
| GET | / | Serves web interface |

---

## 💻 Installation

# Install dependencies
npm install

# Start server
npm start

# Open browser
http://localhost:3000

📱 Mobile App Setup
Find your laptop IP address

Update index.tsx:

javascript
const API_URL = 'http://YOUR_IP:3000';
Run: npx react-native run-android

📊 Server Output Example
text
========== NEW ORDER AT SAFFRON HOUSE ==========
Customer: Ahmed
Table Number: 5
Total: AED 178
Time: 1/15/2024, 10:30:00 AM
================================================
✅Requirements
Node.js/Express backend

GET /catalog endpoint

POST /order endpoint

Server logs orders

HTML/CSS web interface

React Native mobile app

Cart functionality





