package dk.sdu.mmmi.cbse.incomeservice.repository;


import dk.sdu.mmmi.cbse.incomeservice.model.Income;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IncomeRepository extends MongoRepository<Income, String> {
}