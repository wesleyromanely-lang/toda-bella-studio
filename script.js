let servico="";
let horario="";



function abrirAgenda(){

document
.getElementById("agenda")
.scrollIntoView({
behavior:"smooth"
});

}




function selecionarServico(nome){


servico = nome;


document.getElementById("resultado").innerHTML =

"Serviço:<br><b>"
+servico+
"</b><br><br>Escolha o horário";


}





function escolherHorario(hora){


horario = hora;



document.getElementById("resultado").innerHTML =

"Serviço:<br><b>"
+servico+
"</b><br><br>Horário:<br><b>"
+horario+
"</b>";

}





function confirmar(){


let nome =
document.getElementById("nomeCliente").value;


let telefone =
document.getElementById("telefone").value;



if(servico=="" || horario==""){

alert("Escolha serviço e horário");

return;

}



if(nome=="" || telefone==""){


alert("Preencha seus dados");

return;


}



document.getElementById("resultado").innerHTML =

"✅ Agendamento confirmado!<br><br>"+

"<b>"+servico+"</b><br>"+

horario+

"<br><br>"+

nome+

"<br>"+

telefone;


}
