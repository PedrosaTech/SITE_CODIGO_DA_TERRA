const firebaseConfig = {
  apiKey: "AIzaSyDCMze76XmCGqufSMGO7NOZS8ad4_HROzA",
  authDomain: "codigodaterra-7c22e.firebaseapp.com",
  databaseURL: "https://codigodaterra-7c22e-default-rtdb.firebaseio.com",
  projectId: "codigodaterra-7c22e",
  storageBucket: "codigodaterra-7c22e.firebasestorage.app",
  messagingSenderId: "32808222509",
  appId: "1:32808222509:web:f6a7e8ecd1c1ec2a20dda4"
};

firebase.initializeApp(firebaseConfig);
document.addEventListener("DOMContentLoaded", () => {
  const emailAutorizado = "pedrosa.julio@gmail.com";

  firebase.auth().onAuthStateChanged(function(user) {
    if (!user || user.email !== emailAutorizado) {
      alert("Acesso restrito.");
      window.location.href = "../index.html";
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
          <label>Fotoperíodo médio (h):</label>
          <input type="number" step="0.1" id="luz-${uid}" value="${a.sensor_luminosidade || ''}">

          <label>Status:</label>
          <select id="status-${uid}">
            <option value="pendente" ${a.status === "pendente" ? "selected" : ""}>Pendente</option>
            <option value="ativo" ${a.status === "ativo" ? "selected" : ""}>Ativo</option>
          </select>

          <label>Foto 1 da Horta:</label>
          <input type="file" onchange="uploadFoto(this, '${uid}', 'foto1')"><br>
          ${a.foto1 ? `<img src="${a.foto1}" alt="foto1" style="max-width:48%;margin:0.5rem;">` : ''}

          <label>Foto 2 da Horta:</label>
          <input type="file" onchange="uploadFoto(this, '${uid}', 'foto2')"><br>
          ${a.foto2 ? `<img src="${a.foto2}" alt="foto2" style="max-width:48%;margin:0.5rem;">` : ''}

          <button onclick="salvarDados('${uid}')">Salvar Dados</button>
          <hr style="margin:2rem 0;">
        `;
        container.appendChild(div);
      }
    });
  }

  window.salvarDados = function(uid) {
    const dados = {
      status_colheita: document.getElementById('colheita-' + uid).value,
      historico_entregas: document.getElementById('historico-' + uid).value,
      plantado: document.getElementById('plantado-' + uid).value,
      data_plantio: document.getElementById('plantio-' + uid).value,
      estimativa_colheita: document.getElementById('estimativa-' + uid).value,
      sensor_temperatura: parseFloat(document.getElementById('temp-' + uid).value),
      sensor_umidade: parseFloat(document.getElementById('umid-' + uid).value),
      sensor_luminosidade: parseFloat(document.getElementById('luz-' + uid).value),
      status: document.getElementById('status-' + uid).value
    };

    firebase.database().ref("assinantes/" + uid).update(dados).then(() => {
      alert("Dados atualizados com sucesso.");
    });
  }

  window.uploadFoto = function(input, uid, campo) {
    const file = input.files[0];
    if (!file) return;

    const storageRef = firebase.storage().ref(`hortas/${uid}/${campo}`);
    storageRef.put(file).then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => firebase.database().ref("assinantes/" + uid).update({ [campo]: url }))
      .then(() => {
        alert("Foto enviada com sucesso.");
        carregarAssinantes();
      })
      .catch(error => {
        console.error("Erro ao enviar imagem:", error);
        alert("Erro ao enviar imagem: " + error.message);
      });
  }
});
