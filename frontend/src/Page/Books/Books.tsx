import React, { useState, useEffect } from "react";
import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios"; // เพิ่มการใช้งาน axios
import { CreateBooks,GetAllMachine } from "../../services/https";
import { BooksInterface } from "../../interfaces/Books";


// ฟังก์ชันดึงข้อมูลเครื่องทั้งหมด

function BooksInput() {
  const [messageApi, contextHolder] = message.useMessage();
  const [machines, setMachines] = useState([]); // สร้าง state สำหรับเก็บข้อมูลเครื่อง

  // ใช้ useEffect เพื่อดึงข้อมูลเครื่องเมื่อหน้าโหลด
  useEffect(() => {
    const fetchMachines = async () => {
      const machineData = await GetAllMachine();
      setMachines(machineData); // อัพเดตข้อมูลเครื่องใน state
    };

    fetchMachines();
  }, []); // [] หมายถึงดึงข้อมูลแค่ครั้งเดียวเมื่อหน้าแรกโหลด

  const clikConfirm = async (values: BooksInterface) => {
    console.log(values); // ก่อนส่งข้อมูล

    // ส่งข้อมูลไปยัง API
    let res = await CreateBooks(values);
    console.log(res); // หลังส่ง

    if (res) {
      messageApi.open({
        type: "success",
        content: "บันทึกข้อมูลสำเร็จ",
      });
      setTimeout(() => {
        // navigate("/customer"); // ใช้ถ้าต้องการเปลี่ยนหน้าหลังบันทึกสำเร็จ
      }, 1000);
    } else {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล!",
      });
    }
  };

  return (
    <div>
      {contextHolder}

      <Card
        style={{
          width: "1000px",
          marginLeft: "420px",
          backgroundColor: "pink",
        }}
      >
        <h1>เพิ่มข้อมูล</h1>
        <Divider />
        <Form
          name="basic"
          layout="vertical"
          onFinish={clikConfirm}
          autoComplete="off"
        >
          <Row gutter={[16, 16]}>
            <Col lg={24}>
              <Form.Item
                label="ชื่อจริง"
                name="FirstName"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกชื่อ !",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col lg={24}>
              <Form.Item
                label="นามสกุล"
                name="LastName"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกนามสกุล !",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* เพิ่มฟิลด์สำหรับเลือกเครื่อง */}
            <Col lg={24}>
              <Form.Item
                label="เลือกเครื่อง"
                name="MachineID"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกเครื่อง!",
                  },
                ]}
              >
                <Select placeholder="เลือกเครื่อง">
                  {machines.map((machine) => (
                    <Select.Option key={machine.ID} value={machine.ID}>
                      {machine.machine_type} - {machine.machine_type} - {machine.status}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Space>
                <Button htmlType="button" style={{ marginRight: "10px" }}>
                  ยกเลิก
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                >
                  ยืนยัน
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default BooksInput;
