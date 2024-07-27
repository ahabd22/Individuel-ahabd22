package dk.sdu.mmmi.cbse.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth_route", r -> r
                        .path("/api/v1/auth/**")
                        .uri("http://localhost:8081"))
                .route("expense_route", r -> r
                        .path("/api/v1/expenses/**")
                        .uri("http://localhost:8082"))
                .route("income_route", r -> r
                        .path("/api/v1/incomes/**")
                        .uri("http://localhost:8083"))
                .build();
    }
}
