let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

async function solveDoubt(topic) {
  const explanationBox = document.getElementById("explanation-text");
  const startQuizBtn = document.getElementById("startQuizBtn");
  if (!topic) {
    if (explanationBox) explanationBox.innerText = "⚠️ Please select a topic.";
    return;
  }
  if (explanationBox) explanationBox.innerText = "⏳ Getting explanation and quiz from Gemini AI...";
  if (startQuizBtn) startQuizBtn.style.display = "none";
  document.getElementById("quizContainer").style.display = "none";
  document.getElementById("scoreDisplay").innerHTML = "";
  // Reset quiz state
  quizData = [];
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  showFullPageLoader();
  try {
    const res = await fetch("https://syntax-problem-solver.onrender.com/api/getExplanationAndQuiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });
    const data = await res.json();
    const reply = data.reply;
    if (!reply) {
      if (explanationBox) explanationBox.innerText = "No explanation or quiz received.";
      document.getElementById("quizContainer").style.display = "none";
      hideFullPageLoader();
      return;
    }
    const [explanation] = reply.split(/Q\d+\./);
    if (explanationBox) explanationBox.innerText = explanation.trim();
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
      if (startQuizBtn) startQuizBtn.style.display = "inline-block";
    } else {
      document.getElementById("quizContainer").style.display = "none";
      if (explanationBox) explanationBox.innerText += "\n⚠️ No quiz found. Please try another topic.";
    }
  } catch (error) {
    if (explanationBox) explanationBox.innerText = `Error: ${error.message}`;
    document.getElementById("quizContainer").style.display = "none";
  } finally {
    hideFullPageLoader();
  }
}

// Show quiz only after clicking Start Quiz
window.onload = function() {
  const startQuizBtn = document.getElementById("startQuizBtn");
  if (startQuizBtn) {
    startQuizBtn.onclick = function() {
      if (quizData.length > 0) {
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        document.getElementById("scoreDisplay").innerHTML = "";
        showQuestion();
        document.getElementById("quizContainer").style.display = "block";
        startQuizBtn.style.display = "none";
      }
    };
  }
};

function showQuizLoading() {
  document.getElementById('quiz-loading').style.display = '';
  document.getElementById('question-text-span').textContent = '';
}

function hideQuizLoading() {
  document.getElementById('quiz-loading').style.display = 'none';
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
  if (!quizData || quizData.length === 0) {
    document.getElementById("quizContainer").style.display = "none";
    return;
  }
  document.getElementById("quizContainer").style.display = "block";
  const questionObj = quizData[currentQuestionIndex];
  if (!questionObj) return;
  const questionTextSpan = document.getElementById("question-text-span");
  if (questionTextSpan) questionTextSpan.textContent = `Q${currentQuestionIndex + 1}. ${questionObj.question}`;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  questionObj.options.forEach((opt, idx) => {
    const optionBtn = document.createElement("button");
    optionBtn.innerText = String.fromCharCode(65 + idx) + ") " + opt;
    optionBtn.onclick = () => checkAnswer(idx);
    optionBtn.className = "";
    optionsDiv.appendChild(optionBtn);
  });
  // Add/clear feedback area in quiz section
  let feedbackDiv = document.getElementById('quiz-feedback');
  if (!feedbackDiv) {
    feedbackDiv = document.createElement('div');
    feedbackDiv.id = 'quiz-feedback';
    feedbackDiv.style.margin = '10px 0 0 0';
    feedbackDiv.style.fontSize = '1.02rem';
    feedbackDiv.style.fontWeight = '600';
    feedbackDiv.style.minHeight = '28px';
    document.getElementById('quizContainer').appendChild(feedbackDiv);
  }
  feedbackDiv.innerHTML = '';
}

