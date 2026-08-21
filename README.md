# 🎬 Lumora

Painel interativo de filmes e séries — busque títulos, veja pôster, sinopse e avaliação, favorite, filtre por gênero, troque entre 7 idiomas e alterne entre tema claro/escuro. Projeto de portfólio construído com **React + Vite**, dados da **TMDB** e autenticação/armazenamento em nuvem opcional via **Firebase**.

## ✨ Funcionalidades

- 🔎 Busca de filmes e séries em tempo real (com debounce)
- 🖼️ Pôster, título, sinopse e avaliação de cada título
- ❤️ Favoritar/desfavoritar com um clique
- 📱 Layout 100% responsivo (mobile-first)
- 🎭 Filtro por gênero
- 🌗 Tema claro/escuro persistido
- 💾 Favoritos salvos no `localStorage` — funcionam mesmo sem conta
- 🌍 Interface em 7 idiomas: Português, English, Español, Français, Deutsch, Italiano, 日本語
- 🔐 Conta opcional (e-mail/senha via Firebase) que sincroniza os favoritos entre dispositivos

## 🧱 Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) para navegação
- [react-i18next](https://react.i18next.com/) para internacionalização
- [Firebase](https://firebase.google.com/) (Authentication + Firestore) — **opcional**
- [TMDB API](https://www.themoviedb.org/) como fonte dos dados de filmes/séries

## 🚀 Rodando localmente

```bash
npm install
cp .env.example .env
```

Preencha o `.env` (veja a seção abaixo) e depois:

```bash
npm run dev
```

O site abre em `http://localhost:5173`.

## 🔑 Configurando as chaves

### TMDB (obrigatório para carregar filmes/séries)

1. Crie uma conta grátis em https://www.themoviedb.org
2. Vá em **Configurações → API** e gere uma chave (v3 auth)
3. Cole em `VITE_TMDB_API_KEY` no `.env`

Sem essa chave, o site sobe normalmente mas mostra um aviso no lugar da lista de filmes — não existe forma de consultar o catálogo do TMDB sem uma chave, mesmo anonimamente, pois isso é uma exigência da própria API deles (gratuita, mas obrigatória).

### Firebase (opcional — só necessário para "criar conta")

1. Crie um projeto em https://console.firebase.google.com
2. **Authentication** → ative o provedor "E-mail/senha"
3. **Firestore Database** → crie um banco (pode começar em modo teste)
4. Em **Configurações do projeto → Seus apps**, crie um app Web e copie as chaves para o `.env`

Sem Firebase configurado, o site funciona 100% em **modo convidado**: busca, filtros, favoritos (via `localStorage`) e troca de idioma/tema continuam funcionando — só o botão "Entrar" avisa que a conta ainda não está disponível.

## 📁 Estrutura

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

## 🏗️ Build para produção

```bash
npm run build
npm run preview
```

O build final fica em `dist/`, pronto para publicar em Vercel, Netlify, GitHub Pages, etc.

## ⚠️ Nota

<<<<<<< HEAD
Este é um projeto de portfólio pessoal. Não é afiliado à Netflix, Amazon Prime Video, HBO Max ou qualquer outro serviço de streaming — a semelhança visual é só uma referência de estilo.
=======
---

<div align="center">

Feito por **Gabriel Herrera** — [GitHub](https://github.com/GabssGH) · [LinkedIn](https://www.linkedin.com/in/gabriel-herrera-806bb4367/)

</div>
>>>>>>> 60f7280d1aaffdc8c538c5b8648b30cadb893d2a
