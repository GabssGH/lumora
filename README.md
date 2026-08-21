<div align="center">

# 🎬 Lumora

### Descubra o que assistir. Favorite. Continue de onde parou.

Um painel interativo de filmes e séries — busque títulos, veja pôster, sinopse e avaliação, monte sua lista de favoritos e acesse tudo isso em português, inglês, espanhol, francês, alemão, italiano ou japonês.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TMDB](https://img.shields.io/badge/Dados-TMDB%20API-01B4E4?logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)
[![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-222?logo=github)](https://gabssgh.github.io/lumora/)
[![License](https://img.shields.io/badge/uso-portfólio%20pessoal-lightgrey)]()

### 🔗 [Acesse o site publicado](https://gabssgh.github.io/lumora/)

</div>

---

## 📌 Sobre o projeto

**Lumora** é um projeto de portfólio que recria a experiência de navegar por um catálogo de streaming — pensado do zero para treinar consumo de API, gerenciamento de estado, autenticação, internacionalização e design de interface responsiva em React.

Não é afiliado a nenhum serviço de streaming: os dados de filmes e séries vêm da [TMDB](https://www.themoviedb.org/), e toda a identidade visual (nome, paleta, tipografia) foi criada especificamente para este projeto.

## ✨ Funcionalidades

| | |
|---|---|
| 🔎 **Busca em tempo real** | Encontre filmes e séries digitando o título, com resultados atualizados enquanto você digita |
| 🖼️ **Ficha completa** | Pôster, título, sinopse e avaliação de cada título, num modal de detalhes |
| ❤️ **Favoritos** | Salve títulos com um clique — funciona até sem criar conta |
| 🎭 **Filtro por gênero** | Explore por categoria, combinando resultados de filme e série |
| ♾️ **Scroll infinito** | Novos títulos carregam automaticamente conforme você rola a página |
| 🌗 **Tema claro/escuro** | Alternância instantânea, com preferência salva |
| 🌍 **7 idiomas** | Português, English, Español, Français, Deutsch, Italiano, 日本語 |
| 🔐 **Conta opcional** | Login por e-mail/senha via Firebase sincroniza favoritos entre dispositivos — mas nunca é obrigatório |
| 📱 **100% responsivo** | Layout pensado mobile-first |

## 🧱 Tecnologias

- **React 18** + **Vite** — base da aplicação
- **React Router** — navegação entre páginas
- **react-i18next** — internacionalização
- **Firebase** (Authentication + Firestore) — conta de usuário e sincronização de favoritos, de forma opcional
- **TMDB API** — fonte dos dados de filmes e séries

## 🎨 Identidade visual

O design segue um conceito de "marquise de cinema": fundo escuro, tipografia condensada nos títulos, acentos em dourado e coral, e selos de avaliação inspirados em canhotos de ingresso — uma forma de fugir do visual genérico de dashboard e criar algo com personalidade própria.

## 🚀 Rodando o projeto localmente

```bash
git clone https://github.com/gabssgh/lumora.git
cd lumora
npm install
cp .env.example .env
```

Preencha o `.env` com sua chave gratuita da [TMDB](https://www.themoviedb.org/settings/api) (obrigatória para carregar o catálogo) e, se quiser ativar login de verdade, com as credenciais de um projeto [Firebase](https://console.firebase.google.com/) (opcional).

```bash
npm run dev
```

O site abre em `http://localhost:5173`.

> Sem chave do Firebase configurada, o site funciona normalmente em **modo convidado**: busca, filtros e favoritos continuam ativos, salvos no `localStorage`.

## 📁 Estrutura do código

```
src/
  components/   componentes de UI (Navbar, MovieCard, modais, filtros...)
  context/      Theme, Auth e Favorites (React Context)
  locales/      arquivos de tradução (pt, en, es, fr, de, it, ja)
  pages/        Home e Favoritos
  services/     integração com a API do TMDB
  firebase.js   inicialização do Firebase
  i18n.js       configuração do react-i18next
```

## 🗺️ Próximos passos

- [ ] Página de detalhes dedicada (em vez de modal)
- [ ] Recomendações baseadas nos favoritos
- [ ] Trailers integrados via YouTube

## 📄 Licença

Projeto de portfólio pessoal, criado para fins de estudo e demonstração de habilidades. Sinta-se à vontade para explorar o código como referência.

---

<div align="center">

Feito por **Gabriel Herrera** — [GitHub](https://github.com/gabssgh) · [LinkedIn](www.linkedin.com/in/gabriel-herrera-806bb4367)

</div>
