// کد قبلی برای رنج اول
const rangeSlider = document.querySelector(".range-slider");
const minThumb = document.querySelector(".range-slider-thumb-min");
const maxThumb = document.querySelector(".range-slider-thumb-max");
const minYearInput = document.getElementById("min-year");
const maxYearInput = document.getElementById("max-year");
const minYearValue = document.getElementById("min-year-value");
const maxYearValue = document.getElementById("max-year-value");

let minValue = 1888;
let maxValue = 2024;
let minPos = 0;
let maxPos = 100;

function updateSlider() {
  minThumb.style.left = `${minPos}%`;
  maxThumb.style.left = `${maxPos}%`;
  minYearInput.value = Math.round(minValue);
  maxYearInput.value = Math.round(maxValue);
  minYearValue.textContent = Math.round(minValue);
  maxYearValue.textContent = Math.round(maxValue);
}

rangeSlider.addEventListener("mousedown", (e) => {
  if (e.target === minThumb) {
    document.addEventListener("mousemove", handleMinThumb);
  } else if (e.target === maxThumb) {
    document.addEventListener("mousemove", handleMaxThumb);
  }
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", handleMinThumb);
    document.removeEventListener("mousemove", handleMaxThumb);
  });
});

function handleMinThumb(e) {
  const rect = rangeSlider.getBoundingClientRect();
  minPos = ((e.clientX - rect.left) / rect.width) * 100;
  minPos = Math.max(0, Math.min(minPos, maxPos));
  minValue = (minPos / 100) * (2024 - 1888) + 1888;
  updateSlider();
}

function handleMaxThumb(e) {
  const rect = rangeSlider.getBoundingClientRect();
  maxPos = ((e.clientX - rect.left) / rect.width) * 100;
  maxPos = Math.max(minPos, Math.min(maxPos, 100));
  maxValue = (maxPos / 100) * (2024 - 1888) + 1888;
  updateSlider();
}

// کد جدید برای رنج دوم
const rangeSlider2 = document.querySelector(".range-slider-2");
const minThumb2 = document.querySelector(".range-slider-thumb-min-2");
const maxThumb2 = document.querySelector(".range-slider-thumb-max-2");
const minValueInput = document.getElementById("min-value");
const maxValueInput = document.getElementById("max-value");
const minValueText = document.getElementById("min-value-text");
const maxValueText = document.getElementById("max-value-text");

let minValue2 = 0;
let maxValue2 = 10;
let minPos2 = 0;
let maxPos2 = 100;

function updateSlider2() {
  minThumb2.style.left = `${minPos2}%`;
  maxThumb2.style.left = `${maxPos2}%`;
  minValueInput.value = Math.round(minValue2);
  maxValueInput.value = Math.round(maxValue2);
  minValueText.textContent = Math.round(minValue2);
  maxValueText.textContent = Math.round(maxValue2);
}

rangeSlider2.addEventListener("mousedown", (e) => {
  if (e.target === minThumb2) {
    document.addEventListener("mousemove", handleMinThumb2);
  } else if (e.target === maxThumb2) {
    document.addEventListener("mousemove", handleMaxThumb2);
  }
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", handleMinThumb2);
    document.removeEventListener("mousemove", handleMaxThumb2);
  });
});

function handleMinThumb2(e) {
  const rect = rangeSlider2.getBoundingClientRect();
  minPos2 = ((e.clientX - rect.left) / rect.width) * 100;
  minPos2 = Math.max(0, Math.min(minPos2, maxPos2));
  minValue2 = (minPos2 / 100) * (10 - 0) + 0;
  updateSlider2();
}

function handleMaxThumb2(e) {
  const rect = rangeSlider2.getBoundingClientRect();
  maxPos2 = ((e.clientX - rect.left) / rect.width) * 100;
  maxPos2 = Math.max(minPos2, Math.min(maxPos2, 100));
  maxValue2 = (maxPos2 / 100) * (10 - 0) + 0;
  updateSlider2();
}
