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


let dataCalendario = new Date();


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


document.getElementById("tituloServico").innerHTML =
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



dataCalendario = new Date();


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






function mudarMes(valor){


dataCalendario.setMonth(
dataCalendario.getMonth()+valor
);


criarCalendario();


}








function criarCalendario(){


let area =
document.getElementById("dias");


area.innerHTML="";



let ano =
dataCalendario.getFullYear();


let mes =
dataCalendario.getMonth();



let hoje =
new Date();




let topo =
document.createElement("h3");


topo.innerHTML =

`
<button onclick="mudarMes(-1)">←</button>

${meses[mes]} ${ano}

<button onclick="mudarMes(1)">→</button>

<br>

<small>Atendimento: Terça a Sábado</small>

`;



topo.style.color="white";

topo.style.gridColumn="1 / 8";



area.appendChild(topo);






let primeiroDia =
new Date(
ano,
mes,
1
).getDay();



let totalDias =
new Date(
ano,
mes+1,
0
).getDate();





for(let i=0;i<primeiroDia;i++){


let vazio =
document.createElement("div");


area.appendChild(vazio);


}








for(let dia=1;dia<=totalDias;dia++){



let data =
new Date(
ano,
mes,
dia
);



let botao =
document.createElement("button");



botao.innerHTML = dia;






// bloqueia dias anteriores

let hojeLimpo =
new Date();

hojeLimpo.setHours(0,0,0,0);



if(data < hojeLimpo){


botao.disabled=true;

botao.classList.add("ocupado");


}








// bloqueia hoje depois das 16:30

if(
data.toDateString()
==
hoje.toDateString()
){



let horaAtual =
hoje.getHours();



let minutoAtual =
hoje.getMinutes();





if(
horaAtual > 16 ||
(
horaAtual == 16 &&
minutoAtual > 30
)
){


botao.disabled=true;


botao.innerHTML =
dia+
"<br>Encerrado";


botao.classList.add("ocupado");


}

else{


botao.innerHTML =
dia+
"<br>Hoje";


}



}








// domingo e segunda folga

if(
data.getDay()==0 ||
data.getDay()==1
){


botao.disabled=true;


botao.innerHTML =
dia+
"<br>Folga";


botao.classList.add("ocupado");


}








if(!botao.disabled){


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
dia
+
" de "
+
meses[mes];






carregarHorarios();



atualizarResumo();





}


}






area.appendChild(botao);



}



}









async function carregarHorarios(){


horariosOcupados=[];



let dados =
await get(
ref(db,"agendamentos")
);





if(dados.exists()){



Object.values(dados.val())
.forEach(item=>{


if(
item.dia ==
diaEscolhido
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


alert(
"Esse horário já está reservado"
);


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



if(
horariosOcupados.includes(
botao.innerText
)
){


botao.disabled=true;


botao.classList.add("ocupado");


}



});


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


alert(
"Escolha serviço, dia e horário"
);


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


Quero confirmar meu agendamento.


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

window.mudarMes=mudarMes;
