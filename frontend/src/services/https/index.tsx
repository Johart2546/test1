import {SignInInterface} from "../../interfaces/SignIn";
import { SignUpInterface } from "../../interfaces/SignUp";
import {PaymentInterface,ReceiptInterface} from "../../interfaces/StoreInterface";

import { UsersInterface ,} from "../../interfaces/UsersInterface";
import { BooksInterface ,} from "../../interfaces/Books";
import { BooksDetailsInterface ,} from "../../interfaces/BooksDetails";
import { MachinesInterface ,} from "../../interfaces/Machine";

import axios from 'axios';
const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token");

const Bearer = localStorage.getItem("token_type");


const requestOptions = {

  headers: {

    "Content-Type": "application/json",

    Authorization: `${Bearer} ${Authorization}`,

  },

};

//============================User========================================
//login
async function SignIn(data: SignInInterface) {

  return await axios
  .post(`${apiUrl}/signin`, data, requestOptions)
  .then((res) => {
    if (res.status === 200) {
      // ตัวอย่างกำหนดข้อความสำเร็จ
      alert("Sign-in successful! Welcome back.");
    } else {
      // กรณีอื่นที่ไม่ใช่ 200
      alert(`Unexpected status: ${res.status}`);
    }
    return res;
  })
  .catch((e) => {
    if (e.response) {
      // ตรวจสอบสถานะของ error response
      switch (e.response.status) {
        case 400:
          alert("Bad Request: Please check your input.");
          break;
        case 401:
          alert("Unauthorized: Invalid username or password.");
          break;
        case 500:
          alert("Server Error: Please try again later.");
          break;
        default:
          alert(`Error: ${e.response.data.message || "Something went wrong."}`);
      }
    } else {
      // กรณีที่ไม่มี response จาก server
      alert("Network error: Please check your connection.");
    }
    return e.response;
  });


}

async function CreateUser(data: UsersInterface) {
  return await axios
    .post(`${apiUrl}/signup`, data, requestOptions)
    .then((response) => {
      if (response.status === 201) {
        return {
          success: true,
          message: "Resource created successfully",
          data: response.data,
        };
      }
      return {
        success: false,
        message: `Request completed with status: ${response.status}`,
        data: response.data,
      };
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // แสดงข้อความจากเซิร์ฟเวอร์
          return {
            success: false,
            message: error.response.data?.error || `Error with status: ${error.response.status}`,
            data: error.response.data,
          };
        }
        return {
          success: false,
          message: "No response from server. Network error or server is unreachable.",
          data: null,
        };
      }
      return {
        success: false,
        message: "An unexpected error occurred.",
        data: null,
      };
    });
}



// async function SignUp(data: SignUpInterface) {

//   return await axios

//     .post(`${apiUrl}/signup`, data, requestOptions)

//     .then((res) => res)

//     .catch((e) => e.response);

// }

