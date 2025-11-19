function startGame() {
  const name = document.getElementById("playerName").value.trim();

  if (name === "") {
    alert("Digite seu nome para começar!");
    return;
  }

  localStorage.setItem("playerName", name);
  window.location.href = "quiz.html";
}
