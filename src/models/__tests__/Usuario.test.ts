import { Consulta } from '../Consulta';
import { Usuario } from '../Usuario';
import { Request, Response } from 'express';

// Mock CORRETO - mocka o módulo inteiro
jest.mock('../Consulta', () => {
  const originalModule = jest.requireActual('../Consulta');
  
  return {
    ...originalModule,
    Consulta: {
      ...originalModule.Consulta,
      mostraTodasConsultas: jest.fn()
    }
  };
});

// Mock do console
const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

describe('exibeProntuario', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: { email: 'williamribeiro2408@gmail.com' }
    };

    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('deve criar prontuario com consultas do paciente', async () => {
    // Arrange
    const mockConsultas = [{ id: 1, data: '2023-01-01' }];
    (Consulta.mostraTodasConsultas as jest.Mock).mockResolvedValue(mockConsultas);

    // Act
    await Usuario.exibeProntuario(mockReq as Request, mockRes as Response);

    // Assert
    expect(Consulta.mostraTodasConsultas).toHaveBeenCalledWith(
      mockReq, 
      mockRes, 
      'paciente'
    );
    
    expect(consoleLogSpy).toHaveBeenCalledWith({
      consultas: mockConsultas
    });
  });

  it('deve lidar com erro quando mostraTodasConsultas falhar', async () => {
    // Arrange
    const mockError = new Error('Erro no banco de dados');
    (Consulta.mostraTodasConsultas as jest.Mock).mockRejectedValue(mockError);

    // Act
    await Usuario.exibeProntuario(mockReq as Request, mockRes as Response);

    // Assert
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      mensagem: "Erro ao gerar o prontuario",
      errro: mockError
    });
  });
});