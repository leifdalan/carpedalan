import db from '../../../server/db';

export default async function() {
  const tagsResponse = await db('tags').select();
  const counts = await db('photos_tags')
    .select('tagId')
    .count('*')
    .groupBy('tagId');

  const countsById = counts.reduce(
    (acc, count) => ({
      ...acc,
      [count.tagId]: count.count,
    }),
    {},
  );

  const withCount = tagsResponse.map(tag => ({
    ...tag,
    count: countsById[tag.id],
  }));
  return withCount;
}
