package com.game.comicgame.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PromptController {
    @RequestMapping("/prompt")
    public String showCanvas() {
        return "prompt.html";
    }
}
