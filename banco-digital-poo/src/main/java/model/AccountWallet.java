
package model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AccountWallet extends Wallet {
    private String pixKey;

    public AccountWallet(String id, BigDecimal balance, String pixKey) {
        super(id, balance, null);
        this.pixKey = pixKey;
    }
}
