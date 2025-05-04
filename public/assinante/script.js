
function login() {
  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-senha").value;
  firebase.auth().signInWithEmailAndPassword(email, senha)
    .then(() => {
      window.location.href = "assinante/painel.html";
    })
    .catch(error => {
      alert("Erro ao entrar: " + error.message);
    });
}

function cadastrar() {
  const nome = document.getElementById("cad-nome").value;
  const email = document.getElementById("cad-email").value;
  const telefone = document.getElementById("cad-telefone").value;
  const senha = document.getElementById("cad-senha").value;
  const senhaConfirm = document.getElementById("cad-senha-confirm").value;
  const plano = document.getElementById("cad-plano").value;

  if (senha !== senhaConfirm) {
    alert("As senhas não coincidem.");
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then(cred => {
      return firebase.database().ref("assinantes/" + cred.user.uid).set({
        nome,
        email,
        telefone,
        plano,
        status: "pendente"
      });
    })
    .then(() => {
      alert("Cadastro enviado! Aguarde aprovação.");
      document.getElementById("cad-nome").value = "";
      document.getElementById("cad-email").value = "";
      document.getElementById("cad-telefone").value = "";
      document.getElementById("cad-senha").value = "";
      document.getElementById("cad-senha-confirm").value = "";
    })
    .catch(error => {
      alert("Erro ao cadastrar: " + error.message);
    });
}
