import { prisma } from './prisma.js';

/**
 * Adaptador para manter nomenclatura parecida com o legado PHP.
 * Preferencialmente use repositórios Prisma tipados para novas implementações.
 */
export const db = {
  async sql_insert(sql: string) {
    return prisma.$executeRawUnsafe(sql);
  },
  async listar<T = unknown>(sql: string) {
    return prisma.$queryRawUnsafe(sql) as Promise<T[]>;
  },
  async listarToStd<T = unknown>(sql: string) {
    return prisma.$queryRawUnsafe(sql) as Promise<T[]>;
  },
  async listarToArray<T = unknown>(sql: string) {
    return prisma.$queryRawUnsafe(sql) as Promise<T[]>;
  },
  async listar_st<T = unknown>(sql: string, params: unknown[]) {
    return prisma.$queryRawUnsafe(sql, ...params) as Promise<T[]>;
  },
  async listar_st_toStd<T = unknown>(sql: string, params: unknown[]) {
    return prisma.$queryRawUnsafe(sql, ...params) as Promise<T[]>;
  },
  async listar_st_toArray<T = unknown>(sql: string, params: unknown[]) {
    return prisma.$queryRawUnsafe(sql, ...params) as Promise<T[]>;
  },
  async getResultSet<T = unknown>(sql: string) {
    return prisma.$queryRawUnsafe(sql) as Promise<T[]>;
  },
  async getResultSetParams<T = unknown>(sql: string, params: unknown[]) {
    return prisma.$queryRawUnsafe(sql, ...params) as Promise<T[]>;
  },
  async sql_insert_st_id(sql: string, params: unknown[]) {
    const rows = (await prisma.$queryRawUnsafe(sql, ...params)) as Array<{ id?: string | number }>;
    return rows?.[0]?.id;
  },
  async sql_insert_st(sql: string, params: unknown[]) {
    return prisma.$executeRawUnsafe(sql, ...params);
  },
};
