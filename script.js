import {
db,
ref,
push,
get
} from "./firebase.js";



let servicoEscolhido = "";

let diaEscolhido = "";

let horarioEscolhido = "";

let horariosOcupados = [];





const meses = [

"Janeiro",
"Fevereiro",
"Março",
"Abril",
"Maio",
"Junho",
"Julho",
"Agosto",
"Setembro",
"Outubro",
"Novembro",
"Dezembro"

];




const diasSemana = [

"Dom",
"Seg",
"Ter",
"Qua",
"Qui",
"Sex",
"Sáb"

];







function abrirAgendamento(servico){



servicoEscolhido = servico || "";

diaEscolhido="";

horarioEscolhido="";



document
.getElementById("tituloServico")
.innerHTML =

servicoEscolhido

?

"✨ "+servicoEscolhido

:

"Escolha o serviço";






document
.getElementById("home")
.classList.add("escondida");



document
.getElementById("agenda")
.classList.remove("escondida");






criarCalendario();


limparHorarios();


}









function voltar(){


document
.getElementById("agenda")
.classList.add("escondida");



document
.getElementById("home")
.classList.remove("escondida");



}




function criarCalendario(){



let area =
document.getElementById("dias");



area.innerHTML="";



let hoje = new Date();



let ano = hoje.getFullYear();

let mes = hoje.getMonth();




let totalDias =
new Date(
ano,
mes+1,
0
).getDate();







for(let i=1;i<=totalDias;i++){





let data =
new Date(
ano,
mes,
i
);





let botao =
document.createElement("button");





botao.innerHTML =

diasSemana[data.getDay()]

+
"<br>"

+
i;






botao.onclick=function(){





document
.querySelectorAll(".dias button")
.forEach(b=>{

b.classList.remove("selecionado");

});





botao.classList.add("selecionado");






diaEscolhido =


diasSemana[data.getDay()]

+
" "

+
i
+
" de "
+
meses[mes];







carregarHorarios();






atualizarResumo();



}





area.appendChild(botao);






}




}









async function carregarHorarios(){



horariosOcupados=[];



let banco = await get(
ref(db,"agendamentos")
);




if(banco.exists()){



let dados=banco.val();




Object.values(dados).forEach(item=>{





if(
item.dia == diaEscolhido
){



horariosOcupados.push(
item.horario
);



}





});




}




bloquearHorarios();



}









function limparHorarios(){



document
.querySelectorAll(".horarios button")
.forEach(botao=>{


botao.disabled=false;


botao.classList.remove("ocupado");


botao.classList.remove("selecionado");


});



}









function hora(botao,valor){



if(
horariosOcupados.includes(valor)
){



alert("Esse horário já está reservado");


return;



}





horarioEscolhido=valor;




document
.querySelectorAll(".horarios button")
.forEach(b=>{


b.classList.remove("selecionado");


});





botao.classList.add("selecionado");




atualizarResumo();



}









function bloquearHorarios(){



document
.querySelectorAll(".horarios button")
.forEach(botao=>{



let hora =
botao.innerText;






if(
horariosOcupados.includes(hora)
){



botao.disabled=true;


botao.classList.add("ocupado");



}



});



}









function atualizarResumo(){



document
.getElementById("resumo")
.innerHTML =



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









async function whatsapp(){



let nome =
document.getElementById("nome").value;



let telefone =
document.getElementById("whatsapp").value;





if(
!servicoEscolhido ||
!diaEscolhido ||
!horarioEscolhido
){


alert("Escolha serviço, dia e horário");


return;


}






await push(

ref(db,"agendamentos"),


{


nome,

telefone,

servico:servicoEscolhido,

dia:diaEscolhido,

horario:horarioEscolhido,

data:new Date().toLocaleString()

}


);







let numero =
"5511964201177";







let mensagem =


`

Olá Toda Bella ✨


Quero confirmar meu horário.


Cliente:
${nome}


Serviço:
${servicoEscolhido}


Dia:
${diaEscolhido}


Horário:
${horarioEscolhido}


`;







window.open(

"https://wa.me/"

+
numero
+
"?text="
+
encodeURIComponent(mensagem)

);



}








window.abrirAgendamento=abrirAgendamento;

window.voltar=voltar;

window.hora=hora;

window.whatsapp=whatsapp;
