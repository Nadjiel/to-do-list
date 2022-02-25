class Tarefa {
    constructor(nome, id, status) {
        this.nome = nome;
        this.id = id;
        this.status = status;
    }
}

function adicionarNaLista(tarefa) {
    const div = document.createElement("div");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = tarefa.id;
    input.onclick = manusearClickEmTarefa;
    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.innerText = tarefa.nome;

    div.appendChild(input);
    div.appendChild(label);
    switch(tarefa.status) {
        case "pendente":
            listaTarefasPendentes.appendChild(div);
            break;
        case "concluida":
            listaTarefasConcluidas.appendChild(div);
            input.checked = true;
    }
}

function ehPendente(tarefa) {
    if(tarefa.status === "pendente") return true;
    else return false;
}

function compararId(tarefa, string) {
    return string === tarefa.id;
}

function alternarStatus(tarefa) {
    if(tarefa.status === "pendente") tarefa.status = "concluida";
    else tarefa.status = "pendente";
}

function adicionarEventoEmElementos(evento, callback, ...elementos) {
    for(const elemento of elementos) {
        elemento.addEventListener(evento, callback);
    }
}

function criarNovaTarefa(nome) {
    if(!nome) nome = inputs.novaTarefa.value;

    tarefas.push(new Tarefa(nome, `tarefa${tarefas.length}`, "pendente"));
    salvarTarefas();
    adicionarNaLista(tarefas[tarefas.length-1]);
}

function criarTarefasDeVolta() {
    tarefas.forEach((tarefa) => {
        if(!document.getElementById(tarefa.id)) {
            adicionarNaLista(tarefa);
        }
    });
}

function pesquisarTarefas() {
    tarefas.forEach((tarefa) => {
        if(!tarefa.nome.toLowerCase().includes(inputs.buscarTarefa.value.toLowerCase())) {
            if(document.getElementById(`${tarefa.id}`)) {
                if(ehPendente(tarefa)) {
                    listaTarefasPendentes.removeChild(document.getElementById(`${tarefa.id}`).parentNode);
                }
                else {
                    listaTarefasConcluidas.removeChild(document.getElementById(`${tarefa.id}`).parentNode);
                }
            }
        }
        else {
            if(!document.getElementById(`${tarefa.id}`)) {
                adicionarNaLista(tarefa);
            }
        }
    });
}

function acharTarefa(id) {
    for(const tarefa of tarefas) {
        if(compararId(tarefa, id)) {
            return tarefas.indexOf(tarefa);
        }
    }
}

function stringifyItensDeArray(array) {
    array.forEach((item, i) => {
        array[i] = JSON.stringify(item);
    });

    return array;
}

function unstringifyItensDeArray(array) {
    array.forEach((item, i) => {
        array[i] = JSON.parse(item);
    });

    return array;
}

function salvarTarefas() {
    if(!localStorage.tarefas){
        localStorage.tarefas = JSON.stringify([]);
    }
    let tarefasSalvas = JSON.parse(localStorage.tarefas);

    tarefasSalvas = stringifyItensDeArray(tarefasSalvas);

    for(const tarefa of tarefas) {
        if(tarefasSalvas.indexOf(JSON.stringify(tarefa)) === -1) {
            tarefasSalvas.push(JSON.stringify(tarefa));
        }
    }

    tarefasSalvas = unstringifyItensDeArray(tarefasSalvas);

    localStorage.tarefas = JSON.stringify(tarefasSalvas);
}

function excluirTarefa(tarefa) {
    let tarefasSalvas = JSON.parse(localStorage.tarefas);

    tarefasSalvas = stringifyItensDeArray(tarefasSalvas);

    const indexTarefaExcluida = tarefasSalvas.indexOf(JSON.stringify(tarefa));

    tarefasSalvas.splice(indexTarefaExcluida, 1);

    tarefasSalvas = unstringifyItensDeArray(tarefasSalvas);

    localStorage.tarefas = JSON.stringify(tarefasSalvas);

    if(localStorage.tarefas === "[]") delete localStorage.tarefas;
}

function atualizarTarefa(tarefa) {
    let tarefasSalvas = JSON.parse(localStorage.tarefas);

    tarefasSalvas = stringifyItensDeArray(tarefasSalvas);

    const indexTarefaAlterada = tarefasSalvas.indexOf(JSON.stringify(tarefa));

    tarefasSalvas = unstringifyItensDeArray(tarefasSalvas);

    alternarStatus(tarefasSalvas[indexTarefaAlterada]);

    localStorage.tarefas = JSON.stringify(tarefasSalvas);
}

function manusearClickEmTarefa(e) {
    const inputTarefa = e.target;
    const divTarefa = inputTarefa.parentNode;
    const indexTarefa = acharTarefa(inputTarefa.id);

    if(e.ctrlKey) {
        if(inputTarefa.checked) {
            listaTarefasPendentes.removeChild(divTarefa);
        }
        else {
            listaTarefasConcluidas.removeChild(divTarefa);
        }
        excluirTarefa(tarefas[indexTarefa]);
        tarefas.splice(indexTarefa, 1);
    }
    else {
        if(inputTarefa.checked) {
            listaTarefasConcluidas.insertBefore(divTarefa, listaTarefasConcluidas.children[0]);
        }
        else {
            listaTarefasConcluidas.removeChild(divTarefa);
            listaTarefasPendentes.appendChild(divTarefa);
        }
        atualizarTarefa(tarefas[indexTarefa]);
        alternarStatus(tarefas[indexTarefa]);
    }
}
//-------------------------------------Fluxo-Principal-------------------------------------//

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

let tarefas;

if(!localStorage.tarefas) tarefas = [];
else {
    tarefas = JSON.parse(localStorage.tarefas);
    criarTarefasDeVolta();
}

adicionarEventoEmElementos("click", (e) => e.target.select(), inputs.novaTarefa, inputs.buscarTarefa);

botoes.novaTarefa.onclick = () => {
    if(inputs.novaTarefa.value) criarNovaTarefa();
}

botoes.buscarTarefa.onclick = () => pesquisarTarefas();

let buscaAtiva = false;

window.onclick = () => {
    if(inputs.buscarTarefa === document.activeElement) buscaAtiva = true;
    else if(buscaAtiva === true) {
        buscaAtiva = false;
        if(!inputs.buscarTarefa.value) {
            criarTarefasDeVolta();
        }
    }
}

window.onkeydown = (e) => {
    if(!e.repeat) {
        switch(e.key) {
            case "Enter":
                if(inputs.novaTarefa === document.activeElement) {
                    botoes.novaTarefa.onclick();
                }
                if(inputs.buscarTarefa === document.activeElement) {
                    botoes.buscarTarefa.onclick();
                }
        }
    }
}