async function SignUp(data: SignUpInterface) {
  try {
    const response = await fetch(`${apiUrl}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.status === 201) {
      return await response.json(); // User created successfully
    } else if (response.status === 409) {
        const errorData = await response.json(); // Try to parse the error response
        const errorMessage = errorData?.message || "User already exists"; // Provide a default message
        throw new Error(errorMessage); // Re-throw with user friendly message
    } else {
      // Handle other errors (400, 500 etc.)
      throw new Error(`HTTP error! status: ${response.status}`); 
    }
  } catch (error) {
    console.error("Signup error:", error);
    // Display the error to the user (e.g., in a <p> tag)
    // Example:  setError(error.message) where setError is a state updater in your React component
    return false; //
  }
}


// get user by id
async function GetUserById(id: string) {

  return await axios

    .get(`${apiUrl}/user/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
// update User
async function UpdateUserByid(id: string, data: UsersInterface) {

  return await axios

    .put(`${apiUrl}/user/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
//Add Store

// get UserStore by id
async function UserStoreByid(id: string) {

  return await axios

    .get(`${apiUrl}/userstore/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
//Delete userstore
async function DeleteUserStoreByID(id: string) {
  return await axios
    .delete(`${apiUrl}/DeleteUserStore/${id}`, requestOptions)
    .then((res) => {
      // if (res) {
      //   window.location.reload(); // reload หลังจากลบเสร็จ
      // }
      return res;
    })
    .catch((e) => e.response);
}
// get Message by id
async function GetMessageById(id: string) {

  return await axios

    .get(`${apiUrl}/Message/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


// Create message

// get Tax by id
async function GetTaxById(id: string) {

  return await axios

    .get(`${apiUrl}/Tax/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
// Create Tax

//============================Store========================================
// get Store by Floor
async function GetStoreByFloor(id: string) {

  return await axios

    .get(`${apiUrl}/store/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
// get Store by id
async function GetStoreById(id: string) {

  return await axios

    .get(`${apiUrl}/storeid/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
// update Store

// get Membership by id
async function GetMembershipByid(id: string) {

  return await axios

    .get(`${apiUrl}/Membership/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
//============================payment store========================================
// get payment by userid Preload
async function GetPaymentByuseridPreload(id: string) {

  return await axios

    .get(`${apiUrl}/Payment/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
// get payment by userid ไม่ใช้เด้อจ้าา
async function GetPaymentByuserid(id: string) {

  return await axios

    .get(`${apiUrl}/PaymentStore/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
// get payment by id payment
async function GetPaymentid(id: string) {

  return await axios

    .get(`${apiUrl}/PaymentInfo/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
// Create AddPayment
async function AddPayment(data: PaymentInterface) {

  return await axios

    .post(`${apiUrl}/CreatePayment`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
// update Payment Status ตอนนี้มันคือ put ที่ไม่ได้แก้แค่ status
async function UpdatePaymentStatus(id: string, data: PaymentInterface) {

  return await axios

    .put(`${apiUrl}/PaymentStore/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
// get PaymentMethod
async function GetPaymentMethod() {

  return await axios

    .get(`${apiUrl}/PaymentMethod`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
//============================bill========================================
// get bill by paymentid Preload
async function GetBillByPayidPreload(id: string) {

  return await axios

    .get(`${apiUrl}/Receipt/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
// Create bill
async function CreateBill(data: ReceiptInterface) {

  return await axios

    .post(`${apiUrl}/Receipt`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}





//============================Admin========================================
// get Store WaitingForApproval
async function GetStoreWaiting(status: string) {

  return await axios

    .get(`${apiUrl}/storeWaiting/${status}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}



//============================JoJo================================


async function GetBooks() {
  return await axios
    .get(`${apiUrl}/books`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ดึงข้อมูลการจองตาม ID
async function GetBooksById(id: string) {
  return await axios
    .get(`${apiUrl}/books/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// อัปเดตข้อมูลการจองตาม ID
async function UpdateBooksById(id: string, data: BooksInterface) {
  return await axios
    .put(`${apiUrl}/books/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ลบการจองตาม ID
async function DeleteBooksById(id: string) {
  return await axios
    .delete(`${apiUrl}/books/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// สร้างการจองใหม่
async function CreateBooks(data: BooksInterface) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data), /*  data บอกว่าคือ  USER*/
    };
  
    let res = await fetch(`${apiUrl}/books`, requestOptions)   /* /users ตรงนี้บอกว่าคือการ POST ของ USER หาตั้งนาน */  
      .then((res) => {  /*ตรวจสอบผลลัพธ์ในบล็อกของ .then()*/    /* ใช้ await เพื่อรอการตอบกลับจากเซิร์ฟเวอร์และเก็บผลลัพธ์ไว้ในตัวแปร res */ 
        if (res.status == 201) {   /*รหัสสถานะ 201 หมายถึง "Created" ซึ่งบ่งบอกว่าข้อมูลใหม่ถูกสร้างสำเร็จ*/
          return res.json();/*หากสถานะเป็น 201 จะทำการแปลงการตอบกลับเป็น JSON และส่งกลับค่า */
        } else {
          return false;
        }
      });
  
    return res;  /*ส่งค่าผลลัพธ์สุดท้าย (ซึ่งจะเป็น JSON หรือ false) ออกจากฟังก์ชัน */
  }



async function GetBooking() {
  return await axios
    .get(`${apiUrl}/booking`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ดึงข้อมูลการจองตาม ID
async function GetBookingById(id: string) {
  return await axios
    .get(`${apiUrl}/booking/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// อัปเดตข้อมูลการจองตาม ID
async function UpdateBookingById(id: string, data: BooksDetailsInterface) {
  return await axios
    .put(`${apiUrl}/booking/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ลบการจองตาม ID
async function DeleteBookingById(id: string) {
  return await axios
    .delete(`${apiUrl}/booking/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// สร้างการจองใหม่
async function CreateBooking(data: BooksDetailsInterface[]) {
  return await axios
    .post(`${apiUrl}/booking`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAllMachine() {
  return await axios
    .get(`${apiUrl}/machine`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export const getLastBooks = async () => {
  try {
    const response = await axios.get('http://localhost:8000/books/last');  // เรียก API ที่ backend
    return response.data;  // คืนค่าข้อมูลหนังสือล่าสุด
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลการจองได้');
  }
};



//============================JoJo================================



export {
//============================JoJo================================
  GetBooks,
  GetBooksById,
  UpdateBooksById,
  DeleteBooksById,
  CreateBooks,


  GetBooking,
  GetBookingById,
  UpdateBookingById,
  DeleteBookingById,
  CreateBooking,

  GetAllMachine,


//============================JoJo================================

    SignIn,//user
    CreateUser,
    GetUserById,
    UpdateUserByid,
    UserStoreByid,
    DeleteUserStoreByID,
    GetMessageById,
  
    GetTaxById,


    GetStoreWaiting,//admin

    GetStoreByFloor,//store

    GetStoreById,
    GetMembershipByid,

    GetPaymentByuseridPreload,//payment store
    GetPaymentByuserid,
    GetPaymentid,
    AddPayment,
    UpdatePaymentStatus,
    GetPaymentMethod,
    GetBillByPayidPreload,//bill
    CreateBill,
    SignUp,
}