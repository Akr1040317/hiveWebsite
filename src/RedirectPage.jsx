import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

export default function RedirectPage() {
  const [searchParams] = useSearchParams();
  const referralId = searchParams.get("ref");

  useEffect(() => {
    const recordClickAndRedirect = async () => {
      if (referralId) {
        const docRef = doc(db, "link_tracking", referralId);

        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // If doc exists, increment the click count
            await updateDoc(docRef, {
              clicks: increment(1),
            });
          } else {
            // If doc doesn’t exist, create it
            await setDoc(docRef, {
              username: referralId, // or store something more descriptive if you’d like
              clicks: 1,
            });
          }
        } catch (error) {
          console.error("Error updating doc:", error);
        }
      }

      // Redirect to the app store (always redirect, even if no ref)
      window.location.href =
        "https://apps.apple.com/us/app/hive-spelling-bee-prep-app/id6479415050";
    };

    recordClickAndRedirect();
  }, [referralId]);

  return <div>Redirecting…</div>;
}
