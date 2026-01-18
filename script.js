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
