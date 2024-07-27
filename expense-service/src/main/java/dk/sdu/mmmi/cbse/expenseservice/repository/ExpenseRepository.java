package dk.sdu.mmmi.cbse.expenseservice.repository;


import dk.sdu.mmmi.cbse.expenseservice.model.Expense;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExpenseRepository extends MongoRepository<Expense, String> {
}