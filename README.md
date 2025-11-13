### Chạy code DEV

### Lưu ý : Đợi từng terminal chạy xong rồi hãy chạy terminal khác

**_ Mở 3 terminal _**

```Terminal 1
Đứng tại Medicare_booking_app chạy lệnh
- npm run dev:databases
```

```Terminal 2
1 . cd .\Frontend-medicare_booking_app\
2 . npm run dev
```

```Terminal 3
1 . cd .\Backend-medicare_booking_app\
2 . npm run dev:services
```

## `Code xong dùng Ctrl + C (2 Lần) và ### npm run down`

### Chạy code PRODUCTION

**_ Mở 1 terminal _**

```Terminal
Đứng tại Medicare_booking_app chạy lệnh
- npm run build
```

### Fix lỗi : Đợi từng terminal chạy xong rồi hãy chạy terminal khác

```
    Environment variables loaded from .env
    Prisma schema loaded from prisma\schema.prisma
    Datasource "db": MySQL database "payment_db" at "localhost:3313"
    Error: P1001: Can't reach database server at `localhost:3313`
    Please make sure your database server is running at `localhost:3313`.

```

---> **_ Cách fix đổi DATABASE_URL trong env của services từ localhost thành 127.0.0.1 _**


### Build production
```
build : docker compose --env-file docker-compose.env up --build -d
stop : docker compose --env-file docker-compose.env stop
down : docker compose --env-file docker-compose.env down

```