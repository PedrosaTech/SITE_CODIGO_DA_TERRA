
const emailAutorizado = "pedrosa.julio@gmail.com";

function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  firebase.auth().signInWithEmailAndPassword(email, senha)
    .then(userCredential => {
      if (userCredential.user.email === emailAutorizado) {
        window.location.href = "painel-admin.html";
      } else {
        document.getElementById("mensagem").innerText = "Acesso não autorizado.";
        firebase.auth().signOut();
      }
    })
    .catch(error => {
      document.getElementById("mensagem").innerText = "Erro: " + error.message;
    });
}
