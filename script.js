// Shows one lesson at a time and handles the light/dark theme toggle.

var lessons = Array.prototype.slice.call(document.querySelectorAll(".lesson"));
var select = document.getElementById("lesson-select");
var prevButton = document.getElementById("prev-bottom");
var nextButton = document.getElementById("next-bottom");
var themeButton = document.getElementById("theme-toggle");
var current = 0;

// Add the "Lesson N of 22" label and gold rule above each lesson's heading,
// and fill the "Contents" menu from the lesson titles.
lessons.forEach(function (lesson, i) {
  var eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "Lesson " + (i + 1) + " of " + lessons.length;
  var rule = document.createElement("div");
  rule.className = "rule";
  lesson.insertBefore(rule, lesson.firstChild);
  lesson.insertBefore(eyebrow, rule);

  var option = document.createElement("option");
  option.value = i;
  option.textContent = i + 1 + ". " + lesson.dataset.title;
  select.appendChild(option);
});

function setPager(button, index) {
  var title = button.querySelector(".pager-title");
  var exists = index >= 0 && index < lessons.length;
  button.disabled = !exists;
  title.textContent = exists ? lessons[index].dataset.title : "";
}

function showLesson(index, updateHash) {
  if (index < 0 || index >= lessons.length) {
    return;
  }
  current = index;
  lessons.forEach(function (lesson, i) {
    lesson.hidden = i !== index;
  });
  select.value = index;
  setPager(prevButton, index - 1);
  setPager(nextButton, index + 1);
  if (updateHash) {
    history.replaceState(null, "", "#" + lessons[index].id);
  }
  window.scrollTo(0, 0);
}

function lessonFromHash() {
  var id = location.hash.slice(1);
  for (var i = 0; i < lessons.length; i++) {
    if (lessons[i].id === id) {
      return i;
    }
  }
  return 0;
}

select.addEventListener("change", function () {
  showLesson(Number(select.value), true);
});
prevButton.addEventListener("click", function () {
  showLesson(current - 1, true);
});
nextButton.addEventListener("click", function () {
  showLesson(current + 1, true);
});
window.addEventListener("hashchange", function () {
  showLesson(lessonFromHash(), false);
});

// Theme: light by default; the choice is remembered if the browser allows it.
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeButton.textContent = theme === "dark" ? "Light theme" : "Dark theme";
  themeButton.setAttribute("aria-pressed", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    // Storage can be blocked (for example in private windows); the toggle still works.
  }
}

var savedTheme = "light";
try {
  savedTheme = localStorage.getItem("theme") === "dark" ? "dark" : "light";
} catch (e) {
  savedTheme = "light";
}
setTheme(savedTheme);

themeButton.addEventListener("click", function () {
  setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

showLesson(lessonFromHash(), false);
