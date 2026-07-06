declare global {
  interface KVNamespace {
    get(key: string, options?: { type: "text" | "arrayBuffer" | "json" | "stream" }): Promise<string | ArrayBuffer | ReadableStream | null>;
    get(key: string, encoding?: "text"): Promise<string | null>;
    put(key: string, value: string | ArrayBuffer | ReadableStream | FormData): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: { name: string; metadata?: unknown }[]; list_complete: boolean; cursor?: string }>;
  }

  interface CloudflareEnv {
    ANIMAL_DATA?: KVNamespace;
  }
}

export {};
