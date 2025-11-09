export interface CardCollectionDto {
  /**
   * ISO Timestamp of collection date
   */
  timestamp: string;

  /**
   * Card ids
   */
  collection: string[];

  /**
   * Collection version string
   */
  version: 'v1'
}
export async function getPsimCollection(): Promise<CardCollectionDto> {
  const kv = await Deno.openKv();
  const list = await kv.get<string>(['psim']);
  
  const json = list.value ?? '[]';
  const decoded = JSON.parse(json); 
  if(Array.isArray(decoded)) {
    // Old style collection--translate to new
    const timestamp = (new Date(0)).toISOString();
    console.log("Decoded old collection json--translating to new with timestamp", timestamp)
    return {
      timestamp,
      collection: decoded,
      version: 'v1',
    }
  } else {
    return decoded;
  }
}

export async function setPsimCollection(collection: CardCollectionDto) {
  const kv = await Deno.openKv();
  await kv.set(['psim'], JSON.stringify(collection));
}