# CicadaFinance-Bot 🦗

Script ini digunakan untuk mengotomatiskan penyelesaian tugas di platform Cicada Finance, membantu pengguna mengklaim poin dan gems dengan mudah dan efisien!

---

## 📌 Fitur
- ✅ Auto completion untuk semua tugas yang tersedia di campaign (mengambil daftar tugas dari API)
- 🔄 Filter tugas yang belum selesai berdasarkan data poin pengguna
- 🎁 Klaim poin dan gems secara otomatis untuk setiap tugas yang diselesaikan
- 🔌 Dukungan proxy (`proxy.txt`) untuk koneksi aman (HTTP, SOCKS4, SOCKS5)
- 🌈 Tampilan console yang keren dengan `cfonts` dan `chalk`, dilengkapi emoji untuk log yang menarik
- ⚡ Pilihan interaktif untuk menggunakan proxy (y/n) melalui prompt
- 🛡️ Error handling yang kuat dengan pesan kesalahan spesifik (misalnya, HTTP status dan response API)

---

## 🚀 Cara Penggunaan

1. **Clone repository ini**
```sh
git clone https://github.com/airdrop-888/cicadaFinance-Bot.git
cd cicadaFinance-Bot
```

---

2. **Install Dependencies**
```sh
npm install axios chalk@4 cfonts http-proxy-agent socks-proxy-agent readline-sync
```

---

3. **Siapkan file tokens**

- Buat file `tokens.txt` dan isi dengan token JWT, satu token per baris. Contoh:
```sh
eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlNyZ0ZUNjFQVmFxX3QzekpScFNCUWxkSjV2R0R4dV9Yb0pjTTBoekk4OXMifQ...
eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlNyZ0ZUNjFQVmFxX3QzekpScFNCUWxkSjV2R0R4dV9Yb0pjTTBoekk4OXMifQ...
```

- (Opsional) Buat `proxy.txt` jika ingin menggunakan proxy. Contoh:
```sh
http://username:password@host:port
socks5://username:password@host:port
```

---

4. **Jalankan Script**
```sh
node index.js
```

---

5. **Ikuti Instruksi**

- Pilih apakah ingin menggunakan proxy (y/n)
- Script akan otomatis:
  - Mengambil daftar tugas dari campaign (default: campaignId 440)
  - Memeriksa tugas yang sudah selesai
  - Menyelesaikan tugas yang belum selesai dan mengklaim poin serta gems
- Log hasil akan ditampilkan dengan warna dan emoji untuk memudahkan tracking

---

## ⚠️ Disclaimer
Gunakan script ini dengan bijak dan sesuai aturan platform Cicada Finance.  
Developer tidak bertanggung jawab atas penyalahgunaan atau banned akun.

---

## 🤝 Kontribusi
Jika ingin berkontribusi, silakan fork repo ini dan ajukan pull request! Kami terbuka untuk ide baru, seperti menambahkan fitur retry, mendukung campaign lain, atau meningkatkan UI console.

---

## 📞 Kontak
Jika ada pertanyaan, hubungi: [@balveerxyz](https://t.me/balveerxyz)  
Join channel Telegram gratis: [t.me/airdroplocked](https://t.me/airdroplocked)

---

## 🙌 Kredit
Script coded by - @balveerxyz  
Dibuat dengan ❤️ untuk komunitas airdrop!
