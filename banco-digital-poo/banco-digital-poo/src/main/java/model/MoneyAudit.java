
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

    @Override
    public String toString() {
        String operationType = getAmount().compareTo(BigDecimal.ZERO) > 0 ? "Crédito" : "Débito";
        return String.format("[%s] %s: R$ %.2f em %s", date.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")), operationType, getAmount().abs(), date);
    }
}
