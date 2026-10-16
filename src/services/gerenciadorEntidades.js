import dadosIniciais from "../data/dados.json";

const STORAGE = "dados_app";

export const carregarDados = () => {
  const dados = localStorage.getItem(STORAGE);
  if (dados) return JSON.parse(dados);

  localStorage.setItem(STORAGE, JSON.stringify(dadosIniciais));
  return dadosIniciais;
};

const salvar = (dados) => {
  localStorage.setItem(STORAGE, JSON.stringify(dados));
};

const gerarId = (lista) => {
  if (!lista.length) return 101;
  return Math.max(...lista.map((i) => i.id)) + 1;
};

// USUARIO
export const cadastrarUsuario = (dados, form) => {
  const novoUsuario = { 
    id: gerarId(dados.usuarios), 
    senha: form.senha || "123", // Garante senha padrão no cadastro manual
    ...form 
  };
  
  const atualizado = {
    ...dados,
    usuarios: [...dados.usuarios, novoUsuario]
  };
  
  salvar(atualizado);
  return atualizado;
};

export const login = (dados, email, senha) => {
  return dados.usuarios.find(
    (u) => u.email === email && u.senha === senha
  );
};

// ANIMAL
export const cadastrarAnimal = (dados, form) => {
  const novo = { id: gerarId(dados.animais), ...form };

  const atualizado = {
    ...dados,
    animais: [...dados.animais, novo]
  };

  salvar(atualizado);
  return atualizado;
};

export const excluirAnimal = (dados, id) => {
  const atualizado = {
    ...dados,
    animais: dados.animais.filter((a) => a.id !== id)
  };

  salvar(atualizado);
  return atualizado;
};

// ADOÇÃO
export function registrarAdocao(dadosAtuais, idAnimal, idAdotante) {
  const jaExiste = dadosAtuais.adocoes.some(
    (a) => Number(a.animalId) === Number(idAnimal) && Number(a.adotanteId) === Number(idAdotante)
  );

  if (jaExiste) {
    return dadosAtuais;
  }

  const novaAdocao = {
    id: dadosAtuais.adocoes.length > 0 ? Math.max(...dadosAtuais.adocoes.map(a => a.id)) + 1 : 1,
    animalId: Number(idAnimal),
    adotanteId: Number(idAdotante),
    status: "Pendente" // Status inicial da triagem
  };

  const dadosAtualizados = {
    ...dadosAtuais,
    adocoes: [...dadosAtuais.adocoes, novaAdocao]
  };

  localStorage.setItem("dados_app", JSON.stringify(dadosAtualizados));
  return dadosAtualizados;
}

// OPERAÇÃO REMOVER
export const excluirRegistro = (dados, chaveEntidade, idParaRemover) => {
  const listaFiltrada = dados[chaveEntidade].filter(item => item.id !== idParaRemover);
  
  const atualizado = {
    ...dados,
    [chaveEntidade]: listaFiltrada
  };

  salvar(atualizado);
  return atualizado;
};
