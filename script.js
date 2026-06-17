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



const diasSemana = [

"Dom",
"Seg",
"Ter",
"Qua",
"Qui",
"Sex",
"Sáb"

];



// ABRIR AGENDAMENTO

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



criarCalendario();


carregarHorarios();



}






// VOLTAR

function voltar(){


document
.getElementById("agenda")
.classList.add("escondida");



document
.getElementById("home")
.classList.remove("escondida");


}






// CALENDARIO

function criarCalendario(){


let area =
document.getElementById("dias");


area.innerHTML="";



let hoje = new Date();



for(let i=1;i<=7;i++){


let data = new Date();


data.setDate(
hoje.getDate()+i
);



let botao =
document.createElement("button");



botao.innerHTML =

diasSemana[data.getDay()]
+
"<br>"
+
data.getDate();





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
data.getDate();



carregarHorarios();


atualizarResumo();


}



area.appendChild(botao);



}


}








// BUSCA HORARIOS NO FIREBASE

async function carregarHorarios(){


horariosOcupados=[];



const banco = await get(
ref(db,"agendamentos")
);



if(banco.exists()){


let dados =
banco.val();



Object.values(dados).forEach(item=>{


if(item.dia == diaEscolhido){


horariosOcupados.push(
item.horario
);


}



});



}



bloquearHorarios();



}








// ESCOLHER HORARIO

function hora(botao,valor){



if(
horariosOcupados.includes(valor)
){


alert("Esse horário já foi reservado");


return;


}




horarioEscolhido = valor;



document
.querySelectorAll(".horarios button")
.forEach(b=>{

b.classList.remove("selecionado");

});



botao.classList.add("selecionado");



atualizarResumo();



}









// BLOQUEAR HORARIOS

function bloquearHorarios(){



document
.querySelectorAll(".horarios button")
.forEach(botao=>{



botao.disabled=false;

botao.classList.remove("ocupado");



let horario =
botao.innerText;




if(
horariosOcupados.includes(horario)
){



botao.disabled=true;

botao.classList.add("ocupado");


}



});



}










// RESUMO

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









// CONFIRMAR

async function confirmar(){


let nome =
document.getElementById("nome").value;



let whatsapp =
document.getElementById("whatsapp").value;





if(
!servicoEscolhido ||
!diaEscolhido ||
!horarioEscolhido
){


alert("Escolha serviço, dia e horário");


return;


}




if(
!nome ||
!whatsapp
){


alert("Preencha seus dados");


return;


}






await push(

ref(db,"agendamentos"),

{


nome:nome,

whatsapp:whatsapp,

servico:servicoEscolhido,

dia:diaEscolhido,

horario:horarioEscolhido,

criado:
new Date().toLocaleString()


}

);





alert("Agendamento realizado ✨");



document
.getElementById("btnWhatsapp")
.style.display="block";



}










// WHATSAPP TODA BELLA

function whatsapp(){



let numero =
"5511964201177";



let mensagem =


`

Olá Toda Bella ✨


Quero confirmar meu agendamento.


Cliente:
${document.getElementById("nome").value}


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







window.abrirAgendamento =
abrirAgendamento;


window.voltar =
voltar;


window.hora =
hora;


window.confirmar =
confirmar;


window.whatsapp =
whatsapp;
