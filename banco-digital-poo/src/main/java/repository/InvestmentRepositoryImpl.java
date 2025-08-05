
package repository;

import exception.InvestmentNotFoundException;
import model.Investment;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class InvestmentRepositoryImpl implements InvestmentRepository {

    private static final List<Investment> INVESTMENTS = new ArrayList<>();

    @Override
    public void create(Investment entity) {
        INVESTMENTS.add(entity);
    }

    @Override
    public Investment findById(String id) {
        return INVESTMENTS.stream()
                .filter(investment -> Objects.equals(investment.getId(), id))
                .findFirst()
                .orElseThrow(() -> new InvestmentNotFoundException("Investimento não encontrado."));
    }

    @Override
    public List<Investment> findAll() {
        return INVESTMENTS;
    }

    @Override
    public void update(Investment entity) {
        Investment investment = findById(entity.getId());
        investment.setRate(entity.getRate());
    }
}
