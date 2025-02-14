// src/Tools.jsx
import React, { useState, useEffect } from 'react';
import {
  FaToolbox,
  FaChartBar,
  FaCog,
  FaHeart,
  FaInfoCircle,
  FaQuestionCircle,
  FaSearch,
  FaUser,
} from 'react-icons/fa';

// Import your actual component if available
import WordManagement from "./WordManagement.jsx";

// Import Firestore functions and your db instance
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  doc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig'; // Adjust the path as needed

// -------------------------------------------------------------------
// Dummy Components for Other Tools
const SectionManagement = () => (
  <div className="tools-content bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl text-white mb-4">Section Management</h2>
    <p className="text-gray-300">Section management tool coming soon!</p>
  </div>
);
const OnboardingControl = () => (
  <div className="tools-content bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl text-white mb-4">Onboarding Control</h2>
    <p className="text-gray-300">Onboarding control tool coming soon!</p>
  </div>
);
const FeedbackCenter = () => (
  <div className="tools-content bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl text-white mb-4">Feedback Center</h2>
    <p className="text-gray-300">Feedback center tool coming soon!</p>
  </div>
);
const NotificationCenter = () => (
  <div className="tools-content bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl text-white mb-4">Notification Center</h2>
    <p className="text-gray-300">Notification center tool coming soon!</p>
  </div>
);
const HelpSupport = () => (
  <div className="tools-content bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl text-white mb-4">Help & Support</h2>
    <p className="text-gray-300">Help and support tool coming soon!</p>
  </div>
);
const SearchTool = () => (
  <div className="tools-content bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl text-white mb-4">Search</h2>
    <p className="text-gray-300">Search tool coming soon!</p>
  </div>
);
const ProfileTool = () => (
  <div className="tools-content bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl text-white mb-4">Profile</h2>
    <p className="text-gray-300">Profile tool coming soon!</p>
  </div>
);

// -------------------------------------------------------------------
// sendEmailService: Calls the backend SMTP endpoint
const sendEmailService = async (emailDraftData) => {
  console.log("Attempting to send email with data:", emailDraftData);
  try {
    // Use your production URL – assuming your site is hosted at https://www.hivespelling.com,
    // the rewrite makes /send-email available.
    const response = await fetch("https://www.hivespelling.com/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: emailDraftData.subject,
        body: emailDraftData.body,
        recipient: emailDraftData.recipient,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("❌ Error sending email:", data.error);
      throw new Error(data.error || "Error sending email");
    }
    console.log("✅ Email sent successfully:", data.info);
    return data;
  } catch (error) {
    console.error("❌ Exception while sending email:", error);
    throw error;
  }
};

