
package model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Wallet {
    private String id;
    private BigDecimal balance;
    private List<MoneyAudit> history = new ArrayList<>();
}
