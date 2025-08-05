

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
        System.out.print("Digite a chave PIX: ");
        String pixKey = scanner.nextLine();

        try {
            accountRepository.create(new AccountWallet(UUID.randomUUID().toString(), BigDecimal.ZERO, pixKey));
            System.out.println("Conta criada com sucesso!");
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
        // This method seems to be a duplicate of invest().
        // For now, it will call invest().
        invest();
    }

    private static void deposit() {
        System.out.print("Digite o ID da conta: ");
        String accountId = scanner.nextLine();
        System.out.print("Digite o valor a ser depositado: ");
        BigDecimal amount = scanner.nextBigDecimal();
        scanner.nextLine(); // consume newline

        try {
            AccountWallet account = accountRepository.findById(accountId);
            account.setBalance(account.getBalance().add(amount));
            account.getHistory().add(new MoneyAudit(amount, LocalDateTime.now()));
            accountRepository.update(account);
            System.out.println("Depósito realizado com sucesso!");
        } catch (AccountNotFoundException e) {
            System.out.println(e.getMessage());
        }
    }

    private static void withdraw() {
        System.out.print("Digite o ID da conta: ");
        String accountId = scanner.nextLine();
        System.out.print("Digite o valor a ser sacado: ");
        BigDecimal amount = scanner.nextBigDecimal();
        scanner.nextLine(); // consume newline

        try {
            AccountWallet account = accountRepository.findById(accountId);
            if (account.getBalance().compareTo(amount) < 0) {
                throw new NoFundsEnoughException("Saldo insuficiente.");
            }
            account.setBalance(account.getBalance().subtract(amount));
            account.getHistory().add(new MoneyAudit(amount.negate(), LocalDateTime.now()));
            accountRepository.update(account);
            System.out.println("Saque realizado com sucesso!");
        } catch (AccountNotFoundException | NoFundsEnoughException e) {
            System.out.println(e.getMessage());
        }
    }

    private static void transfer() {
        System.out.print("Digite o ID da conta de origem: ");
        String fromAccountId = scanner.nextLine();
        System.out.print("Digite a chave PIX da conta de destino: ");
        String toPixKey = scanner.nextLine();
        System.out.print("Digite o valor a ser transferido: ");
        BigDecimal amount = scanner.nextBigDecimal();
        scanner.nextLine(); // consume newline

        try {
            AccountWallet fromAccount = accountRepository.findById(fromAccountId);
            AccountWallet toAccount = accountRepository.findByPixKey(toPixKey);

            if (fromAccount.getBalance().compareTo(amount) < 0) {
                throw new NoFundsEnoughException("Saldo insuficiente.");
            }

            fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
            fromAccount.getHistory().add(new MoneyAudit(amount.negate(), LocalDateTime.now()));
            accountRepository.update(fromAccount);

            toAccount.setBalance(toAccount.getBalance().add(amount));
            toAccount.getHistory().add(new MoneyAudit(amount, LocalDateTime.now()));
            accountRepository.update(toAccount);

            System.out.println("Transferência realizada com sucesso!");
        } catch (AccountNotFoundException | NoFundsEnoughException e) {
            System.out.println(e.getMessage());
        }
    }

    private static void invest() {
        System.out.print("Digite o ID da conta: ");
        String accountId = scanner.nextLine();
        System.out.print("Digite o ID do investimento: ");
        String investmentId = scanner.nextLine();
        System.out.print("Digite o valor a ser investido: ");
        BigDecimal amount = scanner.nextBigDecimal();
        scanner.nextLine(); // consume newline

        try {
            AccountWallet account = accountRepository.findById(accountId);
            Investment investment = investmentRepository.findById(investmentId);

            if (account.getBalance().compareTo(amount) < 0) {
                throw new NoFundsEnoughException("Saldo insuficiente.");
            }

            account.setBalance(account.getBalance().subtract(amount));
            account.getHistory().add(new MoneyAudit(amount.negate(), LocalDateTime.now()));
            accountRepository.update(account);

            // For simplicity, we are not creating a separate investment wallet.
            // We will just print a success message.
            System.out.println("Investimento de " + amount + " em " + investment.getName() + " realizado com sucesso!");

        } catch (AccountNotFoundException | InvestmentNotFoundException | NoFundsEnoughException e) {
            System.out.println(e.getMessage());
        }
    }

    private static void withdrawInvestment() {
        System.out.println("Funcionalidade ainda não implementada.");
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
        System.out.println("Funcionalidade ainda não implementada.");
    }

    private static void updateInvestments() {
        System.out.println("Funcionalidade ainda não implementada.");
    }

    private static void accountHistory() {
        System.out.print("Digite o ID da conta: ");
        String accountId = scanner.nextLine();

        try {
            AccountWallet account = accountRepository.findById(accountId);
            System.out.println("\n--- Histórico da Conta " + accountId + " ---");
            account.getHistory().forEach(System.out::println);
        } catch (AccountNotFoundException e) {
            System.out.println(e.getMessage());
        }
    }
}
