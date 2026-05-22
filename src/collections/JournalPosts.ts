import type { CollectionConfig } from 'payload'
import { seoField } from '../fields/seo'

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
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
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
    { name: 'mainImage', type: 'upload', relationTo: 'media' },
    { name: 'author', type: 'text' },
    { name: 'authorMember', type: 'relationship', relationTo: 'team-members' },
    { name: 'publishedAt', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'body', type: 'richText' },
    seoField,
  ],
}
