const texto = "> Bem-vindo ao meu portfólio";
let i = 0;

function digitar() {
  if (i < texto.length) {
    document.querySelector(".terminal").innerHTML += texto[i];
    i++;
    setTimeout(digitar, 100);
  }
}

digitar();