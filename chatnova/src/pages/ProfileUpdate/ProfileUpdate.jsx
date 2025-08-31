// src/pages/ProfileUpdate/ProfileUpdate.jsx
import React, { useContext, useEffect, useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import uploadToCloudinary from "../../lib/cloudinary";
import { AppContext } from "../../context/AppContext";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [uid, setUid] = useState("");
  const { setUserData } = useContext(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Upload profile picture");
        return;
      }

      const docRef = doc(db, "users", uid);

      if (image) {
        const imgUrl = await uploadToCloudinary(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef, {
          avatar: imgUrl,
          bio: bio,
          name: name,
        });
      } else {
        await updateDoc(docRef, {
          bio: bio,
          name: name,
        });
      }

      const snap = await getDoc(docRef);
      setUserData && setUserData(snap.data());
      toast.success("Profile updated!");
      navigate("/chat");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Update failed");
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const d = docSnap.data() || {};
        if (d.name) setName(d.name);
        if (d.bio) setBio(d.bio);
        if (d.avatar) setPrevImage(d.avatar);
      } else {
        navigate("/");
      }
    });
    return () => unsub();
  }, [navigate]);

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>

          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg, .webp, .mp4"
              hidden
            />
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : prevImage || assets.avatar_icon
              }
              alt=""
            />
            Upload profile image
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            required
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write Profile bio"
            required
          />

          <button type="submit">Save</button>
        </form>

        <img
          className="profile-pic"
          src={
            image ? URL.createObjectURL(image) : prevImage || assets.logo_icon
          }
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
