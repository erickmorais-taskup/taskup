let dados = {};

fetch('freelancers.json')
    .then(res => res.json())
    .then(json => dados = json);

function mostrarServico(servico) {
    const container = document.getElementById("jobs");
    const section = document.getElementById("profissionais");

    container.innerHTML = "";

    if (!dados[servico] || dados[servico].length === 0) {
        container.innerHTML = "<p>Nenhum profissional disponível.</p>";
    } else {
        dados[servico].forEach(p => {
            container.innerHTML += `
                <div class="job-card">
                    <h5>${p.nome}</h5>
                    <p class="p-card">
                        Experiência: ${p.experiencia}<br>
                        Valor: ${p.valor}<br>
                        Bairro: ${p.bairro}
                    </p>
                    <button class="job-card-button"
                        onclick="contatoWhats(${p.whatsapp}, '${p.nome}', '${p.bairro}')">
                        Entrar em contato pelo WhatsApp
                    </button>
                </div>
            `;
        });
    }

    section.classList.remove("hidden");
    window.scrollTo({ top: section.offsetTop - 20, behavior: "smooth" });
}

function contatoWhats(numero, nome, bairro) {
    const msg = `Olá, me interessei pelo serviço de ${nome}, do bairro ${bairro}, disponível no site TaskUp.`;
    window.open(
        `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`,
        "_blank"
    );
                     }

function registrar() {
    const empresa = document.getElementById("empresa").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (!empresa || !email || !senha) {
        alert("Preencha todos os campos");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    usuarios.push({ empresa, email, senha });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
}

function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuarios.find(
        u => u.email === email && u.senha === senha
    );

    if (!usuario) {
        alert("Email ou senha inválidos");
        return;
    }

    localStorage.setItem("logado", "true");
    localStorage.setItem("empresa", usuario.empresa);

    window.location.href = "servicos.html";
}
