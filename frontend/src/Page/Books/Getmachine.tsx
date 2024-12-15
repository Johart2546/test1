import React, { useState, useEffect } from "react";
import { MachinesInterface } from "../../interfaces/Machine";
import { Button, Space, message } from "antd";
import { ToolOutlined } from "@ant-design/icons";
import { GetAllMachine, GetUserById, CreateBooking, CreateBooks } from "../../services/https";
import machineImage from './laundry.png'; // นำเข้ารูปภาพ


function Viewtable() {
    const [account, setUsers] = useState<MachinesInterface[]>([]);
    const [selectedMachines, setSelectedMachines] = useState<MachinesInterface[]>([]);
    const [currentTime, setCurrentTime] = useState<string>("");
    const [totalPrice, setTotalPrice] = useState<number>(0);  // เพิ่มตัวแปรสำหรับคำนวณราคา
    const [userId, setUserId] = useState<string | null>(null);  // เก็บ user_id
    const [userInfo, setUserInfo] = useState<any>(null);  // เก็บข้อมูลของ user


    // ฟังก์ชันในการดึงข้อมูลเครื่อง
    const fetchMachines = async () => {
        try {
            let res = await GetAllMachine();
            console.log("res is: ", res);
            if (res && res.status === 200) {
                const machines: MachinesInterface[] = res.data;
                setUsers(machines);
            } else {
                message.error("ไม่สามารถโหลดข้อมูลเครื่องซักผ้าได้");
            }
        } catch (error) {
            console.error("Error fetching machines:", error);
            message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
        }
    };
    const fetchUserInfo = async () => {
        if (userId) {
            try {
                const response = await GetUserById(userId);  // เรียก API ด้วย userId
                if (response && response.data) {
                    setUserInfo(response.data);  // เก็บข้อมูลผู้ใช้ใน state
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserInfo();  // ดึงข้อมูลผู้ใช้เมื่อ userId มีค่า
        }
    }, [userId]);  // เมื่อ userId เปลี่ยนแปลงให้ดึงข้อมูลใหม่



    useEffect(() => {
        const storedUserId = localStorage.id;  // ดึง user_id จาก localStorage
        if (storedUserId) {
            setUserId(storedUserId);
            console.log("loging", localStorage.id);  // ตั้งค่า userId ใน state
        } else {
            console.log("User not logged in");  // ถ้าไม่มี user_id ใน localStorage
        }
    }, []);

    // ฟังก์ชันในการตั้งเวลา
    const setCurrentDateTime = () => {
        const date = new Date();
        const hours = date.getHours().toString().padStart(2, "0");  // เอาชั่วโมง
        const minutes = date.getMinutes().toString().padStart(2, "0");  // เอานาที
        const formattedTime = `${hours}:${minutes}`;
        setCurrentTime(formattedTime);  // เซ็ตเวลาใน state
    };

    useEffect(() => {
        fetchMachines();
        setCurrentDateTime();  // ตั้งเวลาปัจจุบันเมื่อโหลดคอมโพเนนต์

        // การอัพเดตเวลาทุกๆ 1 วินาที
        const intervalId = setInterval(setCurrentDateTime, 1000);

        return () => clearInterval(intervalId); // ลบ interval เมื่อ component ถูกทำลาย
    }, []);


    useEffect(() => {
        // Set background color for body
        document.body.style.backgroundColor = "#67B1D7";

        // Cleanup on component unmount
        return () => {
            document.body.style.backgroundColor = "";
        };
    }, []);


    const updateTotalPrice = (machine: MachinesInterface, action: string) => {
        let price = machine.machine_type === "ซัก" ? 80 : 60;  // 80 บาทสำหรับเครื่องซัก, 60 บาทสำหรับเครื่องอบ
        if (action === "add") {
            setTotalPrice(prevPrice => prevPrice + price);  // เพิ่มราคาเมื่อเลือกเครื่อง
        } else if (action === "remove") {
            setTotalPrice(prevPrice => prevPrice - price);  // ลดราคาเมื่อยกเลิกเครื่อง
        }
    };
    // ฟังก์ชันเลือกเครื่อง
    const handleMachineSelect = (machine: MachinesInterface) => {
        if (!selectedMachines.find((m) => m.ID === machine.ID) && machine.status !== "ไม่ว่าง" && machine.status !== "ซ่อมแซม") {
            setSelectedMachines((prev) => [...prev, machine]);
            message.success(`เลือกเครื่อง ${machine.machine_name} สำหรับการจอง`);
            updateTotalPrice(machine, "add"); // อัพเดตราคาเมื่อเลือกเครื่อง
        } else if (machine.status === "ไม่ว่าง") {
            message.error(`เครื่อง ${machine.machine_name} อยู่ในสถานะไม่ว่าง`);
        } else if (machine.status === "ซ่อมแซม") {
            message.error(`เครื่อง ${machine.machine_name} อยู่ในสถานะซ่อมแซม`);
        } else {
            setSelectedMachines((prev) => prev.filter((m) => m.ID !== machine.ID));
            message.success(`ยกเลิกการเลือกเครื่อง ${machine.machine_name}`);
            updateTotalPrice(machine, "remove"); // อัพเดตราคาเมื่อยกเลิกเครื่อง
        }
    };

    // ฟังก์ชันสำหรับการส่งข้อมูลการจอง
    const handleSubmitBooking = async () => {
        if (selectedMachines.length === 0) {
            message.error("กรุณาเลือกเครื่องอย่างน้อย 1 เครื่อง");
            return;
        }
    
        try {
            const bookingData = selectedMachines.map((machine) => {
                // แปลง currentTime เป็น Date object
                const startDate = new Date(`2024-01-01T${currentTime}:00Z`);
                const endDate = new Date(startDate);
                endDate.setHours(startDate.getHours() + 1);  // เพิ่ม 1 ชั่วโมง
                const userId = Number(localStorage.id);
    
                return {
                    machineID: machine.ID,
                    books_start: startDate.toISOString(),
                    books_end: endDate.toISOString(),
                    price: totalPrice,
                    user_id: userId
                };
            });
    
            // สร้างข้อมูล Books
            const booksData = {
                ID: 0,
                Price: totalPrice,
                Status: 'ส่งการจอง',
                books_start: new Date(bookingData[0].books_start),
                books_end: new Date(bookingData[0].books_end),
                user_id: Number(localStorage.id)
            };
    
            // เรียกฟังก์ชัน CreateBooks เพื่อสร้างข้อมูล Books
            const createdBook = await CreateBooks(booksData);
            if (true) {
                const createdBookId = createdBook.ID;  // สมมติว่า ID จะมาจาก response ของ CreateBooks
                // สร้างข้อมูล BooksDetails สำหรับแต่ละเครื่อง
                const bookingDetailsData = selectedMachines.map((machine) => ({
                    ID: 0,
                    machine_id: machine.ID,  // ให้มั่นใจว่า machine.ID ถูกต้อง
                    books_id: 50  // ใช้ createdBookId จากการตอบกลับของ CreateBooks
                }));
                console.log("CreatedBookId:", createdBookId);  // ตรวจสอบว่า createdBookId ถูกตั้งค่าอย่างถูกต้อง
                console.log("BookingDetailsData:", bookingDetailsData);  // ตรวจสอบข้อมูลทั้งหมดที่ส่งไป
                
                // เรียกฟังก์ชัน CreateBooking เพื่อบันทึก BooksDetails
                const createdBookingDetails = await CreateBooking(bookingDetailsData);  // ฟังก์ชันนี้จะถูกเรียกแยกจากกัน
    
                if (createdBookingDetails) {
                    message.success("บันทึกการจองเครื่องเรียบร้อย");
                } else {
                    message.error("เกิดข้อผิดพลาดในการบันทึกการจองรายละเอียดเครื่อง");
                }
            } else {
                message.error("เกิดข้อผิดพลาดในการสร้างการจอง");
                console.log("JoJo", booksData);
            }
    
        } catch (error) {
            console.error("Error submitting booking:", error);
            message.error("เกิดข้อผิดพลาดในการบันทึกการจอง");
        }
        
    };
    



    return (
        <>
            {/* กรอบสีม่วงซ้อนทับ */}
            <div
                style={{
                    position: "absolute",
                    top: "120px",
                    left: "30%",
                    width: "40%",
                    height: "80px",
                    padding: "20px",
                    backgroundColor: "#F9F9F9",
                    borderRadius: "30px 30px 30px 30px",
                    textAlign: "left",
                    fontSize: "24px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    zIndex: 1,
                    fontFamily: "Tahoma, sans-serif",
                }}
            >
                <div style={{ marginTop: "-30px" }}><h3>จองเครื่องซักอบ</h3></div>
                {/* แสดงเวลาปัจจุบัน */}
                <div style={{ textAlign: "right", fontSize: "16px", marginTop: "-50px", marginRight: "40px" }}>เวลาจอง: {currentTime}</div>
                <div style={{ marginTop: "20px", textAlign: "right", fontSize: "18px", fontWeight: "bold", padding: "10px", marginRight: "28px" }}>
                    ราคารวม: <span style={{ color: "red" }}>{totalPrice} บาท</span>
                </div>

            </div>

            {/* div หลัก */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "left",
                    gap: "30px",
                    marginTop: "180px",
                    marginLeft: "20%",
                    padding: "20px",
                    borderRadius: "140px 140px 0px 0px",
                    backgroundColor: "#f9f9f9",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    width: "60%",
                    height: "700px",
                    overflow: "auto",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "left",
                        gap: "20px",
                        marginTop: "110px",
                        padding: "20px",
                        borderRadius: "12px",
                        backgroundColor: "#f9f9f9",
                        width: "700px",
                        height: "500px",
                        overflow: "auto",
                    }}
                >
                    {account.map((machine) => (
                        <div
                            key={machine.ID}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "170px",
                                height: "170px",
                                backgroundColor: selectedMachines.find((m) => m.ID === machine.ID)
                                    ? "#1890ff"
                                    : machine.status === "ไม่ว่าง"
                                        ? "#E2A0A0"
                                        : machine.status === "ซ่อมแซม"
                                            ? "#D9D9D9"
                                            : "#fff",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                                borderRadius: "12px",
                                textAlign: "center",
                                cursor: machine.status === "ไม่ว่าง" || machine.status === "ซ่อมแซม" ? "not-allowed" : "pointer",
                                transition: "all 0.3s ease",
                                marginBottom: "20px",
                                position: "relative",
                                color: selectedMachines.find((m) => m.ID === machine.ID)
                                    ? "#fff"
                                    : "#333",
                            }}
                            onClick={() => handleMachineSelect(machine)}
                        >
                            <div
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    color: "#333",
                                    position: "absolute",
                                    top: "20px",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: "100%",
                                    textAlign: "center",
                                }}
                            >
                                {machine.machine_type} {machine.ID}
                            </div>

                            {/* แสดงรูปภาพ */}
                            <img
                                src={machineImage}
                                alt="machine"
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    marginTop: "-5px",
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                            />

                            <div style={{ fontSize: "12px", marginBottom: "-120px" }}>
                                สถานะ: {machine.status}
                                {machine.status === "ซ่อมแซม" && (
                                    <div
                                        style={{
                                            marginTop: "10px",
                                            fontSize: "60px",
                                            color: "#333",
                                            position: "absolute",
                                            top: "50%",
                                            left: "45%",
                                            transform: "translate(-50%, -50%)",
                                        }}
                                    >
                                        <ToolOutlined />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: "center", marginTop: "600px" }}>
                    <Space>
                        <Button onClick={handleSubmitBooking} type="primary" disabled={selectedMachines.length === 0}>
                            ยืนยันการจอง
                        </Button>
                    </Space>
                </div>
            </div>
        </>
    );
}

export default Viewtable;
