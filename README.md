# 🚀 Cander-App | Anonymous Messaging Platform

\<p align="center">
&#x20; A Secure Backend Application for Anonymous Messaging
\</p>

## 📌 About The Project

**Cander-App** هو Backend Application مستوحى من تطبيقات Anonymous Messaging زي Sarahah، بيوفر للمستخدمين إمكانية إرسال واستقبال الرسائل بشكل مجهول، مع إدارة الحسابات وتأمين البيانات والتحكم في صلاحيات الوصول.

المشروع مش مجرد CRUD APIs، لكنه بيطبق مجموعة من مفاهيم **Backend Engineering** من خلال Modular Architecture، Secure Authentication، Database Management، Caching، File Uploads، وApplication Security.

---

## 🛠️ Tech Stack

| Category                    | Technologies                     |
| --------------------------- | -------------------------------- |
| Runtime                     | Node.js                          |
| Backend Framework           | Express.js                       |
| Database                    | MongoDB                          |
| ODM                         | Mongoose                         |
| Caching & In-Memory Storage | Redis                            |
| Authentication              | JWT, Google OAuth                |
| Validation                  | Zod                              |
| Password Hashing            | Argon2                           |
| OTP Hashing                 | Bcrypt                           |
| Cryptography                | Node.js Crypto                   |
| File Upload                 | Multer                           |
| Email Service               | Nodemailer                       |
| Security                    | Helmet, CORS, Express Rate Limit |
| Rate Limit Storage          | Redis Store                      |

---

## 🏗️ Backend Architecture & Design Patterns

تم تنظيم المشروع باستخدام مجموعة من الـArchitectural Concepts لفصل المسؤوليات وتحسين Maintainability وCode Reusability.

- **Modular Architecture:** تقسيم التطبيق إلى Modules مستقلة، زي Authentication وUser وMessages.
- **Repository Pattern:** فصل Database Operations عن الـBusiness Logic.
- **Service Layer:** وضع الـBusiness Logic داخل Services بدلاً من الـRoutes.
- **Custom Error Classes:** إنشاء Custom Exceptions للتعامل مع أنواع الأخطاء المختلفة.
- **Global Error Handling:** معالجة الأخطاء مركزياً من خلال Global Error Handler.
- **Unified Response Schema:** توحيد شكل الـAPI Responses سواء Success أو Error.
- **Environment Variables:** إدارة Configuration والبيانات الحساسة خارج Source Code.

---

## 🔐 Authentication & Authorization

تم بناء Authentication Module لإدارة دورة حياة حساب المستخدم بالكامل.

### Account Management

- **User Registration:** إنشاء حسابات جديدة.
- **Login:** تسجيل الدخول والتحقق من بيانات المستخدم.
- **Email Verification:** تفعيل الحساب باستخدام OTP.
- **Resend OTP:** إعادة إرسال OTP للتحقق من البريد الإلكتروني.
- **Forgot Password:** بدء عملية استعادة كلمة المرور.
- **Reset Password:** إعادة تعيين كلمة المرور باستخدام OTP.
- **Google OAuth:** تسجيل الدخول باستخدام Google.

### Token Management

- **Access Token:** التحقق من هوية المستخدم وتأمين الوصول إلى Protected Routes.
- **Refresh Token:** تجديد Access Tokens دون الحاجة إلى تسجيل الدخول مرة أخرى.
- **Token Revocation:** إلغاء صلاحية Tokens باستخدام Redis.
- **Authentication Middleware:** التحقق من صحة الـJWT واستخراج بيانات المستخدم.
- **Authorization Middleware:** التحقق من User Roles والصلاحيات قبل تنفيذ العمليات المحمية.

---

## ⚡ Redis Implementation

تم استخدام Redis في عدة أجزاء من التطبيق، مش مجرد Cache لتسريع Database Queries.

| Use Case         | Implementation                                     |
| ---------------- | -------------------------------------------------- |
| OTP Management   | تخزين OTP وإدارة انتهاء صلاحيته باستخدام TTL       |
| Refresh Token    | إدارة وتخزين بيانات Refresh Tokens                 |
| Token Revocation | تخزين Tokens التي تم إلغاؤها                       |
| Rate Limiting    | تخزين Request Counters                             |
| Expiration       | استخدام TTL لإدارة انتهاء صلاحية البيانات تلقائياً |

---

## 🔒 Security Concepts

تطبيق مجموعة من الـSecurity Practices لحماية الـApplication والـAPIs.

### HTTP & API Security

- **Helmet:** تأمين HTTP Response Headers وإضافة Security Headers.
- **CORS:** التحكم في Cross-Origin Resource Sharing وتحديد مصادر الطلبات المسموح بها.
- **Rate Limiting:** الحد من عدد Requests لمنع إساءة استخدام الـAPIs وتقليل احتمالية Brute Force Attacks.
- **Redis Rate Limit Store:** تخزين Rate Limit Counters في Redis بدلاً من الاعتماد على In-Memory Storage.
- **GeoIP:** استخدام معلومات الموقع الجغرافي للـIP لتطبيق إعدادات Rate Limiting حسب الدولة.
- **Authentication & Authorization:** حماية الـProtected Routes والتحكم في الوصول حسب الصلاحيات.

### Data Security & Cryptography

