package com.aurelia.gateway;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.util.Enumeration;

@RestController
public class ForwardingController {
    private final RestClient.Builder restClientBuilder = RestClient.builder();
    @Value("${services.auth}") private String auth;
    @Value("${services.booking}") private String booking;
    @Value("${services.room}") private String room;
    @Value("${services.housekeeping}") private String housekeeping;
    @Value("${services.maintenance}") private String maintenance;
    @Value("${services.notification}") private String notification;

    @RequestMapping("/api/**")
    public ResponseEntity<byte[]> forward(HttpServletRequest request) throws IOException {
        String path = request.getRequestURI();
        String target = targetFor(path);
        if (target == null) return ResponseEntity.notFound().build();

        String query = request.getQueryString();
        String url = target + path + (query == null ? "" : "?" + query);
        byte[] body = request.getInputStream().readAllBytes();
        RestClient.RequestBodySpec spec = restClientBuilder.build()
                .method(HttpMethod.valueOf(request.getMethod())).uri(url);
        Enumeration<String> names = request.getHeaderNames();
        while (names.hasMoreElements()) {
            String name = names.nextElement();
            if (!name.equalsIgnoreCase("host") && !name.equalsIgnoreCase("content-length")) {
                spec.header(name, request.getHeader(name));
            }
        }
        return spec.body(body).exchange((req, res) -> {
            byte[] responseBody = res.getBody() == null ? new byte[0] : res.getBody().readAllBytes();
            HttpHeaders headers = new HttpHeaders();
            headers.putAll(res.getHeaders());
            // RestClient/Spring will calculate these headers for the new response.
            // Forwarding them from the upstream response can produce duplicate
            // Transfer-Encoding headers and make Nginx return 502.
            headers.remove(HttpHeaders.TRANSFER_ENCODING);
            headers.remove(HttpHeaders.CONTENT_LENGTH);
            headers.remove(HttpHeaders.CONNECTION);
            headers.remove("Keep-Alive");
            headers.remove("Proxy-Authenticate");
            headers.remove("Proxy-Authorization");
            headers.remove("TE");
            headers.remove("Trailer");
            headers.remove("Upgrade");
            return ResponseEntity.status(res.getStatusCode()).headers(headers).body(responseBody);
        });
    }

    private String targetFor(String path) {
        if (path.startsWith("/api/auth") || path.startsWith("/api/roles") || path.startsWith("/api/permissions")) return auth;
        if (path.startsWith("/api/bookings")) return booking;
        if (path.startsWith("/api/rooms")) return room;
        if (path.startsWith("/api/housekeeping")) return housekeeping;
        if (path.startsWith("/api/maintenance")) return maintenance;
        if (path.startsWith("/api/notifications")) return notification;
        return null;
    }
}
