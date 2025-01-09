import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "./firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

// Import your Hero component
import Hero from "./Hero";

export default function HeroRedirectPage() {
  const [searchParams] = useSearchParams();
  const referralId = searchParams.get("ref");

  useEffect(() => {
    const recordClickAndRedirect = async () => {
      console.log("recordClickAndRedirect called");
      if (referralId) {
        console.log(`Referral ID: ${referralId}`);
        const docRef = doc(db, "link_tracking", referralId);

        try {
          console.log("Fetching document...");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log("Document exists. Updating...");
            await updateDoc(docRef, {
              clicks: increment(1),
              clickTimestamps: arrayUnion(new Date()), // Use client-side timestamp for testing
              // clickTimestamps: arrayUnion(serverTimestamp()), // Reintroduce later
            });
            console.log("Document updated.");
          } else {
            console.log("Document does not exist. Creating...");
            await setDoc(docRef, {
              username: referralId,
              clicks: 1,
              clickTimestamps: [new Date()], // Use client-side timestamp for testing
              // clickTimestamps: [serverTimestamp()], // Reintroduce later
              createdAt: serverTimestamp(),
            });
            console.log("Document created.");
          }
        } catch (error) {
          console.error("Error updating doc:", error);
        }
      }

      // Redirect to the app store (always redirect, even if no ref)
      console.log("Redirecting to App Store...");
      window.location.href =
        "https://apps.apple.com/us/app/hive-spelling-bee-prep-app/id6479415050";
    };

    recordClickAndRedirect();

    // 2. After 3 seconds, redirect to App Store
    const redirectTimer = setTimeout(() => {
      console.log("Timeout redirecting to App Store...");
      window.location.href =
        "https://apps.apple.com/us/app/hive-spelling-bee-prep-app/id6479415050";
    }, 3000); // 3000ms = 3 seconds, adjust as needed

    // Cleanup if the component unmounts before time ends
    return () => clearTimeout(redirectTimer);
  }, [referralId]);

  // 3. Show your Hero component in the meantime
  return (
    <div>
      <Hero />
    </div>
  );
}
