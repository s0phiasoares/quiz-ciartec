document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("rankingList");
  if (!list) {
    console.error("Elemento #rankingList não encontrado no DOM.");
    return;
  }

  let raw = localStorage.getItem("ranking");
  let ranking = [];

  // Tenta parsear localStorage com segurança
  try {
    if (raw) {
      ranking = JSON.parse(raw);

      // Se veio string (ex: um único objeto serializado), forçar a ser array
      if (!Array.isArray(ranking) && typeof ranking === "object" && ranking !== null) {
        ranking = [ranking];
      }
    }
  } catch (err) {
    console.error("Erro ao parsear localStorage 'ranking':", err);
    ranking = []; // fallback
  }

  // Se não for array, força vazio
  if (!Array.isArray(ranking)) ranking = [];

  // Normaliza e filtra itens inválidos
  ranking = ranking
    .map(item => {
      // protege contra valores inesperados
      const name = item && item.name ? String(item.name) : "Jogador(a) Desconhecido(a)";
      const score = item && item.score !== undefined && item.score !== null ? Number(item.score) : 0;
      const dateRaw = item && item.date ? String(item.date) : null;
      // tenta formatar data; se inválida, usa data atual
      let date;
      if (dateRaw) {
        const d = new Date(dateRaw);
        date = isNaN(d.getTime()) ? new Date() : d;
      } else {
        date = new Date();
      }
      return { name, score: isNaN(score) ? 0 : score, date };
    })
    .filter(it => typeof it.name === "string"); // filtra lixo

  if (ranking.length === 0) {
    list.innerHTML = "<p style='text-align:center;'>Ainda não há jogadores no ranking.</p>";
    return;
  }

  // Ordena decrescente por score (numérico)
  ranking.sort((a, b) => b.score - a.score);

  // Create list items safely (melhor performance que innerHTML += em loop)
  const fragment = document.createDocumentFragment();

  ranking.forEach((player, i) => {
    let medal = "🎖";
    if (i === 0) medal = "🥇";
    else if (i === 1) medal = "🥈";
    else if (i === 2) medal = "🥉";

    const item = document.createElement("div");
    item.className = "rank-item";

    const medalSpan = document.createElement("span");
    medalSpan.className = "rank-medal";
    medalSpan.textContent = medal;

    const infoSpan = document.createElement("span");
    const dateStr = player.date instanceof Date ?
      player.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }) :
      String(player.date);

    infoSpan.innerHTML = `<strong>${escapeHtml(player.name)}</strong><br>${player.score} pontos – ${dateStr}`;

    item.appendChild(medalSpan);
    item.appendChild(infoSpan);
    fragment.appendChild(item);
  });

  list.innerHTML = ""; // limpa
  list.appendChild(fragment);

  // função simples para escapar HTML de nomes (evitar injeção)
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});