package com.hotel.staff_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                // Basic Security setup: Disable CSRF (since it's a stateless REST API)
                // Enable CORS to allow the React Frontend to make API calls
                // and require authentication for any endpoint.
                http
                                .cors(Customizer.withDefaults())
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(auth -> auth
                                                .anyRequest().authenticated())
                                .httpBasic(Customizer.withDefaults()); // Enable Basic Authentication

                return http.build();
        }

        @Bean
        public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
                org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
                configuration.addAllowedOriginPattern("*"); // Allow any origin for testing
                configuration.addAllowedMethod("*");
                configuration.addAllowedHeader("*");
                configuration.setAllowCredentials(true);
                org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        @Bean
        public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
                // Create 3 Users with different Roles in-memory for testing purposes.

                UserDetails admin = User.builder()
                                .username("admin")
                                .password(passwordEncoder.encode("admin123"))
                                .roles("ADMIN")
                                .build();

                UserDetails manager = User.builder()
                                .username("manager")
                                .password(passwordEncoder.encode("manager123"))
                                .roles("MANAGER")
                                .build();

                UserDetails staff = User.builder()
                                .username("staff")
                                .password(passwordEncoder.encode("staff123"))
                                .roles("STAFF")
                                .build();

                return new InMemoryUserDetailsManager(admin, manager, staff);
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}
