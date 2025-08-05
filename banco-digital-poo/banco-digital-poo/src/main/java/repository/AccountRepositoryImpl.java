
package repository;

import exception.AccountNotFoundException;
import exception.PixInUseException;
import model.AccountWallet;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class AccountRepositoryImpl implements AccountRepository {

    private static final List<AccountWallet> ACCOUNTS = new ArrayList<>();

    @Override
    public void create(AccountWallet entity) {
        if (ACCOUNTS.stream().anyMatch(account -> account.getPixKey().equals(entity.getPixKey()))) {
            throw new PixInUseException("Chave PIX já cadastrada.");
        }
        ACCOUNTS.add(entity);
    }

    @Override
    public AccountWallet findById(String id) {
        return ACCOUNTS.stream()
                .filter(account -> Objects.equals(account.getId(), id))
                .findFirst()
                .orElseThrow(() -> new AccountNotFoundException("Conta não encontrada."));
    }

    @Override
    public List<AccountWallet> findAll() {
        return ACCOUNTS;
    }

    @Override
    public void update(AccountWallet entity) {
        AccountWallet account = findById(entity.getId());
        account.setBalance(entity.getBalance());
        // Limpar o histórico existente e adicionar todos os elementos da entidade
        account.getHistory().clear();
        account.getHistory().addAll(entity.getHistory());
        account.setInvestmentWallets(entity.getInvestmentWallets());
        System.out.println("DEBUG AccountRepositoryImpl.update: Histórico da entity recebida: " + entity.getHistory().size());
        System.out.println("DEBUG AccountRepositoryImpl.update: Histórico da conta no repositório após update: " + account.getHistory().size());
    }

    @Override
    public AccountWallet findByPixKey(String pixKey) {
        return ACCOUNTS.stream()
                .filter(account -> Objects.equals(account.getPixKey(), pixKey))
                .findFirst()
                .orElseThrow(() -> new AccountNotFoundException("Conta não encontrada."));
    }
}
