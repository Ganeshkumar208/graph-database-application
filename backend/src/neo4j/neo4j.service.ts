import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver, ManagedTransaction, Session } from 'neo4j-driver';

/**
 * Thin wrapper around the official Neo4j driver.
 *
 * CognoDB speaks openCypher over Bolt and is wire-compatible with the
 * standard Neo4j drivers, so this service would work unchanged against
 * a real Neo4j/Aura instance too -- only the connection details differ.
 *
 * All queries elsewhere in the app go through `read()` / `write()` below,
 * which always pass parameters separately from the Cypher text (never
 * string-concatenated), and translate connectivity failures into a
 * clean 503 instead of leaking driver internals to the client.
 */
@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(Neo4jService.name);
  private driver: Driver;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const uri = this.config.get<string>('NEO4J_URI');
    const username = this.config.get<string>('NEO4J_USERNAME');
    const password = this.config.get<string>('NEO4J_PASSWORD');

    if (!uri || !username || !password) {
      this.logger.error(
        'Missing NEO4J_URI / NEO4J_USERNAME / NEO4J_PASSWORD environment variables.',
      );
      return;
    }

    this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
      maxConnectionPoolSize: 20,
      // Counts/levels/years in this app never approach 2^53 -- return plain
      // JS numbers instead of lossless {low, high} Integer objects, which
      // otherwise serialize wrong over JSON and break numeric rendering.
      disableLosslessIntegers: true,
    });

    try {
      await this.driver.verifyConnectivity();
      this.logger.log(`Connected to graph database at ${uri}`);
    } catch (err) {
      // Don't crash the whole API on boot if the DB happens to be
      // unreachable -- surface it per-request instead so the frontend
      // can show a proper "database unreachable" state (see requirement 5.3).
      this.logger.error(
        `Could not connect to graph database at ${uri}: ${(err as Error).message}`,
      );
    }
  }

  async onModuleDestroy() {
    await this.driver?.close();
  }

  private getSession(): Session {
    if (!this.driver) {
      throw new ServiceUnavailableException(
        'The graph database is not configured or unreachable. Check NEO4J_URI / NEO4J_USERNAME / NEO4J_PASSWORD.',
      );
    }
    return this.driver.session();
  }

  /** Run a read-only, parameterised Cypher query. */
  async read<T = any>(
    cypher: string,
    params: Record<string, unknown> = {},
  ): Promise<T[]> {
    const session = this.getSession();
    try {
      const result = await session.executeRead((tx: ManagedTransaction) =>
        tx.run(cypher, params),
      );
      return result.records.map((r) => r.toObject() as T);
    } catch (err) {
      this.handleError(err);
    } finally {
      await session.close();
    }
  }

  /** Run a write, parameterised Cypher query (used only by the seed script). */
  async write<T = any>(
    cypher: string,
    params: Record<string, unknown> = {},
  ): Promise<T[]> {
    const session = this.getSession();
    try {
      const result = await session.executeWrite((tx: ManagedTransaction) =>
        tx.run(cypher, params),
      );
      return result.records.map((r) => r.toObject() as T);
    } catch (err) {
      this.handleError(err);
    } finally {
      await session.close();
    }
  }

  async isHealthy(): Promise<boolean> {
    if (!this.driver) return false;
    try {
      await this.driver.verifyConnectivity();
      return true;
    } catch {
      return false;
    }
  }

  private handleError(err: unknown): never {
    this.logger.error((err as Error).message);
    throw new ServiceUnavailableException(
      'The graph database is unreachable right now. Please try again shortly.',
    );
  }
}
