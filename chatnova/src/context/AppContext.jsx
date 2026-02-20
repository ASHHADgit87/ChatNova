import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useRef, useState } from "react";
import { auth, db } from "../config/Firebase-temp";
import { useNavigate } from "react-router-dom";
import { messaging } from "../config/Firebase-temp";
import { getToken } from "firebase/messaging";


export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const navigate = useNavigate();
  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false);
  const intervalRef = useRef(null);

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      console.log("userRef path:", userRef.path);
      const userSnap = await getDoc(userRef);
      console.log("userSnap.exists:", userSnap.exists());
      const data = userSnap.data() || {};
      console.log("loaded user data:", data);
      setUserData(data);

      if (data.avatar && data.name) {
        navigate("/chat");
      } else {
        navigate("/profile");
      }

      await updateDoc(userRef, { lastSeen: Date.now() });
      if (Notification.permission === "default") {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BMDIY0B0ui-jwYDAobKw0xfwniN1Y-p_wJqaK6WuZz4Huj5g2QjTQ-UvG_ShwY2N4BHSgUJujIsRPrNNTbyTGQY",
    });

    console.log("FCM Token:", token);

    await updateDoc(userRef, {
      fcmToken: token,
    });
  }
}

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(async () => {
        if (auth.currentUser) {
          await updateDoc(userRef, { lastSeen: Date.now() });
        }
      }, 60000);
    } catch (error) {
      console.error("loadUserData error:", error);
    }
  };

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        const chatItems = res.data().chatsData;
        const tempData = [];
        for (const item of chatItems) {
          const userRef = doc(db, "users", item.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          tempData.push({ ...item, userData });
        }
        setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
      });
      return () => {
        unSub();
      };
    }
  }, [userData]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messages,
    setMessages,
    chatUser,
    setChatUser,
    messagesId,
    setMessagesId,
    chatVisible,
    setChatVisible,
    rightSidebarVisible,
    setRightSidebarVisible
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
