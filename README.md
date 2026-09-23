# e-mall.uz

e-mall.uz — do‘konlar uchun ko‘p-do‘konli (multi-tenant) marketplace, POS va
ombor boshqaruv SaaS platformasi. Har bir do‘kon o‘z vitrinasini, mahsulotlarini,
sotuvchilarini, buyurtmalarini va savdo tarixini boshqaradi.

## Asosiy imkoniyatlar

- Do‘kon ro‘yxatdan o‘tishi va Telegram orqali tasdiqlanishi
- Telefon raqami va parol orqali kirish
- Rollarga asoslangan ruxsatlar
- Do‘kon vitrinasida mahsulotlarni ko‘rsatish
- POS orqali kassaviy savdo
- Mahsulot, kategoriya, ombor va qoldiq boshqaruvi
- Shtrix-kod/MXIK orqali Soliq katalogidan ma’lumot qidirish
- Sotuvchilarni qo‘shish va ularning savdo statistikasini ko‘rish
- Buyurtmalar, kuponlar, qaytarishlar va savdo tarixi
- Telegram orqali ombor ogohlantirishlari
- Socket.IO orqali real-time savdo, buyurtma va ombor yangilanishlari
- Oylik obuna va premium funksiyalar uchun billing arxitekturasi
- Hozircha Demo provider bilan test obuna; Click va Payme keyingi bosqichda ulanadi
- Light, dark va vaqt bo‘yicha avtomatik theme rejimi
- Responsive desktop/mobile interfeys

## Texnologiyalar

- **Next.js 16.3 + React 19 + TypeScript** — App Router asosidagi web ilova
- **PostgreSQL + Prisma 7** — ma’lumotlar bazasi va migrationlar
- **Auth.js v5** — telefon/parol autentifikatsiyasi va sessionlar
- **Tailwind CSS 4 + Base UI/shadcn** — UI komponentlar
- **Socket.IO** — alohida `realtime-server/` serveri
- **Neon** — production PostgreSQL uchun tavsiya etiladi
- **Vercel** — asosiy Next.js ilovasi uchun tavsiya etiladi
- **Render/Railway** — realtime server uchun

## Rollar va bo‘limlar

### SUPER_ADMIN

Platforma administratori:

- `/dashboard/admin` — do‘konlar
- `/dashboard/admin/billing` — tariflar, obunalar va to‘lovlar
- `/dashboard/admin/products` — katalog mahsulotlari
- `/dashboard/admin/categories` — kategoriyalar
- `/dashboard/admin/attributes` — mahsulot maydonlari
- `/dashboard/admin/requests` — o‘zgartirish so‘rovlari
- `/dashboard/admin/users` — foydalanuvchilar
- `/dashboard/admin/analytics` — platforma analitikasi,

### OWNER

Do‘kon egasi:

- `/dashboard/owner` — do‘kon ko‘rinishi
- `/dashboard/owner/products` — mahsulotlar
- `/dashboard/owner/warehouse` — ombor va kirimlar
- `/dashboard/owner/sellers` — sotuvchilar
- `/dashboard/owner/orders` — buyurtmalar
- `/dashboard/owner/sales` — savdo tarixi
- `/dashboard/owner/coupons` — kuponlar
- `/dashboard/owner/billing` — obuna va to‘lovlar
- `/dashboard/owner/settings` — do‘kon sozlamalari
- `/dashboard/pos` — POS/kassa

### SELLER

- `/dashboard/pos` — POS orqali savdo qilish
- `/dashboard/notifications` — bildirishnomalar

### CUSTOMER

- Do‘kon vitrinasini ko‘rish
- Mahsulot qidirish
- Savat va onlayn buyurtma
- Sevimli mahsulotlar

## Talablar

- Node.js 20 yoki undan yuqori
- npm
- PostgreSQL yoki Neon hisob qaydnomasi
- Git
- Telegram bot (ro‘yxatdan o‘tish va login tasdig‘i uchun)

## Lokal o‘rnatish

```bash
npm install
```

`.env` faylini loyiha ildizida yarating va quyidagi o‘zgaruvchilarni kiriting.
`.env` faylini Git’ga commit qilmang.

### Lokal Prisma Postgres

Prisma 7 uchun lokal database:

```bash
npx prisma dev -d
npx prisma migrate dev
npx prisma generate
npm run seed
```

### Neon yoki mavjud PostgreSQL

`DATABASE_URL` va migrationlar uchun `DATABASE_URL_UNPOOLED` qiymatlarini
kiriting, so‘ng:

```bash
npx prisma migrate deploy
npx prisma generate
npm run seed
```

