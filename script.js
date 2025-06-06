

// let quizData = [];
// let currentQuestionIndex = 0;
// let score = 0;

// async function solveDoubt() {
//   const topic = document.getElementById("topicSelect").value;
//   const responseBox = document.getElementById("response");
//   const startQuizBtn = document.getElementById("startQuizBtn");

//   if (!topic) {
//     responseBox.innerText = "⚠️ Please select a topic.";
//     return;
//   }

//   responseBox.innerText = "⏳ Getting explanation and quiz from Gemini AI...";
//   startQuizBtn.style.display = "none";

//   try {
//     const res = await fetch("http://localhost:3001/api/getExplanationAndQuiz", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ topic })
//     });

//     const data = await res.json();
//     const reply = data.reply;

//     if (!reply) {
//       responseBox.innerText = "No explanation or quiz received.";
//       return;
//     }

//     const [explanation] = reply.split(/Q\d+\./); // crude split to extract explanation
//     responseBox.innerText = explanation.trim();

//     // Regex to extract quiz questions
//     const quizRegex = /Q\d+\.\s*(.*?)\nA\)\s*(.*?)\nB\)\s*(.*?)\nC\)\s*(.*?)\nD\)\s*(.*?)\nAnswer:\s*([A-D])/g;

//     quizData = [];
//     let match;
//     while ((match = quizRegex.exec(reply)) !== null) {
//       quizData.push({
//         question: match[1],
//         options: [match[2], match[3], match[4], match[5]],
//         answer: match[6]
//       });
//     }

//     if (quizData.length > 0) {
//       startQuizBtn.style.display = "inline-block";
//     }
//   } catch (error) {
//     responseBox.innerText = `Error: ${error.message}`;
//   }
// }

// function startQuiz() {
//   currentQuestionIndex = 0;
//   score = 0;
//   document.getElementById("quizContainer").style.display = "block";
//   document.getElementById("startQuizBtn").style.display = "none";
//   document.getElementById("scoreDisplay").innerText = "";
//   showQuestion();
// }

// function showQuestion() {
//   const questionObj = quizData[currentQuestionIndex];
//   if (!questionObj) return;

//   document.getElementById("questionText").innerText = `Q${currentQuestionIndex + 1}. ${questionObj.question}`;
//   const optionsDiv = document.getElementById("options");
//   optionsDiv.innerHTML = "";

//   questionObj.options.forEach((opt, idx) => {
//     const optionBtn = document.createElement("button");
//     optionBtn.innerText = String.fromCharCode(65 + idx) + ") " + opt;
//     optionBtn.onclick = () => checkAnswer(idx);
//     optionsDiv.appendChild(optionBtn);
//   });
// }

// function checkAnswer(selectedIndex) {
//   const questionObj = quizData[currentQuestionIndex];
//   const correctIndex = "ABCD".indexOf(questionObj.answer);
//   if (selectedIndex === correctIndex) {
//     score++;
//   }
//   nextQuestion();
// }

// function nextQuestion() {
//   currentQuestionIndex++;
//   if (currentQuestionIndex < quizData.length) {
//     showQuestion();
//   } else {
//     document.getElementById("quizContainer").style.display = "none";
//     document.getElementById("scoreDisplay").innerText = `✅ Quiz complete! Your score: ${score}/${quizData.length}`;
//   }
// }






























let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

