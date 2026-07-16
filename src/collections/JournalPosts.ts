import type { CollectionConfig } from 'payload'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

export const JournalPosts: CollectionConfig = {
  slug: 'journal-posts',
  labels: { singular: 'Journal post', plural: 'Journal' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'updatedAt'],
    listSearchableFields: ['title', 'summary'],
  },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ from: 'title' }),
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Story', value: 'story' },
        { label: 'News', value: 'news' },
        { label: 'Recipe', value: 'recipe' },
        { label: 'Behind the scenes', value: 'behind-the-scenes' },
        { label: 'Impact', value: 'impact' },
      ],
    },
    { name: 'summary', type: 'textarea', maxLength: 280 },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Landscape, at least 2000px wide. Cropped to 16:9 on the post, 3:2 when featured and 4:5 portrait on cards, so keep the subject centred.',
      },
    },
    { name: 'author', type: 'text' },
    { name: 'authorMember', type: 'relationship', relationTo: 'team-members' },
    { name: 'publishedAt', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'body', type: 'richText' },
    seoField,
  ],
}
