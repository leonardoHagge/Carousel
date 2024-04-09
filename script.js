var slideContainer = document.getElementById('slides-container');
var slides = [];
var previous = document.getElementById("previous");
var next = document.getElementById("next");
var play = document.getElementById("play");
var stop = document.getElementById("stop");
var iptTime = document.getElementById("time");
var save = document.getElementById("save");
var sites = document.getElementById("sites");
var dialog = document.getElementsByTagName('dialog')[0];
var url = document.getElementById('url');
var files = document.getElementById('files');
var urlList = document.getElementById('url-list');
var file;
var urls = [];


var currentSlide = 0;

var time;
var listner;



function showSlide(index) {

  // if (index < 0) {
  //     index = slides.length + 1;
  // } else if (index >= slides.length) {
  //     index = 0;
  // }

  if (index == currentSlide)
    index = 0;



  for (var i = 0; i < slides.length; i++) {
    slides[i].classList.remove('active');
  }

  slides[index].classList.add('active');
  currentSlide = index;
  reloadHub(currentSlide);
}

function nextSlide() {
  showSlide(currentSlide + ((currentSlide + 1) == slides.length ? 0 : 1));
}

function prevSlide() {
  showSlide(currentSlide - (currentSlide == 0 ? 0 : 1));
}

function reloadHub(currentSlide) {
  if (currentSlide == (slides.length - 1) && !next.classList.contains('hide'))
    next.classList.add('hide');
  if (currentSlide < (slides.length - 1) && next.classList.contains('hide'))
    next.classList.remove('hide');


  if (currentSlide == 0 && !previous.classList.contains('hide'))
    previous.classList.add('hide');
  if (currentSlide > 0 && previous.classList.contains('hide'))
    previous.classList.remove('hide');
}

// Alterna automaticamente os slides a cada 50 segundos

function startCarousel() {
  listner = setInterval(nextSlide, time);
}


function stopCarousel() {

  clearInterval(listner);
}

previous.addEventListener("click", prevSlide);
next.addEventListener("click", nextSlide);
pause.addEventListener("click", () => {
  stopCarousel();
  document.getElementById('pause').classList.add('hide');
  if (document.getElementById('play').classList.contains('hide'))
    document.getElementById('play').classList.remove('hide');
});
play.addEventListener("click", () => {
  startCarousel();
  document.getElementById('play').classList.add('hide');
  if (document.getElementById('pause').classList.contains('hide'))
    document.getElementById('pause').classList.remove('hide');
});
save.addEventListener("click", () => {
  let value = iptTime.value;
  if (value < 5000) {
    iptTime.value = time;
    return;
  }


  time = iptTime.value;

  stopCarousel();
  startCarousel();
  setTimerOnStorange();
});

sites.addEventListener('click', () => {
  if (dialog.hasAttribute('open'))
    dialog.removeAttribute('open')
  else
    dialog.setAttribute('open', '');

})


files.addEventListener('change', (e) => {
  file = e.target.files[0];
})

document.getElementById('save-url').addEventListener('click', (e) => {
  e.preventDefault();
  if (!url.value && !file)
    return;
  if (!!url.value) {
    addUrl(url.value);
    url.value = "";
  }

  if (!!file) {
    readTxt();
    files.value = undefined;
  }
  createUrls();

})



function readTxt() {
  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;

    for (let url of content.split('\n'))
      addUrl(url);

    createUrls();
  };
  reader.readAsText(file);
}


function addUrl(url) {
  if (!urls.includes(url))
    urls.push(url);
  saveSitesOnStorange();
}
function removeUrl(url) {
  if (urls.includes(url))
    urls = urls.filter(u => u != url);

  saveSitesOnStorange();
}


function createUrls() {
  removeUrls();
  // if (urlList.childNodes.length != 0)
  //   return;

  for (let url of urls) {
    let li = document.createElement('li');
    let label = document.createElement('label');
    label.innerHTML = url;
    li.appendChild(label);
    let span = document.createElement('span')
    span.innerHTML = '❌';
    span.addEventListener('click', () => {
      removeUrl(url);
      createUrls();
    })
    li.appendChild(span);
    urlList.appendChild(li);
  }

  removeSlides();
  setSlides();
}

function removeUrls() {
  for (let i = 0; i < urlList.childNodes.length; i++) {
    urlList.childNodes[i].remove();
    i = -1;
  }
}


function saveSitesOnStorange() {
  localStorage.setItem('siteList', JSON.stringify(urls));
}


function loadSitesFromStorange() {
  const storedSiteList = localStorage.getItem('siteList');
  if (!!storedSiteList)
    urls = JSON.parse(storedSiteList);
}



function addSlide(url) {
  let div = document.createElement('div');
  div.classList.add('slide');
  if (slideContainer.querySelectorAll('.slide').length == 0)
    div.classList.add('active');


  let iFrame = document.createElement('iframe');
  iFrame.src = url;
  iFrame.frameborder = 0;
  div.appendChild(iFrame);
  slideContainer.appendChild(div);
}


function removeSlides() {
  for (let i = 0; i < slides.length; i++) {
    slides[i].remove();
  }
}

function setSlides() {
  slides = document.querySelectorAll('.slide');
  if (urls.length > 0)
    urls.forEach(u => addSlide(u));
  slides = document.querySelectorAll('.slide');
  reloadHub(0);
}

function setTimerOnStorange() {
  localStorage.setItem('timerSlide', JSON.stringify(time));
}


function getTimerOnStorange() {
  const t = localStorage.getItem('timerSlide');
  time = !!t ? JSON.parse(t) : 50000;
  document.getElementById('time').value = time;
}


window.addEventListener('load', function () {
  loadSitesFromStorange();
  createUrls();
  getTimerOnStorange();
  startCarousel();
});

