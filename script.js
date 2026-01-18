// ===============================
// CARREGAR FREELANCERS (JSON)
// ===============================
let dados = {};

fetch('freelancers.json')
    .then(res => res.json())
    .then(json => dados = json)
    .catch(err => console.error("Erro ao carregar freelancers:", err));


// ===============================
// PROTEÇÃO DA PÁGINA SERVIÇOS
// ===============================
if (window.location.pathname.includes("servicos.html")) {
    if (localStorage.getItem("logado") !== "true") {
        window.location.href = "login.html";
    }
}


// ===============================
// MOSTRAR PROFISSIONAIS
// ===============================
function mostrarServico(servico) {
    const container = document.getElementById("jobs");
    const section = document.getElementById("profissionais");

    if (!container || !section) return;

    container.innerHTML = "";

    if (!dados[servico] || dados[servico].length === 0) {
        container.innerHTML = "<p>Nenhum profissional disponível.</p>";
    } else {
        dados[servico].forEach(p => {
            container.innerHTML += `
                <div class="job-card">
                    <h5>${p.nome}</h5>
                    <p>
                        Experiência: ${p.experiencia}<br>
                        Valor: ${p.valor}<br>
                        Bairro: ${p.bairro}
                    </p>
                    <button class="job-card-button"
                        onclick="contatoWhats('${p.whatsapp}', '${p.nome}', '${p.bairro}')">
                        WhatsApp
                    </button>
                </div>
            `;
        });
    }

    section.classList.remove("hidden");
}


// ===============================
// WHATSAPP
// ===============================
function contatoWhats(numero, nome, bairro) {
    const msg = `Olá, me interessei pelo serviço de ${nome}, do bairro ${bairro}, disponível no site TaskUp.`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, "_blank");
}


// ===============================
// REGISTRO DE EMPRESA
// ===============================
function registrar() {
    const tipo = document.getElementById("tipo").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (!tipo || !email || !senha) {
        alert("Preencha todos os campos");
        return;
    }

    let usuario = {
        tipo,
        email,
        senha
    };

    if (tipo === "empresa") {
        usuario.empresa = document.getElementById("empresa").value;
        usuario.cnpj = document.getElementById("cnpj").value;
        usuario.telefone = document.getElementById("telefoneEmpresa").value;

        if (!usuario.empresa || !usuario.cnpj || !usuario.telefone) {
            alert("Preencha todos os dados da empresa");
            return;
        }
    }

    if (tipo === "pessoa") {
        usuario.nome = document.getElementById("nome").value;
        usuario.cpf = document.getElementById("cpf").value;
        usuario.telefone = document.getElementById("telefonePessoa").value;

        if (!usuario.nome || !usuario.cpf || !usuario.telefone) {
            alert("Preencha todos os dados pessoais");
            return;
        }
    }

    localStorage.setItem(document.getElementById("nome"), JSON.stringify(usuario));
    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
}


// ===============================
// LOGIN
// ===============================
function login() {
    const email = document.getElementById("email")?.value;
    const senha = document.getElementById("senha")?.value;

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        alert("Nenhuma empresa cadastrada");
        return;
    }

    if (email === usuario.email && senha === usuario.senha) {
        localStorage.setItem("logado", "true");
        window.location.href = "servicos.html";
    } else {
        alert("Email ou senha incorretos");
    }
}

function trocarTipo() {
    const tipo = document.getElementById("tipo").value;

    document.getElementById("empresaCampos").style.display = "none";
    document.getElementById("pessoaCampos").style.display = "none";

    if (tipo === "empresa") {
        document.getElementById("empresaCampos").style.display = "block";
    }

    if (tipo === "pessoa") {
        document.getElementById("pessoaCampos").style.display = "block";
    }
}

// ===============================
// LOGOUT
// ===============================
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
