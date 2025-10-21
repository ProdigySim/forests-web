
export async function getPsimCollection(): Promise<string> {
  const kv = await Deno.openKv();
  const list = await kv.get<string>(['psim']);
  return list.value ?? '[]';
}

export async function setPsimCollection(collection: string) {
  const kv = await Deno.openKv();
  await kv.set(['psim'], collection);
}