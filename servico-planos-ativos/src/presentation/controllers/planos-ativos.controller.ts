import { Controller, Get, Param } from '@nestjs/common';
import { ConsultarPlanoAtivoUseCase } from '../../application/use-cases/consultar-plano-ativo.use-case.js';

@Controller('planosativos')
export class PlanosAtivosController {
  constructor(
    private readonly consultarPlanoAtivoUseCase: ConsultarPlanoAtivoUseCase,
  ) {}

  @Get(':codass')
  async verificarPlanoAtivo(@Param('codass') codass: string) {
    // A especificação pede para retornar literalmente o booleano (true/false)
    return this.consultarPlanoAtivoUseCase.execute(Number(codass));
  }
}
