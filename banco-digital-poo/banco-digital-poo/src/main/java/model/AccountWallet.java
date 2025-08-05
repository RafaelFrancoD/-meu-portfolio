
package model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AccountWallet extends Wallet {
    private String pixKey;
    private List<InvestmentWallet> investmentWallets = new ArrayList<>();

    public AccountWallet(String id, BigDecimal balance, String pixKey) {
        super(id, balance, new java.util.ArrayList<>());
        this.pixKey = pixKey;
    }

    @Override
    public String toString() {
        return "Conta PIX: " + pixKey + ", Saldo: R$ " + getBalance();
    }
}
