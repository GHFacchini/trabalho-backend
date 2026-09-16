import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { RegistrarPagamentoUseCase } from '../../application/use-cases/registrar-pagamento.use-case.js';
import type { RegistrarPagamentoInput } from '../../application/use-cases/registrar-pagamento.use-case.js';

@Controller('registrarpagamento')
export class FaturamentoController {
  constructor(
    private readonly registrarPagamentoUseCase: RegistrarPagamentoUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async registrar(@Body() body: RegistrarPagamentoInput) {
    return this.registrarPagamentoUseCase.execute(body);
  }
}
