
firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    window.location.href = "index.html";
  } else {
    const uid = user.uid;
    firebase.database().ref("assinantes/" + uid).once("value").then(snapshot => {
      const dados = snapshot.val();
      if (!dados) return;

      const div = document.getElementById("info-assinante");
      div.innerHTML = `
        <p><strong>Nome:</strong> ${dados.nome}</p>
        <p><strong>Plano:</strong> ${dados.plano}</p>
        <p><strong>Status da Colheita:</strong> ${dados.status_colheita || '-'}</p>
        <p><strong>Histórico:</strong> ${dados.historico_entregas || '-'}</p>
        <p><strong>Observações:</strong> ${dados.observacoes || '-'}</p>
        <p><strong>Dia do Plantio:</strong> ${dados.dia_plantio || '-'}</p>
        <p><strong>O que foi plantado:</strong> ${dados.oque_plantou || '-'}</p>
        <p><strong>Estimativa da Colheita:</strong> ${dados.estimativa_colheita || '-'}</p>
        ${dados.foto1 ? `<img src="${dados.foto1}" alt="Horta 1" style="max-width:45%;margin:0.5rem;">` : ""}
        ${dados.foto2 ? `<img src="${dados.foto2}" alt="Horta 2" style="max-width:45%;margin:0.5rem;">` : ""}
      `;
    });
  }
});

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
}
