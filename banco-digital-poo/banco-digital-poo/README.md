
# Banco Digital POO

Este projeto é uma aplicação Java orientada a objetos, desenvolvida com o objetivo de consolidar conceitos fundamentais da programação orientada a objetos (POO), como herança, encapsulamento, polimorfismo, abstração e reuso de código.

A aplicação simula um sistema bancário básico que permite a criação de contas, depósitos, saques, transferências via PIX, criação de investimentos e acompanhamento de histórico de transações.

## Estrutura do Projeto

O projeto está organizado nos seguintes pacotes:

- `exception`: Contém as classes de exceção customizadas.
- `model`: Contém as classes de modelo de dados (entidades).
- `repository`: Contém as interfaces e implementações dos repositórios para persistência de dados em memória.
- `Main`: Contém a classe principal que executa a aplicação.

## Como Executar

Para executar a aplicação, você precisa ter o Java e o Gradle instalados. Em seguida, execute os seguintes comandos no terminal, a partir da raiz do projeto:

```bash
gradle build
gradle run
```

## Funcionalidades

A aplicação oferece as seguintes funcionalidades:

- Criar uma conta
- Criar um investimento
- Fazer um investimento
- Depositar na conta
- Sacar da conta
- Transferência entre contas
- Investir
- Sacar investimento
- Listar contas
- Listar investimentos
- Listar carteiras de investimento
- Atualizar investimentos
- Histórico de conta
- Sair
