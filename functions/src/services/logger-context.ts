import { Service } from 'typedi';

/**
 * Logger context will let you add additional logging properties dynamically.
 * This is inspired from MDC from SLF4J library. It is not exactly same.
 * Because this was for multi-threading environment, here we have it for single thread.
 */
@Service()
export class LoggerContext {
    private static readonly map = new Map<string, any>();

    static put(key: string, value: any): void {
        if (!key) {
            return;
        }
        this.map.set(key, value);
    }

    static remove(key: string): void {
        if (!key) {
            return;
        }
        this.map.delete(key);
    }

    static clear(): void {
        this.map.clear();
    }

    static get(key: string): any {
        return this.map.get(key);
    }

    static getCopyOfContextMap(): Map<string, any> {
        return new Map(this.map);
    }

}
