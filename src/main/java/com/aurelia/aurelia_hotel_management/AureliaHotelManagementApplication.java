package com.aurelia.aurelia_hotel_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AureliaHotelManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(AureliaHotelManagementApplication.class, args);
	}

}
