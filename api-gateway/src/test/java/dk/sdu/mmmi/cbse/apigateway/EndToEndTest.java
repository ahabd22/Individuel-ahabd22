package dk.sdu.mmmi.cbse.apigateway;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class EndToEndTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void testAddIncomeAndRetrieveIt() {
        // lave ny indkomst
        String incomeJson = "{\"title\":\"Salary\",\"amount\":5000,\"date\":\"2023-05-01\",\"category\":\"Work\",\"description\":\"Monthly salary\"}";
        ResponseEntity<String> addResponse = restTemplate.postForEntity("/api/v1/incomes/add-income", incomeJson, String.class);
        assertThat(addResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // hente alle indkomster
        ResponseEntity<String> getResponse = restTemplate.getForEntity("/api/v1/incomes/get-incomes", String.class);
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getResponse.getBody()).contains("Salary");
    }

    @Test
    public void testAddExpenseAndRetrieveIt() {
        // lave en ny udgift
        String expenseJson = "{\"title\":\"Groceries\",\"amount\":100,\"date\":\"2023-05-02\",\"category\":\"Food\",\"description\":\"Weekly groceries\"}";
        ResponseEntity<String> addResponse = restTemplate.postForEntity("/api/v1/expenses/add-expense", expenseJson, String.class);
        assertThat(addResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // hente alle udgifter
        ResponseEntity<String> getResponse = restTemplate.getForEntity("/api/v1/expenses/get-expenses", String.class);
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getResponse.getBody()).contains("Groceries");
    }
}