- **Argon2:** استخدام Password Hashing لتخزين كلمات المرور بشكل آمن.
- **Bcrypt:** Hashing وComparison لأكواد OTP.
- **Phone Encryption & Decryption:** تشفير أرقام الهواتف وفك تشفيرها عند الحاجة لاستخدامها.
- **Node.js Crypto:** توليد OTP باستخدام `crypto.randomInt()` لضمان استخدام Random Values آمنة تشفيرياً.
- **Environment Variables:** حماية Secrets وCredentials وعدم تضمينها داخل Source Code.

---

## ✅ Validation & Error Handling

تنفيذ Validation Layer وError Handling System لتنظيم التعامل مع Requests والأخطاء.

### Request Validation

- **Zod:** التحقق من صحة Request Body وQuery Parameters وبيانات المستخدم.
- **Custom Validation Middleware:** فصل Validation Logic عن Route Handlers.
- **File Validation:** التحقق من الملفات المرفوعة قبل معالجتها.

### Error Handling

- **Custom Error Classes:** إنشاء أنواع مخصصة من Exceptions للتعامل مع الأخطاء.
- **Global Error Handler:** استقبال ومعالجة الأخطاء مركزياً.
- **Unified Error Response:** إرجاع Error Responses موحدة تحتوي على المعلومات اللازمة عن الخطأ.

---

## 🗄️ Database Management

استخدام MongoDB وMongoose لإدارة البيانات والعلاقات بين الـDocuments.

- **Schema Design:** تصميم Database Schemas وتحديد Data Types وValidation Rules.
- **Custom Document Identifiers:** تخصيص الـ`_id` وإدارة Document Identifiers.
- **CRUD Operations:** تنفيذ Create, Read, Update, Delete.
- **Mongoose Populate:** استرجاع البيانات المرتبطة بين الـModels.
- **Query Filtering:** بناء Queries باستخدام Filters وشروط مختلفة.
- **Pagination:** تقسيم النتائج إلى صفحات لتحسين Data Retrieval.

---

## 👤 User Module

مسؤول عن عمليات المستخدم وإدارة بيانات الحسابات.

- إدارة بيانات المستخدم.
- التعامل مع User Profiles.
- حماية عمليات المستخدم باستخدام Authentication.
- التحكم في العمليات حسب User Roles.
- التعامل مع الملفات المرتبطة بحساب المستخدم.

---

## 📨 Messages Module

الـCore Feature في التطبيق، والمسؤول عن إدارة الرسائل المجهولة.

- **Send Anonymous Messages:** إرسال رسائل للمستخدمين دون إظهار هوية المرسل للمستلم.
- **Message Attachments:** دعم إرفاق الملفات بالرسائل.
- **Received Messages:** استرجاع الرسائل المستلمة.
- **Sent Messages:** استرجاع الرسائل المرسلة.
- **Message Filtering:** فلترة الرسائل باستخدام Sender وReceiver.
- **Pagination:** تنظيم استرجاع الرسائل وتقسيم النتائج.
- **Delete Messages:** حذف الرسائل.

---

## 📁 File Upload Management

استخدام Multer لإدارة عمليات رفع الملفات ومعالجة بياناتها.

- **Single Upload:** رفع ملف واحد.
- **Array Upload:** رفع مجموعة ملفات من نفس الـField.
- **Fields Upload:** رفع ملفات من Multiple Fields.
- **Magic Number Validation:** التحقق من نوع الملف الحقيقي من خلال File Signature بدلاً من الاعتماد فقط على Extension أو MIME Type.
- **File Validation Middleware:** التحقق من الملفات والتعامل مع الملفات غير المسموح بها.

---

## 📧 Email & Event-Driven Architecture

- **Nodemailer:** إرسال رسائل البريد الإلكتروني.
- **OTP Email Delivery:** إرسال أكواد التحقق للمستخدمين.
- **Node.js EventEmitter:** فصل عملية إرسال OTP Emails عن الـAuthentication Business Logic باستخدام Event-Driven Approach.
- **Redis TTL:** التحكم في مدة صلاحية أكواد التحقق.

---

## 🧪 API Testing

استخدام Postman لاختبار الـAPIs والتحقق من الـRequest/Response Lifecycle.

- تنظيم API Requests داخل Collections.
- استخدام Environment Variables.
- استخدام Postman Scripts لاستخراج البيانات من API Responses.
- تخزين Tokens تلقائياً داخل Global Variables لاستخدامها في الطلبات التالية.
- اختبار Authentication وProtected Routes.

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/ElsayedHossny/Sarahah-App.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

أنشئ ملف `.env` وأضف إعدادات المشروع المطلوبة، مثل:

```env
PORT=
MONGO_URI=
REDIS_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EMAIL_USER=
EMAIL_PASSWORD=
```

\<sub>ملاحظة: أسماء المتغيرات هنا نموذجية، ويجب مطابقتها مع أسماء المتغيرات المستخدمة فعلياً في المشروع.\</sub>

### 4. Run Application

```bash
npm run dev
```

---

## 👨‍💻 Developer

**Elsayed Hossny**

Backend Developer | Node.js | Express.js | MongoDB

[GitHub Profile](https://github.com/ElsayedHossny)


<img width="128" height="752" alt="image" src="https://github.com/user-attachments/assets/2cb3545d-41ef-415e-b501-315b8a6f22f1" />
