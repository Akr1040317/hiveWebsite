// LeaderboardPage.jsx

import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { isToday, isThisWeek } from "date-fns";
import styled from "styled-components";

// Styled Components
const LeaderboardContainer = styled.div`
  background-color: #000;
  min-height: 100vh;
  color: #fff;
  padding: 20px;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const ToggleButton = styled.button`
  background-color: ${(props) => (props.active ? "#4CAF50" : "#333")};
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #555;
  }
`;

const ChartWrapper = styled.div`
  width: 90%;
  max-width: 1000px;
  height: 500px;
`;

const TooltipStyle = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
`;

// Define 10 unique gradient colors
const gradients = [
  { id: "gradient0", startColor: "#82ca9d", endColor: "#8884d8" }, // Green to Purple
  { id: "gradient1", startColor: "#FF0000", endColor: "#FFFF00" }, // Red to Yellow
  { id: "gradient2", startColor: "#FF7F50", endColor: "#1E90FF" }, // Coral to Dodger Blue
  { id: "gradient3", startColor: "#DA70D6", endColor: "#32CD32" }, // Orchid to Lime Green
  { id: "gradient4", startColor: "#FFA500", endColor: "#00CED1" }, // Orange to Dark Turquoise
  { id: "gradient5", startColor: "#FF69B4", endColor: "#8A2BE2" }, // Hot Pink to Blue Violet
  { id: "gradient6", startColor: "#00FF7F", endColor: "#FF4500" }, // Spring Green to Orange Red
  { id: "gradient7", startColor: "#7B68EE", endColor: "#FF1493" }, // Medium Slate Blue to Deep Pink
  { id: "gradient8", startColor: "#00BFFF", endColor: "#FFD700" }, // Deep Sky Blue to Gold
  { id: "gradient9", startColor: "#ADFF2F", endColor: "#DC143C" }, // Green Yellow to Crimson
];

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [view, setView] = useState("Today"); // "Today" or "This Week"
  const [loading, setLoading] = useState(true);
  const [yAxisMax, setYAxisMax] = useState(100); // Default value

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch all documents from link_tracking collection
        const q = query(
          collection(db, "link_tracking"),
          orderBy("clicks", "desc")
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Process data based on the current view
        const processedData = data.map((item) => {
          const { username, clickTimestamps } = item;
          let count = 0;

          if (clickTimestamps && Array.isArray(clickTimestamps)) {
            count = clickTimestamps.filter((timestamp) => {
              const date = timestamp.toDate(); // Firestore Timestamp to JS Date

              if (view === "Today") {
                return isToday(date);
              } else if (view === "This Week") {
                return isThisWeek(date, { weekStartsOn: 0 }); // Sunday as start of the week
              }

              return false;
            }).length;
          }

          return {
            username: username || item.id, // Fallback to ID if username is missing
            clicks: count, // Number of clicks in the selected view
          };
        });

        // Sort the processed data by clicks descending
        const sortedData = processedData.sort((a, b) => b.clicks - a.clicks);

        // Determine the maximum number of clicks to set Y-axis domain
        const maxClicks = sortedData.length > 0 ? sortedData[0].clicks : 0;
        setYAxisMax(maxClicks * 5 > 0 ? maxClicks * 5 : 100); // Ensure a minimum value

        setLeaderboard(sortedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [view]);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <TooltipStyle>
          <p>{`${label} : ${payload[0].value} Clicks`}</p>
        </TooltipStyle>
      );
    }

    return null;
  };

  return (
    <LeaderboardContainer>
      <h2 style={{ textAlign: "center", paddingBottom: 20, fontSize:30 }}>Leaderboard</h2>
      
        <h1 style={{ textAlign: "center", paddingInline: 300, fontSize:20 }}>
          Welcome to the leaderboard challenge! 🎉 I've given each of you
          a customized link, and when someone clicks on your link, it counts as
          a hit. The top two people with the most hits will win a gift card! 🎁 The deadline 
          for this challenge is January 31, abt 3 weeks from now. 
        </h1>
        <h1 style={{ textAlign: "center", paddingBottom:30, paddingTop: 30, paddingInline: 300, fontSize:20}}>
          This is just a fun way for me to market my app and see how many people
          are engaging with the website. 🚀 Only one rule: <strong>no cheating</strong>! 
          Good luck! P.S. Me & my brother cannot win.😊
        </h1>
      <ToggleContainer>
        <ToggleButton
          active={view === "Today"}
          onClick={() => setView("Today")}
        >
          Today
        </ToggleButton>
        <ToggleButton
          active={view === "This Week"}
          onClick={() => setView("This Week")}
        >
          This Week
        </ToggleButton>
      </ToggleContainer>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : leaderboard.length === 0 ? (
        <p style={{ textAlign: "center" }}>No data available.</p>
      ) : (
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={leaderboard}
              margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
            >
              {/* Define gradients */}
              <defs>
                {gradients.map((gradient) => (
                  <linearGradient
                    key={gradient.id}
                    id={gradient.id}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={gradient.startColor}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={gradient.endColor}
                      stopOpacity={0.8}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="username"
                angle={-45}
                textAnchor="end"
                interval={0}
                stroke="#fff"
                height={100}
              />
              <YAxis
                stroke="#fff"
                domain={[0, yAxisMax]}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="clicks"
                animationDuration={1500}
                barSize={30} // Adjust bar thickness
                barGap={15}  // Space between bars
              >
                {leaderboard.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#${gradients[index % gradients.length].id})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}
    </LeaderboardContainer>
  );
}
