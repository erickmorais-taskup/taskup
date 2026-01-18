// ===============================
// SUPABASE CLIENT (GLOBAL SEGURO)
// ===============================
var supabase;

// ===============================
// INICIALIZAÇÃO SEGURA
// ===============================
document.addEventListener("DOMContentLoaded", async () => {

    if (!window.supabase) {
        console.error("Supabase SDK não carregou");
        return;
    }

    if (!window.supabaseClient) {
        window.supabaseClient = window.supabase.createClient(
            "https://bfynkxmdsydbmkdttdok.supabase.co",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeW5reG1kc3lkYm1rZHR0ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MTQ3NzEsImV4cCI6MjA4NDI5MDc3MX0.Dvbijztg4bHPcxgjVhpfGcAfwNJrbv2CsuGktG9nqyg"
        );
    }

    supabase = window.supabaseClient;

    // 🔐 Protege páginas privadas SOMENTE depois do Supabase pronto
    if (window.location.pathname.includes("servicos.html")) {
        await protegerPagina();
    }
});

async function mostrarServico(servico) {
    const { data } = await supabase
        .from("freelancers")
        .select("*")
        .eq("servico", servico);

    const container = document.getElementById("jobs");
    container.innerHTML = "";

    if (!data || data.length === 0) {
        container.innerHTML = "<p>Nenhum profissional disponível.</p>";
        return;
    }

    data.forEach(p => {
        container.innerHTML += `
            <div class="job-card">
                <h5>${p.nome}</h5>
                <p>
                    Experiência: ${p.experiencia}<br>
                    Valor: ${p.valor}<br>
                    Bairro: ${p.bairro}
                </p>
                <button onclick="contatoWhats('${p.nome}', '${p.bairro}', '${servico}')">
                    Solicitar via WhatsApp
                </button>
            </div>
        `;
    });
}

async function registrar() {
    const tipo = document.getElementById("tipo").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (!tipo || !email || !senha) {
        alert("Preencha todos os campos");
        return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: senha
    });

    if (signUpError) {
        alert(signUpError.message);
        return;
    }

    // 🔥 LOGIN IMEDIATO
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password: senha
    });

    if (loginError) {
        alert(loginError.message);
        return;
    }

    const { data } = await supabase.auth.getUser();
    const userId = data.user.id;

    let payload = {
        id: userId,
        tipo,
        email
    };

    if (tipo === "empresa") {
        payload.empresa = document.getElementById("empresa").value;
        payload.cnpj = document.getElementById("cnpj").value;
        payload.telefone = document.getElementById("telefoneEmpresa").value;
    } else {
        payload.nome = document.getElementById("nome").value;
        payload.cpf = document.getElementById("cpf").value;
        payload.telefone = document.getElementById("telefonePessoa").value;
    }

    const { error: dbError } = await supabase
        .from("usuarios")
        .insert([payload]);

    if (dbError) {
        alert(dbError.message);
        return;
    }

    alert("Cadastro realizado com sucesso!");
    window.location.href = "servicos.html";
}

async function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha
    });

    if (error) {
        alert("Email ou senha inválidos");
        return;
    }

    window.location.href = "servicos.html";
}

function trocarTipo() {
    const tipo = document.getElementById("tipo").value;

    const empresaCampos = document.getElementById("empresaCampos");
    const pessoaCampos = document.getElementById("pessoaCampos");

    // Esconde tudo primeiro
    empresaCampos.style.display = "none";
    pessoaCampos.style.display = "none";

    if (tipo === "empresa") {
        empresaCampos.style.display = "block";
    }

    if (tipo === "pessoa") {
        pessoaCampos.style.display = "block";
    }
}

async function logout() {
    await supabase.auth.signOut();
    window.location.href = "login.html";
}

async function protegerPagina() {
    // aguarda o supabase estar pronto
    if (!supabase) {
        setTimeout(protegerPagina, 50);
        return;
    }

    const { data, error } = await supabase.auth.getUser();

    if (error || !data || !data.user) {
        // limpa cache visual
        document.documentElement.style.display = "block";
        window.location.replace("login.html");
        return;
    }

    // usuário válido → libera página
    document.documentElement.style.display = "block";
}

async function contatoWhats(nomeFreela, bairroFreela, servico) {
    const numeroTaskUp = "5531992111470";

    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    const userId = data.user.id;

    const { data: usuario } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", userId)
        .single();

    let dados = usuario.tipo === "empresa"
        ? `Empresa: ${usuario.empresa}\nCNPJ: ${usuario.cnpj}`
        : `Nome: ${usuario.nome}\nCPF: ${usuario.cpf}`;

    const msg = `
Solicitação via TaskUp

Serviço: ${servico}
Profissional: ${nomeFreela}
Bairro: ${bairroFreela}

${dados}
Email: ${usuario.email}
Telefone: ${usuario.telefone}
    `;

    window.open(
        `https://wa.me/${numeroTaskUp}?text=${encodeURIComponent(msg)}`
    );
}
