import React, { useEffect, useState } from 'react';
import { message , Upload} from "antd";
import type {  UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import Clock from "../../assets/icon/ForPage/MainIcon/Clock.png";
import Address from "../../assets/icon/ForPage/MainIcon/Address.png";
import Hutao from "../../assets/icon/ForPage/MainIcon/HuTaopic.jpg"
import card1 from "../../assets/icon/ForPage/MainIcon/cardp.png"
import card2 from "../../assets/icon/ForPage/MainIcon/cardg.png"
import card3 from "../../assets/icon/ForPage/MainIcon/cardd.png"
import box from "../../assets/icon/ForPage/MainIcon/GmailLogin.png"
import background from "../../assets/icon/ForPage/Store/Store3.jpg"
import './NavBar.css';
import { useNavigate } from 'react-router-dom';


//API
import { UsersInterface } from "../../interfaces/UsersInterface";
import { GetUserById  , UpdateUserByid } from '../../services/https';



export const NavBar: React.FC = () => {
    const [user, setUser] = useState<UsersInterface | null>(null); // State to store user data
    const userIdstr = localStorage.getItem("id");
    useEffect(() => {
        if (userIdstr) {
            fetchUserData(userIdstr);
          
           
        } else {
            
        }
    }, [userIdstr]);

    const fetchUserData = async (userIdstr: string ) => {
        try {
            const res = await GetUserById(userIdstr);
            if (res.status === 200) {
                setUser(res.data);
                setFormUser({
                    Email: res.data.Email,
                    Profile: res.data.Profile,
                    ProfileBackground: res.data.ProfileBackground,
                    FirstName: res.data.FirstName,
                    LastName: res.data.LastName,
                    Tel: res.data.Tel,
                    Age: res.data.Age,
                });
                //message.success("พบข้อมูลUser");
            }else {
                message.error("error");
            }
        } catch (error) {
            console.error("Error fetching user data:", error); // Debug
            message.error("เกิดข้อผิดพลาดในการดึงข้อมูลUser");
        }
    };
    //=====================listStore===========================
    

    //=====================Menu on Profile======================
    const [isMenuOpen, setMenu] = useState(false);
    const OpenMenu = () => {
        setMenu(!isMenuOpen);
    };

    //=====================Logout======================
    const Logout = () => {
        localStorage.clear();
        message.success("Logout successful");
        setTimeout(() => {
          location.href = "/";
        }, 1000);
    };
    //=====================inbox=======================
    const navigate = useNavigate();
    const GotoInbox = () => {
        navigate('/Inbox');
    };
    //=====================time================================
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
    
        return () => clearInterval(interval);
      }, []);
    const getFormattedDateTime = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = (date.getFullYear()).toString(); // to year พศ +543
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
      };
    //====================is open? ============================
    useEffect(() => {
        const hours = currentTime.getHours();
        if (hours >= 10 && hours <= 21) {
            //setOpen(true);
            settextOpen('OPEN NOW');
        } else {
            //setOpen(false);
            settextOpen('NOT OPEN NOW');
        }
    }, [currentTime]);
    //const [isOpen, setOpen] = useState(false);
    const [istextOpen, settextOpen] = useState('NOT OPEN NOW');
    //====================profile==============================
    const [isProfile, setProfile] = useState(false);
    const [card ,setcard] = useState(0);
    const OpenProfile = () => {
        setProfile(true);
        if (user?.Status == 'Admin') {
            setcard(3);
        }else if (user?.Status == 'Employee'){
            setcard(2);
        }else{
            setcard(1);
        }
    };
    const CloseProfile = () => {
        setProfile(false);
        closeCard();
        setEditProfile(false);
        
    };
    const closeCard = () => {
        setcard(0);
    };
    //=========================================Edit profile===========================
    const [isEditProfile, setEditProfile] = useState(false);
    const OpenEditProfile = () => {
        setEditProfile(!isEditProfile)
    };
    const [formUser, setFormUser] = useState({
        Email: "",
        Profile: "",
        ProfileBackground: "",
        FirstName: "",
        LastName: "",
        Tel: "",
        Age: 0,
    });
    
    const [fileListProfile, setFileListProfile] = useState<UploadFile[]>([]);
    const [fileListBackground, setFileListBackground] = useState<UploadFile[]>([]);

    const getImageURLEDIT = async (file?: File): Promise<string> => {
        if (!file) return '';
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
        });
    };

    const onPreviewEDIT = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src && file.originFileObj) {
            src = await getImageURLEDIT(file.originFileObj);
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const handleChangeEditUser = (e : any) => {
        const { name, value } = e.target;
        setFormUser({ ...formUser, [name]: name === "Age" ? Number(value) : value });
    };

    const onChangeProfile: UploadProps['onChange'] = ({ fileList }) => {
        setFileListProfile(fileList);
        // Update Profile image URL in formUser
        if (fileList.length > 0 && fileList[0].originFileObj) {
            getImageURLEDIT(fileList[0].originFileObj).then((url) => {
                setFormUser({ ...formUser, Profile: url });
            });
        }
    };

    const onChangeBackground: UploadProps['onChange'] = ({ fileList }) => {
        setFileListBackground(fileList);
        // Update Background image URL in formUser
        if (fileList.length > 0 && fileList[0].originFileObj) {
            getImageURLEDIT(fileList[0].originFileObj).then((url) => {
                setFormUser({ ...formUser, ProfileBackground: url });
            });
        }
    };

    const handleSubmitEdit = async (e : any) => {
        e.preventDefault();
        try {
            const res = await UpdateUserByid(String(userIdstr), formUser);
            if (res.status === 200) {
                message.success(res.data.message);
            } else {
                message.error(res.data.error);
            }
        } catch (error) {
            message.error("การอัพเดทข้อมูลไม่สำเร็จ");
        }
    };
    //=========================================Add Store==============================
    const [messageApi, contextHolder] = message.useMessage();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const getImageURL = async (file?: File): Promise<string> => {
        if (!file) return '';
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
        });
    };

    
    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src && file.originFileObj) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as File);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
    const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };
    

    
    const [formData, setFormData] = useState({
        nameStore: '',
        picStore: '',
        subPicOne: '',     // ภาพย่อยที่ 1
        subPicTwo: '',     // ภาพย่อยที่ 2
        subPicThree: '',   // ภาพย่อยที่ 3
        description: '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        formData.picStore = await getImageURL(fileList[0]?.originFileObj);
        formData.subPicOne = await getImageURL(fileList[1]?.originFileObj);
        formData.subPicTwo = await getImageURL(fileList[2]?.originFileObj);
        formData.subPicThree = await getImageURL(fileList[3]?.originFileObj);
        console.log('Form data submitted:', formData);
       
    };

    
    //===============================popup add store============================================
    const [isAddstore, setAddstore] = useState(false);
    const OpenAddStore = () => {
        setAddstore(!isAddstore)
    };
    const closeAddStore = () => {
        setAddstore(false)
    };
    
    return (
        <>
            {contextHolder}
            
                <>
                    <div className={`back ${isProfile ? 'fade-in' : 'fade-out'}`} onClick={CloseProfile} ></div>
                    <div className={`ProfileContaner ${isProfile ? 'fade-in' : 'fade-out'}`}>
                        <div><img src={user?.ProfileBackground || background} alt="ProfileBackground" /></div>
                        <div><img src={user?.Profile || Hutao} alt="Profile" /></div>
                        <div>{user?.Status}</div>
                        <div>{user?.UserName}</div>
                        <div>Gmail : {user?.Email}</div>
                        <div>Name : {user?.FirstName}{user?.LastName}</div>
                        <div>Age : {user?.Age} Tel : {user?.Tel || 'No Phone Number'}</div>
                        <div onClick={CloseProfile}>back to main ▶</div>
                        <div onClick={OpenEditProfile}>🛠️</div>
                       
                        
                        
                    </div>

                    
                    <div className={`EditProfileContaner ${isEditProfile ? 'fade-in' : 'fade-out'}`}>
                        <div className='EditContaner'>
                            <h1 style={{textAlign: "center"}}>Edit Your Profile</h1>
                            <form onSubmit={handleSubmitEdit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div className='uploadEdit'>
                                    <Upload
                                        fileList={fileListProfile}
                                        onChange={onChangeProfile}
                                        onPreview={onPreview}
                                        beforeUpload={() => false}
                                        maxCount={1}
                                        listType="picture-card"
                                    >
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Profile</div>
                                        </div>
                                    </Upload>

                                    <Upload
                                        fileList={fileListBackground}
                                        onChange={onChangeBackground}
                                        onPreview={onPreviewEDIT}
                                        beforeUpload={() => false}
                                        maxCount={1}
                                        listType="picture-card"
                                    >
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Background</div>
                                        </div>
                                    </Upload><div></div>
                                </div>
                                <label>Email</label>
                                <input type="email" name="Email" value={formUser.Email} onChange={handleChangeEditUser} required />

                                <label>First Name</label>
                                <input type="text" name="FirstName" value={formUser.FirstName} onChange={handleChangeEditUser} required />

                                <label>Last Name</label>
                                <input type="text" name="LastName" value={formUser.LastName} onChange={handleChangeEditUser} required />

                                <label>Tel</label>
                                <input type="tel" name="Tel" value={formUser.Tel} onChange={handleChangeEditUser} />

                                <label>Age</label>
                                <input type="text" name="Age" value={formUser.Age} onChange={handleChangeEditUser} />

                                <button type="submit" className='Editsubmit'>Save Changes</button>
                            </form>
                            <div onClick={OpenEditProfile} className='EditBtn'>🛠️</div>
                        </div>
                    </div>

                    {/* <div className='CardMember'>
                        <div className={`Platinum ${card === 1 ? 'fade-in' : 'fade-out'}`} onClick={closeCard}><img src={card1} alt="ProfileBackground" /></div>
                        <div className={`Gold ${card === 2 ? 'fade-in' : 'fade-out'}`} onClick={closeCard}><img src={card2} alt="ProfileBackground" /></div>
                        <div className={`Dimond ${card === 3 ? 'fade-in' : 'fade-out'}`} onClick={closeCard}><img src={card3} alt="ProfileBackground" /></div>
                    </div> */}
                    
                       
                    

                   

                    
                </>
            
            <nav className='positionNav'>
                <nav className='NavComponent'>
                    <span className='SubNab1'>
                        <img style={{ width: '25px', height: '25px' }} className='Clock' src={Clock} alt="Clock" />
                        <p>{istextOpen} <br /> 10 AM - 9 PM <br /> Now {getFormattedDateTime(currentTime)}</p>
                        <div className='vertical-divider'></div>

                        <img style={{ width: '25px', height: '25px' }} className='Loclation' src={Address} alt="Address" />
                        <p>111, University Road, Suranaree<br /> Subdistrict, Mueang Nakhon Ratchasima<br />District, Nakhon Ratchasima 30000</p>
                        <div className='vertical-divider'></div>
                    </span>
        
                    <span className='SubNab3'>
                        <span className='welcome'>Hello! {user?.UserName} Welcome to ICONIC🎉</span>
                        <img className='box' src={box} alt="box" onClick={GotoInbox} />
                        <img style={{ width: '45px', height: '45px', borderRadius: '50px', cursor: 'pointer' }} className='profileButton' src={user?.Profile || Hutao} alt="User" onClick={OpenMenu}></img>
                        
                            <div className={`dropboxMenu ${isMenuOpen ? 'fade-in' : 'fade-out'}`}>
                                <a onClick={OpenProfile} ><p className='dropboxMenuP'>Your Profile</p></a>
                                <a href="" ><p className='dropboxMenuP'>Job Application</p></a>
                                <a href="" ><p className='dropboxMenuP'>Car Parking</p></a>
                                {user?.Status === 'Admin' && 
                                    <a href="/Admin" ><p className='dropboxMenuP'>Management</p></a>
                                }
                                <div className='lineMenu'></div>
                                <p className='dropboxMenuP' onClick={Logout}>Log Out</p>
                            </div>
                        
                    </span>
                </nav> 
                <nav className='NavComponentMenu'>
                    <div></div>
                    <div>
                        <a href="/Main" ><span className={`MenuHover ${location.pathname === "/Main" ? "active" : ""}`}>NEWS</span></a>
                        <a href="/Store" ><span className={`MenuHover ${location.pathname === "/Store" ? "active" : ""}`}>STORE</span></a>
                        {user?.Status === 'Admin' && 
                            <a href="/Hall" ><span className={`MenuHover ${location.pathname === "/Hall" ? "active" : ""}`}>BOOK A HALL</span></a>
                        }
                        <a href="#" ><span className='MenuHover'>SERVICEREQUEST</span></a>
                        <a href="#" ><span className='MenuHover'>CLEANING</span></a>
                    </div>
                    <div></div>
                </nav>
            
            </nav>
        </>
    );
};



export const IntroWeb: React.FC = () => {
    const [user, setUser] = useState<UsersInterface | null>(null); // State to store user data
    const userIdstr = localStorage.getItem("id");
    useEffect(() => {
        if (userIdstr) {
            fetchUserData(userIdstr);
        } else {
            
        }
    }, [userIdstr]);

    const fetchUserData = async (userIdstr: string ) => {
        try {
            const res = await GetUserById(userIdstr);
            if (res.status === 200) {
                setUser(res.data);
                //message.success("พบข้อมูลUser");
            } else {
                
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            message.error("เกิดข้อผิดพลาดในการดึงข้อมูลUser");
        }
    };

    const [intro, setIntro] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIntro(false)
        }, 10000);
    }, []);
    return (

        <>
            {intro && 
                <div className='introMainWeb'>
            
                    <h1>Hello! {user?.UserName}</h1>
                    <h2>WELCOME TO ICONIC</h2>
                    <p>Press anywhere to skip</p>
                </div>
            }
        </>

    );

};
