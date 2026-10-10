package com.jobproof.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

/**
 * Controller to handle root browser requests on backend port (8081)
 * and seamlessly redirect users to the live frontend application (port 5173).
 */
@Controller
public class RootRedirectController {

    @GetMapping("/")
    public RedirectView redirectToFrontend() {
        return new RedirectView("http://localhost:5173/");
    }
}
