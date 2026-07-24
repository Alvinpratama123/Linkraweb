# Linkraweb — Dokumentasi Sistem (Use Case, Flowchart & Program)

> **PT Lintas Wahana Teknologi** — Sistem Manajemen & Monitoring Proyek

---

## Daftar Isi

1. [Gambaran Umum Sistem](#1-gambaran-umum-sistem)
2. [Daftar Aktor](#2-daftar-aktor)
3. [Use Case Diagram](#3-use-case-diagram)
4. [Flowchart / Diagram Alir](#4-flowchart--diagram-alir)
5. [Spesifikasi Program](#5-spesifikasi-program)
6. [Arsitektur Sistem](#6-arsitektur-sistem)
7. [Database (ERD)](#7-database-erd)

---

## 1. Gambaran Umum Sistem

**Linkraweb** adalah aplikasi web internal untuk **manajemen dan monitoring proyek** di PT Lintas Wahana Teknologi. Sistem ini menyediakan:

- **Autentikasi** — Login via email & password (magic link), manajemen akun oleh admin
- **Manajemen Proyek** — Upload, edit, review, dan approve/reject proyek
- **Sistem Revisi** — Kirim laporan revisi lintas role dengan komentar dan persetujuan
- **Notifikasi** — Notifikasi in-app dan email secara real-time
- **Laporan & Analitik** — Grafik progres modul, eksport ke Excel/PDF

### Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (Pages Router) |
| Bahasa | JavaScript (纯) |
| Database | MySQL 8.0 (3 database terpisah) |
| ORM | Prisma 6.19 |
| Autentikasi | JWT + HttpOnly Cookie |
| Email | Nodemailer (SMTP Gmail) |
| UI | Tailwind CSS v4, react-icons, framer-motion |
| Export | jsPDF, ExcelJS |

---

## 2. Daftar Aktor

| ID | Aktor | Deskripsi |
|---|---|---|
| A1 | **Admin** | Pengguna dengan role `admin`. Memiliki akses penuh ke semua fitur termasuk manajemen anggota |
| A2 | **Member** | Pengguna dengan role selain admin (`frontend`, `backend`, `uiux`, `qa`, `pm`). Akses terbatas (tidak bisa manajemen anggota) |
| A3 | **Guest** | Pengunjung yang belum login. Hanya bisa mengakses landing page |
| A4 | **Sistem (Email)** | Subsistem email (Nodemailer) yang mengirim notifikasi otomatis |

---

## 3. Use Case Diagram

### 3.1 Use Case — Guest (Belum Login)

```mermaid
graph LR
    Guest((Guest))
    UC1[UC-01: Melihat Landing Page]
    UC2[UC-02: Melihat Statistik Publik]
    UC3[UC-03: Login]
    UC4[UC-04: Lupa Password]

    Guest --> UC1
    Guest --> UC2
    Guest --> UC3
    Guest --> UC4
```

### 3.2 Use Case — Admin

```mermaid
graph TB
    Admin((Admin))

    subgraph Autentikasi
        UC05[UC-05: Logout]
        UC06[UC-06: Edit Profil]
        UC07[UC-07: Ganti Password]
        UC08[UC-08: Ganti Tema]
    end

    subgraph Manajemen Anggota
        UC09[UC-09: Lihat Daftar Anggota]
        UC10[UC-10: Tambah Anggota Baru]
        UC11[UC-11: Hapus Anggota]
        UC12[UC-12: Kirim Ulang Email Kredensial]
    end

    subgraph Manajemen Proyek
        UC13[UC-13: Buat/Upload Proyek]
        UC14[UC-14: Edit Proyek]
        UC15[UC-15: Hapus Proyek]
        UC16[UC-16: Review & Approve/Reject Proyek]
    end

    subgraph Sistem Revisi
        UC17[UC-17: Kirim Laporan Revisi]
        UC18[UC-18: Approve/Reject Revisi]
        UC19[UC-19: Komentar pada Revisi]
        UC20[UC-20: Hapus Revisi]
    end

    subgraph Notifikasi
        UC21[UC-21: Lihat Notifikasi]
        UC22[UC-22: Tandai Sudah Dibaca]
    end

    subgraph Laporan
        UC23[UC-23: Lihat Dashboard Statistik]
        UC24[UC-24: Lihat Grafik Analitik]
        UC25[UC-25: Export Laporan ke Excel/PDF]
    end

    Admin --> Autentikasi
    Admin --> Manajemen Anggota
    Admin --> Manajemen Proyek
    Admin --> Sistem Revisi
    Admin --> Notifikasi
    Admin --> Laporan
```

### 3.3 Use Case — Member

```mermaid
graph TB
    Member((Member))

    subgraph Autentikasi
        UC05b[UC-05: Logout]
        UC06b[UC-06: Edit Profil]
        UC07b[UC-07: Ganti Password]
        UC08b[UC-08: Ganti Tema]
    end

    subgraph Manajemen Proyek
        UC13b[UC-13: Buat/Upload Proyek]
        UC14b[UC-14: Edit Proyek]
        UC15b[UC-15: Hapus Proyek]
    end

    subgraph Sistem Revisi
        UC17b[UC-17: Kirim Laporan Revisi]
        UC18b[UC-18: Approve/Reject Revisi]
        UC19b[UC-19: Komentar pada Revisi]
    end

    subgraph Notifikasi
        UC21b[UC-21: Lihat Notifikasi]
        UC22b[UC-22: Tandai Sudah Dibaca]
    end

    subgraph Laporan
        UC23b[UC-23: Lihat Dashboard Statistik]
        UC24b[UC-24: Lihat Grafik Analitik]
    end

    Member --> Autentikasi
    Member --> Manajemen Proyek
    Member --> Sistem Revisi
    Member --> Notifikasi
    Member --> Laporan
```

### 3.4 Use Case — Detail Setiap Use Case

| ID | Use Case | Aktor | Deskripsi | Prekondisi | Postkondisi |
|---|---|---|---|---|---|
| UC-01 | Melihat Landing Page | Guest | Mengakses halaman utama (`/`) | Tidak ada | Halaman ditampilkan |
| UC-02 | Melihat Statistik Publik | Guest | Melihat jumlah proyek & anggota di landing page | Tidak ada | Data statistik ditampilkan |
| UC-03 | Login | Guest | Masuk ke sistem menggunakan email & password | Akun sudah terdaftar | JWT cookie dibuat, redirect ke dashboard |
| UC-04 | Lupa Password | Guest | Reset password via OTP email | Akun terdaftar | Password baru diatur |
| UC-05 | Logout | Admin, Member | Keluar dari sistem | Sudah login | JWT cookie dihapus |
| UC-06 | Edit Profil | Admin, Member | Mengubah nama, email, foto profil | Sudah login | Profil diperbarui |
| UC-07 | Ganti Password | Admin, Member | Mengubah password | Sudah login | Password diupdate |
| UC-08 | Ganti Tema | Admin, Member | Toggle dark/light mode | Sudah login | Tema berubah |
| UC-09 | Lihat Daftar Anggota | Admin | Melihat semua anggota beserta role & posisi | Role = admin | Daftar anggota ditampilkan |
| UC-10 | Tambah Anggota | Admin | Membuat akun anggota baru dengan role & posisi | Role = admin | Anggota dibuat, email kredensial terkirim |
| UC-11 | Hapus Anggota | Admin | Menghapus akun anggota dari sistem | Role = admin | Akun terhapus |
| UC-12 | Kirim Ulang Email | Admin | Mengirim ulang email kredensial ke anggota | Role = admin | Email terkirim ulang |
| UC-13 | Buat/Upload Proyek | Admin, Member | Membuat proyek baru dengan gambar & modul | Sudah login | Proyek tersimpan, notifikasi terkirim |
| UC-14 | Edit Proyek | Admin, Member | Mengubah data proyek | Pemilik proyek atau admin | Proyek diperbarui |
| UC-15 | Hapus Proyek | Admin, Member | Menghapus proyek beserta lampiran | Pemilik atau admin | Proyek & lampiran terhapus |
| UC-16 | Review Proyek | Admin | Approve atau reject proyek | Role = admin, project pending | Keputusan tersimpan, notifikasi terkirim |
| UC-17 | Kirim Revisi | Admin, Member | Mengirim laporan revisi ke role tertentu | Sudah login, target valid | Revisi tersimpan, notifikasi + email terkirim |
| UC-18 | Approve/Reject Revisi | Admin, Member | Menyetujui atau menolak laporan revisi | Sudah login, role target sesuai | Status revisi diupdate, notifikasi terkirim |
| UC-19 | Komentar Revisi | Admin, Member | Menambahkan komentar pada laporan revisi | Sudah login | Komentar tersimpan, notifikasi terkirim |
| UC-20 | Hapus Revisi | Admin, Member | Menghapus laporan revisi | Pemilik revisi | Revisi terhapus |
| UC-21 | Lihat Notifikasi | Admin, Member | Melihat daftar notifikasi | Sudah login | Daftar notifikasi ditampilkan |
| UC-22 | Tandai Dibaca | Admin, Member | Menandai notifikasi sudah dibaca | Sudah login | `isRead = true` |
| UC-23 | Dashboard Statistik | Admin, Member | Melihat ringkasan jumlah proyek, anggota, dll | Sudah login | Statistik ditampilkan |
| UC-24 | Grafik Analitik | Admin, Member | Melihat grafik kategori proyek & progres modul | Sudah login | Grafik ditampilkan |
| UC-25 | Export Laporan | Admin | Mengekspor laporan ke Excel atau PDF | Role = admin | File terdownload |

### 3.5 Use Case — Relasi Include & Extend

```mermaid
graph TB
    UC03[UC-03: Login] 
    UC04[UC-04: Lupa Password]
    UC10[UC-10: Tambah Anggota]
    UC13[UC-13: Buat/Upload Proyek]
    UC16[UC-16: Review Proyek]
    UC17[UC-17: Kirim Revisi]

    VALIDATE[<<include>> Validasi JWT]
    SEND_EMAIL[<<include>> Kirim Email]
    NOTIFY[<<include>> Buat Notifikasi]
    UPLOAD_FILE[<<include>> Upload File]
    OTP_STEP[<<extend>> Verifikasi OTP]
    ROLE_CHECK[<<extend>> Cek Role Target]

    UC03 -->|include| VALIDATE
    UC10 -->|include| SEND_EMAIL
    UC10 -->|include| NOTIFY
    UC13 -->|include| UPLOAD_FILE
    UC13 -->|include| NOTIFY
    UC16 -->|include| NOTIFY
    UC17 -->|include| NOTIFY
    UC17 -->|include| SEND_EMAIL
    UC17 -->|extend| ROLE_CHECK
    UC04 -->|extend| OTP_STEP
```

---

## 4. Flowchart / Diagram Alir

### 4.1 Flowchart — Login

```mermaid
flowchart TD
    Start([Mulai]) --> InputEmail[Input Email + Password]
    InputEmail --> ValidateInput{Input valid?}
    
    ValidateInput -->|Tidak| ErrInput[Error: Field wajib kosong]
    ErrInput --> EndFail([Gagal])
    
    ValidateInput -->|Ya| FindUser[Cari User di Database]
    FindUser --> UserExists{User ditemukan?}
    
    UserExists -->|Tidak| ErrUser[Error: User tidak ditemukan]
    ErrUser --> EndFail
    
    UserExists -->|Ya| CheckPass{Password cocok?}
    CheckPass -->|Tidak| ErrPass[Error: Password salah]
    ErrPass --> EndFail
    
    CheckPass -->|Ya| GenJWT[Generate JWT Token - 7 hari]
    GenJWT --> SetCookie[Set auth_token HttpOnly Cookie]
    SetCookie --> ReturnData[Return user data + redirect path]
    ReturnData --> CheckRole{Role?}
    
    CheckRole -->|admin| RedirectAdmin[/dashboardAdmin/admin]
    CheckRole -->|member| RedirectMember[/memberDashboard/MemberDashboard]
    
    RedirectAdmin --> EndOK([Berhasil])
    RedirectMember --> EndOK
    
    style Start fill:#22c55e,color:#fff
    style EndOK fill:#22c55e,color:#fff
    style EndFail fill:#ef4444,color:#fff
    style RedirectAdmin fill:#3b82f6,color:#fff
    style RedirectMember fill:#8b5cf6,color:#fff
```

### 4.2 Flowchart — Lupa Password (3 Langkah)

```mermaid
flowchart TD
    Start([Mulai]) --> Step1
    
    subgraph Step1["Langkah 1: Kirim OTP"]
        S1Input[Input Email] --> S1FindUser{User ada?}
        S1FindUser -->|Tidak| S1Err[Error: Email tidak terdaftar]
        S1FindUser -->|Ya| S1DelOld[Hapus OTP lama]
        S1DelOld --> S1GenOTP[Generate OTP 6 karakter - 15 menit]
        S1GenOTP --> S1SendEmail[Kirim OTP via Email]
        S1SendEmail --> S1Done1[/Tampilkan form OTP/]
    end
    
    subgraph Step2["Langkah 2: Verifikasi OTP"]
        S2Input[Input OTP] --> S2Verify{OTP valid & belum expired?}
        S2Verify -->|Tidak| S2Err[Error: OTP salah/expired]
        S2Verify -->|Ya| S2Return[Return resetId]
    end
    
    subgraph Step3["Langkah 3: Reset Password"]
        S3Input[Input Password Baru] --> S3Update[Update Password + Tandai OTP Used]
        S3Update --> S3Done[/Password berhasil diubah/]
    end
    
    S1Done1 --> Step2
    S2Return --> Step3
    S3Done --> EndOK([Selesai])
    
    S1Err --> EndFail([Gagal])
    S2Err --> EndFail
    
    style Start fill:#22c55e,color:#fff
    style EndOK fill:#22c55e,color:#fff
    style EndFail fill:#ef4444,color:#fff
```

### 4.3 Flowchart — Tambah Anggota (Admin Only)

```mermaid
flowchart TD
    Start([Admin Login]) --> OpenTeam[Membuka Halaman Team Management]
    OpenTeam --> FillForm[Isi Form: Nama, Email, Password, Posisi, Role]
    FillForm --> CheckEmail{Email sudah digunakan?}
    
    CheckEmail -->|Ya| ErrEmail[Error: Email sudah terdaftar]
    ErrEmail --> FillForm
    
    CheckEmail -->|Tidak| HashPass[Hash Password dengan bcrypt - 10 rounds]
    HashPass --> CreateUser[Simpan User ke Database - ID: cuid]
    CreateUser --> SendCred[Kirim Email Kredensial ke Anggota Baru]
    SendCred --> NotifyAdmin[Buat Notifikasi ke Semua Admin]
    NotifyAdmin --> NotifyMember[Buat Notifikasi ke Anggota Baru]
    NotifyMember --> EndOK([Berhasil: Anggota Ditambahkan])
    
    style Start fill:#22c55e,color:#fff
    style EndOK fill:#22c55e,color:#fff
    style ErrEmail fill:#ef4444,color:#fff
```

### 4.4 Flowchart — Upload Proyek

```mermaid
flowchart TD
    Start([User Login]) --> OpenProject[Membuka Project Management]
    OpenProject --> FillForm[Isi Form: Nama, Posisi, Repo Link, Tanggal, Tim]
    FillForm --> UploadImg{Upload Gambar?}
    
    UploadImg -->|Ya| ValImg{Valid? (jpg/png, max 10MB)}
    ValImg -->|Tidak| ErrImg[Error: Format/ukuran salah]
    ValImg -->|Ya| SaveImg[Simpan Gambar]
    UploadImg -->|Tidak| SkipImg
    
    SaveImg --> UploadMod{Upload Modul?}
    SkipImg --> UploadMod
    
    UploadMod -->|Ya| ValMod{Valid? (pdf/doc/docx, max 10MB)}
    ValMod -->|Tidak| ErrMod[Error: Format/ukuran salah]
    ValMod -->|Ya| SaveMod[Simpan Modul]
    UploadMod -->|Tidak| SkipMod
    
    SaveMod --> Upsert{Project sudah ada?}
    SkipMod --> Upsert
    
    Upsert -->|Ya| UpdateProject[Update Project yang ada]
    Upsert -->|Tidak| CreateProject[Buat Project Baru - ID: cuid]
    
    UpdateProject --> SaveAttach[Simpan Attachment Records - ID: autoincrement]
    CreateProject --> SaveAttach
    
    SaveAttach --> NotifyAll[Buat Notifikasi ke Semua User]
    NotifyAll --> EndOK([Berhasil: Proyek Diupload])
    
    ErrImg --> FillForm
    ErrMod --> FillForm
    
    style Start fill:#22c55e,color:#fff
    style EndOK fill:#22c55e,color:#fff
    style ErrImg fill:#ef4444,color:#fff
    style ErrMod fill:#ef4444,color:#fff
```

### 4.5 Flowchart — Review Proyek (Admin)

```mermaid
flowchart TD
    Start([Admin Login]) --> OpenReview[Membuka Project Review]
    OpenReview --> ViewProjects[Daftar Proyek - Status: Pending]
    ViewProjects --> SelectProject[Pilih Proyek]
    SelectProject --> CheckProgress{Progres & Lampiran OK?}
    
    CheckProgress -->|Ya| Approved[Decision: APPROVED]
    CheckProgress -->|Tidak| Rejected[Decision: REJECTED]
    
    Approved --> NotifApproved[Buat Notifikasi ke Semua User]
    Rejected --> NotifRejected[Buat Notifikasi ke Semua User]
    
    NotifApproved --> EndOK([Review Selesai])
    NotifRejected --> EndOK
    
    style Start fill:#22c55e,color:#fff
    style EndOK fill:#22c55e,color:#fff
    style Approved fill:#22c55e,color:#fff
    style Rejected fill:#ef4444,color:#fff
```

### 4.6 Flowchart — Kirim Laporan Revisi

```mermaid
flowchart TD
    Start([User Login]) --> OpenIssues[Membuka Halaman Issues]
    OpenIssues --> SelectRole{Pilih Target Role}
    
    SelectRole -->|QA ->| FE_BE_PM_UIUX_DO[Target: Frontend, Backend, PM, UI/UX, DevOps]
    SelectRole -->|FE ->| BE_PM_QA[Target: Backend, PM, QA]
    SelectRole -->|BE ->| FE_PM_QA[Target: Frontend, PM, QA]
    SelectRole -->|PM ->| FE_BE_QA_UIUX_DO[Target: Frontend, Backend, QA, UI/UX, DevOps]
    SelectRole -->|UIUX ->| FE_PM_QA2[Target: Frontend, PM, QA]
    SelectRole -->|DevOps ->| BE_PM2[Target: Backend, PM]
    
    FE_BE_PM_UIUX_DO --> SelectUser[Pilih Target User]
    BE_PM_QA --> SelectUser
    FE_PM_QA --> SelectUser
    FE_BE_QA_UIUX_DO --> SelectUser
    FE_PM_QA2 --> SelectUser
    BE_PM2 --> SelectUser
    
    SelectUser --> FillForm[Isi: Tipe Issue, Deskripsi, Progres]
    FillForm --> AttachFile{Ada Lampiran?}
    
    AttachFile -->|Ya| UploadFile[Upload File Lampiran]
    AttachFile -->|Tidak| SaveReport
    UploadFile --> SaveReport
    
    SaveReport[Simpan RevisionReport - ID: cuid]
    SaveReport --> CreateNotif[Buat Notifikasi ke Target User]
    CreateNotif --> SendEmail[Kirim Email ke Target User]
    SendEmail --> EndOK([Revisi Terkirim])
    
    style Start fill:#22c55e,color:#fff
    style EndOK fill:#3b82f6,color:#fff
```

### 4.7 Flowchart — Proses Revisi (Target User)

```mermaid
flowchart TD
    Start([Target User Menerima Notifikasi]) --> OpenIssues[Membuka Halaman Issues]
    OpenIssues --> ViewRevision[Melihat Laporan Revisi]
    ViewRevision --> Decision{Keputusan?}
    
    Decision -->|Approve| SetApproved[Status: APPROVED]
    Decision -->|Reject| SetRejected[Status: REJECTED]
    Decision -->|Comment| AddComment[Tulis Komentar]
    
    SetApproved --> NotifySender1[Buat Notifikasi ke Pengirim]
    SetRejected --> NotifySender2[Buat Notifikasi ke Pengirim]
    AddComment --> NotifySender3[Buat Notifikasi ke Pengirim + Author]
    
    NotifySender1 --> EndOK([Selesai])
    NotifySender2 --> EndOK
    NotifySender3 --> EndOK
    
    style Start fill:#22c55e,color:#fff
    style EndOK fill:#22c55e,color:#fff
    style SetApproved fill:#22c55e,color:#fff
    style SetRejected fill:#ef4444,color:#fff
```

### 4.8 Flowchart — Sistem Notifikasi

```mermaid
flowchart TD
    Trigger{Trigger Event} --> EvtType{Jenis Event}
    
    EvtType -->|Proyek Baru| NotifAll[Buat Notifikasi ke Semua User]
    EvtType -->|Revisi Dikirim| NotifTarget[Buat Notifikasi ke Target User]
    EvtType -->|Revisi Di-approve/reject| NotifSender[Buat Notifikasi ke Pengirim Revisi]
    EvtType -->|Komentar| NotifSenderAuthor[Buat Notifikasi ke Pengirim + Author]
    EvtType -->|Anggota Baru| NotifAdminNew[Buat Notifikasi ke Admin + Anggota Baru]
    
    NotifAll --> StoreDB[Simpan ke Database - ID: cuid]
    NotifTarget --> StoreDB
    NotifSender --> StoreDB
    NotifSenderAuthor --> StoreDB
    NotifAdminNew --> StoreDB
    
    StoreDB --> SendEmail[Kirim Email via Nodemailer]
    SendEmail --> UpdateBell[Update Notification Bell di UI]
    
    UpdateBell --> UserAction{User Action}
    UserAction -->|Klik Bell| ViewList[Daftar Notifikasi]
    UserAction -->|Tandai Dibaca| MarkRead[PATCH isRead = true]
    UserAction -->|Ikuti Link| OpenPage[Buka Halaman Terkait]
    
    ViewList --> MarkRead
    
    Trigger -->|24 jam| Cleanup[Auto-delete notifikasi > 24 jam]
    
    Trigger2[Scheduler] --> Cleanup
    Cleanup --> End([Selesai])
    
    style Trigger fill:#f59e0b,color:#fff
    style End fill:#22c55e,color:#fff
    style Cleanup fill:#f59e0b,color:#fff
```

### 4.9 Flowchart — Export Laporan (Admin)

```mermaid
flowchart TD
    Start([Admin Login]) --> OpenReports[Membuka Halaman Reports]
    OpenReports --> LoadData[Muat Data Proyek & Anggota]
    LoadData --> ComputeStats[Hitung Statistik]
    
    ComputeStats --> Categorize[Kategori Proyek: IoT, Website, Mobile App, API, Other]
    ComputeStats --> MemberStats[Posisi Anggota: Frontend, Backend, UI/UX, dll]
    ComputeStats --> ModuleProgress[Progres Modul per Proyek]
    
    Categorize --> RenderCharts[Tampilkan Grafik Bar]
    MemberStats --> RenderCharts
    ModuleProgress --> RenderCharts
    
    RenderCharts --> ChooseExport{Export Format}
    ChooseExport -->|Excel| GenExcel[Generate file .xlsx via ExcelJS]
    ChooseExport -->|PDF| GenPDF[Generate PDF via jsPDF + autoTable]
    
    GenExcel --> Download[Download File]
    GenPDF --> Download
    Download --> EndOK([Selesai])
    
    style Start fill:#22c55e,color:#fff
    style EndOK fill:#22c55e,color:#fff
```

---

## 5. Spesifikasi Program

### 5.1 Struktur Halaman

```
D:\Alvi\test-next\
├── src/
│   ├── pages/
│   │   ├── index.js                    # Landing page
│   │   ├── components/
│   │   │   └── login.js                # Komponen login
│   │   ├── auth/
│   │   │   └── forgot-password.js      # Lupa password (3 langkah)
│   │   ├── dashboardAdmin/
│   │   │   └── admin.js                # Dashboard admin (shell)
│   │   ├── memberDashboard/
│   │   │   └── MemberDashboard.js      # Dashboard member (shell)
│   │   ├── settings/
│   │   │   ├── profile.js              # Edit profil
│   │   │   ├── changepassword.js       # Ganti password
│   │   │   └── settingsTema.js         # Toggle tema
│   │   └── api/
│   │       ├── auth/                   # Autentikasi API
│   │       ├── members/                # Manajemen anggota API
│   │       ├── projects/               # Manajemen proyek API
│   │       ├── revisions/              # Sistem revisi API
│   │       ├── notifications/          # Notifikasi API
│   │       └── stats/                  # Statistik API
│   ├── lib/
│   │   ├── revisionConfig.js           # Konfigurasi role & permission revisi
│   │   ├── notification.js             # Helper notifikasi
│   │   ├── email.js                    # Template email revisi
│   │   └── mailer.js                   # Nodemailer setup & template kredensial
│   ├── generated/
│   │   └── prisma/                     # Prisma client (generated)
│   └── components/
│       ├── componentsDashboard/        # Komponen dashboard (sidebar, cards, dll)
│       └── componentsSettings/         # Komponen settings
├── prisma/
│   ├── auth/schema.prisma              # Schema auth_db
│   ├── project/schema.prisma           # Schema project_db
│   └── monitoring/schema.prisma        # Schema monitoring_db
├── public/
│   └── uploads/                        # File upload (gambar & modul)
├── middleware.js                        # Rate limiting & security headers
├── docker-compose.yml                  # MySQL 8.0 container
└── .env                                # Environment variables
```

### 5.2 API Endpoints

#### Auth API

| Method | Endpoint | Fungsi |
|---|---|---|
| `POST` | `/api/auth/login` | Validasi kredensial, buat JWT cookie |
| `GET` | `/api/auth/me` | Ambil data user dari JWT cookie |
| `GET` | `/api/auth/get-profile` | Ambil profil user (termasuk updatedAt) |
| `PUT` | `/api/auth/update-profile` | Update nama, email, foto profil |
| `POST` | `/api/auth/logout` | Hapus cookie autentikasi |
| `POST` | `/api/auth/forgot-password` | Generate & kirim OTP 6 karakter |
| `POST` | `/api/auth/verify-reset-otp` | Verifikasi OTP (15 menit expiry) |
| `POST` | `/api/auth/reset-password` | Update password + tandai OTP used |

#### Member API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| `GET` | `/api/members` | Daftar semua anggota | Admin |
| `POST` | `/api/members` | Tambah anggota baru + kirim email kredensial | Admin |
| `DELETE` | `/api/members/[id]` | Hapus anggota | Admin |
| `POST` | `/api/members/resend-email/[id]` | Kirim ulang email kredensial | Admin |

#### Project API

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/projects` | Daftar semua proyek |
| `POST` | `/api/projects` | Buat/update proyek (upsert) |
| `PATCH` | `/api/projects` | Update field proyek (decision, finished, progress) |
| `DELETE` | `/api/projects` | Hapus proyek + lampiran |
| `GET/PATCH/DELETE` | `/api/projects/[id]` | CRUD proyek per ID |
| `POST` | `/api/projects/upload` | Upload proyek dengan file (multipart) |
| `GET` | `/api/projects/download` | Download file lampiran |
| `GET/PATCH/DELETE` | `/api/projects/attachments/[id]` | Kelola lampiran individual |

#### Revision API

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/revisions` | Daftar revisi (dengan filter & paginasi) |
| `POST` | `/api/revisions` | Buat laporan revisi baru |
| `PATCH` | `/api/revisions` | Update status revisi (progress, approval) |
| `DELETE` | `/api/revisions` | Hapus revisi |
| `GET/PATCH/DELETE` | `/api/revisions/[id]` | CRUD revisi per ID |
| `GET/POST` | `/api/revisions/[id]/comments` | Lihat/tambah komentar |

#### Notification API

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/notifications` | Daftar notifikasi (24 jam terakhir) |
| `POST` | `/api/notifications` | Buat notifikasi baru |
| `PATCH` | `/api/notifications` | Tandai sudah dibaca (satu/all) |
| `DELETE` | `/api/notifications` | Hapus notifikasi |
| `DELETE` | `/api/notifications/cleanup` | Hapus notifikasi > 24 jam |
| `GET` | `/api/notifications/count` | Jumlah notifikasi belum dibaca |

### 5.3 Konfigurasi Role Revisi (Sender -> Target)

| Sender Role | Target Role yang Diizinkan |
|---|---|
| QA | Frontend, Backend, PM, UI/UX, DevOps |
| Frontend | Backend, PM, QA |
| Backend | Frontend, PM, QA |
| PM | Frontend, Backend, QA, UI/UX, DevOps |
| UI/UX | Frontend, PM, QA |
| DevOps | Backend, PM |

### 5.4 Tipe Issue Revisi

| Kode | Keterangan |
|---|---|
| `MODUL` | Masalah pada modul/dokumen |
| `PROJECT` | Masalah pada proyek secara umum |
| `INTEGRASI` | Masalah integrasi antar modul |
| `BUG` | Error/bug pada aplikasi |
| `LAINNYA` | Tipe lainnya |

### 5.5 Status Progres Revisi

| Status | Keterangan |
|---|---|
| `BELUM_DILAKUKAN` | Belum ada tindakan |
| `SEDANG_DILAKUKAN` | Sedang dikerjakan |
| `SELESAI` | Pengerjaan selesai |

### 5.6 Status Persetujuan Revisi

| Status | Keterangan |
|---|---|
| `PENDING` | Menunggu keputusan |
| `APPROVED` | Disetujui |
| `REJECTED` | Ditolak |

---

## 6. Arsitektur Sistem

### 6.1 Diagram Arsitektur

```mermaid
graph TB
    subgraph Client["Client (Browser)"]
        FE[Next.js Frontend<br/>React + Tailwind]
    end

    subgraph Server["Server (Next.js API Routes)"]
        AuthAPI[Auth API]
        MemberAPI[Member API]
        ProjectAPI[Project API]
        RevisionAPI[Revision API]
        NotifAPI[Notification API]
        StatsAPI[Stats API]
    end

    subgraph DB["Database Layer (MySQL 8.0)"]
        authDB[(auth_db<br/>User, PasswordResetToken)]
        projectDB[(project_db<br/>Project, Attachment)]
        monitorDB[(monitoring_db<br/>RevisionReport, Comment, Notification)]
    end

    subgraph External["External Services"]
        Gmail[SMTP Gmail<br/>Nodemailer]
        FileStorage[File Storage<br/>public/uploads/]
    end

    FE <-->|HTTP/REST| Server
    AuthAPI <--> authDB
    MemberAPI <--> authDB
    ProjectAPI <--> projectDB
    ProjectAPI <--> authDB
    RevisionAPI <--> monitorDB
    RevisionAPI <--> authDB
    NotifAPI <--> monitorDB
    StatsAPI <--> projectDB
    StatsAPI <--> authDB

    AuthAPI --> Gmail
    MemberAPI --> Gmail
    RevisionAPI --> Gmail
    ProjectAPI --> FileStorage

    style Client fill:#dbeafe,stroke:#3b82f6
    style Server fill:#dcfce7,stroke:#22c55e
    style DB fill:#fef3c7,stroke:#f59e0b
    style External fill:#fce7f3,stroke:#ec4899
```

### 6.2 Flow Autentikasi JWT

```mermaid
sequenceDiagram
    participant U as User/Browser
    participant S as Server (Next.js)
    participant DB as auth_db

    U->>S: POST /api/auth/login (email, password)
    S->>DB: SELECT user WHERE email = ?
    DB-->>S: User data
    S->>S: bcrypt.compare(password, hash)
    S->>S: jwt.sign({userId, email, role, ...}, SECRET, 7d)
    S->>S: Set-Cookie: auth_token=JWT (HttpOnly, 7d)
    S-->>U: {user: {...}, redirectPath: "/dashboardAdmin/admin"}

    U->>S: GET /api/auth/me (Cookie: auth_token=JWT)
    S->>S: jwt.verify(token, SECRET)
    S->>DB: SELECT user WHERE id = userId
    DB-->>S: User data
    S-->>U: {id, name, email, role, position, photo, canApprove}

    U->>S: POST /api/auth/logout
    S->>S: Clear auth_token cookie
    S-->>U: {success: true}
```

### 6.3 Flow Upload Proyek (Multipart)

```mermaid
sequenceDiagram
    participant U as User/Browser
    participant S as Server (API)
    participant FS as File System
    participant DB as project_db

    U->>S: POST /api/projects/upload (multipart/form-data)
    Note over U,S: Fields: name, position, repoLink,<br/>date, teamMembers, image, module

    S->>S: formidable.parse(request)
    S->>FS: Simpan image ke public/uploads/
    S->>FS: Simpan module ke public/uploads/

    S->>DB: SELECT project WHERE name=? AND userId=?
    
    alt Project belum ada
        S->>DB: INSERT INTO project (id=cuid, name, ...)
    else Project sudah ada
        S->>DB: UPDATE project SET ... WHERE id=?
    end

    S->>DB: INSERT INTO attachment (type, name, url, ...)
    S-->>U: {success: true, project: {...}}
```

### 6.4 Flow Kirim Revisi + Notifikasi

```mermaid
sequenceDiagram
    participant Sender as Pengirim Revisi
    participant S as Server (API)
    participant M_DB as monitoring_db
    participant A_DB as auth_db
    participant Email as Nodemailer
    participant Target as Target User

    Sender->>S: POST /api/revisions (data revisi)
    S->>A_DB: SELECT user WHERE id = targetUserId
    A_DB-->>S: Target user data
    S->>S: Validasi role target sesuai SenderTargetMap

    S->>M_DB: INSERT INTO revision_report (id=cuid, ...)
    S->>M_DB: INSERT INTO notification (userId=targetUserId, ...)
    S->>Email: Send email ke target user
    Email-->>Target: Email notifikasi

    S-->>Sender: {success: true, revision: {...}}

    Note over Target: Target user membuka revisi

    Target->>S: PATCH /api/revisions (approval=APPROVED)
    S->>M_DB: UPDATE revision_report SET approval=APPROVED
    S->>M_DB: INSERT INTO notification (userId=senderId, ...)
    S->>Email: Send email ke pengirim
    S-->>Target: {success: true}
```

---

## 7. Database (ERD)

### 7.1 Entity Relationship Diagram

```mermaid
erDiagram
    %% ============================================
    %% DATABASE: auth_db
    %% ============================================
    USER {
        string id PK "cuid()"
        string email UK
        string password
        string name
        string role "default: member"
        string position
        string profile
        string photo
        boolean isVerified "default: true"
        boolean canApprove "default: false"
        boolean credentialEmailSent "default: false"
        datetime createdAt
        datetime updatedAt
    }

    PASSWORD_RESET_TOKEN {
        string id PK "cuid()"
        string email
        string code
        datetime expiresAt
        boolean used "default: false"
        datetime usedAt
        datetime createdAt
        string userId FK
    }

    %% ============================================
    %% DATABASE: project_db
    %% ============================================
    PROJECT {
        string id PK "cuid()"
        string name
        string position
        string repoLink
        datetime date
        int progress "default: 0"
        string decision "pending|approved|rejected"
        boolean finished "default: false"
        string imageDescription
        string imageUrl
        string moduleUrl
        string teamMembers
        string userId "cross-DB ref"
        datetime createdAt
        datetime updatedAt
    }

    ATTACHMENT {
        int id PK "autoincrement()"
        string projectId FK
        string type
        string name
        string url
        string status "default: pending"
        string description
        boolean isAdditionalDescription "default: false"
        datetime createdAt
    }

    %% ============================================
    %% DATABASE: monitoring_db
    %% ============================================
    REVISION_REPORT {
        string id PK "cuid()"
        string projectName
        string issueType "MODUL|PROJECT|INTEGRASI|BUG|LAINNYA"
        string description
        string progress "BELUM_DILAKUKAN"
        string approval "PENDING|APPROVED|REJECTED"
        string approvalNote
        string senderRole
        string targetRole
        string targetUserId "cross-DB ref"
        string sentById "cross-DB ref"
        string attachmentName
        string attachmentUrl
        datetime createdAt
        datetime updatedAt
    }

    REVISION_COMMENT {
        string id PK "cuid()"
        string content
        string authorId "cross-DB ref"
        string reportId FK
        datetime createdAt
    }

    NOTIFICATION {
        string id PK "cuid()"
        string userId "cross-DB ref"
        string title
        string message
        string type "default: system"
        string link
        boolean isRead "default: false"
        string icon
        string color
        datetime createdAt
        datetime updatedAt
    }

    %% ============================================
    %% RELATIONS
    %% ============================================
    USER ||--o{ PASSWORD_RESET_TOKEN : "has"
    PROJECT ||--o{ ATTACHMENT : "has"
    REVISION_REPORT ||--o{ REVISION_COMMENT : "has"
    USER ||--o{ PROJECT : "userId (manual)"
    USER ||--o{ REVISION_REPORT : "sentById (manual)"
    USER ||--o{ REVISION_REPORT : "targetUserId (manual)"
    USER ||--o{ REVISION_COMMENT : "authorId (manual)"
    USER ||--o{ NOTIFICATION : "userId (manual)"
```

### 7.2 Multi-Database Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    MySQL 8.0 (Docker)                     │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   auth_db   │  │  project_db  │  │  monitoring_db  │  │
│  │             │  │              │  │                 │  │
│  │ • User      │  │ • Project    │  │ • RevisionReport│  │
│  │ • PwdReset  │  │ • Attachment │  │ • RevisionComment│ │
│  │   Token     │  │              │  │ • Notification  │  │
│  └──────┬──────┘  └──────┬───────┘  └────────┬────────┘  │
│         │                │                    │           │
│         └────────────────┼────────────────────┘           │
│                          │                                │
│              Cross-DB refs via String IDs                 │
│              (managed at application layer)               │
└──────────────────────────────────────────────────────────┘
```

---

## Lampiran: Kode Referensi Cepat

### Rate Limiting (middleware.js)
- 20 requests / 15 menit per IP untuk `/api/auth/*`

### Keamanan (Security Headers)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy`
- `Strict-Transport-Security` (production)
- `SameSite=Lax` untuk cookies

### File Upload Limits
- **Foto profil**: max 2MB (jpg, png)
- **Gambar proyek**: max 10MB (jpg, png, gif, webp)
- **Modul proyek**: max 10MB (pdf, doc, docx)

### Auto-Cleanup
- Notifikasi otomatis dihapus setelah **24 jam**
- Token reset password expiring **15 menit**
- JWT cookie expiring **7 hari**
