
package model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class InvestmentWallet extends Wallet {
    public InvestmentWallet(String id, BigDecimal balance) {
        super(id, balance, null);
    }
}
