# Backend Simple E-Commerce

Backend sederhana untuk aplikasi E-Commerce menggunakan **Node.js** dan **Express.js**.
Project ini dibuat sebagai bagian dari **Tugas Akhir Kewirausahaan (KWU)**.

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/Lyc-n/Backend-Simple-E-Commerce.git
```

Masuk ke folder project:

```bash
cd Backend-Simple-E-Commerce
```

---

## 2. Install Dependencies

```bash
npm install
```

---

# Run Project

Mode development:

```bash
npm run dev
```

Mode production:

```bash
npm start
```

Server akan berjalan di:

```bash
http://localhost:5000
```

---

# Authentication

Project ini menggunakan:

* JWT Authentication
* HTTP Only Cookie
* Middleware Authentication

Authentication flow:

```text
Client → Login → Server Generate JWT
→ JWT disimpan di Cookie
→ Middleware memverifikasi JWT
→ User mendapatkan akses
```

