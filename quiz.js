// Course quiz: each answer is marked as soon as it is chosen; the score shows after the last one.

(function () {
  var root = document.querySelector("[data-quiz]");
  if (!root) {
    return;
  }

  var questions = Array.prototype.slice.call(root.querySelectorAll(".quiz-q"));
  var progress = root.querySelector("[data-progress]");
  var scoreBox = root.querySelector("[data-score]");
  var scoreText = root.querySelector("[data-score-text]");
  var scoreNote = root.querySelector("[data-score-note]");
  var restartButton = root.querySelector("[data-quiz-restart]");
  var answered = 0;
  var score = 0;

  function updateProgress() {
    progress.textContent = "Answered " + answered + " of " + questions.length;
  }

  function addMarker(button, text) {
    var marker = document.createElement("span");
    marker.className = "mark";
    marker.textContent = " (" + text + ")";
    button.querySelector(".option-text").appendChild(marker);
  }

  function showScore() {
    scoreText.textContent = "You scored " + score + " out of " + questions.length + ".";
    if (score === questions.length) {
      scoreNote.textContent = "A perfect score. Well done.";
    } else if (score >= questions.length * 0.75) {
      scoreNote.textContent = "Good work. Look back at the lessons for the questions you missed.";
    } else {
      scoreNote.textContent = "Keep going. Revisit the lessons, then try the quiz again.";
    }
    scoreBox.hidden = false;
    scoreBox.scrollIntoView({ block: "nearest" });
  }

  questions.forEach(function (question) {
    var options = Array.prototype.slice.call(question.querySelectorAll(".option"));
    var feedback = question.querySelector(".feedback");

    options.forEach(function (button, index) {
      button.addEventListener("click", function () {
        if (question.dataset.done) {
          return;
        }
        var right = Number(question.dataset.correct);
        var correct = index === right;
        question.dataset.done = "true";
        options.forEach(function (o) { o.disabled = true; });

        options[right].classList.add("correct");
        addMarker(options[right], "correct answer");
        if (!correct) {
          button.classList.add("wrong");
          addMarker(button, "your answer");
        }

        var label = document.createElement("b");
        label.textContent = correct ? "Correct. " : "Not quite. ";
        var detail = correct ? "" : "Correct answer: " + options[right].querySelector(".option-text").firstChild.textContent + ". ";
        feedback.textContent = "";
        feedback.appendChild(label);
        feedback.appendChild(document.createTextNode(detail + question.dataset.explain));

        answered++;
        if (correct) {
          score++;
        }
        updateProgress();
        if (answered === questions.length) {
          showScore();
        }
      });
    });
  });

  restartButton.addEventListener("click", function () {
    questions.forEach(function (question) {
      delete question.dataset.done;
      question.querySelector(".feedback").textContent = "";
      Array.prototype.forEach.call(question.querySelectorAll(".option"), function (o) {
        o.disabled = false;
        o.classList.remove("correct", "wrong");
        var marker = o.querySelector(".mark");
        if (marker) {
          marker.remove();
        }
      });
    });
    answered = 0;
    score = 0;
    scoreBox.hidden = true;
    updateProgress();
    root.scrollIntoView({ block: "start" });
  });
})();
