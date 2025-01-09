import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  orderBy,
  query
} from "firebase/firestore";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Build the query to order by clicks descending
        const q = query(
          collection(db, "link_tracking"),
          orderBy("clicks", "desc")
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Username/RefID</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((item) => (
            <tr key={item.id}>
              <td>{item.username}</td>
              <td>{item.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
