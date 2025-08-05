
package model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class InvestmentWallet extends Wallet {
    private Investment investment;

    public InvestmentWallet(String id, BigDecimal balance, Investment investment) {
        super(id, balance, new java.util.ArrayList<>());
        this.investment = investment;
    }

    @Override
    public String toString() {
        return "Carteira de Investimento: " + investment.getName() + ", Saldo: R$ " + getBalance();
    }
}
