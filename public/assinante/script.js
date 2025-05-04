firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  const uid = user.uid;
  firebase.database().ref("assinantes/" + uid).once("value").then(snapshot => {
    const data = snapshot.val();
    if (!data || data.status !== "ativo") {
      alert("Cadastro não aprovado ainda.");
      firebase.auth().signOut().then(() => window.location.href = "index.html");
      return;
    }
    document.getElementById("nome").innerText = data.nome || "";
    document.getElementById("plano").innerText = data.plano || "";
    document.getElementById("plantio").innerText = data.plantio || "";
    document.getElementById("oqueplantou").innerText = data.oqueplantou || "";
    document.getElementById("estimativa").innerText = data.estimativa_colheita || "";
    document.getElementById("temp").innerText = data.temperatura || "--";
    document.getElementById("luz").innerText = data.luminosidade || "--";
    document.getElementById("umidade").innerText = data.umidade || "--";
    document.getElementById("adubo").innerText = data.adubacao || "--";
    document.getElementById("limpeza").innerText = data.limpeza || "--";
    if (data.foto1) document.getElementById("foto1").src = data.foto1;
    if (data.foto2) document.getElementById("foto2").src = data.foto2;
  });
});

function logout() {
  firebase.auth().signOut().then(() => window.location.href = "index.html");
}
