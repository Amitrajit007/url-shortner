# URL Shortener

🔗 A simple and efficient URL shortening service built with Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [🔹 Features](#-features)
- [🔹 Tech Stack](#-tech-stack)
- [🔹 Prerequisites](#-prerequisites)
- [🔹 Code Style](#-code-style)
- [🔹 Installation](#-installation)
- [🔹 Usage](#-usage)
- [🔹 API Endpoints](#-api-endpoints)
- [🔹 Database Schema (MongoDB)](#-database-schema-mongodb)
- [🔹 Project Structure](#-project-structure)
- [🔹 How it Works](#-how-it-works)
- [🔹 Note](#-note)

## 🔹 Features

- 🚀 Fast URL shortening service
- 🔄 URL validation before shortening
- 📊 MongoDB for persistent storage
- 🎯 Custom short code generation
- 🔀 Automatic redirection to original URLs
- ⚡ Built with modern ES6+ modules
- 🛠️ Development mode with auto-reload using Nodemon

## 🔹 Tech Stack

- **Runtime:** Node.js
- **Framework:** `Express` v5.1.0
- **Database:** MongoDB (via `Mongoose` v8.18.3)
- **Validation:** `valid-url` v1.0.9
- **Environment Variables:** `dotenv` v17.2.3
- **Dev Tools:** `Nodemon` v3.1.10

## 🔹 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas account)

## 🔹 Code Style

This project uses ES6+ modules. Make sure to:

- Use `import/export` syntax instead of `require/module.exports`

## 🔹 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
BASE_URL=http://localhost:5000
# Add any other environment variables your app needs
```

4. **Start the development server:**

```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file make sure to change the BASE_URL if u change the PORT.).

## 🔹 Usage

### Creating a Short URL

Send a POST request to create a shortened URL:

```bash
curl -X POST http://localhost:5000/url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com/very-long-url"}'
```

### Accessing a Shortened URL

Simply navigate to:

```
http://localhost:5000/{shortCode}
```

You'll be automatically redirected to the original URL.

## 🔹 API Endpoints

### `POST /url`

Create a new shortened URL.

**Request Body:**

```json
{
  "url": "https://www.example.com/long-url"
}
```

- or

```json
{
  "url": "https://www.example.com/long-url",
  "expiryDays": 1
}
```

```text
Note: expiryDays: 1 means the URL will expire after 1 day it can be any number.
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 18,
    "originalUrl": "https://www.example.com/long-url",
    "shortCode": "i",
    "shortUrl": "http://localhost:5000/i",
    "clicks": 0,
    "expiryDays": 1,
    "expiresAt": "2025-10-06T20:48:53.410Z"
  }
}
```

### `GET /:shortCode`

Redirect to the original URL associated with the short code.

### `GET /redirect`

Special endpoint for testing/Easter egg functionality.

## 🔹 Database Schema (MongoDB)

| Field       | Type   | Description                            |
| ----------- | ------ | -------------------------------------- |
| id          | Number | Auto-increment ID                      |
| originalUrl | String | Original long URL                      |
| shortCode   | String | Short code (Base62)                    |
| shortUrl    | String | Generated short URL                    |
| clicks      | Number | Number of times URL was clicked        |
| expiryDays  | Number | Optional: number of days before expiry |
| expiresAt   | Date   | Calculated expiry date (TTL index)     |
| createdAt   | Date   | Document creation timestamp            |
| updatedAt   | Date   | Document last update timestamp         |

## 🔹 Project Structure

url-shortener/
├── server/
│ └── src/
│ ├── app.js # Main application entry point
│ ├── config/
│ │ └── url.config.js # Database configuration
│ ├── controllers/
│ │ ├── shorturlCreate.controller.js # URL shortening logic
│ │ ├── redirect.controller.js # Redirection handling
│ │ └── X.controller.js # Easter egg handling
│ │
│ ├── model/
│ │ └── url.model.js # URL schema and model
│ ├── data/
│ │ └── repository.js # Data access layer
│ ├── routes/
│ │ ├── creatUrl.route.js # URL creation route
│ │ ├── redirect.route.js # Redirection route
│ │ └── X.route.js # Easter egg route
│ └── middlewares/
│ └── validator.middleware.js # URL validation middleware
├── .env # Environment variables (not in repo)
├── .gitignore # Git ignore file
├── nodemon.json # Nodemon configuration
├── package.json # Project dependencies
├── package-lock.json # Locked dependencies
└── README.md # Project documentation

## 🔹 How it Works

1. User sends a long URL to /url.

2. Backend generates a shortCode and stores it in MongoDB along with optional expiry.

3. MongoDB automatically deletes expired URLs (TTL index on expiresAt).

4. When someone visits /:shortCode, the server redirects to the original URL if it’s valid and not expired.

## 🔹 Note:

- Test scripts need to be configured in package.json.
- Do **not** try to shorten a URL that is already shortened by this service.
- TTL deletion is handled automatically by MongoDB.
- Expired URLs will return **HTTP 410 (Gone)**.
- Clicks are tracked in the `clicks` field in the database.
