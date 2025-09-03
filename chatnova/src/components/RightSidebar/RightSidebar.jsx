import React, { useContext, useEffect, useState } from "react";
import "./RightSidebar.css";
import assets from "../../assets/assets";
import { logout } from "../../config/Firebase-temp";
import { AppContext } from "../../context/AppContext";
const RightSidebar = () => {
  const { chatUser, messages,rightSidebarVisible,setRightSidebarVisible } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);
  useEffect(() => {
    let tempVar = [];
    messages.forEach((msg) => {
      if (msg.image) {
        tempVar.push({ type: "image", url: msg.image });
      }
      if (msg.video) {
        tempVar.push({ type: "video", url: msg.video });
      }
    });
    setMsgImages(tempVar);
  }, [messages]);

  return chatUser ? (
  <div className={`rs ${rightSidebarVisible ? "visible" : ""}`}>
    <div className="rs-profile">
      <img
        onClick={() => setRightSidebarVisible(false)} 
        src={assets.arrow_icon}
        className="arrow"
        alt=""
      />
      <img src={chatUser.userData.avatar} alt="" />
      <h3>
        {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
          <img src={assets.green_dot} className="dot" alt="" />
        ) : null}{" "}
        {chatUser.userData.name}
      </h3>
      <p>{chatUser.userData.bio}</p>
    </div>
    <hr />
    <div className="rs-media">
      <p>Media</p>
      <div>
        {msgImages.map((media, index) =>
          media.type === "image" ? (
            <img
              onClick={() => window.open(media.url)}
              key={index}
              src={media.url}
              alt=""
            />
          ) : (
            <video key={index} src={media.url} controls />
          )
        )}
      </div>
    </div>
    <button onClick={() => logout()}>Logout</button>
  </div>
) : (
  <div className={`rs ${rightSidebarVisible ? "visible" : ""}`}>
    <button onClick={() => logout()}>Logout</button>
  </div>
);

};

export default RightSidebar;