function checkAnswer(selectedIndex) {
  const questionObj = quizData[currentQuestionIndex];
  const correctIndex = "ABCD".indexOf(questionObj.answer);
  const optionButtons = document.querySelectorAll("#options button");
  optionButtons.forEach((btn, idx) => {
    btn.disabled = true;
    btn.classList.remove("selected", "correct", "wrong");
    if (idx === correctIndex) {
      btn.classList.add("correct");
    }
    if (idx === selectedIndex && selectedIndex !== correctIndex) {
      btn.classList.add("wrong");
    }
    if (idx === selectedIndex) {
      btn.classList.add("selected");
    }
  });
  userAnswers.push({
    question: questionObj.question,
    selected: String.fromCharCode(65 + selectedIndex),
    correct: questionObj.answer
  });
  let feedbackDiv = document.getElementById('quiz-feedback');
  if (!feedbackDiv) {
    feedbackDiv = document.createElement('div');
    feedbackDiv.id = 'quiz-feedback';
    feedbackDiv.style.margin = '10px 0 0 0';
    feedbackDiv.style.fontSize = '1.02rem';
    feedbackDiv.style.fontWeight = '600';
    feedbackDiv.style.minHeight = '28px';
    document.getElementById('quizContainer').appendChild(feedbackDiv);
  }
  if (selectedIndex === correctIndex) {
    score++;
    feedbackDiv.innerHTML = `<span style='color:#388e3c;'>Correct! Well done.</span>`;
  } else {
    feedbackDiv.innerHTML = `<span style='color:#b71c1c;'>Incorrect. The correct answer is <b>${questionObj.answer}</b>.</span>`;
  }
  setTimeout(() => {
    nextQuestion();
  }, 1200);
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    showQuestion();
    document.getElementById("scoreDisplay").innerHTML = "";
  } else {
    document.getElementById("quizContainer").style.display = "none";
    const scoreDisplay = document.getElementById("scoreDisplay");
    let summary = `<div style='font-size:1.08rem;font-weight:600;color:#2e7d32;'>Quiz complete!<br>Your score: ${score} / ${quizData.length}</div>`;
    if (score === quizData.length) {
      summary += `<div style='color:#388e3c;font-weight:500;'>Excellent! You got all answers correct.</div>`;
    } else if (score === 0) {
      summary += `<div style='color:#b71c1c;font-weight:500;'>Don't worry, review the explanation and try again!</div>`;
    } else {
      summary += `<div style='color:#388e3c;font-weight:500;'>Keep practicing to improve your score.</div>`;
    }
    // Add review table with questions and answers
    summary += `<div style='margin-top:18px;'><b>Review your answers:</b><br><table style='width:100%;border-collapse:collapse;font-size:0.98rem;margin-top:8px;'>
      <tr style='background:#f1f8f4;'>
        <th style='padding:4px 6px;border:1px solid #b2dfdb;'>Q#</th>
        <th style='padding:4px 6px;border:1px solid #b2dfdb;'>Question</th>
        <th style='padding:4px 6px;border:1px solid #b2dfdb;'>Your Answer</th>
        <th style='padding:4px 6px;border:1px solid #b2dfdb;'>Correct</th>
      </tr>`;
    userAnswers.forEach((ans, i) => {
      const isCorrect = ans.selected === ans.correct;
      const qText = quizData[i]?.question || '';
      summary += `<tr style='background:${isCorrect ? "#e8f5e9" : "#ffcdd2"};'>
        <td style='padding:4px 6px;border:1px solid #b2dfdb;'>${i + 1}</td>
        <td style='padding:4px 6px;border:1px solid #b2dfdb;'>${qText}</td>
        <td style='padding:4px 6px;border:1px solid #b2dfdb;color:${isCorrect ? "#388e3c" : "#b71c1c"};font-weight:600;'>${ans.selected}</td>
        <td style='padding:4px 6px;border:1px solid #b2dfdb;color:#388e3c;font-weight:600;'>${ans.correct}</td>
      </tr>`;
    });
    summary += `</table></div>`;
    scoreDisplay.innerHTML = summary;
  }
}
