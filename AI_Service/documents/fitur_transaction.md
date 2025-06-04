#Fitur Transaksi

1. Tambah Transaksi (Add Transaction)
 Field yang diisi pengguna:
  - amount (number, required): Nominal uang transaksi.
  - type (enum: 'income' | 'expense', required)
  - category (select, required)
  - description (string, required)
  - date (date, opsional)

 Validasi:
  - Amount harus > 0
  - Date tidak boleh lebih dari hari ini (optional, tergantung logic)

 Kategori yang tersedia:
  - Expense:
    belanja, keperluan pribadi, hiburan, donasi, investasi, makanan dan minuman, kesehatan, pendidikan, tagihan, transportasi, transfer, lainnya

  - Income:
    gaji, bonus, penjualan, hadiah, refund, hibah, dividen, lainnya

 Contoh Prompt RAG:
    "Bagaimana cara menambahkan transaksi pembelian makanan di aplikasi ini?"
    → Jawaban AI: "Kamu bisa klik tombol 'Add Transaction', lalu isi amount, pilih tipe expense, dan kategori makanan dan minuman. Setelah itu simpan transaksinya."

2. Edit Transaksi (Update)
 - Akses via daftar transaksi
 - Field editable: semua kecuali ID
 - Tampilkan data lama sebagai default value
 - Validasi sama seperti tambah transaksi
 Contoh Prompt RAG:
    "Aku salah pilih kategori transaksi, bisa diubah gak?"
    → "Bisa, klik transaksi yang ingin diubah lalu perbarui kategori atau data lain dan simpan ulang."

3. Hapus Transaksi (Delete)
 - Akses via icon/trash di daftar
 - Konfirmasi sebelum hapus
 Contoh Prompt RAG:
    "Aku ingin menghapus transaksi refund yang tidak sengaja aku input, gimana caranya?"
    → "Kamu bisa buka daftar transaksi, cari yang ingin dihapus, klik ikon sampah, lalu konfirmasi penghapusan."

4. Visualisasi table
 - Table transaction list berguna untuk melihat transaksi user perhari
 - Table transaction trends berguna untuk melihat tren transaksi 