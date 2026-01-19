// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeW5reG1kc3lkYm1rZHR0ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MTQ3NzEsImV4cCI6MjA4NDI5MDc3MX0.Dvbijztg4bHPcxgjVhpfGcAfwNJrbv2CsuGktG9nqyg

// ===============================
// SUPABASE CLIENT (ÚNICO)
// ===============================
const supabase = window.supabase.createClient(
  "https://bfynkxmdsydbmkdttdok.supabase.co",
  "COLE_SUA_ANON_KEY_AQUI"
);

// ===============================
// LOGIN
// ===============================
async function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha
  });

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "servicos.html";
}

// ===============================
// REGISTRO
// ===============================
async function registrar() {
  const tipo = document.getElementById("tipo").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (!tipo || !email || !senha) {
    alert("Preencha todos os campos");
    return;
  }

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

  window.location.href = "servicos.html";
}

// ===============================
// TROCAR TIPO
// ===============================
function trocarTipo() {
  document.getElementById("empresaCampos").style.display = "none";
  document.getElementById("pessoaCampos").style.display = "none";

  const tipo = document.getElementById("tipo").value;

  if (tipo === "empresa") {
    document.getElementById("empresaCampos").style.display = "block";
  }

  if (tipo === "pessoa") {
    document.getElementById("pessoaCampos").style.display = "block";
  }
}

// ===============================
// PROTEÇÃO DE PÁGINA
// ===============================
async function protegerPagina() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    window.location.replace("login.html");
  }
}

// ===============================
// SERVIÇOS (executa só se existir)
// ===============================
if (window.location.pathname.includes("servicos.html")) {
  protegerPagina();
}