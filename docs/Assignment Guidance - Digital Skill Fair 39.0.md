# **Assignment Guidance: Simulasi Mesin ATM (CLI \+ javascript)**

**Digital Skill Fair 39.0**

# **Periode Pembelajaran**

Node JS fundamental & Database MySQL

# **Objectives**

1. Membangun Aplikasi CLI sederhana menggunakan commander.js
2. Menggunakan SQL untuk manipulasi data(CRUD)
3. Merancang Relational database yang mencerminkan proses bisnis
4. install nodeJS

# **Deskripsi Assignment**

Kamu diminta untuk membuat sebuah aplikasi **simulasi mesin ATM** berbasis command-line interface (CLI) menggunakan bahasa **Javascript** dengan database backend menggunakan **MySQL**.

Aplikasi harus mampu melakukan proses keuangan dasar seperti registrasi akun, login, pengecekan saldo, setor, tarik tunai, dan transfer antar akun. Mahasiswa juga diminta untuk menyimpan histori transaksi dan menangani kasus-kasus error atau edge case secara eksplisit.

# **Fungsi CLI yang Harus Diimplementasikan**

| Perintah CLI    | Deskripsi                                                       |
| --------------- | --------------------------------------------------------------- |
| `register`      | Membuat akun baru (input: nama, PIN).                           |
| `login`         | Login ke akun dengan nomor akun dan PIN.                        |
| `check-balance` | Menampilkan saldo akun saat ini.                                |
| `deposit`       | Menambahkan saldo ke akun login.                                |
| `withdraw`      | Mengurangi saldo dari akun login (tidak bisa negatif).          |
| `transfer`      | Mentransfer saldo ke akun lain (butuh input nomor akun tujuan). |

### **Spesifikasi Teknis**

#### **1\. Struktur Tabel MySQL:**

##### **Tabel accounts**

| Kolom      | Tipe      | Keterangan                                        |
| ---------- | --------- | ------------------------------------------------- |
| id         | INT (PK)  | Nomor akun                                        |
| name       | VARCHAR   | Nama pengguna                                     |
| pin        | VARCHAR   | PIN (boleh disimpan dalam bentuk plain atau hash) |
| balance    | DECIMAL   | Saldo rekening                                    |
| created_at | TIMESTAMP | Tanggal pembuatan akun                            |

##### **Tabel transactions**

| Kolom      | Tipe       | Keterangan                                   |
| ---------- | ---------- | -------------------------------------------- |
| id         | INT (PK)   | ID transaksi                                 |
| account_id | INT (FK)   | Akun pemilik transaksi                       |
| type       | ENUM       | deposit, withdraw, transfer_in, transfer_out |
| amount     | DECIMAL    | Jumlah transaksi                             |
| target_id  | INT (NULL) | Akun tujuan transfer (jika transfer)         |
| created_at | TIMESTAMP  | Tanggal transaksi                            |

###

###

###

### **Skenario dan Syarat Validasi**

1. Login hanya berlaku selama satu sesi program berjalan (bisa simpan di variable global untuk simulasi).

2. Tidak boleh melakukan transaksi jika belum login.

3. withdraw dan transfer harus menolak transaksi jika saldo tidak mencukupi.

4. Transaksi transfer harus membuat dua entri: satu untuk transfer_out, satu lagi transfer_in.

# **Tools**

VsCode, Mysql.

# **Pengumpulan Assignment**

**KETENTUANNYA**  
1\. Kerjakan dalam bentuk portofolio seperti materi yang ada secara individual  
2\. Wajib upload ke LinkedIn (pastikan tidak privat) dengan tag akun @dibimbing.id dan menggunakan hashtag \#Dibimbing \+ \#DigitalSkillFair39 \+ \#FacultyofIT  
3\. Pastikan memperkenalkan diri dan menuliskan nama kelas yang diikuti dalam postingan (post lebih dari satu kelas, otomatis sertifikat tidak dikirim)  
4\. Copy link postingan LinkedIn dan unggah berdasarkan kelas yang kakak-kakak sudah ikuti melalui link berikut (mengirim lebih dari satu kelas, otomatis sertifikat tidak dikirim)

\[Catatan\] Penugasan menjadi pertimbangan utama bagi sertifikat kakak-kakak yaa, lewat dari deadline sertifikat tidak dikirimkan

Deadline 21 Meil 2025 jam 23.59 malam
