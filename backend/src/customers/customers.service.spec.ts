import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Customer } from '@prisma/client';

describe('CustomersService', () => {
  let service: CustomersService;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    prismaService = module.get(PrismaService);
  });

  describe('upsert', () => {
    it('should call PrismaService.upsert with correct parameters', async () => {
      const id = 'test-id';
      const mockResult = {
        id,
        userId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Customer;

      prismaService.customer.upsert.mockResolvedValue(mockResult);

      const result = await service.upsert(id);

      expect(prismaService.customer.upsert).toHaveBeenCalledWith({
        where: { id },
        update: {},
        create: { id },
      });

      expect(result).toEqual(mockResult);
    });

    it('should throw an error if PrismaService.upsert fails', async () => {
      const id = 'test-id';

      prismaService.customer.upsert.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.upsert(id)).rejects.toThrow('Database error');
    });
  });
});