`DATABASE_URL` runtime uchun pooled URL bo‘lishi mumkin. `DATABASE_URL_UNPOOLED`
esa migrationlar uchun direct/non-pooled URL bo‘lishi kerak. Neon’da
`-pooler` bilan tugamaydigan hostdan foydalaning.

### Ilovani ishga tushirish

```bash
npm run dev
```

Ilova: `http://localhost:3000`

Super Admin seed orqali:

- Telefon: `+998900000000`
- Parol: `admin123`

Production’da bu parolni almashtiring va seed credentiallarini oshkor qilmang.

### Realtime server

Alohida terminalda:

```bash
cd realtime-server
npm install
npm run dev
```

Realtime server odatda `http://localhost:4000` manzilida ishlaydi. Server
ishlamasa asosiy ilova ishlashda davom etadi, lekin live-feed va ayrim
real-time bildirishnomalar ishlamaydi.

### Lokal subdomenlar

Do‘kon vitrinasi slug asosidagi subdomen orqali ishlaydi:

```text
http://test-market.localhost:3000
```

## Environment variables

Quyidagi ro‘yxat loyihada ishlatiladigan muhit o‘zgaruvchilarining to‘liq
ro‘yxati. Secret qiymatlarni faqat Vercel/Render Environment Variables
bo‘limiga yoki lokal `.env` fayliga kiriting.

### Database va autentifikatsiya

| O‘zgaruvchi | Majburiyligi | Vazifasi |
|---|---|---|
| `DATABASE_URL` | Majburiy | Runtime Prisma/PostgreSQL ulanishi |
| `DATABASE_URL_UNPOOLED` | Production’da majburiy | Prisma migrationlar uchun direct connection |
| `AUTH_SECRET` | Majburiy | Auth.js session/JWT imzolash |
| `NEXTAUTH_SECRET` | Fallback | `AUTH_SECRET` bo‘lmasa ishlatiladigan secret |
| `NEXTAUTH_URL` | Production’da majburiy | Asosiy ilova URL’i, masalan `https://e-mall.uz` |

`AUTH_SECRET` uchun kuchli tasodifiy qiymat yarating:

```bash
openssl rand -base64 32
```

Secret o‘zgartirilsa mavjud sessionlar bekor bo‘ladi.

### Domen va realtime

| O‘zgaruvchi | Vazifasi |
|---|---|
| `NEXT_PUBLIC_ROOT_DOMAIN` | Marketplace asosiy domeni, masalan `e-mall.uz` |
| `AUTH_COOKIE_DOMAIN` | Ixtiyoriy: custom domenlar orasida session ulashish uchun `.e-mall.uz`; Vercel preview/deployment URL’larida bo‘sh qoldiriladi |
| `NEXT_PUBLIC_ECAFE_ROOT_DOMAIN` | e-cafe subdomen/root domeni |
| `NEXT_PUBLIC_REALTIME_URL` | Socket.IO server URL’i |
| `REALTIME_JWT_SECRET` | Realtime JWT imzolash; asosiy ilova va realtime serverda bir xil |
| `REALTIME_API_KEY` | Realtime API himoyasi; ikkala serverda bir xil |
| `ALLOWED_ORIGINS` | Realtime server CORS originlari, vergul bilan ajratiladi |
| `PORT` | Realtime server porti; default `4000` |

### Telegram

| O‘zgaruvchi | Vazifasi |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Telegram bot API tokeni |
| `TELEGRAM_WEBHOOK_SECRET` | Telegram webhook so‘rovlarini tekshirish |
| `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` | Brauzerda Telegram tasdiqlash widgeti uchun bot username |

Placeholder Telegram qiymatlari bilan register/login tasdig‘i ishlamaydi.

### Rasmlar va tashqi servislar

| O‘zgaruvchi | Vazifasi |
|---|---|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud nomi |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Unsigned image upload preset |
| `MATN_UZ_API_TOKEN` | Lotin/Kiril transliteratsiyasi uchun Matn.uz tokeni |
| `ECOURIER_API_URL` | e-Courier API manzili |
| `ECOURIER_WEBHOOK_SECRET` | Courier webhook va API so‘rovlarini himoyalash |

Cloudinary secret key browserga chiqarilmaydi. Faqat unsigned preset va public
cloud name ishlatiladi.

## Scriptlar

```bash
npm run dev       # lokal development server
npm run build     # prisma migrate deploy && next build
npm run start     # production buildni ishga tushirish
npm run lint      # ESLint
npm test          # Vitest testlari
npm run seed      # Super Admin va boshlang‘ich ma’lumotlar
```

