let servicoEscolhido = "";
let horarioEscolhido = "";



// ABRIR TELA DE AGENDAMENTO

function abrirAgendamento(servico){


if(servico){

servicoEscolhido = servico;


document.getElementById("tituloServico").innerHTML =
"✨ " + servico;


}


document
.getElementById("home")
.classList.add("escondida");


document
.getElementById("agenda")
.classList.remove("escondida");



}





// VOLTAR PARA HOME

function voltar(){


document
.getElementById("agenda")
.classList.add("escondida");



document
.getElementById("home")
.classList.remove("escondida");



}







// ESCOLHER HORÁRIO

function hora(hora){


horarioEscolhido = hora;



document
.getElementById("resumo")
.innerHTML =


`
Serviço:<br>

<b>${servicoEscolhido}</b>

<br><br>

Horário:

<br>

<b>${horarioEscolhido}</b>
`;



}







// CONFIRMAR AGENDAMENTO

function confirmar(){



if(servicoEscolhido === ""){


alert("Escolha um serviço");

return;

}



if(horarioEscolhido === ""){


alert("Escolha um horário");

return;


}




document
.getElementById("resumo")
.innerHTML =



`
<div>

<h2>✅ Confirmado</h2>


<p>
Serviço:
</p>

<b>${servicoEscolhido}</b>


<p>
Horário:
</p>

<b>${horarioEscolhido}</b>


<br><br>


Obrigado por agendar com a Toda Bella ✨


</div>

`;



}






// LIMPAR AGENDAMENTO

function limpar(){


servicoEscolhido = "";

horarioEscolhido = "";


document.getElementById("resumo").innerHTML =
"Selecione o horário";



}
