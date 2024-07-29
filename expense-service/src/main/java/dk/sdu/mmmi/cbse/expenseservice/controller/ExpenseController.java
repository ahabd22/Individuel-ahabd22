package dk.sdu.mmmi.cbse.expenseservice.controller;

import dk.sdu.mmmi.cbse.expenseservice.model.Expense;
import dk.sdu.mmmi.cbse.expenseservice.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @PostMapping("/add-expense")
    public ResponseEntity<?> addExpense(@RequestBody Expense expense) {
        if (expense.getTitle() == null || expense.getCategory() == null || expense.getDescription() == null || expense.getDate() == null) {
            return ResponseEntity.badRequest().body("All fields are required!");
        }
        if (expense.getAmount() <= 0) {
            return ResponseEntity.badRequest().body("Amount must be a positive number!");
        }
        expenseRepository.save(expense);
        return ResponseEntity.ok("Expense Added");
    }

    @GetMapping("/get-expenses")
    public List<Expense> getExpenses() {
        return expenseRepository.findAll();
    }

    @DeleteMapping("/delete-expense/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable String id) {
        expenseRepository.deleteById(id);
        return ResponseEntity.ok("Expense Deleted");
    }
}