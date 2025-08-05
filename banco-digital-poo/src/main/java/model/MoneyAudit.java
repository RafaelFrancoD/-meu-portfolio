
package model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MoneyAudit extends Money {
    private LocalDateTime date;

    public MoneyAudit(BigDecimal amount, LocalDateTime date) {
        super(amount);
        this.date = date;
    }
}
