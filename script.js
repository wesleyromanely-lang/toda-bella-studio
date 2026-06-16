let servicoEscolhido="";
let diaEscolhido="";
let horarioEscolhido="";





function abrirAgendamento(servico){



if(servico){

servicoEscolhido=servico;


document.getElementById("tituloServico").innerHTML=
"✨ "+servico;

}



let home =
document.getElementById("home");


let agenda =
document.getElementById("agenda");



home.classList.add("sair");



setTimeout(()=>{


home.classList.add("escondida");


agenda.classList.remove("escondida");


agenda.classList.add("entrar");



},300);



}







function voltar(){



let home =
document.getElementById("home");


let agenda =
document.getElementById("agenda");



agenda.classList.add("sair");



setTimeout(()=>{


agenda.classList.add("escondida");


home.classList.remove("escondida");


home.classList.add("entrar");



},300);



}








function dia(valor){


diaEscolhido=valor;


atualizar();


}





function hora(valor){


horarioEscolhido=valor;


atualizar();


}







function atualizar(){



document.getElementById("resumo").innerHTML=


`
Serviço:<br>
<b>${servicoEscolhido}</b>

<br><br>

Dia:<br>
<b>${diaEscolhido}</b>

<br><br>

Horário:<br>
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


alert("Complete o agendamento");

return;

}





if(!nome || !whatsapp){


alert("Informe seus dados");

return;

}






document.getElementById("resumo").innerHTML=


`
<h2>✅ Agendado</h2>

${servicoEscolhido}

<br><br>

${diaEscolhido}

<br>

${horarioEscolhido}

<br><br>

Cliente:
<b>${nome}</b>

`;



}
