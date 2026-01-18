if (!window.supabaseClient) {
  window.supabaseClient = window.supabase.createClient(
    "https://bfynkxmdsydbmkdttdok.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeW5reG1kc3lkYm1rZHR0ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MTQ3NzEsImV4cCI6MjA4NDI5MDc3MX0.Dvbijztg4bHPcxgjVhpfGcAfwNJrbv2CsuGktG9nqyg"
  );
}

const supabase = window.supabaseClient;

async function mostrarServico(servico) {
    const { data, error } = await supabase
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

    const { data, error } = await supabase.auth.signUp({
        email,
        password: senha
    });

    if (error) {
        alert(error.message);
        return;
    }

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

    alert("Cadastro realizado!");
    window.location.href = "login.html";
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

async function logout() {
    await supabase.auth.signOut();
    window.location.href = "login.html";
}

async function protegerPagina() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
        window.location.href = "login.html";
    }
}

if (window.location.pathname.includes("servicos.html")) {
    protegerPagina();
}

async function contatoWhats(nomeFreela, bairroFreela, servico) {
    const numeroTaskUp = "5531992111470";

    const { data } = await supabase.auth.getUser();
    const userId = data.user.id;

    const { data: usuario } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", userId)
        .single();

    let dados = usuario.tipo === "empresa"
        ? `Empresa: ${usuario.empresa}
CNPJ: ${usuario.cnpj}`
        : `Nome: ${usuario.nome}
CPF: ${usuario.cpf}`;

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
