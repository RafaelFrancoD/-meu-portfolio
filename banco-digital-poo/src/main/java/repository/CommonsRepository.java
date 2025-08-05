
package repository;

import java.util.List;

public interface CommonsRepository<T> {
    void create(T entity);
    T findById(String id);
    List<T> findAll();
    void update(T entity);
}
