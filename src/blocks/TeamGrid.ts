import type { Block } from 'payload'

export const TeamGrid: Block = {
  slug: 'teamGrid',
  labels: { singular: 'Team grid', plural: 'Team grids' },
  imageURL: '/block-previews/teamGrid.jpg',
  imageAltText: 'Grid of team member portraits',
  admin: { group: 'Lists' },
  fields: [
    {
      name: 'caption',
      type: 'text',
      admin: {
        description:
          'Optional caption shown beneath the heading on the parent page. The block itself renders all team-members grouped by staff type.',
      },
    },
  ],
}
