export interface BooksInterface {
    ID: number; // รหัสของการจอง
    BookStart: Date; // วันที่และเวลาที่เริ่มการจอง
    BookEnd: Date; // วันที่และเวลาที่สิ้นสุดการจอง
    Price: number; // ราคาค่าบริการ
    UserID: number; // รหัสผู้จอง (อ้างอิงกับผู้ใช้)
    MachineID: number; // รหัสเครื่องซัก-อบที่จอง
    Status: string; // สถานะการจอง (เช่น "Confirmed", "Completed", "Cancelled")
  }
  