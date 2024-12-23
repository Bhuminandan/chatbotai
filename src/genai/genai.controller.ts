import { Controller, Post } from '@nestjs/common';

@Controller('genai')
export class GenaiController {
    @Post("/ask")
    async ask() {
        return {
            message: "Hello World"
        }
    }
}
