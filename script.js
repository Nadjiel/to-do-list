class Tarefa {
    constructor(nome, id, status) {
        this.nome = nome;
        this.id = id;
        this.status = status;
    }

    adicionarNaLista() {
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

    compararId(string) {
        return string === this.id;
    }
}

function adicionarEventoEmElementos(evento, callback, ...elementos) {
    for(const elemento of elementos) {
        elemento.addEventListener(evento, callback);
    }
}

function criarNovaTarefa(nome) {
    if(!nome) nome = inputs.novaTarefa.value;

    tarefas.push(new Tarefa(nome, `tarefa${tarefas.length}`, "pendente"));
    tarefas[tarefas.length-1].adicionarNaLista();
}

function criarTarefasDeVolta() {
    tarefas.forEach((tarefa) => {
        if(!document.getElementById(tarefa.id)) {
            tarefa.adicionarNaLista();
        }
    });
}

function pesquisarTarefas() {
    tarefas.forEach((tarefa) => {
        if(!tarefa.nome.toLowerCase().includes(inputs.buscarTarefa.value.toLowerCase())) {
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

function acharTarefaComId(id) {
    for(const tarefa of tarefas) {
        if(tarefa.compararId(id)) {
            return tarefas.indexOf(tarefa);
        }
    }
}

function manusearClickEmTarefa(e) {
    const inputTarefa = e.target;
    const divTarefa = inputTarefa.parentNode;
    const indexTarefa = acharTarefaComId(inputTarefa.id);
    
    if(inputTarefa.checked) {
        listaTarefasConcluidas.insertBefore(divTarefa, listaTarefasConcluidas.children[0]);
        tarefas[indexTarefa].status = "concluida";
    }
    else {
        listaTarefasConcluidas.removeChild(divTarefa);
        listaTarefasPendentes.appendChild(divTarefa);
        tarefas[indexTarefa].status = "pendente";
    }
}
//=====~~~~~=====+++++|+++++=====~~~~~=====//
//deletar tarefas
//guardar na memoria
//pesquisar com enter
//criar tarefas de volta quando nao houver texto no input de busca inves de ao apertar no botao

const listaTarefasPendentes = document.querySelector("#tarefas-pendentes");
const listaTarefasConcluidas = document.querySelector("#tarefas-concluidas");
const inputs = {
    novaTarefa: document.querySelector("#adicionar-tarefa input"),
    buscarTarefa: document.querySelector("#barra-de-busca input")
};
const botoes = {
    novaTarefa: document.querySelector("#adicionar-tarefa button"),
    buscarTarefa: document.querySelector("#barra-de-busca button")
};

const tarefas = [];

adicionarEventoEmElementos("click", (e) => e.target.select(), inputs.novaTarefa, inputs.buscarTarefa);

botoes.novaTarefa.onclick = () => {
    if(inputs.novaTarefa.value) criarNovaTarefa();
}

botoes.buscarTarefa.onclick = () => {
    if(!inputs.buscarTarefa.value) {
        criarTarefasDeVolta();
    }

    pesquisarTarefas();
}

window.onkeydown = (e) => {
    if(!e.repeat) {
        switch(e.key) {
            case "Enter":
                if(inputs.novaTarefa === document.activeElement) {
                    botoes.novaTarefa.onclick();
                }
        }
    }
}