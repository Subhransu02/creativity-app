import React, { useState, useEffect } from "react";
import { firestore, auth } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Chart from "chart.js/auto";

const statements = [
  { id: 1, text: "I dislike unfamiliar situations.", category: "AA" },
  {
    id: 2,
    text: "There is a great danger in giving up our old customs and traditions.",
    category: "C",
  },
  {
    id: 3,
    text: "I can predict the behavior of a person if I know his social background.",
    category: "R",
  },
  {
    id: 4,
    text: "I prefer to give up when I hear that a task is too difficult.",
    category: "FF",
  },
  {
    id: 5,
    text: "You can't be called mature unless you really control your emotions.",
    category: "SS",
  },
  {
    id: 6,
    text: "I don't think I have very distinctive skills outside my area of specialization.",
    category: "RM",
  },
  {
    id: 7,
    text: "I like to make friends mostly with those that appreciate me.",
    category: "T",
  },
  {
    id: 8,
    text: "I resist expressing tenderness towards others.",
    category: "SS",
  },
  {
    id: 9,
    text: "If you don't plan your holidays in detail, you just end up wasting time and money.",
    category: "AA",
  },
  {
    id: 10,
    text: "Parents know best that occupations their children should pursue.",
    category: "C",
  },
  {
    id: 11,
    text: "You can make out what people are like by noticing the way they dress.",
    category: "R",
  },
  {
    id: 12,
    text: "I don't plan to compete with strong opponents.",
    category: "FF",
  },
  { id: 13, text: "I rather dislike sad movies.", category: "SS" },
  {
    id: 14,
    text: "At work or studies I generally don't share problems with colleagues and seek their guidance.",
    category: "RM",
  },
  {
    id: 15,
    text: "I really dislike any criticism leveled against me.",
    category: "T",
  },
  {
    id: 16,
    text: "I have very little interest in flower arrangements and the like..",
    category: "SS",
  },
  {
    id: 17,
    text: "I prefer a boss who tells precisely what I am supposed to do",
    category: "AA",
  },
  {
    id: 18,
    text: "Women should not dress like men and vice-versa.",
    category: "C",
  },
  {
    id: 19,
    text: "I am more comfortable after I have classified a person.",
    category: "R",
  },
  { id: 20, text: "I dislike being compared to others.", category: "FF" },
  {
    id: 21,
    text: "No matter what choice of food I have in a restaurant, I tend to order the same favorites.",
    category: "SS",
  },
  {
    id: 22,
    text: "I don't think India has the resources to catch up with the west.",
    category: "RM",
  },
  {
    id: 23,
    text: "I dislike juniors trying to be familiar with me.",
    category: "T",
  },
  {
    id: 24,
    text: "Giving in to the pleasures of the body detracts from high thinking.",
    category: "SS",
  },
  {
    id: 25,
    text: "I can't stand meetings without a clear prior agenda.",
    category: "AA",
  },
  {
    id: 26,
    text: "Premarital physical relationship is wrong because it is considered immoral in our society.",
    category: "C",
  },
  {
    id: 27,
    text: "Necessities must always have priority over artistic matter.",
    category: "R",
  },
  { id: 28, text: "I hate to lose at games.", category: "FF" },
  {
    id: 29,
    text: "I have never bothered myself with modern art.",
    category: "SS",
  },
  {
    id: 30,
    text: "I don't think I can do well in a job or occupation very different from my present one.",
    category: "RM",
  },
  {
    id: 31,
    text: "I feel tense communicating with persons who have greater authority than I.",
    category: "T",
  },
  {
    id: 32,
    text: "I can't be bothered with questions such as 'What would happen if birds had brains like humans and humans had wings like birds'.",
    category: "SS",
  },
  { id: 33, text: "I hate confusion.", category: "AA" },
  {
    id: 34,
    text: "One must fulfill one's social obligation at any cost.",
    category: "C",
  },
  {
    id: 35,
    text: "People in the same profession have similar personalities.",
    category: "R",
  },
  {
    id: 36,
    text: "In a meeting I don't speak up unless I am an expert on a point.",
    category: "FF",
  },
  {
    id: 37,
    text: "A pound of imagination is not worth an ounce of facts.",
    category: "SS",
  },
  {
    id: 38,
    text: "One can accomplish little without the support of the authorities.",
    category: "RM",
  },
  {
    id: 39,
    text: "I don't like being contradicted in the presence of others.",
    category: "T",
  },
  {
    id: 40,
    text: "I don't like to go to serious plays or movies.",
    category: "SS",
  },
];

