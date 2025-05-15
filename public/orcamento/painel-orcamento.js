// painel-orcamento.js
import "./firebaseConfig.js";

const db = firebase.database();
const auth = firebase.auth();
const userEmailAutorizado = "pedrosa.julio@gmail.com";

const loginForm = document.getElementById("login-form");
const painel = document.getElementById("painel");
const logoutBtn = document.getElementById("logout");

const hospedesList = document.getElementById("hospedes-list");
const facilitadoresList = document.getElementById("facilitadores-list");

function renderLista(refPath, container) {
  container.innerHTML = "";
  db.ref(refPath).once("value").then(snapshot => {
    const dados = snapshot.val();
    for (const key in dados) {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item");

      const inputNome = document.createElement("input");
      inputNome.value = key;
      inputNome.disabled = true;

      const inputValor = document.createElement("input");
      inputValor.type = "number";
      inputValor.value = dados[key];

      const salvarBtn = document.createElement("button");
      salvarBtn.textContent = "💾";
      salvarBtn.onclick = () => {
        const novoValor = parseFloat(inputValor.value);
        db.ref(`${refPath}/${key}`).set(novoValor);
      };

      const excluirBtn = document.createElement("button");
      excluirBtn.textContent = "🗑️";
      excluirBtn.onclick = () => {
        db.ref(`${refPath}/${key}`).remove().then(() => {
          renderLista(refPath, container);
        });
      };

      itemDiv.append(inputNome, inputValor, salvarBtn, excluirBtn);
      container.appendChild(itemDiv);
    }
  });
}

function adicionarNovoItem(refPath, inputNomeId, inputValorId, container) {
  const nome = document.getElementById(inputNomeId).value;
  const valor = parseFloat(document.getElementById(inputValorId).value);
  if (nome && !isNaN(valor)) {
    db.ref(`${refPath}/${nome}`).set(valor).then(() => {
      renderLista(refPath, container);
      document.getElementById(inputNomeId).value = "";
      document.getElementById(inputValorId).value = "";
    });
  }
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const senha = loginForm.password.value;

  auth.signInWithEmailAndPassword(email, senha)
    .then((userCred) => {
      if (userCred.user.email === userEmailAutorizado) {
        loginForm.style.display = "none";
        painel.style.display = "block";
        renderLista("orcamento/hospedes", hospedesList);
        renderLista("orcamento/facilitadores", facilitadoresList);
      } else {
        alert("Usuário não autorizado.");
        auth.signOut();
      }
    })
    .catch((err) => alert("Erro ao fazer login: " + err.message));
});

logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    loginForm.style.display = "block";
    painel.style.display = "none";
  });
});

// Exportar JSON
window.exportarOrcamento = async function () {
  const hospedesSnap = await db.ref("orcamento/hospedes").once("value");
  const facilitadoresSnap = await db.ref("orcamento/facilitadores").once("value");

  const dados = {
    hospedes: hospedesSnap.val() || {},
    facilitadores: facilitadoresSnap.val() || {}
  };

  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "orcamento-codigo-da-terra.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
