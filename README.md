<img width="1920" height="1008" alt="Screenshot 2025-11-03 185139" src="https://github.com/user-attachments/assets/49037f05-1bfe-47b3-8edc-961b433f095b" />
Program ini adalah **API Presensi Online** yang dibuat menggunakan **Node.js dan Express** dengan database **MySQL (via Sequelize ORM)**.  
API ini digunakan untuk mencatat dan mengelola data presensi siswa/karyawan secara digital.
Salah satu fitur utamanya adalah **autentikasi pengguna (login)** agar hanya user yang terdaftar bisa mengakses sistem presensi.

**Cara Kerja Program:**
1. Pengguna mengirimkan **request POST** ke endpoint:
   http://localhost:8000/api/auth/login
2.  Di bagian **Body** kemudian raw, pengguna mengirimkan data login dalam format **JSON**:
{
  "username": "Mala",
  "password": "moklet"
}
3. Server akan:
- Memeriksa kecocokan username dan password dengan data di database.
- Jika benar, server mengembalikan status sukses dan token autentikasi (JWT).
- Jika salah, server mengembalikan pesan error.


<img width="1920" height="1008" alt="Screenshot 2025-11-03 201007" src="https://github.com/user-attachments/assets/0c0d986b-7637-4275-9adc-478b6f340470" /> 
**Cara Kerja Program:**
1. Endpoint ini digunakan untuk menambahkan akun pengguna baru ke dalam sistem presensi.
2. Data name, username, password, dan role dikirimkan melalui request body dalam format JSON.
3. Server kemudian akan:
- Memvalidasi data input,
- Menyimpan pengguna baru ke dalam database,
- Mengembalikan respons berupa status sukses beserta data pengguna yang telah disimpan.


<img width="1920" height="1008" alt="Screenshot 2025-11-03 201422" src="https://github.com/user-attachments/assets/155fcfd7-627c-4dc2-8a5a-47e135adbc1c" />
**Cara Kerja Program:**
1. Endpoint ini digunakan untuk mengubah data pengguna yang sudah ada di database.
2. Parameter :id di URL menunjukkan ID pengguna yang ingin diperbarui (contohnya 24).
3. Data baru (name, username, password, role) dikirim melalui request body dalam format JSON.
4. Server akan:
- Memeriksa apakah ID pengguna tersebut ada di database.
- Memperbarui data sesuai input dari pengguna.
- Mengembalikan respons yang berisi status dan data pengguna yang telah diperbarui.


<img width="1920" height="1008" alt="Screenshot 2025-11-03 201943" src="https://github.com/user-attachments/assets/2a242494-032f-40ae-aa9e-586948debbb9" />
**Cara Kerja Program:**
1. Endpoint ini digunakan untuk **mengambil data satu pengguna** dari database berdasarkan `userID`.
2. Parameter `:id` pada URL berfungsi sebagai **identitas unik pengguna** yang ingin dilihat (misalnya `22`).
3. Server akan mencari data pengguna tersebut di database, lalu mengembalikan hasilnya dalam format **JSON**.
4. Jika ID ditemukan, server mengirimkan status `200 OK` dengan data pengguna.
5. Jika tidak ditemukan, server akan memberikan status `404 Not Found`.


<img width="1920" height="1008" alt="Screenshot 2025-11-03 211751" src="https://github.com/user-attachments/assets/98ef3c21-d64a-4575-9fa2-12da40cab606" />
**Cara Kerja Program:**
1. Endpoint ini digunakan untuk mencatat kehadiran pengguna (siswa) ke dalam database.
2. Data presensi dikirim melalui method POST dalam format JSON, berisi userID, date, time, dan status.
3. Server akan memvalidasi data yang diterima — memastikan semua field terisi dengan benar.
4. Jika valid, server akan menyimpan data presensi ke tabel attendance di database.
5. Setelah berhasil disimpan, server mengirimkan respon JSON berisi pesan sukses, status 200 OK, dan data presensi yang baru dicatat.
6. Jika terjadi kesalahan (misalnya data tidak lengkap atau server gagal menyimpan), server akan mengembalikan pesan error dengan status yang sesuai (400 Bad Request atau 500 Internal Server Error).


<img width="1920" height="1008" alt="Screenshot 2025-11-03 214719" src="https://github.com/user-attachments/assets/bc02f425-5993-445f-b04e-910ed7d8adc6" />
**Cara Kerja Program:**
1. Endpoint
API menerima permintaan (request) GET dengan parameter userID di URL.
Contoh: http://localhost:8000/api/attendance/history/24
→ berarti sistem akan mengambil riwayat presensi untuk pengguna dengan ID 24.
2. Proses di Backend
- Server akan mencari data kehadiran dari database berdasarkan userID.
- Jika data ditemukan, server mengirimkan respon dalam format JSON dengan informasi presensi.
3. Kode Status
- Jika permintaan berhasil, API mengembalikan HTTP 200 OK dengan status "success".
- Jika gagal (misalnya data tidak ditemukan), API bisa mengirim status "failed" atau 404 Not Found.


<img width="1920" height="1008" alt="Screenshot 2025-11-03 215508" src="https://github.com/user-attachments/assets/41343358-0b7f-470a-8f9b-b6c5a342d27c" />
**Cara Kerja Program:**
1. Endpoint ini digunakan untuk mengambil ringkasan data kehadiran seorang pengguna berdasarkan userID.
2. Parameter :id pada URL berfungsi sebagai identitas unik pengguna yang ingin ditampilkan ringkasan kehadirannya (contoh: 24).
3. Server akan mengambil dan menghitung jumlah kehadiran dari database, kemudian mengelompokkan data berdasarkan status seperti hadir, izin, sakit, dan alpa.
4. Hasil perhitungan tersebut akan dikembalikan dalam bentuk respon JSON berisi bulan dan jumlah setiap status presensi.
5. Jika data ditemukan, server mengirimkan status 200 OK beserta ringkasan kehadiran.
6. Jika userID tidak ditemukan atau belum memiliki data presensi, server akan mengembalikan respon kosong atau pesan error sesuai kondisi.


<img width="1920" height="1008" alt="Screenshot 2025-11-03 220720" src="https://github.com/user-attachments/assets/9f01a697-0861-4e9b-b7e2-680fbb9dd21d" />
**Cara Kerja Program:**
1. Client (seperti Postman atau frontend app) mengirim request POST ke endpoint /api/attendance/analysis dengan parameter tanggal dan pengelompokan.
2. Backend mengambil data presensi dari database berdasarkan rentang tanggal.
3. Sistem melakukan pengelompokan dan perhitungan statistik (misalnya total kehadiran per peran atau per hari).
4. Hasil analisis dikembalikan ke client dalam format JSON.
5. Jika proses berhasil, server mengembalikan status 200 OK dan "status": "success".
