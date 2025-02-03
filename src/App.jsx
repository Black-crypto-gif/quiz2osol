import { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut, db, collection, addDoc, query, orderBy, limit, onSnapshot } from "./firebase";
import Quiz from "./Quiz";
import Leaderboard from "./Leaderboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  // Check if the user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch leaderboard data
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(3));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const scores = snapshot.docs.map((doc) => doc.data());
        setLeaderboard(scores);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Check if the user exists in Firestore
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
  
      let fullName = "";
      if (querySnapshot.empty) {
        // Prompt user to enter full name
        fullName = prompt("يرجى إدخال اسمك الكامل (الاسم واللقب):");
        await addDoc(userRef, {
          email: user.email,
          fullName: fullName,
        });
      } else {
        fullName = querySnapshot.docs[0].data().fullName;
      }
  
      setUser({ ...user, fullName });
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setQuizStarted(false);
      setScore(0);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const saveScore = async (score) => {
    if (user) {
      await addDoc(collection(db, "scores"), {
        name: user.displayName,
        score: score,
        timestamp: new Date(),
      });
    }
  };

  return (
    <div className="app">
      <h1>موقع خاص بالامتحانات الحلقة الأسبوعية</h1>
      <p className="description">
      منصة تعليمية مخصصة للمشاركين في الحلقة الأسبوعية، حيث يمكنهم اختبار مدى استفادتهم وتعزيز مهاراتهم من خلال اختبارات شيقة ومفيدة.
      </p>
      <p className="description">
      الكتاب: شرح ثلاثة الأصول المؤلف: محمد بن صالح بن محمد العثيمين (ت ١٤٢١هـ)
      </p>
    
      {!user ? (
        <button className="google-login" onClick={handleLogin}>
          <img src="https://img.icons8.com/fluency/48/google-logo.png" alt="Google Logo" />
          تسجيل الدخول باستخدام جوجل
        </button>
      ) : (
        <div>
          <p>مرحبًا، {user.displayName}</p>
          <button onClick={handleLogout}>تسجيل الخروج</button>
          {!quizStarted ? (
            <button onClick={() => setQuizStarted(true)}>ابدأ المسابقة</button>
          ) : (
            <Quiz setScore={setScore} setQuizStarted={setQuizStarted} saveScore={saveScore} />
          )}
          <Leaderboard leaderboard={leaderboard} />
        </div>
      )}
      <footer className="footer">
        تم إنشاء هذا الموقع لغرض نشر الفائدة وليس لغرض نفعي <br /><span className="dev-name">Blackthunder المطور </span>
      </footer>
    </div>
  );
}

export default App;
