import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/form')
  async form() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PDF Upload</title>
</head>
<body>
  <h1>Upload a PDF file</h1>
  <form action="/lessons/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="file" accept=".pdf" required>
    <button type="submit">Upload</button>
  </form>
</body>
</html>`;
  }
}
