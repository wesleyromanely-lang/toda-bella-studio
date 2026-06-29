import {
db,
ref,
push,
get
} from "./firebase.js";

let servicoEscolhido="";
let diaEscolhido="";
let horarioEscolhido="";
let horariosOcupados=[];

let dataSelecionada="";
let dataCalendario=new Date();

const meses=[
"Janeiro","Fevereiro","Março","Abril","Maio","Junho",
"Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const diasSemana=[
"Dom","Seg","Ter","Qua","Qui","Sex","Sáb"
];

function abrirAgendamento(servico){

servicoEscolhido=servico || "";
diaEscolhido="";
horarioEscolhido="";
dataSelecionada="";

document.getElementById("nome").value="";
document.getElementById("whatsapp").value="";

document.getElementById("tituloServico").innerHTML=
servicoEscolhido
?
"✨ "+servicoEscolhido
:
"Escolha o serviço";

document.getElementById("home")
.classList.add("escondida");

document.getElementById("agenda")
.classList.remove("escondida");

dataCalendario=new Date();

criarCalendario();

limparHorarios();

atualizarResumo();

}

function voltar(){

document.getElementById("agenda")
.classList.add("escondida");

document.getElementById("home")
.classList.remove("escondida");

}

function mudarMes(valor){

dataCalendario.setMonth(
dataCalendario.getMonth()+valor
);

criarCalendario();

}

function criarCalendario(){

let area=document.getElementById("dias");

area.innerHTML="";

let ano=dataCalendario.getFullYear();

let mes=dataCalendario.getMonth();

let hoje=new Date();

let topo=document.createElement("h3");

topo.innerHTML=`

<div class="mes-nav">

<button class="seta-cal" onclick="mudarMes(-1)">
←
</button>

<span class="mes-titulo">
${meses[mes]} ${ano}
</span>

<button class="seta-cal" onclick="mudarMes(1)">
→
</button>

</div>

<small>Atendimento: Terça a Sábado</small>

`;

topo.style.color="white";
topo.style.gridColumn="1 / 8";

area.appendChild(topo);

const semana=[
"Dom",
"Seg",
"Ter",
"Qua",
"Qui",
"Sex",
"Sáb"
];

semana.forEach(dia=>{

const item=document.createElement("div");

item.className="dia-semana";

item.innerHTML=dia;

area.appendChild(item);

});

let primeiroDia=
new Date(ano,mes,1).getDay();

let totalDias=
new Date(ano,mes+1,0).getDate();

for(let i=0;i<primeiroDia;i++){

area.appendChild(
document.createElement("div")
);

}

for(let dia=1;dia<=totalDias;dia++){

let data=
new Date(
ano,
mes,
dia
);

let botao=document.createElement("button");

botao.innerHTML=dia;

let hojeLimpo=new Date();

hojeLimpo.setHours(0,0,0,0);

if(data<hojeLimpo){
// DESTACA O DIA ATUAL
if (data.toDateString() === hoje.toDateString()) {

    botao.classList.add("hoje");

    // Depois das 17:00 o atendimento encerra
if (
    hoje.getHours() > 17 ||
    (hoje.getHours() === 17 && hoje.getMinutes() >= 0)
) {

        botao.disabled = true;
        botao.classList.add("ocupado");
        botao.innerHTML = dia + "<br><small>Encerrado</small>";

    } else {

        botao.innerHTML = dia + "<br><small>Hoje</small>";

    }

}
botao.disabled=true;

botao.classList.add("ocupado");

}

if(
data.getDay()==0 ||
data.getDay()==1
){

botao.disabled=true;

botao.classList.add("ocupado");

botao.innerHTML=
dia+"<br>Folga";

}

if(!botao.disabled){

botao.onclick=function(){

document
.querySelectorAll(".dias button")
.forEach(b=>{

b.classList.remove("selecionado");

});

botao.classList.add("selecionado");

dataSelecionada=
`${ano}-${String(mes+1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;

diaEscolhido=
diasSemana[data.getDay()]
+" "+
dia+
" de "+
meses[mes];

carregarHorarios();

atualizarResumo();

};

}

area.appendChild(botao);

}

}

async function carregarHorarios(){

horariosOcupados=[];

limparHorarios();

let dados=
await get(
ref(
db,
"agendamentos/"+dataSelecionada
)
);

if(dados.exists()){

Object.values(dados.val())
.forEach(item=>{

if(item.horario){

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

document.getElementById("resumo").innerHTML=

`

Serviço: <br> <b>${servicoEscolhido}</b>

<br><br>

Dia: <br> <b>${diaEscolhido}</b>

<br><br>

Horário: <br> <b>${horarioEscolhido}</b>

`;

}

async function whatsapp(){

const nome =
document
.getElementById("nome")
.value
.trim();

const telefone =
document
.getElementById("whatsapp")
.value
.trim();

if(nome.length===0){

alert(
"Preencha seu nome para continuar."
);

return;

}

if(telefone.length===0){

alert(
"Preencha seu WhatsApp para continuar."
);

return;

}

if(
!servicoEscolhido ||
!diaEscolhido ||
!horarioEscolhido
){

alert(
"Escolha serviço, dia e horário."
);

return;

}

await push(

ref(
db,
"agendamentos/"+dataSelecionada
),

{

nome:nome,

telefone:telefone,

servico:servicoEscolhido,

dia:diaEscolhido,

horario:horarioEscolhido,

data:dataSelecionada

}

);

let numero="5511964201177";

let mensagem=

`
Olá Toda Bella ✨

Quero confirmar meu agendamento.

Cliente:
${nome}

Telefone:
${telefone}

Serviço:
${servicoEscolhido}

Dia:
${diaEscolhido}

Horário:
${horarioEscolhido}
`;

mostrarPopup(
"Seu agendamento foi realizado com sucesso! 🎉"
);

setTimeout(()=>{

window.open(

"https://wa.me/"
+
numero
+
"?text="
+
encodeURIComponent(mensagem),

"_blank"

);

},1500);

}


window.instagram=function(){

window.open(
"https://www.instagram.com/todabellastudio2026/",
"_blank"
);

};

window.abrirAgendamento=abrirAgendamento;
window.voltar=voltar;
window.hora=hora;
window.whatsapp=whatsapp;
window.mudarMes=mudarMes;

window.mostrarPopup=function(texto){

document
.getElementById("popupTexto")
.innerHTML=texto;

document
.getElementById("popupSucesso")
.style.display="flex";

}

window.fecharPopup=function(){

document
.getElementById("popupSucesso")
.style.display="none";

}
