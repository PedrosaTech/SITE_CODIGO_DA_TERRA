
const emailAutorizado = "pedrosa.julio@gmail.com";

firebase.auth().onAuthStateChanged(function(user) {
  if (!user || user.email !== emailAutorizado) {
    alert("Acesso restrito.");
    window.location.href = "index.html";
  } else {
    carregarAssinantes();
  }
});

function carregarAssinantes() {
  const container = document.getElementById("lista-assinantes");
  firebase.database().ref("assinantes").once("value").then(snapshot => {
    const dados = snapshot.val();
    container.innerHTML = "";
    for (const uid in dados) {
      const a = dados[uid];
      const div = document.createElement("div");
      div.className = "assinante";
      div.innerHTML = `
        <h3>${a.nome}</h3>
        <p><strong>Email:</strong> ${a.email}</p>
        <label>Plano:</label>
        <input type="text" id="plano-${uid}" value="${a.plano || ''}">
        <label>Status da Colheita:</label>
        <input type="text" id="colheita-${uid}" value="${a.status_colheita || ''}">
        <label>Histórico de Entregas:</label>
        <textarea id="historico-${uid}">${a.historico_entregas || ''}</textarea>
        <label>Observações:</label>
        <textarea id="obs-${uid}">${a.observacoes || ''}</textarea>
        <label>Dia do Plantio:</label>
        <input type="date" id="plantio-${uid}" value="${a.dia_plantio || ''}">
        <label>O que foi plantado:</label>
        <input type="text" id="oque-${uid}" value="${a.oque_plantou || ''}">
        <label>Estimativa da Colheita:</label>
        <input type="date" id="estimativa-${uid}" value="${a.estimativa_colheita || ''}">

        <label>Foto 1 da Horta:</label>
        <input type="file" onchange="uploadFoto(this, '${uid}', 'foto1')"><br>
        ${a.foto1 ? `<img src="${a.foto1}" alt="foto1" style="max-width:48%;margin:0.5rem;">` : ''}

        <label>Foto 2 da Horta:</label>
        <input type="file" onchange="uploadFoto(this, '${uid}', 'foto2')"><br>
        ${a.foto2 ? `<img src="${a.foto2}" alt="foto2" style="max-width:48%;margin:0.5rem;">` : ''}

        <button onclick="salvarDados('${uid}')">Salvar Dados</button>
        <hr>
      `;
      container.appendChild(div);
    }
  });
}

function salvarDados(uid) {
  const dados = {
    plano: document.getElementById('plano-' + uid).value,
    status_colheita: document.getElementById('colheita-' + uid).value,
    historico_entregas: document.getElementById('historico-' + uid).value,
    observacoes: document.getElementById('obs-' + uid).value,
    dia_plantio: document.getElementById('plantio-' + uid).value,
    oque_plantou: document.getElementById('oque-' + uid).value,
    estimativa_colheita: document.getElementById('estimativa-' + uid).value,
  };
  firebase.database().ref("assinantes/" + uid).update(dados).then(() => {
    alert("Dados atualizados com sucesso.");
  });
}

function uploadFoto(input, uid, campo) {
  const file = input.files[0];
  if (!file) return;
  const ref = firebase.storage().ref(`hortas/${uid}/${campo}`);
  ref.put(file).then(snapshot => snapshot.ref.getDownloadURL()).then(url => {
    return firebase.database().ref("assinantes/" + uid).update({ [campo]: url });
  }).then(() => {
    alert("Imagem atualizada.");
    carregarAssinantes();
  }).catch(err => alert("Erro ao enviar imagem: " + err.message));
}
