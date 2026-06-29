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

// Dias anteriores ficam bloqueados
if (data < hojeLimpo) {

    botao.disabled = true;
    botao.classList.add("ocupado");

}

// Dia atual
if (data.toDateString() === hoje.toDateString()) {

    
    

// Domingo e Segunda = Folga
if (
    data.getDay() == 0 ||
    data.getDay() == 1
) {

    botao.disabled = true;
    botao.classList.add("ocupado");
    botao.innerHTML = dia + "<br>Folga";

}

// Dias disponíveis
if (!botao.disabled) {

    botao.onclick = function () {

        document
            .querySelectorAll(".dias button")
            .forEach(b => {

                b.classList.remove("selecionado");

            });

        botao.classList.add("selecionado");

        dataSelecionada =
            `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

        diaEscolhido =
            diasSemana[data.getDay()] +
            " " +
            dia +
            " de " +
            meses[mes];

        carregarHorarios();

        atualizarResumo();

    };

}

area.appendChild(botao);
