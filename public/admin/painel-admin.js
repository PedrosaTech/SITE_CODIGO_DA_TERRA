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
  const container = document.getElementById("lista-assinantes");

  firebase.database().ref("assinantes/" + uid).once("value").then(snapshot => {
    const a = snapshot.val();
    container.innerHTML = "";

    const div = document.createElement("div");
    div.className = "assinante";
    div.innerHTML = `
      <h3>${a.nome}</h3>
      <p><strong>Plano:</strong> ${a.plano} | <strong>Status:</strong> ${a.status}</p>
      <label>Status da Colheita:</label>
      <input type="text" id="colheita-${uid}" value="${a.status_colheita || ''}">
      <label>Histórico de Entregas:</label>
      <textarea id="historico-${uid}">${a.historico_entregas || ''}</textarea>
      <label>O que foi plantado:</label>
      <input type="text" id="plantado-${uid}" value="${a.plantado || ''}">
      <label>Data do plantio:</label>
      <input type="date" id="plantio-${uid}" value="${a.data_plantio || ''}">
      <label>Estimativa de colheita:</label>
      <input type="date" id="estimativa-${uid}" value="${a.estimativa_colheita || ''}">

      <label>Temperatura média:</label>
      <input type="number" step="0.1" id="temp-${uid}" value="${a.sensor_temperatura || ''}">
      <label>Umidade média:</label>
      <input type="number" step="0.1" id="umid-${uid}" value="${a.sensor_umidade || ''}">
      <label>Luminosidade média:</label>
      <input type="number" step="0.1" id="luz-${uid}" value="${a.sensor_luminosidade || ''}">

      <label>Foto 1 da Horta:</label>
      <input type="file" onchange="uploadFoto(this, '${uid}', 'foto1')"><br>
      ${a.foto1 ? `<img src="${a.foto1}" alt="foto1" style="max-width:48%;margin:0.5rem;">` : ''}

      <label>Foto 2 da Horta:</label>
      <input type="file" onchange="uploadFoto(this, '${uid}', 'foto2')"><br>
      ${a.foto2 ? `<img src="${a.foto2}" alt="foto2" style="max-width:48%;margin:0.5rem;">` : ''}

      <button onclick="salvarDados('${uid}')">Salvar Dados</button>
      <button onclick="carregarAssinantes()">Voltar para todos</button>
      <hr style="margin:2rem 0;">
    `;
    container.appendChild(div);
  });
};
