package com.game.comicgame.controllers;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CanvasController {
    @RequestMapping
    public String showCanvas() {
        return "canvas.html";
    }
}