const App = () => {
  const [scores, setScores] = useState({});
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [totalF, setTotalF] = useState(0);
  const [totalD, setTotalD] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (id, value) => {
    setScores((prevScores) => ({ ...prevScores, [id]: parseInt(value) }));
  };

  const calculateScores = () => {
    let categoryScores = {
      AA: [],
      C: [],
      FF: [],
      T: [],
      RM: [],
      R: [],
      SS: [],
    };

    let detailedResults = [];

    statements.forEach((statement) => {
      const score = scores[statement.id] || 0;
      categoryScores[statement.category].push({ id: statement.id, score });
    });

    let categoryAverages = {};
    let totalF = 0;
    let totalD = 0;

    for (const category in categoryScores) {
      const scoresArray = categoryScores[category];
      const total = scoresArray.reduce((acc, val) => acc + val.score, 0);
      const average = total / scoresArray.length;
      const correctionscore = average - 1;
      const correctedAverage = (correctionscore * 20).toFixed(2);
      categoryAverages[category] = parseFloat(correctedAverage);

      if (["AA", "C", "FF", "T"].includes(category)) {
        totalF += categoryAverages[category];
      } else {
        totalD += categoryAverages[category];
      }

      detailedResults.push({
        category,
        id: scoresArray.map((item) => item.id).join(", "),
        score: scoresArray.map((item) => item.score).join(", "),
        step: ` Total: ${total}, Average (Total/${
          scoresArray.length
        }): ${average.toFixed(
          2
        )}, Correction Score (-1): ${correctionscore.toFixed(
          2
        )} ,Percentage Score (Correction Score x 20): ${correctedAverage}%`,
      });
    }

    totalF /= 4;
    totalD /= 3;

    const overallScore = ((totalF + totalD) / 2).toFixed(2);

    setTotalF(totalF);
    setTotalD(totalD);
    setOverallScore(overallScore);
    setResults(detailedResults);
  };

  const saveScores = async () => {
    if (!user) {
      alert("You must be logged in to save scores.");
      return;
    }
    try {
      const userScoresRef = collection(firestore, "users", user.uid, "scores");
      await addDoc(userScoresRef, {
        scores: Object.keys(scores).map((id) => ({
          statementId: parseInt(id),
          score: scores[id],
        })),
        timestamp: new Date(),
      });
      alert("Scores saved successfully!");
    } catch (error) {
      console.error("Error saving scores:", error);
      alert("Failed to save scores.");
    }
  };

  useEffect(() => {
    // Create and update the pie chart when results change
    const ctx = document.getElementById("pie-chart");
    let chartInstance = null;

    if (ctx) {
      // Check if there is an existing chart instance and destroy it
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Create a new Chart.js instance
      chartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Overall Score", "Remaining"],
          datasets: [
            {
              label: "Percentage",
              data: [overallScore, 100 - overallScore],
              backgroundColor: ["#FFD700", "#E5E5E5"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }

    // Clean up the chart instance when component unmounts
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [overallScore]);

  return (
    <div className="App">
      <h1>Blocks to Creativity - Scoring & Measurement</h1>
      <div className="form-container">
        <form
          id="creativityForm"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <table>
            <thead>
              <tr>
                <th>Item No.</th>
                <th>Statement</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody id="statementsTable">
              {statements.map((statement) => (
                <tr key={statement.id}>
                  <td>{statement.id}</td>
                  <td>{statement.text}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={scores[statement.id] || ""}
                      onChange={(e) =>
                        handleChange(statement.id, e.target.value)
                      }
                      required
                      style={{
                        backgroundColor: "#f2f2f2",
                        border: "1px solid #ccc",
                        padding: "8px",
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "20px" }}>
            <button
              type="button"
              onClick={calculateScores}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                margin: "10px 5px",
              }}
            >
              Calculate Scores
            </button>
            <button
              type="button"
              onClick={saveScores}
              style={{
                backgroundColor: "#008CBA",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                margin: "10px 5px",
              }}
            >
              Save Scores
            </button>
          </div>
        </form>
        <div id="results" className="results-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>User Email</th>
                <th>Category</th>
                <th>ID No.</th>
                <th>Score</th>
                <th>Steps of Calculation</th>
              </tr>
            </thead>
            <tbody>
              {user && (
                <tr>
                  <td rowSpan={results.length + 1}>{user.email}</td>
                </tr>
              )}
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.category}</td>
                  <td>{result.id}</td>
                  <td>{result.score}</td>
                  <td>{result.step}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="6">
                  <strong>Total of F (AA + C + FF + T)/4:</strong>{" "}
                  {totalF.toFixed(2)} |{" "}
                  <strong>Total of D (RM + R + SS)/3:</strong>{" "}
                  {totalD.toFixed(2)} |{" "}
                  <strong>[Total of (F) + Total of (D)]/2:</strong>{" "}
                  {overallScore}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="circle-container">
          <div
            className="circle"
            style={{
              "--percentage": overallScore,
              "--percentage-color": "black",
            }}
          >
            <div className="percentage">
              <span>{overallScore}%</span>
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default App;
