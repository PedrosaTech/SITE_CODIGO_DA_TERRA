window.buscarAssinante = function () {
  const nomeBuscado = document.getElementById("buscar-nome").value.trim().toLowerCase();
  const container = document.getElementById("lista-assinantes");

  if (!nomeBuscado) {
    alert("Digite um nome para buscar.");
    return;
  }

  firebase.database().ref("assinantes").once("value").then(snapshot => {
    const dados = snapshot.val();
    container.innerHTML = "";
    let encontrado = false;

    for (const uid in dados) {
      const a = dados[uid];
      if (a.nome && a.nome.toLowerCase().includes(nomeBuscado)) {
        encontrado = true;
        const div = document.createElement("div");
        div.className = "assinante";
        div.innerHTML = `
          <h3>${a.nome}</h3>
          <p><strong>Plano:</strong> ${a.plano}</p>
          <p><strong>Status:</strong> ${a.status}</p>
          <button onclick="carregarAssinanteCompleto('${uid}')">Abrir Assinatura Completa</button>
          <hr>
        `;
        container.appendChild(div);
      }
    }

    if (!encontrado) {
      container.innerHTML = `<p class="text-red-600">Nenhum assinante encontrado com esse nome.</p>`;
    }
  });
};

// Função opcional para carregar tudo depois da busca
window.carregarAssinanteCompleto = function (uid) {
  firebase.database().ref("assinantes/" + uid).once("value").then(snapshot => {
    const a = snapshot.val();
    alert(`Assinante encontrado: ${a.nome}\nPlano: ${a.plano}`);
    // Aqui você pode redirecionar, exibir ou reusar a função carregarAssinantes se preferir
  });
};
