declare global {
  interface R2Bucket {
    get(key: string, options?: { range?: { offset?: number; length?: number }; head?: boolean }): Promise<R2Object | null>;
    head(key: string): Promise<R2Object | null>;
  }

  interface R2Object {
    key: string;
    size: number;
    etag: string;
    uploaded: Date;
    httpEtag?: string;
    checksums?: { md5?: string; sha1?: string; sha256?: string; crc32c?: string };
    customMetadata?: Record<string, string>;
    /** @deprecated Use `customMetadata` instead */
    metadata?: Record<string, string>;
    text(): Promise<string>;
    arrayBuffer(): Promise<ArrayBuffer>;
    stream(): ReadableStream<Uint8Array>;
    json<T>(): Promise<T>;
    formData(): Promise<FormData>;
  }

  interface CloudflareEnv {
    ANIMAL_DATA_BUCKET?: R2Bucket;
  }
}

export {};
