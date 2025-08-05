import exception.AccountNotFoundException;
import exception.InvestmentNotFoundException;
import exception.NoFundsEnoughException;
import exception.PixInUseException;
import model.AccountWallet;
import model.Investment;
import model.InvestmentWallet;
import model.MoneyAudit;
import repository.AccountRepository;
import repository.AccountRepositoryImpl;
import repository.InvestmentRepository;
import repository.InvestmentRepositoryImpl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Scanner;
import java.util.UUID;

public class Main {

    private static final AccountRepository accountRepository = new AccountRepositoryImpl();
    private static final InvestmentRepository investmentRepository = new InvestmentRepositoryImpl();
    private static final Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        while (true) {
            printMenu();
            int choice = scanner.nextInt();
            scanner.nextLine(); // consume newline

            switch (choice) {
                case 1 -> createAccount();
                case 2 -> createInvestment();
                case 3 -> makeInvestment();
                case 4 -> deposit();
                case 5 -> withdraw();
                case 6 -> transfer();
                case 7 -> invest();
                case 8 -> withdrawInvestment();
                case 9 -> listAccounts();
                case 10 -> listInvestments();
                case 11 -> listWallets();
                case 12 -> updateInvestments();
                case 13 -> accountHistory();
                case 14 -> {
                    System.out.println("Saindo...");
                    return;
                }
                default -> System.out.println("Opção inválida.");
            }
        }
    }

    private static void printMenu() {
        System.out.println("\nSelecione a operação desejada:");
        System.out.println("1. Criar uma conta");
        System.out.println("2. Criar um investimento");
        System.out.println("3. Fazer um investimento");
        System.out.println("4. Depositar na conta");
        System.out.println("5. Sacar da conta");
        System.out.println("6. Transferência entre contas");
        System.out.println("7. Investir");
        System.out.println("8. Sacar investimento");
        System.out.println("9. Listar contas");
        System.out.println("10. Listar investimentos");
        System.out.println("11. Listar carteiras de investimento");
        System.out.println("12. Atualizar investimentos");
        System.out.println("13. Histórico de conta");
        System.out.println("14. Sair");
    }

    private static void createAccount() {
        System.out.print("Crie uma chave PIX para a nova conta (ex: email, CPF, telefone): ");
        String pixKey = scanner.nextLine();
        System.out.print("Informe o valor do depósito inicial: ");
        BigDecimal initialDeposit = scanner.nextBigDecimal();
        scanner.nextLine(); // consume newline

        try {
            AccountWallet account = new AccountWallet(UUID.randomUUID().toString(), initialDeposit, pixKey);
            if (initialDeposit.compareTo(BigDecimal.ZERO) > 0) {
                account.getHistory().add(new MoneyAudit(initialDeposit, LocalDateTime.now()));
            }
            accountRepository.create(account);
            System.out.println("\nConta criada com sucesso!");
            System.out.println("Detalhes: " + account);
            System.out.println("Pressione Enter para voltar ao menu.");
            scanner.nextLine();
        } catch (PixInUseException e) {
            System.out.println(e.getMessage());
        }
    }

    private static void createInvestment() {
        System.out.print("Digite o nome do investimento: ");
        String name = scanner.nextLine();
        System.out.print("Digite a taxa de rendimento (ex: 0.01): ");
        BigDecimal rate = scanner.nextBigDecimal();
        scanner.nextLine(); // consume newline

        investmentRepository.create(new Investment(UUID.randomUUID().toString(), name, rate));
        System.out.println("Investimento criado com sucesso!");
    }

    private static void makeInvestment() {
        // Este método é um alias para invest(), conforme solicitado.
        invest();
    }

    private static void deposit() {
        System.out.print("Informe a chave PIX da conta para depósito: ");
        String pixKey = scanner.nextLine();
        System.out.print("Informe o valor que será depositado: ");
        BigDecimal amount = scanner.nextBigDecimal();
        scanner.nextLine(); // consume newline

        try {
            AccountWallet account = accountRepository.findByPixKey(pixKey);
            account.setBalance(account.getBalance().add(amount));            account.getHistory().add(new MoneyAudit(amount, LocalDateTime.now()));            System.out.println("DEBUG Main.deposit: Histórico antes do update: " + account.getHistory().size());            accountRepository.update(account);            System.out.println("\nDepósito de R$ " + amount + " realizado com sucesso na conta PIX: " + pixKey + "!");
            System.out.println("Novo saldo: R$ " + account.getBalance());
        } catch (AccountNotFoundException e) {
            System.out.println(e.getMessage());
        }
    }

    private static void withdraw() {
        System.out.print("Informe a chave PIX da conta para saque: ");
        String pixKey = scanner.nextLine();
        System.out.print("Informe o valor que será sacado: ");
        BigDecimal amount = scanner.nextBigDecimal();
        scanner.nextLine(); // consume newline

        try {
            AccountWallet account = accountRepository.findByPixKey(pixKey);
            if (account.getBalance().compareTo(amount) < 0) {
                throw new NoFundsEnoughException("Saldo insuficiente.");
            }
            account.setBalance(account.getBalance().subtract(amount));            account.getHistory().add(new MoneyAudit(amount.negate(), LocalDateTime.now()));            System.out.println("DEBUG Main.withdraw: Histórico antes do update: " + account.getHistory().size());            accountRepository.update(account);            System.out.println("\nSaque de R$ " + amount + " realizado com sucesso da conta PIX: " + pixKey + "!");
            System.out.println("Novo saldo: R$ " + account.getBalance());
        } catch (AccountNotFoundException | NoFundsEnoughException e) {
            System.out.println(e.getMessage());
        }
    }

    private static void transfer() {
        System.out.print("Informe a chave PIX da conta de origem: ");
        String fromPixKey = scanner.nextLine();
        System.out.print("Informe a chave PIX da conta de destino: ");
        String toPixKey = scanner.nextLine();
        System.out.print("Informe o valor que será transferido: ");
        BigDecimal amount = scanner.nextBigDecimal();
        scanner.nextLine(); // consume newline

        try {
            AccountWallet fromAccount = accountRepository.findByPixKey(fromPixKey);
            AccountWallet toAccount = accountRepository.findByPixKey(toPixKey);

            if (fromAccount.getBalance().compareTo(amount) < 0) {
                throw new NoFundsEnoughException("Saldo insuficiente.");
            }

            fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
            fromAccount.getHistory().add(new MoneyAudit(amount.negate(), LocalDateTime.now()));
            System.out.println("DEBUG Main.transfer (fromAccount): Histórico antes do update: " + fromAccount.getHistory().size());
            accountRepository.update(fromAccount);

            toAccount.setBalance(toAccount.getBalance().add(amount));
            toAccount.getHistory().add(new MoneyAudit(amount, LocalDateTime.now()));
            System.out.println("DEBUG Main.transfer (toAccount): Histórico antes do update: " + toAccount.getHistory().size());
            accountRepository.update(toAccount);

            System.out.println("\nTransferência de R$ " + amount + " da conta PIX: " + fromPixKey + " para a conta PIX: " + toPixKey + " realizada com sucesso!");
            System.out.println("Novo saldo da conta de origem: R$ " + fromAccount.getBalance());
            System.out.println("Novo saldo da conta de destino: R$ " + toAccount.getBalance());
        } catch (AccountNotFoundException | NoFundsEnoughException e) {
            System.out.println(e.getMessage());
        }
    }

    private static void invest() {
        System.out.print("Informe a chave PIX da conta para investimento: ");
        String pixKey = scanner.nextLine();
        System.out.print("Informe o identificador do investimento: ");
        String investmentId = scanner.nextLine();

        try {
            Investment investment = investmentRepository.findById(investmentId);
            System.out.println("Você selecionou: " + investment);

            System.out.print("Informe o valor que será investido: ");
            BigDecimal amount = scanner.nextBigDecimal();
            scanner.nextLine(); // consume newline

            AccountWallet account = accountRepository.findByPixKey(pixKey);

            if (account.getBalance().compareTo(amount) < 0) {
                throw new NoFundsEnoughException("Saldo insuficiente na conta principal.");
            }

            // Encontrar ou criar a InvestmentWallet para este investimento
            InvestmentWallet investmentWallet = account.getInvestmentWallets().stream()
                    .filter(iw -> iw.getInvestment().getId().equals(investmentId))
                    .findFirst()
                    .orElseGet(() -> {
                        InvestmentWallet newInvestmentWallet = new InvestmentWallet(UUID.randomUUID().toString(), BigDecimal.ZERO, investment);
                        account.getInvestmentWallets().add(newInvestmentWallet);
                        return newInvestmentWallet;
                    });

            // Transferir da conta principal para a carteira de investimento
            account.setBalance(account.getBalance().subtract(amount));
            account.getHistory().add(new MoneyAudit(amount.negate(), LocalDateTime.now()));
            accountRepository.update(account);

            investmentWallet.setBalance(investmentWallet.getBalance().add(amount));
            investmentWallet.getHistory().add(new MoneyAudit(amount, LocalDateTime.now()));

            System.out.println("\nInvestimento de R$ " + amount + " em " + investment.getName() + " realizado com sucesso!");
            System.out.println("Novo saldo da conta principal: R$ " + account.getBalance());
            System.out.println("Novo saldo da carteira de investimento: R$ " + investmentWallet.getBalance());

        } catch (AccountNotFoundException | InvestmentNotFoundException | NoFundsEnoughException e) {
            System.out.println(e.getMessage());
        }
    }

    private static void withdrawInvestment() {
        System.out.print("Informe a chave PIX da conta para resgate do investimento: ");
        String pixKey = scanner.nextLine();
        System.out.print("Informe o identificador do investimento: ");
        String investmentId = scanner.nextLine();
        System.out.print("Informe o valor que será sacado: ");
        BigDecimal amount = scanner.nextBigDecimal();
        scanner.nextLine(); // consume newline

        try {
            AccountWallet account = accountRepository.findByPixKey(pixKey);
            Investment investment = investmentRepository.findById(investmentId);

            InvestmentWallet investmentWallet = account.getInvestmentWallets().stream()
                    .filter(iw -> iw.getInvestment().getId().equals(investmentId))
                    .findFirst()
                    .orElseThrow(() -> new InvestmentNotFoundException("Carteira de investimento não encontrada para este investimento."));

            if (investmentWallet.getBalance().compareTo(amount) < 0) {
                throw new NoFundsEnoughException("Saldo insuficiente na carteira de investimento.");
            }

            // Transferir da carteira de investimento para a conta principal
            investmentWallet.setBalance(investmentWallet.getBalance().subtract(amount));
            investmentWallet.getHistory().add(new MoneyAudit(amount.negate(), LocalDateTime.now()));

            account.setBalance(account.getBalance().add(amount));
            account.getHistory().add(new MoneyAudit(amount, LocalDateTime.now()));
            accountRepository.update(account);

            System.out.println("\nResgate de R$ " + amount + " do investimento " + investment.getName() + " realizado com sucesso!");
            System.out.println("Novo saldo da conta principal: R$ " + account.getBalance());
            System.out.println("Novo saldo da carteira de investimento: R$ " + investmentWallet.getBalance());

        } catch (AccountNotFoundException | InvestmentNotFoundException | NoFundsEnoughException e) {
            System.out.println(e.getMessage());
        }
    }

    private static void listAccounts() {
        System.out.println("\n--- Contas ---");
        accountRepository.findAll().forEach(System.out::println);
    }

    private static void listInvestments() {
        System.out.println("\n--- Investimentos ---");
        investmentRepository.findAll().forEach(System.out::println);
    }

    private static void listWallets() {
        System.out.print("Informe a chave PIX da conta para listar as carteiras de investimento: ");
        String pixKey = scanner.nextLine();

        try {
            AccountWallet account = accountRepository.findByPixKey(pixKey);
            System.out.println("\n--- Carteiras de Investimento da Conta " + account.getPixKey() + " ---");
            if (account.getInvestmentWallets().isEmpty()) {
                System.out.println("Nenhuma carteira de investimento encontrada para esta conta.");
            } else {
                account.getInvestmentWallets().forEach(System.out::println);
            }
        } catch (AccountNotFoundException e) {
            System.out.println(e.getMessage());
        }
    }

    private static void updateInvestments() {
        System.out.println("Funcionalidade ainda não implementada.");
    }

    private static void accountHistory() {
        System.out.print("Informe a chave PIX da conta para verificar extrato: ");
        String pixKey = scanner.nextLine();

        try {
            AccountWallet account = accountRepository.findByPixKey(pixKey);
            System.out.println("\n--- Histórico da Conta " + account.getPixKey() + " ---");
            account.getHistory().forEach(System.out::println);
        } catch (AccountNotFoundException e) {
            System.out.println(e.getMessage());
        }
    }
}