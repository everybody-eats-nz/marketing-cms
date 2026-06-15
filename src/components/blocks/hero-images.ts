// Hero carousel frames. Static imports → each file is content-hashed by Next and
// the carousel lazily mounts only the frames in play. Source JPGs live in
// ~/Downloads and are converted by scripts/convert-hero-photos.mjs.
import type { StaticImageData } from 'next/image'

import conf142 from '@/assets/photos/142-weallaotearoa-conference2024.webp'
import conf143 from '@/assets/photos/143-weallaotearoa-conference2024.webp'
import conf150 from '@/assets/photos/150-weallaotearoa-conference2024.webp'
import woapBoilup from '@/assets/photos/woap-boilup-08-2.webp'
import woap209 from '@/assets/photos/woap-w2-09.webp'
import woap210 from '@/assets/photos/woap-w2-10.webp'
import woap213 from '@/assets/photos/woap-w2-13.webp'
import woap216 from '@/assets/photos/woap-w2-16.webp'
import woap217 from '@/assets/photos/woap-w2-17.webp'
import woap219 from '@/assets/photos/woap-w2-19.webp'
import woap406 from '@/assets/photos/woap-w4-06.webp'
import woap408 from '@/assets/photos/woap-w4-08.webp'
import woap411 from '@/assets/photos/woap-w4-11.webp'
import cb064 from '@/assets/photos/cb01605-064.webp'
import cb078 from '@/assets/photos/cb01605-078.webp'
import cb094 from '@/assets/photos/cb01605-094.webp'
import cb099 from '@/assets/photos/cb01605-099.webp'
import cb122 from '@/assets/photos/cb01605-122.webp'
import cb123 from '@/assets/photos/cb01605-123.webp'
import cb127 from '@/assets/photos/cb01605-127.webp'
import cb130 from '@/assets/photos/cb01605-130.webp'
import cb143 from '@/assets/photos/cb01605-143.webp'
import cb144 from '@/assets/photos/cb01605-144.webp'
import cb150 from '@/assets/photos/cb01605-150.webp'
import cb151 from '@/assets/photos/cb01605-151.webp'
import cb152 from '@/assets/photos/cb01605-152.webp'
import cb153 from '@/assets/photos/cb01605-153.webp'
import cb160 from '@/assets/photos/cb01605-160.webp'
import onehunga2 from '@/assets/photos/onehunga2.webp'
import onehunga3 from '@/assets/photos/onehunga3.webp'

export type CycleImage = { image: StaticImageData; alt: string }

const SERVICE = 'An Everybody Eats volunteer during service'
const COMMUNITY = 'The Everybody Eats community gathered together'
const EVENT = 'Volunteers and guests at an Everybody Eats event'
const DINING = 'Inside an Everybody Eats restaurant dining room'

export const HERO_IMAGES: CycleImage[] = [
  { image: cb078, alt: SERVICE },
  { image: conf142, alt: COMMUNITY },
  { image: woap217, alt: EVENT },
  { image: cb123, alt: SERVICE },
  { image: onehunga2, alt: DINING },
  { image: woap209, alt: EVENT },
  { image: cb130, alt: SERVICE },
  { image: conf143, alt: COMMUNITY },
  { image: woapBoilup, alt: EVENT },
  { image: cb094, alt: SERVICE },
  { image: onehunga3, alt: DINING },
  { image: woap210, alt: EVENT },
  { image: cb122, alt: SERVICE },
  { image: conf150, alt: COMMUNITY },
  { image: woap216, alt: EVENT },
  { image: cb127, alt: SERVICE },
  { image: woap219, alt: EVENT },
  { image: cb143, alt: SERVICE },
  { image: woap406, alt: EVENT },
  { image: cb144, alt: SERVICE },
  { image: woap408, alt: EVENT },
  { image: cb150, alt: SERVICE },
  { image: woap411, alt: EVENT },
  { image: cb151, alt: SERVICE },
  { image: woap213, alt: EVENT },
  { image: cb152, alt: SERVICE },
  { image: cb064, alt: SERVICE },
  { image: cb153, alt: SERVICE },
  { image: cb099, alt: SERVICE },
  { image: cb160, alt: SERVICE },
]
