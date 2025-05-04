function login() {
  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;

  firebase.auth().signInWithEmailAndPassword(email, senha)
    .then(() => window.location.href = 'painel.html')
    .catch(err => alert("Erro ao entrar: " + err.message));
}

function cadastrar() {
  const nome = document.getElementById('cad-nome').value;
  const email = document.getElementById('cad-email').value;
  const senha = document.getElementById('cad-senha').value;
  const senha2 = document.getElementById('cad-senha-confirma').value;

  if (senha !== senha2) {
    alert("Senhas não coincidem.");
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then(userCred => {
      const uid = userCred.user.uid;
      firebase.database().ref('assinantes/' + uid).set({
        nome: nome,
        email: email,
        status: 'pendente'
      });
      alert("Cadastro realizado. Aguarde aprovação.");
    })
    .catch(err => alert("Erro ao cadastrar: " + err.message));
}

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
}