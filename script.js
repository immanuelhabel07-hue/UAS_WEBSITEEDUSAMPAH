const $=id=>document.getElementById(id);
function showTip(title,text){$("tipTitle").textContent=title;$("tipText").textContent=text;$("tipModal").classList.add("show")}
function closeTip(){$("tipModal").classList.remove("show")}
const toggleButton = document.querySelector(".menu-toggle");
const navMenu = document.getElementById("navMenu");
if (toggleButton && navMenu) {
  toggleButton.onclick = () => navMenu.classList.toggle("open");
}
document.querySelectorAll("#navMenu a").forEach(a => a.onclick = () => {
  if (navMenu) navMenu.classList.remove("open");
});
const tipModal = document.getElementById("tipModal");
if (tipModal) {
  tipModal.addEventListener("click", e => { if (e.target.id === "tipModal") closeTip(); });
}

const sortItems = [
  {icon:"🍌", name:"Kulit Pisang", bin:"organik"},
  {icon:"🥤", name:"Botol Plastik", bin:"anorganik"},
  {icon:"🔋", name:"Baterai Bekas", bin:"b3"},
  {icon:"🍂", name:"Daun Kering", bin:"organik"},
  {icon:"🥫", name:"Kaleng Minuman", bin:"anorganik"}
];
let sortIndex = 0, sortScore = 0;
function showSortItem(){
  if(sortIndex >= sortItems.length){
    $("sortIcon").textContent="🏆"; $("sortItemName").textContent="Hebat, semua sampah sudah dipilah!";
    $("sortHint").textContent="Sasa bangga padamu!"; document.querySelectorAll(".bin-choice").forEach(b=>b.disabled=true); return;
  }
  const item=sortItems[sortIndex]; $("sortIcon").textContent=item.icon; $("sortItemName").textContent=item.name;
}
document.querySelectorAll(".bin-choice").forEach(button=>button.onclick=()=>{
  const item=sortItems[sortIndex]; if(!item)return;
  const correct=button.dataset.bin===item.bin;
  $("sortFeedback").textContent=correct?"Benar! +10 poin untukmu! 🎉":"Belum tepat, coba lagi ya!";
  $("sortFeedback").className="sort-feedback "+(correct?"success":"error");
  if(correct){sortScore+=10; addPoints(10); $("sortScore").textContent=sortScore; sortIndex++; setTimeout(showSortItem,650);}
});
const suggestionForm = $("suggestionForm");
const nameInput = $("nameInput");
const formMessage = $("formMessage");
if (suggestionForm && nameInput && formMessage) {
  suggestionForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = nameInput.value.trim();
    formMessage.textContent = `Terima kasih, ${name}! Sasa senang mendengar janji hijaumu. 🐢`;
    event.target.reset();
  });
}
const playAudioButton = $("playTimoAudio");
if (playAudioButton) {
  playAudioButton.onclick = () => {
    const text = "Halo Sahabat Bumi! Ingat, kenali sampahnya, pilah sampahnya, dan jaga bumi kita bersama.";
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };
}
showSortItem();

let totalPoints = 0;
const totalPointsElement = $("totalPoints");
const badgeTextElement = $("badgeText");
function addPoints(points){
  totalPoints += points;
  if (totalPointsElement) totalPointsElement.textContent = totalPoints;
  if (badgeTextElement) badgeTextElement.textContent = totalPoints >= 80 ? "🏆 Eco Hero" : totalPoints >= 40 ? "♻️ Sahabat Bumi" : "🌱 Pemula";
}
const profileForm = $("profileForm");
if (profileForm) {
  profileForm.addEventListener("submit", event => {
    event.preventDefault();
    const avatarDisplay = $("avatarDisplay");
    const nameDisplay = $("nameDisplay");
    const schoolDisplay = $("schoolDisplay");
    if (avatarDisplay) avatarDisplay.textContent = $("profileAvatar").value;
    if (nameDisplay) nameDisplay.textContent = $("profileName").value;
    if (schoolDisplay) schoolDisplay.textContent = `${$("profileClass").value} • ${$("profileSchool").value}`;
  });
}
document.querySelectorAll("#challengeGrid input").forEach(box => box.addEventListener("change", () => addPoints(box.checked ? 5 : -5)));

const quizItems=[
  {q:"Kulit pisang termasuk sampah apa?",a:["Organik","Anorganik","B3"],c:0},
  {q:"Botol plastik masuk tempat sampah...",a:["Hijau","Biru","Merah"],c:1},
  {q:"Baterai bekas harus dibuang ke...",a:["Sampah B3","Sampah organik","Sungai"],c:0},
  {q:"Reduce artinya...",a:["Mengurangi","Mendaur ulang","Membuang"],c:0},
  {q:"Daun kering bisa diolah menjadi...",a:["Kaca","Kompos","Plastik"],c:1}
];
let quizIndex=0, quizScore=0, quizTimer, seconds=30, quizRunning=false;
const quizStartButton = $("startQuiz");
const quizQuestion = $("question");
const quizAnswers = $("answers");
const quizResult = $("quizResult");
const quizTimerEl = $("timer");
const quizProgress = $("progressBar");
const quizCount = $("quizCount");

function renderQuiz(){
  if (!quizQuestion || !quizAnswers || !quizProgress || !quizCount || quizIndex >= quizItems.length) return;
  const item=quizItems[quizIndex];
  quizCount.textContent=`Soal ${quizIndex+1} dari ${quizItems.length}`;
  quizQuestion.textContent=item.q;
  quizProgress.style.width=`${quizIndex/quizItems.length*100}%`;
  quizAnswers.innerHTML="";
  item.a.forEach((answer,i)=>{const b=document.createElement("button"); b.className="answer"; b.textContent=answer; b.onclick=()=>answerQuiz(i); quizAnswers.appendChild(b);});
}
function answerQuiz(index){if(!quizRunning || !quizQuestion || !quizAnswers) return; const item=quizItems[quizIndex]; document.querySelectorAll("#answers button").forEach((b,i)=>{b.disabled=true;if(i===item.c)b.classList.add("correct")}); if(index===item.c){quizScore+=20; addPoints(20);} else document.querySelectorAll("#answers button")[index].classList.add("wrong"); setTimeout(()=>{quizIndex++; if(quizIndex<quizItems.length)renderQuiz();else finishQuiz();},600);}
function finishQuiz(){
  clearInterval(quizTimer); quizRunning=false;
  if (quizProgress) quizProgress.style.width="100%";
  const correct=quizScore/20; const status=quizScore>=80?"🏆 Eco Hero":quizScore>=40?"♻️ Sahabat Bumi":"🌱 Pemula";
  if (quizQuestion) quizQuestion.textContent="Kuis selesai!";
  if (quizAnswers) quizAnswers.innerHTML="";
  if (quizResult) quizResult.textContent=`Nilai: ${quizScore}/100 | Benar: ${correct} | Salah: ${5-correct} | ${status}`;
  if (quizStartButton) { quizStartButton.textContent="Main Lagi"; quizStartButton.style.display="inline-block"; }
}
if (quizStartButton) {
  quizStartButton.onclick=()=>{
    quizIndex=0;quizScore=0;seconds=30;quizRunning=true;
    if (quizResult) quizResult.textContent="";
    quizStartButton.style.display="none";
    renderQuiz();
    clearInterval(quizTimer);
    quizTimer=setInterval(()=>{
      seconds--;
      if (quizTimerEl) quizTimerEl.textContent=seconds;
      if(seconds<=0)finishQuiz();
    },1000);
  };
}