async function solveDoubt() {
  const topic = document.getElementById("topicSelect").value;
  const responseBox = document.getElementById("response");
  const startQuizBtn = document.getElementById("startQuizBtn");

  if (!topic) {
    responseBox.innerText = "⚠️ Please select a topic.";
    return;
  }

  responseBox.innerText = "⏳ Getting explanation and quiz from Gemini AI...";
  startQuizBtn.style.display = "none";

  try {
    const res = await fetch("https://syntax-problem-solver.onrender.com/api/getExplanationAndQuiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });

    const data = await res.json();
    const reply = data.reply;
    console.log("🧠 Full Gemini Reply:", reply);

    if (!reply) {
      responseBox.innerText = "No explanation or quiz received.";
      return;
    }
console.log("📝 Extracted quizData:", quizData);

const [explanation] = reply.split(/Q\d+\./); // crude split to extract explanation
    responseBox.innerText = explanation.trim();

    // Regex to extract quiz questions
    // const quizRegex = /Q\d+\.\s*(.*?)\nA\)\s*(.*?)\nB\)\s*(.*?)\nC\)\s*(.*?)\nD\)\s*(.*?)\nAnswer:\s*([A-D])/g;

const quizRegex = /Q\d+\.\s*(.*?)\nA\.\s*(.*?)\nB\.\s*(.*?)\nC\.\s*(.*?)\nD\.\s*(.*?)\nAnswer:\s*([A-D])/g;

    quizData = [];
    let match;
    while ((match = quizRegex.exec(reply)) !== null) {
      quizData.push({
        question: match[1],
        options: [match[2], match[3], match[4], match[5]],
        answer: match[6]
      });
    }

    if (quizData.length > 0) {
  startQuizBtn.style.display = "inline-block";
  console.log("✅ Quiz is ready");
} else {
  responseBox.innerText += "\n⚠️ No quiz found. Please try another topic.";
}

  } catch (error) {
    responseBox.innerText = `Error: ${error.message}`;
  }
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];

  document.getElementById("quizContainer").style.display = "block";
  document.getElementById("startQuizBtn").style.display = "none";
  document.getElementById("scoreDisplay").innerText = "";
  showQuestion();
}

function showQuestion() {
  const questionObj = quizData[currentQuestionIndex];
  if (!questionObj) return;

  document.getElementById("questionText").innerText = `Q${currentQuestionIndex + 1}. ${questionObj.question}`;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  questionObj.options.forEach((opt, idx) => {
    const optionBtn = document.createElement("button");
    optionBtn.innerText = String.fromCharCode(65 + idx) + ") " + opt;
    optionBtn.onclick = () => checkAnswer(idx);
    optionsDiv.appendChild(optionBtn);
  });
}



function checkAnswer(selectedIndex) {
  const questionObj = quizData[currentQuestionIndex];
  const correctIndex = "ABCD".indexOf(questionObj.answer);

  const optionButtons = document.querySelectorAll("#options button");

  optionButtons.forEach((btn, idx) => {
    btn.disabled = true;

    if (idx === correctIndex) {
      btn.classList.add("correct");
    }

    if (idx === selectedIndex && selectedIndex !== correctIndex) {
      btn.classList.add("wrong");
    }
  });

  // Store the user's selected and correct answers
  userAnswers.push({
    question: questionObj.question,
    selected: String.fromCharCode(65 + selectedIndex),
    correct: questionObj.answer
  });

  if (selectedIndex === correctIndex) {
    score++;
  }

  // Show next button after 1 second delay
  setTimeout(() => {
    nextQuestion();
  }, 1000);
}



function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    showQuestion();
  } else {
    document.getElementById("quizContainer").style.display = "none";

    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.innerHTML = `✅ Quiz complete! Your score: ${score}/${quizData.length}<br/><br/>`;

    const wrongAnswers = userAnswers.filter(ans => ans.selected !== ans.correct);

if (wrongAnswers.length > 0) {
  scoreDisplay.innerHTML = `
    <div class="result-table-container">
      <h3>Quiz Complete!</h3>
      <p>You scored ${score} out of ${quizData.length}</p>
      <p>You got ${wrongAnswers.length} question(s) wrong:</p>
      <table class="result-table">
        <thead>
          <tr>
            <th>Question No.</th>
            <th>Question</th>
            <th>Your Answer</th>
            <th>Correct Answer</th>
          </tr>
        </thead>
        <tbody>
          ${wrongAnswers
            .map(
              (ans, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${ans.question}</td>
              <td>${ans.selected}</td>
              <td>${ans.correct}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
} else {
  scoreDisplay.innerHTML = `
    <div class="result-table-container">
      <h3>Quiz Complete!</h3>
      <p>You scored ${score} out of ${quizData.length}</p>
      <p>Perfect score! All answers correct.</p>
    </div>
  `;
}


  }
}
