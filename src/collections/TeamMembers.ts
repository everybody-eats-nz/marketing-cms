import type { CollectionConfig } from 'payload'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Team member', plural: 'Team members' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'jobTitle', 'staffType', 'updatedAt'],
  },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    { name: 'jobTitle', type: 'text' },
    {
      name: 'staffType',
      type: 'select',
      hasMany: false,
      options: [
        { label: 'Board', value: 'board' },
        { label: 'Leadership', value: 'leadership' },
        { label: 'Kitchen', value: 'kitchen' },
        { label: 'Front of house', value: 'foh' },
        { label: 'Operations', value: 'operations' },
        { label: 'Volunteer', value: 'volunteer' },
      ],
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first' },
    },
    { name: 'profilePicture', type: 'upload', relationTo: 'media' },
    { name: 'bioSummary', type: 'textarea' },
    { name: 'bio', type: 'richText' },
    {
      name: 'contact',
      type: 'group',
      admin: { hideGutter: true },
      fields: [
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        { name: 'twitter', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'linkedin', type: 'text' },
      ],
    },
  ],
}
