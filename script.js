// Shows one lesson at a time and handles the light/dark theme toggle.

var lessons = Array.prototype.slice.call(document.querySelectorAll(".lesson"));
var select = document.getElementById("lesson-select");
var position = document.getElementById("position");
var prevButtons = [document.getElementById("prev-top"), document.getElementById("prev-bottom")];
var nextButtons = [document.getElementById("next-top"), document.getElementById("next-bottom")];
var themeButton = document.getElementById("theme-toggle");
var current = 0;

// Fill the "Jump to lesson" menu from the lesson titles.
lessons.forEach(function (lesson, i) {
  var option = document.createElement("option");
  option.value = i;
  option.textContent = i + 1 + ". " + lesson.dataset.title;
  select.appendChild(option);
});

function showLesson(index, updateHash) {
  if (index < 0 || index >= lessons.length) {
    return;
  }
  current = index;
  lessons.forEach(function (lesson, i) {
    lesson.hidden = i !== index;
  });
  select.value = index;
  position.textContent = "Lesson " + (index + 1) + " of " + lessons.length;
  prevButtons.forEach(function (b) { b.disabled = index === 0; });
  nextButtons.forEach(function (b) { b.disabled = index === lessons.length - 1; });
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
prevButtons.forEach(function (b) {
  b.addEventListener("click", function () { showLesson(current - 1, true); });
});
nextButtons.forEach(function (b) {
  b.addEventListener("click", function () { showLesson(current + 1, true); });
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
