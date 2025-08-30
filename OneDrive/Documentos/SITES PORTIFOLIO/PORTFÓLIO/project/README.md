# Meu Portfólio Pessoal

Este é o meu portfólio pessoal, desenvolvido para apresentar minhas habilidades, projetos e experiências na área de desenvolvimento de software. O objetivo é fornecer uma visão abrangente do meu trabalho e facilitar o contato para oportunidades profissionais.

## Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

*   **React**: Biblioteca JavaScript para construção de interfaces de usuário.
*   **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
*   **Vite**: Ferramenta de build rápida para projetos web modernos.
*   **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
*   **react-slick**: Componente de carrossel/slider para React.
*   **lucide-react**: Biblioteca de ícones.

## Funcionalidades

O portfólio inclui as seguintes seções principais:

*   **Sobre Mim**: Uma introdução sobre minha trajetória, paixões e objetivos.
*   **Habilidades e Conhecimentos**: Detalhes sobre as tecnologias e ferramentas que domino.
*   **Projetos**: Uma galeria dos meus principais projetos, com descrições e links.
*   **Contato**: Informações para entrar em contato comigo (email, LinkedIn, GitHub, WhatsApp).

## Como Instalar e Rodar o Projeto Localmente

Se você deseja clonar este repositório e rodar o projeto em sua máquina local, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter o Node.js e o npm (ou Yarn) instalados em sua máquina.

*   [Node.js](https://nodejs.org/en/download/) (inclui npm)

### Passos para Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
    ```

    **Nota:** Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub e `SEU_REPOSITORIO` pelo nome do repositório onde você irá hospedar este portfólio.

2.  **Navegue até o diretório do projeto:**

    ```bash
    cd SEU_REPOSITORIO
    ```

3.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    yarn install
    ```

### Como Rodar o Projeto

Após a instalação das dependências, você pode iniciar o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

O projeto será iniciado em `http://localhost:5173` (ou outra porta disponível). Você pode abrir essa URL no seu navegador para visualizar o portfólio.

### Como Construir para Produção

Para gerar uma versão otimizada do portfólio para implantação em produção:

```bash
npm run build
# ou
yarn build
```

Os arquivos de produção serão gerados na pasta `dist/`.

## Implantação (Vercel)

Este projeto é ideal para ser implantado em plataformas como o Vercel, que oferecem hospedagem gratuita e fácil integração com repositórios GitHub.

### Passos para Implantação no Vercel

1.  **Crie uma conta no Vercel** (se ainda não tiver): [vercel.com](https://vercel.com/)
2.  **Conecte seu repositório GitHub** ao Vercel.
3.  **Importe o projeto** do seu repositório.
4.  O Vercel detectará automaticamente que é um projeto Vite/React e configurará o processo de build.
5.  **Implante o projeto.**

O Vercel cuidará da configuração de HTTPS automaticamente para seu domínio.

## Contribuição

Sinta-se à vontade para explorar o código. Se tiver sugestões ou encontrar problemas, por favor, abra uma issue ou entre em contato.

## Licença

Este projeto está licenciado sob a licença MIT.