// -------------------------------------------------------------------
// EmailDraftForm: Form to create, preview, save, and send an email draft
const EmailDraftForm = ({ onClose }) => {
  const [emailName, setEmailName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  // New filter types: 'userTier', 'createdAt', and 'manual'
  const [receiverFilterType, setReceiverFilterType] = useState('userTier');
  const [receiverUserTier, setReceiverUserTier] = useState('');
  const [receiverStartDate, setReceiverStartDate] = useState('');
  const [receiverEndDate, setReceiverEndDate] = useState('');
  // For manual input of comma-separated emails
  const [manualEmails, setManualEmails] = useState('');
  const [draftId, setDraftId] = useState(null);
  const [saving, setSaving] = useState(false);
  // State to hold the recipient list (each object: id, fullname, email, role, createdAt)
  const [recipientList, setRecipientList] = useState([]);

  // Fetch recipients whenever filter criteria change
  useEffect(() => {
    const fetchRecipients = async () => {
      let recipients = [];
      if (receiverFilterType === 'userTier' && receiverUserTier.trim() !== '') {
        // Query "users" collection by role
        const userQuery = query(
          collection(db, "users"),
          where("role", "==", receiverUserTier)
        );
        const userSnapshot = await getDocs(userQuery);
        // For each user, look up the corresponding createdAt from the "usernames" collection
        const promises = userSnapshot.docs.map(async (doc) => {
          const data = doc.data();
          let createdAtStr = "N/A";
          if (data.username) {
            const usernameQuery = query(
              collection(db, "usernames"),
              where("username", "==", data.username)
            );
            const usernameSnapshot = await getDocs(usernameQuery);
            usernameSnapshot.forEach(uDoc => {
              const uData = uDoc.data();
              if (uData.createdAt) {
                createdAtStr = new Date(uData.createdAt.seconds * 1000).toLocaleDateString();
              }
            });
          }
          return {
            id: doc.id,
            fullname: data.fullname,
            email: data.email,
            role: data.role,
            createdAt: createdAtStr,
          };
        });
        recipients = await Promise.all(promises);
      } else if (
        receiverFilterType === 'createdAt' &&
        receiverStartDate &&
        receiverEndDate
      ) {
        const startDate = new Date(receiverStartDate);
        const endDate = new Date(receiverEndDate);
        endDate.setHours(23, 59, 59, 999);
        // Query "usernames" collection for documents with createdAt in range
        const usernamesQuery = query(
          collection(db, "usernames"),
          where("createdAt", ">=", Timestamp.fromDate(startDate)),
          where("createdAt", "<=", Timestamp.fromDate(endDate))
        );
        const usernamesSnapshot = await getDocs(usernamesQuery);
        const usernames = [];
        usernamesSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.username) {
            usernames.push(data.username);
          }
        });
        // Build mapping from username to createdAt
        const usernameCreatedAtMap = {};
        usernamesSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.username && data.createdAt) {
            usernameCreatedAtMap[data.username] = new Date(data.createdAt.seconds * 1000).toLocaleDateString();
          }
        });
        // For each username, query "users" collection to get full details
        for (const uname of usernames) {
          const userQuery = query(
            collection(db, "users"),
            where("username", "==", uname)
          );
          const userSnapshot = await getDocs(userQuery);
          userSnapshot.forEach(doc => {
            const data = doc.data();
            recipients.push({
              id: doc.id,
              fullname: data.fullname,
              email: data.email,
              role: data.role,
              createdAt: usernameCreatedAtMap[data.username] || "N/A",
            });
          });
        }
      } else if (receiverFilterType === 'manual') {
        // Split the manualEmails string by commas, trim, and build objects
        if (manualEmails.trim() !== '') {
          const emails = manualEmails.split(',').map(e => e.trim()).filter(e => e !== '');
          recipients = emails.map((email, index) => ({
            id: `manual-${index}`,
            fullname: "N/A",
            email,
            role: "Manual",
            createdAt: "N/A",
          }));
        }
      }
      setRecipientList(recipients);
    };

    if (
      (receiverFilterType === 'userTier' && receiverUserTier.trim() !== '') ||
      (receiverFilterType === 'createdAt' && receiverStartDate && receiverEndDate) ||
      (receiverFilterType === 'manual')
    ) {
      fetchRecipients();
    } else {
      setRecipientList([]);
    }
  }, [receiverFilterType, receiverUserTier, receiverStartDate, receiverEndDate, manualEmails]);

  // Save draft to Firestore
  const saveDraft = async () => {
    setSaving(true);
    try {
      const receivers =
        receiverFilterType === 'userTier'
          ? { type: 'userTier', value: receiverUserTier }
          : receiverFilterType === 'createdAt'
          ? { type: 'createdAt', start: receiverStartDate, end: receiverEndDate }
          : { type: 'manual', value: manualEmails };

      const draftData = {
        emailName,
        subject,
        body,
        receivers,
        emailStatus: 'draft',
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'emails'), draftData);
      setDraftId(docRef.id);
      console.log("Draft saved with ID:", docRef.id);
      alert('Draft saved successfully!');
    } catch (error) {
      console.error("Error saving draft:", error);
      alert('Error saving draft');
    }
    setSaving(false);
  };

  // Send email individually to each recipient in the recipient list
  const sendEmail = async () => {
    if (!draftId) {
      await saveDraft();
    }
    try {
      if (recipientList.length === 0) {
        alert("No recipients available to send email to.");
        return;
      }
      // Send email separately for each recipient
      const sendPromises = recipientList.map((r) => {
        const emailDraftData = { emailName, subject, body, recipient: r.email };
        console.log("Sending email for draft ID:", draftId, "to", r.email);
        return sendEmailService(emailDraftData);
      });
      const results = await Promise.all(sendPromises);
      console.log("Email send results:", results);

      const recipientArray = recipientList.map(r => r.email);
      const emailDocRef = doc(db, 'emails', draftId);
      await updateDoc(emailDocRef, {
        emailStatus: 'sent',
        lastModified: serverTimestamp(),
        sentTo: recipientArray,
      });
      console.log("Email document updated to sent. Recipients tracked:", recipientArray);
      alert('Emails sent successfully!');
    } catch (error) {
      console.error("Error sending email:", error);
      alert('Error sending email. Check console for details.');
    }
  };

  // Remove a recipient from the recipient list
  const removeRecipient = (id) => {
    setRecipientList(recipientList.filter(r => r.id !== id));
  };

  return (
    <div className="mt-6 bg-[#2a2a2a] p-4 rounded-lg shadow-lg">
      <h3 className="text-xl text-white mb-4">Create Email Draft</h3>
      <div className="mb-4">
        <label className="text-white block mb-1">Email Name:</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={emailName}
          onChange={(e) => setEmailName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="text-white block mb-1">Subject:</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="text-white block mb-1">Body:</label>
        <textarea
          className="w-full p-2 rounded bg-gray-800 text-white"
          rows="5"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="text-white block mb-1">Receiver Filter Type:</label>
        <select
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={receiverFilterType}
          onChange={(e) => setReceiverFilterType(e.target.value)}
        >
          <option value="userTier">User Tier</option>
          <option value="createdAt">Creation Date</option>
          <option value="manual">Manual Input</option>
        </select>
      </div>
      {receiverFilterType === 'userTier' && (
        <div className="mb-4">
          <label className="text-white block mb-1">User Tier:</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={receiverUserTier}
            onChange={(e) => setReceiverUserTier(e.target.value)}
          />
        </div>
      )}
      {receiverFilterType === 'createdAt' && (
        <div className="mb-4">
          <label className="text-white block mb-1">Start Date:</label>
          <input
            type="date"
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={receiverStartDate}
            onChange={(e) => setReceiverStartDate(e.target.value)}
          />
          <label className="text-white block mb-1 mt-2">End Date:</label>
          <input
            type="date"
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={receiverEndDate}
            onChange={(e) => setReceiverEndDate(e.target.value)}
          />
        </div>
      )}
      {receiverFilterType === 'manual' && (
        <div className="mb-4">
          <label className="text-white block mb-1">Manual Emails (comma-separated):</label>
          <textarea
            className="w-full p-2 rounded bg-gray-800 text-white"
            rows="2"
            value={manualEmails}
            onChange={(e) => setManualEmails(e.target.value)}
            placeholder="example1@domain.com, example2@domain.com"
          ></textarea>
        </div>
      )}

      {/* Recipient Preview Table */}
      {recipientList.length > 0 && (
        <div className="mb-4">
          <h4 className="text-white mb-2">Recipients:</h4>
          <table className="min-w-full bg-gray-800 text-white mb-2">
            <thead>
              <tr>
                <th className="py-1 px-2 border">Name</th>
                <th className="py-1 px-2 border">Email</th>
                <th className="py-1 px-2 border">Role</th>
                <th className="py-1 px-2 border">Created At</th>
                <th className="py-1 px-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {recipientList.map((r) => (
                <tr key={r.id}>
                  <td className="py-1 px-2 border">{r.fullname}</td>
                  <td className="py-1 px-2 border">{r.email}</td>
                  <td className="py-1 px-2 border">{r.role}</td>
                  <td className="py-1 px-2 border">{r.createdAt}</td>
                  <td className="py-1 px-2 border">
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                      onClick={() => removeRecipient(r.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          onClick={saveDraft}
          disabled={saving}
        >
          Save Draft
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          onClick={sendEmail}
          disabled={saving}
        >
          Send Email
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const Emails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showDraftForm, setShowDraftForm] = useState(false);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usernamesSnapshot = await getDocs(collection(db, "usernames"));
        const usernamesMap = {};
        usernamesSnapshot.forEach(doc => {
          const data = doc.data();
          usernamesMap[data.username] = data;
        });
        const combinedData = [];
        usersSnapshot.forEach(doc => {
          const userData = doc.data();
          const createdAt = usernamesMap[userData.username]?.createdAt || null;
          combinedData.push({ ...userData, createdAt });
        });
        combinedData.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return b.createdAt.seconds - a.createdAt.seconds;
        });
        setUsers(combinedData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersData();
  }, []);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];
    if (sortColumn === "createdAt") {
      aVal = aVal ? aVal.seconds : 0;
      bVal = bVal ? bVal.seconds : 0;
    } else {
      aVal = aVal ? aVal.toString().toLowerCase() : "";
      bVal = bVal ? bVal.toString().toLowerCase() : "";
    }
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="tools-content bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl text-white mb-4">Email Tools</h2>
      <p className="text-gray-300 mb-4">
        Below are the current users in our app. (Click a header to sort; an arrow indicates the active sort.)
      </p>
      {loading ? (
        <p className="text-gray-300">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#1a1a1a] text-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-700">
                  <button onClick={() => handleSort("fullname")} className="flex items-center">
                    Full Name {sortColumn === "fullname" && (sortDirection === "asc" ? "▲" : "▼")}
                  </button>
                </th>
                <th className="py-2 px-4 border-b border-gray-700">
                  <button onClick={() => handleSort("username")} className="flex items-center">
                    Username {sortColumn === "username" && (sortDirection === "asc" ? "▲" : "▼")}
                  </button>
                </th>
                <th className="py-2 px-4 border-b border-gray-700">
                  <button onClick={() => handleSort("email")} className="flex items-center">
                    Email {sortColumn === "email" && (sortDirection === "asc" ? "▲" : "▼")}
                  </button>
                </th>
                <th className="py-2 px-4 border-b border-gray-700">
                  <button onClick={() => handleSort("createdAt")} className="flex items-center">
                    Created At {sortColumn === "createdAt" && (sortDirection === "asc" ? "▲" : "▼")}
                  </button>
                </th>
                <th className="py-2 px-4 border-b border-gray-700">
                  <button onClick={() => handleSort("role")} className="flex items-center">
                    Role {sortColumn === "role" && (sortDirection === "asc" ? "▲" : "▼")}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map(user => (
                <tr key={user.id}>
                  <td className="py-2 px-4 border-b border-gray-700">{user.fullname}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{user.username}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{user.email}</td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-6">
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
          onClick={() => setShowDraftForm(!showDraftForm)}
        >
          {showDraftForm ? "Hide Email Draft" : "Create Email Draft"}
        </button>
      </div>
      {showDraftForm && <EmailDraftForm onClose={() => setShowDraftForm(false)} />}
    </div>
  );
};

const Tools = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const toolsList = [
    { id: 1, name: 'Word Management', icon: <FaChartBar /> },
    { id: 2, name: 'Section Management', icon: <FaUser /> },
    { id: 3, name: 'Onboarding Control', icon: <FaCog /> },
    { id: 4, name: 'Feedback Center', icon: <FaHeart /> },
    { id: 5, name: 'Notification Center', icon: <FaInfoCircle /> },
    { id: 6, name: 'Help & Support', icon: <FaQuestionCircle /> },
    { id: 7, name: 'Search', icon: <FaSearch /> },
    { id: 8, name: 'Profile', icon: <FaToolbox /> },
    { id: 9, name: 'Emails', icon: <FaToolbox /> },
  ];

  const renderTool = () => {
    switch (selectedTool) {
      case 1:
        return <WordManagement />;
      case 2:
        return <SectionManagement />;
      case 3:
        return <OnboardingControl />;
      case 4:
        return <FeedbackCenter />;
      case 5:
        return <NotificationCenter />;
      case 6:
        return <HelpSupport />;
      case 7:
        return <SearchTool />;
      case 8:
        return <ProfileTool />;
      case 9:
        return <Emails />;
      default:
        return (
          <div className="tools-content bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl text-white mb-4">Welcome to Tools</h2>
            <p className="text-gray-300">
              Select a tool from the left to get started.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <div className="left-section w-1/3 overflow-y-auto h-full p-4 bg-[#1a1a1a]">
        {toolsList.map((tool) => (
          <div
            key={tool.id}
            className={`bg-[#202020] p-6 rounded-lg mb-4 shadow-lg border border-gray-950 cursor-pointer flex items-center ${
              selectedTool === tool.id
                ? 'brightness-150'
                : 'brightness-100 hover:brightness-125'
            }`}
            style={{ transition: '0.3s ease' }}
            onClick={() => setSelectedTool(tool.id)}
          >
            <div className="text-white text-2xl mr-6">{tool.icon}</div>
            <h2 className="text-xl text-white font-bold">{tool.name}</h2>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="right-section w-2/3 p-4 rounded-lg ml-4 h-full overflow-y-auto bg-[#1a1a1a]">
        {renderTool()}
      </div>
    </div>
  );
};

export default Tools;
