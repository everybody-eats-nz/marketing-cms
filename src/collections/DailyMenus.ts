import type { CollectionConfig } from 'payload'

export const DailyMenus: CollectionConfig = {
  slug: 'daily-menus',
  labels: { singular: 'Daily menu', plural: 'Daily menus' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'menuDate', 'location', 'chefName', 'updatedAt'],
  },
  access: { read: () => true },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Auto-generated from date if blank' },
    },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'menuDate',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'location', type: 'relationship', relationTo: 'locations' },
    { name: 'chefName', type: 'text' },
    {
      name: 'courses',
      type: 'group',
      admin: { hideGutter: true },
      fields: [
        { name: 'starter', type: 'text' },
        { name: 'mainMeat', type: 'text', label: 'Main (meat)' },
        { name: 'mainVeg', type: 'text', label: 'Main (vegetarian)' },
        { name: 'vegOnly', type: 'checkbox', label: 'Vegetarian-only menu tonight' },
        { name: 'dessert', type: 'text' },
        { name: 'drink', type: 'text' },
      ],
    },
    { name: 'announcement', type: 'richText' },
  ],
}
