import { Consulta } from '../Consulta'

// Mock da função mostraTodasConsultas
jest.mock('./Consulta', () => ({
  Consulta: {
    mostraTodasConsultas: jest.fn()
  }
}));

describe('exibeProntuario', () => {
  it('deve criar prontuario com consultas do paciente', async () => {
    const mockConsultas = [{ id: 1, data: '2023-01-01' }];
    
    // Configura o mock para retornar dados falsos
    (Consulta.mostraTodasConsultas as jest.Mock).mockReturnValue(mockConsultas);
    
    const mockReq = { body: { email: 'paciente@exemplo.com' } } as Request;
    const mockRes = {} as Response;
    
    // Chama a função
    await seuController.exibeProntuario(mockReq, mockRes);
    
    // Verifica se a função foi chamada corretamente
    expect(Consulta.mostraTodasConsultas).toHaveBeenCalledWith(
      mockReq, 
      mockRes, 
      'paciente'
    );
    
    // Verifica se o console.log foi chamado com o objeto esperado
    expect(console.log).toHaveBeenCalledWith({
      consultas: mockConsultas
    });
  });
});