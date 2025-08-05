
package repository;

import model.AccountWallet;

public interface AccountRepository extends CommonsRepository<AccountWallet> {
    AccountWallet findByPixKey(String pixKey);
}
