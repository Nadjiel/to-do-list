//Adicao de tarefas
class Tarefa {
    constructor(nome, id, status) {
        this.nome = nome;
        this.id = id;
        this.status = status;
    }

    criarNaLista() {
        const div = document.createElement("div");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = this.id;
        input.onclick = manusearClickEmTarefa;
        const label = document.createElement("label");
        label.htmlFor = input.id;
        label.innerText = this.nome;

        div.appendChild(input);
        div.appendChild(label);
        switch(this.status) {
            case "pendente":
                listaTarefasPendentes.appendChild(div);
                break;
            case "concluida": listaTarefasConcluidas.appendChild(div);
        }
    }

    ehPendente() {
        if(this.status === "pendente") return true;
        else return false;
    }
}

//Gerenciamento de tarefas
function manusearClickEmTarefa(e) {
    const inputTarefa = e.target;
    const divTarefa = inputTarefa.parentNode;
    let indexTarefaClicada;
    tarefas.forEach((tarefa, index) => {
        if(tarefa.id === inputTarefa.id) {
            indexTarefaClicada = index;
        }
    });
    
    if(inputTarefa.checked) {
        listaTarefasConcluidas.insertBefore(divTarefa, listaTarefasConcluidas.children[0]);
        tarefas[indexTarefaClicada].status = "concluida";
    }
    else {
        listaTarefasConcluidas.removeChild(divTarefa);
        listaTarefasPendentes.appendChild(divTarefa);
        tarefas[indexTarefaClicada].status = "pendente";
    }
}
//--------------------

const listaTarefasPendentes = document.querySelector("#tarefas-pendentes");
const listaTarefasConcluidas = document.querySelector("#tarefas-concluidas");
const inputNovaTarefa = document.querySelector("#adicionar-tarefa input");
const botaoAdicionar = document.querySelector("#adicionar-tarefa button");
const inputBuscarTarefa = document.querySelector("#barra-de-busca input");
const botaoBuscar = document.querySelector("#barra-de-busca button");

const tarefas = [];

inputNovaTarefa.onclick = () => {
    inputNovaTarefa.select();
}

inputBuscarTarefa.onclick = () => {
    inputBuscarTarefa.select();
}

botaoAdicionar.onclick = () => {
    if(inputNovaTarefa.value) {
        tarefas.push(new Tarefa(inputNovaTarefa.value, `tarefa${tarefas.length}`, "pendente"));
        tarefas[tarefas.length-1].criarNaLista();
    }
}

botaoBuscar.onclick = () => {
    const busca = inputBuscarTarefa.value;

    if(!busca) {
        tarefas.forEach((tarefa) => {
            if(!document.getElementById(tarefa.id)) {
                tarefa.criarNaLista();
            }
        });
    }

    tarefas.forEach((tarefa) => {
        if(!tarefa.nome.toLowerCase().includes(busca.toLowerCase())) {
            if(document.getElementById(`${tarefa.id}`)) {
                if(tarefa.ehPendente()) {
                    listaTarefasPendentes.removeChild(document.getElementById(`${tarefa.id}`).parentNode);
                }
                else {
                    listaTarefasConcluidas.removeChild(document.getElementById(`${tarefa.id}`).parentNode);
                }
            }
        }
    });
}