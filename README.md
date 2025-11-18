### 🚀 Hướng Dẫn Chạy Dự Án Medicare Booking App

🧪 Chạy Code DEV

⚠ Lưu ý quan trọng:

Mỗi terminal phải chạy xong hoàn toàn rồi mới mở terminal khác

Không chạy đồng thời 3 lệnh cùng lúc

**_ Mở 3 terminal _**

```🔹 Terminal 1
Đứng tại Medicare_booking_app chạy lệnh
- npm run dev:databases
```

```🔹 Terminal 2
1 . cd .\Frontend-medicare_booking_app\
2 . npm run dev
```

```🔹 Terminal 3
1 . cd .\Backend-medicare_booking_app\
2 . npm run dev:services
```

### 🛑 Dừng toàn bộ DEV environment

`Code xong dùng Ctrl + C (2 Lần) và ### npm run down`

### 🏭 Chạy Code PRODUCTION (Local)

**_ Mở 1 terminal _**

```🔹 Terminal
Đứng tại Medicare_booking_app chạy lệnh
- npm run build
```

### 🐳 Build & Deploy Docker (Production)

🚧 Build production
**_ build : docker compose --env-file docker-compose.env up --build -d _**

🛑 Stop containers (tạm dừng)
**_ stop : docker compose --env-file docker-compose.env stop _**

🧹 Down (stop + remove containers)
**_ down : docker compose --env-file docker-compose.env down _**

📌 Ghi chú thêm

```sh

    -d chạy ngầm
    -up --build -d → build + chạy ngầm
    stop → tắt container nhưng không xóa
    down → tắt + xóa container + network

    ⚠️ Lưu ý: KHÔNG dùng các lệnh sau trên production vì sẽ mất toàn bộ dữ liệu DB:

    - docker compose down -v
    - docker volume prune
    - docker system prune --volumes

```

### Tương tác với redis

**_ 👉 1. docker exec -it redis redis-cli _**
**_ 👉 2. AUTH <password> _**
**_ 👉 3. các lệnh tiếp theo _**

```sh

    - KEYS * : XEM DANH SÁCH CÁC KEY
    - TTL <KEY> : XEM GIÂY CÒN LẠI CỦA KEY TRƯỚC KHI BỊ XÓA
    - DBSIZE : XEM TỔNG CÓ BAO NHIÊU KEY
    - INFO memory : XEM BỘ NHỚ
    - DEL <KEY> : XÓA KEYS

```
