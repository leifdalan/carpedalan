import db from '../../../server/db';

export default async function(name) {
  const [tagsResponse] = await db('tags')
    .insert({ name })
    .returning('*');
  return tagsResponse;
}
