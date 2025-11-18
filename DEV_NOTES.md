### ❗ Fix lỗi : Đợi từng terminal chạy xong rồi hãy chạy terminal khác

👉 **_ Cách fix đổi DATABASE_URL trong env của services từ localhost thành 127.0.0.1 _**

```
    Environment variables loaded from .env
    Prisma schema loaded from prisma\schema.prisma
    Datasource "db": MySQL database "payment_db" at "localhost:3313"
    Error: P1001: Can't reach database server at `localhost:3313`
    Please make sure your database server is running at `localhost:3313`.

```

### ❗ Fix lỗi : Cài thư viện mới

👉 **_ 1. Cách fix lỗi down services đó _**
👉 **_ 2. docker volume ls : để lấy ra tên của node_module _**
👉 **_ 3. docker volume rm backend-medicare_booking_app_auth_node_modules : để xóa node_module _**
👉 **_ 4. sau đó build lại là hết lỗi _**

```
    Cannot find module 'ioredis' or its corresponding type declarations.

```
