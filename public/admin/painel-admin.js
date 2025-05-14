
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
        `;
        container.appendChild(div);
      }
    });
  }

  window.buscarAssinante = function () {
    const nomeBuscado = document.getElementById("nome-assinante").value.trim().toLowerCase();
    const container = document.getElementById("lista-assinantes");

    firebase.database().ref("assinantes").once("value").then(snapshot => {
      const dados = snapshot.val();
      container.innerHTML = "";
      for (const uid in dados) {
        const a = dados[uid];
        if (a.nome && a.nome.toLowerCase().includes(nomeBuscado)) {
          const div = document.createElement("div");
          div.className = "assinante";
          div.innerHTML = `
            <h3>${a.nome}</h3>
            <p><strong>Plano:</strong> ${a.plano} | <strong>Status:</strong> ${a.status}</p>
          `;
          container.appendChild(div);
        }
      }
      if (container.innerHTML === "") {
        container.innerHTML = "<p>Assinante não encontrado.</p>";
      }
    });
  };
});
