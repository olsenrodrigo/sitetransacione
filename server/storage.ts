import { promises as fs } from "fs";
import path from "path";
import { leads, type InsertLead, type Lead } from "@shared/schema";

export interface IStorage {
  criarLead(dados: InsertLead): Promise<{ id: number }>;
}

/**
 * Postgres quando DATABASE_URL está definida; caso contrário, um arquivo
 * JSONL local. O site de marketing precisa subir e receber contato mesmo
 * antes de o banco existir — e o e-mail é o canal primário de notificação.
 */
class ArmazenamentoArquivo implements IStorage {
  private caminho = path.resolve(process.cwd(), ".dados/leads.jsonl");

  async criarLead(dados: InsertLead) {
    await fs.mkdir(path.dirname(this.caminho), { recursive: true });
    const id = Date.now();
    await fs.appendFile(
      this.caminho,
      JSON.stringify({ id, ...dados, criadoEm: new Date().toISOString() }) + "\n",
      "utf-8",
    );
    return { id };
  }
}

class ArmazenamentoPostgres implements IStorage {
  private db: Awaited<ReturnType<typeof this.conectar>> | null = null;

  private async conectar() {
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const pg = (await import("pg")).default;
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    return drizzle(pool);
  }

  async criarLead(dados: InsertLead) {
    if (!this.db) this.db = await this.conectar();
    const [linha] = await this.db.insert(leads).values(dados).returning();
    return { id: (linha as Lead).id };
  }
}

export const storage: IStorage = process.env.DATABASE_URL
  ? new ArmazenamentoPostgres()
  : new ArmazenamentoArquivo();

export const modoArmazenamento = process.env.DATABASE_URL ? "postgres" : "arquivo";
