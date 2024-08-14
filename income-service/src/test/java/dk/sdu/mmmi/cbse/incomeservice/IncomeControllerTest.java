package dk.sdu.mmmi.cbse.incomeservice;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import dk.sdu.mmmi.cbse.incomeservice.controller.IncomeController;
import dk.sdu.mmmi.cbse.incomeservice.model.Income;
import dk.sdu.mmmi.cbse.incomeservice.repository.IncomeRepository;

import java.time.LocalDate;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(IncomeController.class)
public class IncomeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IncomeRepository incomeRepository;

    @Test
    public void testAddIncome() throws Exception {
        String incomeJson = "{\"title\":\"Salary\",\"amount\":5000,\"date\":\"2023-05-01\",\"category\":\"Work\",\"description\":\"Monthly salary\"}";

        when(incomeRepository.save(any(Income.class))).thenReturn(new Income());

        mockMvc.perform(post("/api/v1/incomes/add-income")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(incomeJson))
                .andExpect(status().isOk())
                .andExpect(content().string("Income Added"));
    }

    @Test
    public void testGetIncomes() throws Exception {
        Income income1 = new Income();
        income1.setTitle("Salary");
        income1.setAmount(5000.0);
        income1.setDate(LocalDate.of(2023, 5, 1));

        Income income2 = new Income();
        income2.setTitle("Freelance");
        income2.setAmount(1000.0);
        income2.setDate(LocalDate.of(2023, 5, 15));

        when(incomeRepository.findAll()).thenReturn(Arrays.asList(income1, income2));

        mockMvc.perform(get("/api/v1/incomes/get-incomes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Salary"))
                .andExpect(jsonPath("$[1].title").value("Freelance"));
    }
}