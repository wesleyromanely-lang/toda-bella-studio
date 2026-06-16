let servicoEscolhido = "";

let diaEscolhido = "";

let horarioEscolhido = "";





function abrirAgendamento(servico){


if(servico){

servicoEscolhido = servico;


document.getElementById("tituloServico").innerHTML =
"✨ " + servico;


}



document
.getElementById("home")
.classList.add("sair");



setTimeout(()=>{


document
.getElementById("home")
.classList.add("escondida");



document
.getElementById("agenda")
.classList.remove("escondida");



document
.getElementById("agenda")
.classList.add("entrar");



},300);



}







function voltar(){


document
.getElementById("agenda")
.classList.add("sair");



setTimeout(()=>{


document
.getElementById("agenda")
.classList.add("escondida");



document
.getElementById("home")
.classList.remove("escondida");



},300);


}








function dia(botao,valor){


diaEscolhido = valor;



document
.querySelectorAll(".dias button")
.forEach(b=>{

b.classList.remove("selecionado");

});



botao.classList.add("selecionado");



atualizarResumo();


}








function hora(botao,valor){


horarioEscolhido = valor;



document
.querySelectorAll(".horarios button")
.forEach(b=>{

b.classList.remove("selecionado");

});



botao.classList.add("selecionado");



atualizarResumo();



}








function atualizarResumo(){



document.getElementById("resumo").innerHTML =


`
Serviço:

<br>

<b>${servicoEscolhido}</b>


<br><br>


Dia:

<br>

<b>${diaEscolhido}</b>


<br><br>


Horário:

<br>

<b>${horarioEscolhido}</b>

`;



}







function confirmar(){



let nome =
document.getElementById("nome").value;



let whatsapp =
document.getElementById("whatsapp").value;





if(!servicoEscolhido ||
!diaEscolhido ||
!horarioEscolhido){


alert("Escolha serviço, dia e horário");

return;


}




if(!nome || !whatsapp){


alert("Preencha seus dados");

return;

}





document.getElementById("resumo").innerHTML =


`

<h2>✅ Confirmado</h2>


Cliente:

<b>${nome}</b>


<br><br>


Serviço:

<b>${servicoEscolhido}</b>


<br><br>


${diaEscolhido}

<br>

${horarioEscolhido}


`;



}
