import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { carregarDados, excluirRegistro } from "../../services/gerenciadorEntidades";
import "./perfilUsuario.css";

/* Componente de perfil do usuário */
function PerfilUsuario() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dadosApp, setDadosApp] = useState({ animais: [], usuarios: [], adocoes: [] });
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  
  const [idPetEditando, setIdPetEditando] = useState(null);
  const [formEdicao, setFormEdicao] = useState({});
  const [idAdocaoEditando, setIdAdocaoEditando] = useState(null);
  const [observacaoAdocaoEditando, setObservacaoAdocaoEditando] = useState("");

  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [formEdicaoPerfil, setFormEdicaoPerfil] = useState({ nome: "", email: "", telefone: "", cidade: "", estado: "", endereco: "" });

  const [petParaExcluir, setPetParaExcluir] = useState(null);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);

  /* Verifica se estamos em modo público (visualizando perfil de outro tutor) ou modo privado (visualizando próprio perfil) */
  const queryParams = new URLSearchParams(location.search);
  const tutorIdPublico = queryParams.get("tutorId");
  const modoPublico = tutorIdPublico !== null;

  /* Carrega os dados do aplicativo e o usuário logado ao montar o componente ou quando a localização mudar */
  useEffect(() => {
    const dados = carregarDados();
    setDadosApp(dados);

    const usuarioSalvo = localStorage.getItem("usuario_logado");
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
  }, [location]);
 
  /* Função para obter as iniciais do nome do usuário para exibir no avatar */
  const obterIniciais = (nomeCompleto) => {
    if (!nomeCompleto) return "";
    const partes = nomeCompleto.trim().split(/\s+/);
    if (partes.length > 1) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return partes[0][0].toUpperCase();
  };

  /* Função para formatar o número de telefone no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX */
  const formatarTelefone = (telPuro) => {
    if (!telPuro) return "";
    const numeros = telPuro.replace(/\D/g, "");
    if (numeros.length === 11) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }
    if (numeros.length === 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }
    return numeros;
  };
 
  /* Inicia o processo de edição do perfil, preenchendo o formulário com os dados atuais do usuário logado */
  const iniciarEdicaoPerfil = () => {
    setFormEdicaoPerfil({
      nome: usuarioLogado.nome,
      email: usuarioLogado.email,
      telefone: usuarioLogado.telefone || "",
      cidade: usuarioLogado.cidade || "",
      estado: usuarioLogado.estado || "",
      endereco: usuarioLogado.endereco || ""
    });
    setEditandoPerfil(true);
  };
 
  /* Lida com as mudanças nos campos do formulário de edição do perfil, garantindo que o telefone seja formatado corretamente */
  const handleMudancaPerfil = (e) => {
    const { name, value } = e.target;
    if (name === "telefone") {
      const apenasNumeros = value.replace(/\D/g, "").slice(0, 11);
      setFormEdicaoPerfil({ ...formEdicaoPerfil, [name]: apenasNumeros });
    } else {
      setFormEdicaoPerfil({ ...formEdicaoPerfil, [name]: value });
    }
  };
 
  /* Salva as alterações feitas no perfil do usuário, atualizando os dados no localStorage e no estado do aplicativo */
  const salvarEdicaoPerfil = (e) => {
    e.preventDefault();
    const listaUsuariosAtualizada = dadosApp.usuarios.map((u) =>
      u.id === usuarioLogado.id ? { ...u, ...formEdicaoPerfil } : u
    );
    const dadosAtualizados = { ...dadosApp, usuarios: listaUsuariosAtualizada };
    const usuarioSessaoAtualizado = { ...usuarioLogado, ...formEdicaoPerfil };

    localStorage.setItem("dados_app", JSON.stringify(dadosAtualizados));
    localStorage.setItem("usuario_logado", JSON.stringify(usuarioSessaoAtualizado));

    setDadosApp(dadosAtualizados);
    setUsuarioLogado(usuarioSessaoAtualizado);
    setEditandoPerfil(false);
  };
 
  /* Inicia o processo de exclusão de um pet, armazenando o pet selecionado e exibindo a modal de confirmação */
  const handleExcluir = (animal) => {
    setPetParaExcluir(animal);
    setMostrarModalExcluir(true);
  };

  /* Confirma a exclusão do pet selecionado, removendo-o dos dados do aplicativo e atualizando o estado */
  const confirmarExclusaoPet = () => {
    if (!usuarioLogado || !petParaExcluir) return;
    const dadosAtualizados = excluirRegistro(dadosApp, "animais", petParaExcluir.id);
    setDadosApp(dadosAtualizados);
    setMostrarModalExcluir(false);
    setPetParaExcluir(null);
  };
 
  /* Inicia o processo de edição de um pet, preenchendo o formulário com os dados atuais do pet selecionado */
  const iniciarEdicao = (animal) => {
    setIdPetEditando(animal.id);
    setFormEdicao({ ...animal });
  };

  /* Lida com as mudanças nos campos do formulário de edição do pet, atualizando o estado do formulário conforme o usuário digita */
  const handleMudancaEdicao = (e) => {
    const { name, value } = e.target;
    setFormEdicao({ ...formEdicao, [name]: value });
  };
 
  /* Lida com a mudança do campo de upload de imagem, convertendo a imagem selecionada para base64 e armazenando no estado do formulário de edição */
  const handleFileChangeEdicao = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormEdicao({ ...formEdicao, imagem: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  /* Salva as alterações feitas no pet, atualizando os dados no localStorage e no estado do aplicativo, e encerrando o modo de edição */
  const salvarEdicao = (e) => {
    e.preventDefault();
    const listaAnimaisAtualizada = dadosApp.animais.map((pet) =>
      pet.id === formEdicao.id ? formEdicao : pet
    );
    const dadosAtualizados = { ...dadosApp, animais: listaAnimaisAtualizada };
    localStorage.setItem("dados_app", JSON.stringify(dadosAtualizados));
    setDadosApp(dadosAtualizados);
    setIdPetEditando(null); 
  };
 
  /* Inicia o processo de edição de um pedido de adoção, armazenando o ID do pedido e a observação atual para edição */
  const iniciarEdicaoAdocao = (adocao) => {
    setIdAdocaoEditando(adocao.id);
    setObservacaoAdocaoEditando(adocao.observacao || "");
  };

  /* Salva as alterações feitas na observação do pedido de adoção, atualizando os dados no localStorage e no estado do aplicativo, e encerrando o modo de edição */
  const salvarEdicaoAdocao = (idAdocao) => {
    const adocoesAtualizadas = dadosApp.adocoes.map((adocao) =>
      adocao.id === idAdocao ? { ...adocao, observacao: observacaoAdocaoEditando } : adocao
    );
    const dadosAtualizados = { ...dadosApp, adocoes: adocoesAtualizadas };
    localStorage.setItem("dados_app", JSON.stringify(dadosAtualizados));
    setDadosApp(dadosAtualizados);
    setIdAdocaoEditando(null);
  };

  /* Exclui um pedido de adoção, removendo-o dos dados do aplicativo e atualizando o estado */
  const excluirAdocao = (adocao) => {
    const adocoesAtualizadas = dadosApp.adocoes.filter((item) => item.id !== adocao.id);
    const dadosAtualizados = { ...dadosApp, adocoes: adocoesAtualizadas };
    localStorage.setItem("dados_app", JSON.stringify(dadosAtualizados));
    setDadosApp(dadosAtualizados);
  };

  /* Lida com a ação de sair da conta, removendo o usuário logado do localStorage, redirecionando para a página inicial e recarregando a página para atualizar o estado do aplicativo */
  const handleSair = () => {
    localStorage.removeItem("usuario_logado");
    navigate("/");
    window.location.reload();
  };

  /* Determina qual usuário exibir com base no modo (público ou privado) e nos dados disponíveis, garantindo que o perfil correto seja mostrado */
  let usuarioExibir = modoPublico 
    ? dadosApp.usuarios.find((u) => Number(u.id) === Number(tutorIdPublico))
    : usuarioLogado;

  /* Se não houver um usuário logado e não estivermos em modo público, exibe uma mensagem de acesso restrito e um link para a página de login */
  if (!modoPublico && !usuarioLogado) {
    return (
      <main className="perfil-bg-layout">
        <div className="card-dashboard erro-login">
          <h2>Acesso Restrito</h2>
          <p>Nenhum usuário está logado no momento.</p>
          <Link to="/login" className="btn-sair">Ir para Login</Link>
        </div>
      </main>
    );
  }
 
  /* Se o usuário a ser exibido não for encontrado nos dados, exibe uma mensagem de usuário não encontrado */
  if (!usuarioExibir) return <p className="perfil-bg-layout">Usuário não encontrado.</p>;

  /* Filtra os animais cadastrados para exibir apenas aqueles que pertencem ao tutor do perfil sendo visualizado */
  const animaisExibir = dadosApp.animais.filter(
    (animal) => Number(animal.tutorId) === Number(usuarioExibir.id)
  );
 
  /* Filtra os pedidos de adoção para exibir apenas aqueles que foram feitos pelo usuário do perfil sendo visualizado, e depois filtra novamente para mostrar apenas um pedido por pet */
  const adocoesFiltradas = dadosApp.adocoes.filter(
    (adocao) => Number(adocao.adotanteId) === Number(usuarioExibir.id)
  );
 
  /* Filtra os pedidos de adoção para mostrar apenas um pedido por pet, garantindo que o usuário veja apenas um status por pet mesmo que tenha feito múltiplos pedidos para o mesmo pet */
  const minhasAdocoesPedidas = adocoesFiltradas.filter(
    (adocao, index, self) =>
      index === self.findIndex((t) => Number(t.animalId) === Number(adocao.animalId))
  );
 
  /* Retorna o layout do perfil do usuário */
  return (
    <main className="perfil-bg-layout">
      <div className="banner-verde"></div>

      <div className="conteudo-dashboard">
        
        <div className="card-dashboard">
          <div className="perfil-header-top">
            <div className="perfil-info-basica">
              <div className="avatar-quadrado">
                {obterIniciais(usuarioExibir.nome)}
              </div>
              <div className="dados-pessoais">
                {editandoPerfil ? ( /* Exibe o formulário de edição do perfil */
                  <form onSubmit={salvarEdicaoPerfil} className="form-perfil-edicao">
                    <input type="text" name="nome" value={formEdicaoPerfil.nome} onChange={handleMudancaPerfil} placeholder="Nome" required className="input-perfil-campo" />
                    <input type="email" name="email" value={formEdicaoPerfil.email} onChange={handleMudancaPerfil} placeholder="E-mail" required className="input-perfil-campo" />
                    <input type="text" name="telefone" value={formEdicaoPerfil.telefone} onChange={handleMudancaPerfil} placeholder="Telefone" className="input-perfil-campo" />
                    
                    <div className="localidade-row">
                      <input type="text" name="cidade" value={formEdicaoPerfil.cidade} onChange={handleMudancaPerfil} placeholder="Cidade" required className="input-cidade-campo" />
                      <select name="estado" value={formEdicaoPerfil.estado} onChange={handleMudancaPerfil} required className="select-estado-campo">
                        <option value="">UF</option>
                        <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option><option value="AM">AM</option><option value="BA">BA</option><option value="CE">CE</option><option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option><option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option><option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option><option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option><option value="RJ">RJ</option><option value="RN">RN</option><option value="RS">RS</option><option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option><option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
                      </select>
                    </div>

                    <input type="text" name="endereco" value={formEdicaoPerfil.endereco} onChange={handleMudancaPerfil} placeholder="Endereço Completo" required className="input-perfil-campo" />

                    <div className="botoes-acoes-perfil">
                      <button type="submit" className="btn-salvar-dados">Salvar Perfil</button>
                      <button type="button" onClick={() => setEditandoPerfil(false)} className="btn-cancelar-dados">Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h2>{usuarioExibir.nome}</h2> {/* Exibe as informações do perfil do usuário */}
                    <div className="meta-infos">
                      <span>✉️ {usuarioExibir.email}</span>
                      {usuarioExibir.telefone && <span>📞 {formatarTelefone(usuarioExibir.telefone)}</span>}
                      
                      {modoPublico ? (
                        (usuarioExibir.cidade || usuarioExibir.estado) && (
                          <span>📍 {usuarioExibir.cidade}{usuarioExibir.cidade && usuarioExibir.estado ? " - " : ""}{usuarioExibir.estado}</span>
                        )
                      ) : (
                        usuarioExibir.endereco && <span>📍 {usuarioExibir.endereco}, {usuarioExibir.cidade} - {usuarioExibir.estado}</span>
                      )}

                      <span>{animaisExibir.length > 0 ? "👤 Tutor" : "👤 Usuário"}</span>
                      <span>📅 Membro desde 2026</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            {!modoPublico && !editandoPerfil && ( /* Exibe os botões de ação para editar o perfil e sair da conta apenas se estivermos no modo privado e não estivermos editando o perfil */
              <div className="botoes-topo-container">
                <button onClick={iniciarEdicaoPerfil} className="btn-sair-perfil">
                  Editar Perfil
                </button>
                <button onClick={handleSair} className="btn-sair-perfil">
                  Sair da Conta
                </button>
              </div>
            )}
          </div>
 
          {/* Exibe as estatísticas de pets cadastrados e pedidos de adoção, mostrando o número total de cada um para o usuário do perfil sendo visualizado */}
          <div className="estatisticas-grid">
            <div className="stat-box box-amarelo">
              <h3>{animaisExibir.length}</h3>
              <p>Pets Cadastrados</p>
            </div>
            <div className="stat-box box-verde">
              <h3>{minhasAdocoesPedidas.length}</h3>
              <p>Pedidos de Adoção</p>
            </div>
          </div>
        </div>
 
        {/* Exibe a seção de pets cadastrados, mostrando um título diferente dependendo do modo (público ou privado), e um botão para cadastrar pet apenas no modo privado */}
        <div className="card-dashboard">
          <div className="secao-titulo-btn">
            <div>
              <h2>{modoPublico ? "Bichinhos para Adoção" : "Meus Pets"}</h2>
              <p className="subtitulo">Pets cadastrados na plataforma</p>
            </div>
            {!modoPublico && (
              <Link to="/cadastro-bichinho">
                <button className="btn-amarelo-solido">Cadastrar Pet</button>
              </Link>
            )}
          </div>

          {animaisExibir.length === 0 ? (
            <p className="msg-vazia">Nenhum bichinho cadastrado por aqui ainda.</p>
          ) : (
            <div className="pet-grid-moderno">
              {animaisExibir.map((animal) => { /* Verifica se estamos editando o pet atual, e se sim, exibe o formulário de edição do pet ao invés do card normal do pet */
                if (!modoPublico && idPetEditando === animal.id) {
                  return (
                    <div key={animal.id} className="card-dashboard card-edicao-pet">
                      <form onSubmit={salvarEdicao} className="form-edicao">
                        <div className="form-grid-interna">
                          <div className="input-group-interno">
                            <label>Nome do Pet *</label>
                            <input name="nome" value={formEdicao.nome} onChange={handleMudancaEdicao} required className="input-edicao-campo" />
                          </div>
                          <div className="input-group-interno">
                            <label>Idade *</label>
                            <input name="idade" value={formEdicao.idade} onChange={handleMudancaEdicao} required className="input-edicao-campo" />
                          </div>
                          <div className="input-group-interno">
                            <label>Raça *</label>
                            <input name="raca" value={formEdicao.raca} onChange={handleMudancaEdicao} required className="input-edicao-campo" />
                          </div>
                          <div className="input-group-interno">
                            <label>Porte *</label>
                            <select name="porte" value={formEdicao.porte} onChange={handleMudancaEdicao} required className="select-edicao-campo">
                              <option value="Pequeno">Pequeno</option>
                              <option value="Médio">Médio</option>
                              <option value="Grande">Grande</option>
                            </select>
                          </div>
                          <div className="input-group-interno full-width-row">
                            <label>Personalidade / Descrição *</label>
                            <textarea name="personalidade" value={formEdicao.personalidade} onChange={handleMudancaEdicao} required rows="4" placeholder="Conte mais sobre os hábitos e o temperamento do pet..." className="textarea-edicao-campo" />
                          </div>
                          <div className="input-group-interno full-width-row">
                            <label>Alterar Foto do Pet</label>
                            <input type="file" accept="image/*" onChange={handleFileChangeEdicao} className="file-edicao-input" />
                          </div>
                        </div>
                        <div className="botoes-edicao-container">
                          <button type="submit" className="btn-amarelo-solido">Salvar Alterações</button>
                          <button type="button" onClick={() => setIdPetEditando(null)} className="btn-cancelar-pet-edicao">Cancelar</button>
                        </div>
                      </form>
                    </div>
                  );
                }

                let imagemSrc = animal.imagem ? animal.imagem : "img/default.jpg";
                if (animal.imagem && !animal.imagem.startsWith("data:") && !animal.imagem.startsWith("http") && !animal.imagem.startsWith("/")) {
                  imagemSrc = `/${animal.imagem}`;
                }

                /* Exibe o card normal do pet, mostrando as informações básicas e os botões de ação dependendo do modo (público ou privado) */
                return (
                  <div key={animal.id} className="pet-card-moderno">
                    <div className="img-container">
                      <span className="badge-disponivel">Disponível</span>
                      <img src={imagemSrc} alt={animal.nome} onError={(e) => { e.target.src = "https://placehold.co/300x200?text=Pet"; }} />
                    </div>

                    <div className="pet-infos">
                      <div className="nome-idade">
                        <h3 className="nome-pet-texto">{animal.nome}</h3>
                        <span className="idade-texto">{animal.idade || "?"}</span>
                      </div>
                      <p className="raca-texto">{animal.raca} - {animal.genero}</p>
                      
                      {modoPublico ? (
                        <Link to={`/bichinho/${animal.id}`} className="btn-ver-perfil">Ver Perfil</Link>
                      ) : (
                        <div className="botoes-acao-discretos">
                          <button onClick={() => iniciarEdicao(animal)}>Editar</button>
                          <button onClick={() => handleExcluir(animal)} className="txt-perigo">Excluir</button>
                          <Link to={`/bichinho/${animal.id}`} className="btn-ver-perfil">Ver Perfil</Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Exibe a seção de pedidos de adoção, mostrando o status dos pets que o usuário demonstrou interesse, e um botão para incluir interesse apenas no modo privado */}
        {!modoPublico && (
          <div className="card-dashboard">
            <div className="secao-titulo-btn">
              <div>
                <h2>Pedidos de Adoção</h2>
                <p className="subtitulo">Status dos pets que você demonstrou interesse</p>
              </div>
              <Link to="/" state={{ scrollPets: true }}>
                <button className="btn-amarelo-solido">Incluir Interesse</button>
              </Link>
            </div>

            {minhasAdocoesPedidas.length === 0 ? (
              <p className="msg-vazia">Nenhum pedido de adoção cadastrado ainda.</p>
            ) : (
              <div className="adocao-table-wrapper">
                <table className="adocao-table-moderna">
                  <thead>
                    <tr>
                      <th>Pet</th>
                      <th>Status</th>
                      <th>Observação</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {minhasAdocoesPedidas.map((adocao) => {
                      const petRelacionado = dadosApp.animais.find(a => Number(a.id) === Number(adocao.animalId));
                      const editandoAdocao = idAdocaoEditando === adocao.id;
                      return (
                        <tr key={adocao.id}>
                          <td className="tabela-nome-pet">
                            {petRelacionado ? petRelacionado.nome : "Pet não encontrado"}
                          </td>
                          <td>
                            <span className={`badge-status-tabela status-${adocao.status.toLowerCase()}`}>
                              ⏳ {adocao.status}
                            </span>
                          </td>
                          <td className="tabela-observacao-celula">
                            {editandoAdocao ? (
                              <input
                                type="text"
                                value={observacaoAdocaoEditando}
                                onChange={(e) => setObservacaoAdocaoEditando(e.target.value)}
                                className="input-observacao-adocao"
                                placeholder="Ex: tenho espaço e tempo para cuidar"
                              />
                            ) : (
                              <span className="observacao-adocao">{adocao.observacao || "Sem observação"}</span>
                            )}
                          </td>
                          <td>
                            <div className="acoes-adocao">
                              {petRelacionado && <Link to={`/bichinho/${petRelacionado.id}`}>Ver</Link>}
                              {editandoAdocao ? (
                                <>
                                  <button type="button" onClick={() => salvarEdicaoAdocao(adocao.id)}>Salvar</button>
                                  <button type="button" onClick={() => setIdAdocaoEditando(null)} className="btn-tabela-cancelar">Cancelar</button>
                                </>
                              ) : (
                                <button type="button" onClick={() => iniciarEdicaoAdocao(adocao)}>Editar</button>
                              )}
                              <button type="button" onClick={() => excluirAdocao(adocao)} className="txt-perigo">Excluir</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Exibe a modal de confirmação de exclusão do pet, mostrando o nome do pet a ser excluído e as opções para confirmar ou cancelar a exclusão */}
      {mostrarModalExcluir && petParaExcluir && (
        <div className="modal-exclusao-overlay">
          <div className="card-dashboard modal-exclusao-container">
            <span className="modal-exclusao-alerta-icone">⚠️</span>
            <h3>Remover {petParaExcluir.nome}?</h3>
            <p>
              Tem certeza de que deseja remover o(a) <strong>{petParaExcluir.nome}</strong>? Essa ação não poderá ser desfeita na plataforma.
            </p>
            <div className="modal-exclusao-botoes">
              <button onClick={confirmarExclusaoPet} className="btn-modal-confirmar-deletar">
                Sim, Excluir
              </button>
              <button onClick={() => { setMostrarModalExcluir(false); setPetParaExcluir(null); }} className="btn-sair">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default PerfilUsuario;