Windows PowerShell `npm.ps1`ni bloklasa `npm.cmd`dan foydalaning:

```powershell
npm.cmd run dev
npm.cmd test
npx.cmd prisma generate
```

## Prisma va migrationlar

Schema: `prisma/schema.prisma`

Migrationlar: `prisma/migrations/`

Development’da yangi schema o‘zgarishi:

```bash
npx prisma migrate dev --name change_name
npx prisma generate
```

Production’da:

```bash
npx prisma migrate deploy
npx prisma generate
```

`P3009` xatosi failed migration borligini bildiradi. Production migrationni
resolve qilishdan oldin backup yoki Neon branch yarating va migrationning
destruktiv SQL qismini tekshiring:

```bash
npx prisma migrate status
npx prisma migrate resolve --rolled-back <migration_name>
```

Failed migrationni ko‘r-ko‘rona `resolve` qilmang.

## Billing

Billing hozir test rejimida ishlaydi:

- `/dashboard/owner/billing` — Owner uchun obuna sahifasi
- `/dashboard/admin/billing` — Super Admin billing boshqaruvi
- `SubscriptionPlan` — tariflar
- `StoreSubscription` — do‘kon obunasi
- `BillingPayment` — to‘lov yozuvlari
- `BillingProvider.DEMO` — test provider
- `BillingProvider.CLICK` va `PAYME` — kelajakdagi integratsiya uchun

Super Admin:

- tarif nomi, tavsifi va oylik narxini belgilaydi
- tarifni faollashtiradi yoki nofaol qiladi
- barcha do‘kon obunalarini ko‘radi
- to‘lov statusi va providerini ko‘radi

Owner hozircha 30 kunlik Demo obunani faollashtira oladi. Haqiqiy Click/Payme
ulanishidan oldin callback/webhook imzosi, idempotency, transaction statuslari
va production secretlari alohida joriy qilinishi kerak.

## Production deploy

### Vercel

1. GitHub repositoryni Vercel’ga ulang.
2. Vercel Environment Variables’da production qiymatlarni kiriting.
3. Build command sifatida quyidagidan foydalaning:

```bash
prisma migrate deploy && next build
```

4. Deploy’dan oldin Neon backup/branch yarating.
5. Seed kerak bo‘lsa bir marta ishga tushiring:

```bash
npm run seed
```

`.env`dagi placeholder qiymatlarni production’da qoldirmang.

### Neon

1. Neon’da PostgreSQL project yarating.
2. Pooled URL’ni `DATABASE_URL`ga kiriting.
3. Direct/non-pooled URL’ni `DATABASE_URL_UNPOOLED`ga kiriting.
4. Migration holatini `npx prisma migrate status` bilan tekshiring.

### Realtime server — Render yoki Railway

`realtime-server/` papkasini alohida service sifatida deploy qiling:

- Build: `npm install && npm run build`
- Start: `npm start`
- `REALTIME_JWT_SECRET`
- `REALTIME_API_KEY`
- `ALLOWED_ORIGINS=https://e-mall.uz,https://*.e-mall.uz`

Render free tier serverni inactivity’dan keyin uxlatishi mumkin. Real-time
talab oshsa Railway yoki doimiy ishlaydigan serverdan foydalaning.

### Cloudflare + Vercel domenlari

1. `e-mall.uz` domenini Cloudflare’ga ulang.
2. `*.e-mall.uz` wildcard DNS yozuvini Vercel CNAME’iga yo‘naltiring.
3. Wildcard yozuvda proxy’ni o‘chirib, DNS-only rejimini tanlang.
4. Vercel Domains’da `e-mall.uz` va `*.e-mall.uz`ni qo‘shing.

## Xavfsizlik va checklist

- `.env`, tokenlar va parollarni commit qilmang.
- Production’da kuchli `AUTH_SECRET` ishlating.
- Neon production migrationdan oldin backup oling.
- Telegram webhook secretini o‘zgartiring.
- Realtime secretlari asosiy ilova bilan bir xil ekanini tekshiring.
- `DATABASE_URL_UNPOOLED` placeholder emasligini tekshiring.
- Click/Payme production credentiallarini faqat server environment’ida saqlang.
- Default Super Admin parolini almashtiring.
- Vercel deploymentdan keyin login, register, POS, billing va webhooklarni tekshiring.

## Hozirgi cheklovlar

- Click va Payme hali test billingga ulanmagan.
- Billing hozir Demo provider orqali ishlaydi.
- Online kassa/fiskal chek va Soliq integratsiyasi alohida bosqich.
- Ko‘p tillilik hozircha mavjud emas.
- Realtime server alohida ishga tushirilishi kerak.
