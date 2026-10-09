// import { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";
// import API from "../config/api";
// import "./ChatPage.css";

// const ENDPOINT = "http://localhost:5000";
// let socket;

// const ChatPage = ({ user, setUser }) => {
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [search, setSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const messagesEndRef = useRef(null);

//   /* ================= SOCKET SETUP ================= */
//   useEffect(() => {
//     socket = io(ENDPOINT);
//     socket.emit("setup", user);
//     socket.on("connected", () => console.log("Socket connected"));
//     return () => socket.disconnect();
//   }, [user]);

//   /* ================= FETCH CHATS ================= */
//   const fetchChats = async () => {
//     try {
//       const { data } = await API.get("/chats");
//       setChats(data);
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchChats();
//   }, [user]);

//   /* ================= SEARCH USERS ================= */
//   const handleSearch = async () => {
//     if (!search.trim()) return;

//     try {
//       const { data } = await API.get(`/users?search=${search}`);
//       setSearchResults(data);
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   /* ================= CREATE CHAT ================= */
//   const createChat = async (userId) => {
//     try {
//       const { data } = await API.post("/chats", { userId });

//       setChats((prev) => {
//         const exists = prev.find((c) => c._id === data._id);
//         if (exists) return prev;
//         return [data, ...prev];
//       });

//       setSelectedChat(data);
//       setSearch("");
//       setSearchResults([]);
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   /* ================= FETCH MESSAGES ================= */
//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!selectedChat) return;

//       try {
//         const { data } = await API.get(
//           `/messages/${selectedChat._id}`
//         );
//         setMessages(data);
//         socket.emit("join chat", selectedChat._id);
//       } catch (err) {
//         console.error(err.message);
//       }
//     };

//     fetchMessages();
//   }, [selectedChat]);

//   /* ================= RECEIVE MESSAGE ================= */
//   useEffect(() => {
//     socket.on("message received", (newMsg) => {
//       if (!selectedChat || selectedChat._id !== newMsg.chat._id) return;
//       setMessages((prev) => [...prev, newMsg]);
//     });

//     return () => socket.off("message received");
//   }, [selectedChat]);

//   /* ================= AUTO SCROLL ================= */
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* ================= SEND MESSAGE ================= */
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     try {
//       const { data } = await API.post("/messages", {
//         content: newMessage,
//         chatId: selectedChat._id,
//       });

//       setNewMessage("");
//       setMessages((prev) => [...prev, data]);
//       socket.emit("new message", data);
//       fetchChats(); // update sidebar latestMessage
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   /* ================= GET CHAT NAME ================= */
//   const getChatName = (chat) => {
//     if (chat.isGroupChat) return chat.chatName;

//     return chat.users
//       .filter((u) => u._id !== user._id)
//       .map((u) => u.name)[0];
//   };

//   /* ================= LOGOUT ================= */
//   const logoutHandler = () => {
//     localStorage.removeItem("userInfo");
//     setUser(null);
//   };

//   return (
//     <div className="chat-container">
//       {/* LEFT SIDEBAR */}
//       <div className="chat-list">
//         <div className="chat-list-header">
//           <h2>Chats</h2>
//           <button onClick={logoutHandler}>Logout</button>
//         </div>

//         {/* SEARCH SECTION */}
//         <div style={{ padding: "10px" }}>
//           <input
//             type="text"
//             placeholder="Search user..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button onClick={handleSearch}>Search</button>

//           {searchResults.map((u) => (
//             <div
//               key={u._id}
//               style={{ cursor: "pointer", padding: "5px" }}
//               onClick={() => createChat(u._id)}
//             >
//               {u.name} ({u.email})
//             </div>
//           ))}
//         </div>

//         {/* CHAT LIST */}
//         <div className="chat-list-items">
//           {chats.map((chat) => (
//             <div
//               key={chat._id}
//               className={`chat-item ${
//                 selectedChat?._id === chat._id ? "active" : ""
//               }`}
//               onClick={() => setSelectedChat(chat)}
//             >
//               <strong>{getChatName(chat)}</strong>
//               <p style={{ fontSize: "12px", color: "gray" }}>
//                 {chat.latestMessage?.content}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="chat-messages-container">
//         <div className="chat-header">
//           <h2>
//             {selectedChat ? getChatName(selectedChat) : "Select a chat"}
//           </h2>
//         </div>

//         <div className="messages">
//           {selectedChat ? (
//             messages.map((msg) => (
//               <div
//                 key={msg._id}
//                 className={`message ${
//                   msg.sender._id === user._id ? "self" : "other"
//                 }`}
//               >
//                 <p>{msg.content}</p>
//               </div>
//             ))
//           ) : (
//             <div className="no-chat">
//               <h3>No chat selected</h3>
//               <p>Select a chat from the left</p>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {selectedChat && (
//           <form className="message-form" onSubmit={sendMessage}>
//             <input
//               type="text"
//               placeholder="Type a message..."
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//             />
//             <button type="submit">Send</button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

// ChatPage.jsx - Complete with Group Chat Functionality

import { useCallback, useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import API from "../config/api";
import "./ChatPage.css";

const ENDPOINT =
process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

const ChatPage = ({ user, setUser }) => {
const [chats, setChats] = useState([]);
const [selectedChat, setSelectedChat] = useState(null);
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState("");
const [search, setSearch] = useState("");
const [searchResults, setSearchResults] = useState([]);
const [isSearching, setIsSearching] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(false);

// Group chat states
const [showGroupModal, setShowGroupModal] = useState(false);
const [groupName, setGroupName] = useState("");
const [selectedUsers, setSelectedUsers] = useState([]);
const [groupSearch, setGroupSearch] = useState("");
const [groupSearchResults, setGroupSearchResults] = useState([]);
const [showGroupInfo, setShowGroupInfo] = useState(false);

const messagesEndRef = useRef(null);
const socketRef = useRef(null);

// Socket setup
useEffect(() => {
if (!user) return undefined;


const socketInstance = io(ENDPOINT);
socketRef.current = socketInstance;

socketInstance.emit("setup", user);
socketInstance.on("connected", () =>
  console.log("Socket connected")
);

return () => {
  socketInstance.disconnect();

  if (socketRef.current === socketInstance) {
    socketRef.current = null;
  }
};


}, [user]);

// Fetch chats
const fetchChats = useCallback(async () => {
try {
const { data } = await API.get("/chats");
setChats(data);
} catch (err) {
console.error(err.message);
}
}, []);

useEffect(() => {
if (user) {
fetchChats();
}
}, [user, fetchChats]);

// Search users for new private chat
useEffect(() => {
let cancelled = false;


const searchUsers = async () => {
  if (!search.trim()) {
    setSearchResults([]);
    setIsSearching(false);
    return;
  }

  setIsSearching(true);

  try {
    const { data } = await API.get(
      `/users?search=${encodeURIComponent(search)}`
    );

    if (!cancelled) {
      const filtered = data.filter(
        (u) => u._id !== user?._id
      );
      setSearchResults(filtered);
    }
  } catch (err) {
    if (!cancelled) {
      console.error(err.message);
    }
  } finally {
    if (!cancelled) {
      setIsSearching(false);
    }
  }
};

const delayDebounce = setTimeout(searchUsers, 400);

return () => {
  cancelled = true;
  clearTimeout(delayDebounce);
};

}, [search, user]);

// Search users for group creation and adding group members
useEffect(() => {
let cancelled = false;


const searchGroupUsers = async () => {
  if (!groupSearch.trim()) {
    setGroupSearchResults([]);
    return;
  }

  try {
    const { data } = await API.get(
      `/users?search=${encodeURIComponent(groupSearch)}`
    );

    if (!cancelled) {
      const filtered = data.filter(
        (u) =>
          u._id !== user?._id &&
          !selectedUsers.some(
            (selected) => selected._id === u._id
          )
      );

      setGroupSearchResults(filtered);
    }
  } catch (err) {
    if (!cancelled) {
      console.error(err.message);
    }
  }
};

const delayDebounce = setTimeout(searchGroupUsers, 400);

return () => {
  cancelled = true;
  clearTimeout(delayDebounce);
};


}, [groupSearch, user, selectedUsers]);

// Create or access a one-to-one chat
const createChat = async (userId) => {
try {
const { data } = await API.post("/chats", { userId });


  setChats((prev) => {
    const exists = prev.find((chat) => chat._id === data._id);
    return exists ? prev : [data, ...prev];
  });

  setSelectedChat(data);
  setSearch("");
  setSearchResults([]);

  if (window.innerWidth < 768) {
    setSidebarOpen(false);
  }
} catch (err) {
  console.error(err.message);
}


};

// Reset the create-group modal
const resetGroupModal = () => {
setGroupName("");
setSelectedUsers([]);
setGroupSearch("");
setGroupSearchResults([]);
};

// Create group chat
const createGroupChat = async () => {
if (!groupName.trim()) {
alert("Please enter a group name");
return;
}


if (selectedUsers.length < 2) {
  alert("Please select at least 2 members for group chat");
  return;
}

try {
  const userIds = selectedUsers.map((u) => u._id);

  const { data } = await API.post("/chats/group", {
    name: groupName,
    users: userIds,
  });

  setChats((prev) => [data, ...prev]);
  setSelectedChat(data);
  setShowGroupModal(false);
  resetGroupModal();

  if (window.innerWidth < 768) {
    setSidebarOpen(false);
  }
} catch (err) {
  alert(
    err.response?.data?.message || "Failed to create group"
  );
}


};

// Add user to group
const addUserToGroup = async (userId) => {
if (!selectedChat) return;


try {
  const { data } = await API.put("/chats/group/add", {
    chatId: selectedChat._id,
    userId,
  });

  setSelectedChat(data);
  setChats((prev) =>
    prev.map((chat) =>
      chat._id === data._id ? data : chat
    )
  );

  setGroupSearch("");
  setGroupSearchResults([]);
} catch (err) {
  alert(
    err.response?.data?.message || "Failed to add user"
  );
}


};

// Remove user from group
const removeUserFromGroup = async (userId) => {
if (!selectedChat) return;


try {
  const { data } = await API.put("/chats/group/remove", {
    chatId: selectedChat._id,
    userId,
  });

  setSelectedChat(data);
  setChats((prev) =>
    prev.map((chat) =>
      chat._id === data._id ? data : chat
    )
  );
} catch (err) {
  alert(
    err.response?.data?.message || "Failed to remove user"
  );
}


};

// Rename group
const renameGroup = async (newName) => {
if (!newName.trim() || !selectedChat) return;


try {
  const { data } = await API.put("/chats/group/rename", {
    chatId: selectedChat._id,
    chatName: newName,
  });

  setSelectedChat(data);
  setChats((prev) =>
    prev.map((chat) =>
      chat._id === data._id ? data : chat
    )
  );
} catch (err) {
  alert(
    err.response?.data?.message || "Failed to rename group"
  );
}


};

// Leave group
const leaveGroup = async () => {
if (!selectedChat) return;


try {
  await API.put("/chats/group/leave", {
    chatId: selectedChat._id,
  });

  setChats((prev) =>
    prev.filter((chat) => chat._id !== selectedChat._id)
  );

  setSelectedChat(null);
  setMessages([]);
  setShowGroupInfo(false);
} catch (err) {
  alert(
    err.response?.data?.message || "Failed to leave group"
  );
}


};

// Add a selected user to the group-creation selection
const addToGroupSelection = (userToAdd) => {
setSelectedUsers((prev) => {
if (prev.some((u) => u._id === userToAdd._id)) {
return prev;
}


  return [...prev, userToAdd];
});

setGroupSearch("");
setGroupSearchResults([]);


};

// Remove a user from the group-creation selection
const removeFromGroupSelection = (userId) => {
setSelectedUsers((prev) =>
prev.filter((u) => u._id !== userId)
);
};

// Fetch messages when a chat is selected
useEffect(() => {
let cancelled = false;


const fetchMessages = async () => {
  if (!selectedChat) {
    setMessages([]);
    return;
  }

  try {
    const { data } = await API.get(
      `/messages/${selectedChat._id}`
    );

    if (cancelled) return;

    setMessages(data);

    if (socketRef.current) {
      socketRef.current.emit(
        "join chat",
        selectedChat._id
      );
    }
  } catch (err) {
    if (!cancelled) {
      console.error(err.message);
    }
  }
};

fetchMessages();

return () => {
  cancelled = true;
};


}, [selectedChat]);

// Receive real-time messages
useEffect(() => {
const socketInstance = socketRef.current;


if (!socketInstance) return undefined;

const handleMessageReceived = (newMsg) => {
  if (
    !selectedChat ||
    selectedChat._id !== newMsg.chat?._id
  ) {
    return;
  }

  setMessages((prev) => {
    if (prev.some((msg) => msg._id === newMsg._id)) {
      return prev;
    }

    return [...prev, newMsg];
  });
};

socketInstance.on(
  "message received",
  handleMessageReceived
);

return () => {
  socketInstance.off(
    "message received",
    handleMessageReceived
  );
};


}, [selectedChat]);

// Auto-scroll to the latest message
useEffect(() => {
messagesEndRef.current?.scrollIntoView({
behavior: "smooth",
});
}, [messages]);

// Send message
const sendMessage = async (e) => {
e.preventDefault();


if (!newMessage.trim() || !selectedChat) return;

try {
  const { data } = await API.post("/messages", {
    content: newMessage,
    chatId: selectedChat._id,
  });

  setNewMessage("");

  setMessages((prev) => {
    if (prev.some((msg) => msg._id === data._id)) {
      return prev;
    }

    return [...prev, data];
  });

  if (socketRef.current) {
    socketRef.current.emit("new message", data);
  }

  fetchChats();
} catch (err) {
  console.error(err.message);
}


};

// Get the display name of a chat
const getChatName = (chat) => {
if (chat.isGroupChat) return chat.chatName;


const otherUser = chat.users?.find(
  (u) => u._id !== user?._id
);

return otherUser?.name || "Unknown";


};

const getInitials = (name) => {
return name?.charAt(0).toUpperCase() || "?";
};

const formatTime = (date) => {
if (!date) return "";


const d = new Date(date);

return d.toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
});


};

// Logout
const logoutHandler = () => {
localStorage.removeItem("userInfo");
setUser(null);
};

// Group information modal
const GroupInfoModal = () => (
<div
className="modal-overlay"
onClick={() => setShowGroupInfo(false)}
>
<div
className="modal-content"
onClick={(e) => e.stopPropagation()}
> <div className="modal-header"> <h3>Group Info</h3>
<button
className="modal-close"
onClick={() => setShowGroupInfo(false)}
>
× </button> </div>


    <div className="group-info-body">
      <div className="group-name-section">
        <label>Group Name</label>
        <div className="group-name-edit">
          <input
            type="text"
            defaultValue={selectedChat?.chatName}
            placeholder="New group name"
            id="renameGroupInput"
          />
          <button
            onClick={() => {
              const input = document.getElementById(
                "renameGroupInput"
              );
              const newName = input?.value;

              if (newName) {
                renameGroup(newName);
              }
            }}
          >
            Rename
          </button>
        </div>
      </div>

      <div className="members-section">
        <label>
          Members ({selectedChat?.users?.length || 0})
        </label>

        <div className="members-list">
          {selectedChat?.users?.map((member) => (
            <div
              key={member._id}
              className="member-item"
            >
              <div className="member-avatar">
                {getInitials(member.name)}
              </div>

              <div className="member-info">
                <div className="member-name">
                  {member.name}
                </div>
                <div className="member-role">
                  {member._id ===
                  selectedChat?.groupAdmin?._id
                    ? "Admin"
                    : "Member"}
                </div>
              </div>

              {selectedChat?.groupAdmin?._id ===
                user._id &&
                member._id !== user._id && (
                  <button
                    className="remove-member-btn"
                    onClick={() =>
                      removeUserFromGroup(member._id)
                    }
                  >
                    Remove
                  </button>
                )}

              {member._id === user._id && (
                <button
                  className="leave-group-btn"
                  onClick={leaveGroup}
                >
                  Leave
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedChat?.groupAdmin?._id === user._id && (
        <div className="add-members-section">
          <label>Add Members</label>

          <div className="add-member-search">
            <input
              type="text"
              placeholder="Search users..."
              value={groupSearch}
              onChange={(e) =>
                setGroupSearch(e.target.value)
              }
            />
          </div>

          {groupSearchResults.length > 0 && (
            <div className="search-results-list">
              {groupSearchResults.map((u) => (
                <div
                  key={u._id}
                  className="search-result-item"
                  onClick={() => addUserToGroup(u._id)}
                >
                  <div className="result-avatar">
                    {getInitials(u.name)}
                  </div>

                  <div className="result-info">
                    <strong>{u.name}</strong>
                    <small>{u.email}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
</div>


);

// Create group modal
const CreateGroupModal = () => (
<div
className="modal-overlay"
onClick={() => setShowGroupModal(false)}
>
<div
className="modal-content"
onClick={(e) => e.stopPropagation()}
> <div className="modal-header"> <h3>Create Group Chat</h3>
<button
className="modal-close"
onClick={() => setShowGroupModal(false)}
>
× </button> </div>


    <div className="modal-body">
      <div className="input-group">
        <label>Group Name</label>
        <input
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Add Members (min 2)</label>
        <input
          type="text"
          placeholder="Search users..."
          value={groupSearch}
          onChange={(e) =>
            setGroupSearch(e.target.value)
          }
        />
      </div>

      {groupSearchResults.length > 0 && (
        <div className="search-results-list">
          {groupSearchResults.map((u) => (
            <div
              key={u._id}
              className="search-result-item"
              onClick={() => addToGroupSelection(u)}
            >
              <div className="result-avatar">
                {getInitials(u.name)}
              </div>

              <div className="result-info">
                <strong>{u.name}</strong>
                <small>{u.email}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUsers.length > 0 && (
        <div className="selected-users">
          <label>
            Selected Members ({selectedUsers.length})
          </label>

          <div className="selected-users-list">
            {selectedUsers.map((u) => (
              <div
                key={u._id}
                className="selected-user-tag"
              >
                <span>{u.name}</span>
                <button
                  onClick={() =>
                    removeFromGroupSelection(u._id)
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    <div className="modal-footer">
      <button
        className="btn-cancel"
        onClick={() => setShowGroupModal(false)}
      >
        Cancel
      </button>
      <button
        className="btn-create"
        onClick={createGroupChat}
      >
        Create Group
      </button>
    </div>
  </div>
</div>


);

if (!user) return null;

return ( <div className="chat-app">
{/* Sidebar */}
<div
className={`chat-sidebar ${sidebarOpen ? "open" : ""}`}
> <div className="sidebar-header"> <h3>Chatify</h3> <p>Welcome, {user.name}</p> <button
         onClick={logoutHandler}
         className="logout-btn"
       >
Logout </button> </div>


    <div className="search-section">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <button
        className="create-group-btn"
        onClick={() => setShowGroupModal(true)}
      >
        + New Group
      </button>

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((u) => (
            <div
              key={u._id}
              className="search-result-item"
              onClick={() => createChat(u._id)}
            >
              <div className="avatar-placeholder">
                {getInitials(u.name)}
              </div>

              <div className="result-info">
                <strong>{u.name}</strong>
                <small>{u.email}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {isSearching && (
        <div className="search-loading">
          Searching...
        </div>
      )}
    </div>

    <div className="chat-list">
      {/* Group chats */}
      {chats.filter((c) => c.isGroupChat).length > 0 && (
        <>
          <div className="chat-section-title">Groups</div>

          {chats
            .filter((c) => c.isGroupChat)
            .map((chat) => (
              <div
                key={chat._id}
                className={`chat-item ${
                  selectedChat?._id === chat._id
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setSelectedChat(chat);
                  setSidebarOpen(false);
                }}
              >
                <div className="chat-avatar">👥</div>

                <div className="chat-info">
                  <div className="chat-name">
                    <span>{getChatName(chat)}</span>
                    <span className="chat-time">
                      {chat.latestMessage &&
                        formatTime(
                          chat.latestMessage.createdAt
                        )}
                    </span>
                  </div>

                  <div className="last-message">
                    {chat.latestMessage?.content ||
                      "Group created"}
                  </div>
                </div>
              </div>
            ))}
        </>
      )}

      {/* Private chats */}
      {chats.filter((c) => !c.isGroupChat).length > 0 && (
        <>
          <div className="chat-section-title">
            Private Chats
          </div>

          {chats
            .filter((c) => !c.isGroupChat)
            .map((chat) => (
              <div
                key={chat._id}
                className={`chat-item ${
                  selectedChat?._id === chat._id
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setSelectedChat(chat);
                  setSidebarOpen(false);
                }}
              >
                <div className="chat-avatar">
                  {getInitials(getChatName(chat))}
                </div>

                <div className="chat-info">
                  <div className="chat-name">
                    <span>{getChatName(chat)}</span>
                    <span className="chat-time">
                      {chat.latestMessage &&
                        formatTime(
                          chat.latestMessage.createdAt
                        )}
                    </span>
                  </div>

                  <div className="last-message">
                    {chat.latestMessage?.content ||
                      "No messages yet"}
                  </div>
                </div>
              </div>
            ))}
        </>
      )}

      {chats.length === 0 && (
        <div className="empty-state">
          <p>No chats yet</p>
          <small>
            Search for users or create a group to start
            chatting
          </small>
        </div>
      )}
    </div>
  </div>

  {/* Main chat area */}
  <div className="chat-main">
    <div className="chat-header">
      <button
        className="back-button"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      <div
        className="chat-header-info"
        onClick={() =>
          selectedChat?.isGroupChat &&
          setShowGroupInfo(true)
        }
        style={{
          cursor: selectedChat?.isGroupChat
            ? "pointer"
            : "default",
        }}
      >
        <h2>
          {selectedChat
            ? getChatName(selectedChat)
            : "Select a chat"}

          {selectedChat?.isGroupChat && (
            <span className="group-badge">
              👥 Group
            </span>
          )}
        </h2>

        <p>
          {selectedChat
            ? selectedChat.isGroupChat
              ? `${selectedChat.users?.length || 0} members`
              : "Online"
            : "No chat selected"}
        </p>
      </div>
    </div>

    <div className="messages-container">
      {selectedChat ? (
        messages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${
              msg.sender?._id === user._id
                ? "self"
                : "other"
            }`}
          >
            {selectedChat.isGroupChat &&
              msg.sender?._id !== user._id && (
                <div className="message-sender">
                  {msg.sender?.name}
                </div>
              )}

            <div className="message-bubble">
              <p>{msg.content}</p>
            </div>

            <div className="message-meta">
              {formatTime(msg.createdAt)}
            </div>
          </div>
        ))
      ) : (
        <div className="empty-chat">
          <div className="empty-chat-icon">💬</div>
          <h3>Welcome to Chatify</h3>
          <p>
            Search for users to start a private chat
            <br />
            or create a group to chat with multiple people
          </p>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>

    {selectedChat && (
      <form
        className="message-input-form"
        onSubmit={sendMessage}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          autoComplete="off"
        />

        <button type="submit">Send</button>
      </form>
    )}
  </div>

  {/* Modals */}
  {showGroupModal && <CreateGroupModal />}

  {showGroupInfo && selectedChat?.isGroupChat && (
    <GroupInfoModal />
  )}
</div>


);
};

export default ChatPage;
