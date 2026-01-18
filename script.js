let dados = {};

fetch('freelancers.json')
    .then(res => res.json())
    .then(json => dados = json);

// PROTEÇÃO DA PÁGINA
if (window.location.pathname.includes("servicos.html")) {
    if (localStorage.getItem("logado") !== "true") {
        window.location.href = "login.html";
    }
}

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

function contatoWhats(numero, nome, bairro) {
    const msg = `Olá, me interessei pelo serviço de ${nome}, do bairro ${bairro}, disponível no site TaskUp.`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`);
}

function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (email && senha) {
        localStorage.setItem("logado", "true");
        window.location.href = "servicos.html";
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
