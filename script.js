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
.classList.add("escondida");



document
.getElementById("agenda")
.classList.remove("escondida");


}







function voltar(){


document
.getElementById("agenda")
.classList.add("escondida");



document
.getElementById("home")
.classList.remove("escondida");


}







function dia(valor){


diaEscolhido = valor;



atualizarResumo();


}






function hora(valor){


horarioEscolhido = valor;



atualizarResumo();


}







function atualizarResumo(){



document.getElementById("resumo").innerHTML =


"Serviço:<br><b>"
+
servicoEscolhido
+
"</b><br><br>"+


"Dia:<br><b>"
+
diaEscolhido
+
"</b><br><br>"+


"Horário:<br><b>"
+
horarioEscolhido
+
"</b>";



}







function confirmar(){



let nome =
document.getElementById("nome").value;



let whatsapp =
document.getElementById("whatsapp").value;





if(servicoEscolhido=="" ||
diaEscolhido=="" ||
horarioEscolhido==""){


alert("Complete o agendamento");


return;


}





if(nome=="" || whatsapp==""){


alert("Digite seus dados");


return;


}







document.getElementById("resumo").innerHTML =


`
<h2>✅ Confirmado</h2>

Serviço:
<b>${servicoEscolhido}</b>

<br><br>

Dia:
<b>${diaEscolhido}</b>


<br><br>

Horário:
<b>${horarioEscolhido}</b>


<br><br>

Cliente:
<b>${nome}</b>


`;



}
