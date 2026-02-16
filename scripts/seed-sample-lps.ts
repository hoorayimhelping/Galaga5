import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleLPs = [
  // Individual LPs
  {
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (415) 555-0123',
    lpType: 'individual',
    organization: null,
    title: 'Tech Executive',
    commitment: 500000,
    capitalCalled: 150000,
    capitalDistributed: 0,
    ownershipPercent: 2.5,
    vintage: '2023',
    investmentFocus: 'Enterprise SaaS, Fintech',
    ticketSize: '500K - 1M',
    geography: 'Bay Area',
    status: 'active',
    priority: 'high',
    notes: 'Former CTO at major tech company. Strong network in enterprise software.',
  },
  {
    firstName: 'Michael',
    lastName: 'Rodriguez',
    email: 'michael.rodriguez@example.com',
    phone: '+1 (212) 555-0456',
    lpType: 'individual',
    organization: null,
    title: 'Angel Investor',
    commitment: 250000,
    capitalCalled: 75000,
    capitalDistributed: 0,
    ownershipPercent: 1.25,
    vintage: '2024',
    investmentFocus: 'Consumer Tech, FinTech',
    ticketSize: '250K - 500K',
    geography: 'NYC',
    status: 'active',
    priority: 'medium',
    notes: 'Active angel investor with 15+ investments. Looking to increase allocation.',
  },
  {
    firstName: 'Jennifer',
    lastName: 'Thompson',
    email: 'jennifer.thompson@example.com',
    phone: '+1 (650) 555-0789',
    lpType: 'individual',
    organization: null,
    title: 'Founder & CEO',
    commitment: 1000000,
    capitalCalled: 300000,
    capitalDistributed: 50000,
    ownershipPercent: 5.0,
    vintage: '2022',
    investmentFocus: 'Healthcare Tech, AI',
    ticketSize: '1M+',
    geography: 'Silicon Valley',
    status: 'active',
    priority: 'high',
    notes: 'Successfully exited two companies. Very engaged LP, provides intros.',
  },

  // Family Offices
  {
    firstName: 'David',
    lastName: 'Patterson',
    email: 'david@pattersonfo.com',
    phone: '+1 (214) 555-0321',
    lpType: 'family_office',
    organization: 'Patterson Family Office',
    title: 'Managing Director',
    commitment: 5000000,
    capitalCalled: 1500000,
    capitalDistributed: 250000,
    ownershipPercent: 12.5,
    vintage: '2021',
    investmentFocus: 'Broad Tech Focus',
    ticketSize: '5M - 10M',
    geography: 'Texas, National',
    status: 'active',
    priority: 'high',
    notes: 'Anchor LP. 3rd generation wealth. Very patient capital, long-term focus.',
  },
  {
    firstName: 'Lisa',
    lastName: 'Wong',
    email: 'lisa.wong@wongcapital.com',
    phone: '+1 (310) 555-0654',
    lpType: 'family_office',
    organization: 'Wong Capital',
    title: 'Chief Investment Officer',
    commitment: 3000000,
    capitalCalled: 900000,
    capitalDistributed: 150000,
    ownershipPercent: 7.5,
    vintage: '2022',
    investmentFocus: 'AI/ML, Climate Tech',
    ticketSize: '3M - 7M',
    geography: 'Los Angeles',
    status: 'active',
    priority: 'high',
    notes: 'Strong interest in AI applications. Quarterly check-ins preferred.',
  },
  {
    firstName: 'Robert',
    lastName: 'Martinez',
    email: 'rmartinez@martinezfamily.com',
    phone: '+1 (305) 555-0987',
    lpType: 'family_office',
    organization: 'Martinez Family Investments',
    title: 'Partner',
    commitment: 2000000,
    capitalCalled: 600000,
    capitalDistributed: 0,
    ownershipPercent: 5.0,
    vintage: '2023',
    investmentFocus: 'LatAm Expansion, B2B SaaS',
    ticketSize: '2M - 5M',
    geography: 'Miami, Latin America',
    status: 'active',
    priority: 'medium',
    notes: 'Interested in companies with Latin American expansion potential.',
  },

  // Institutional
  {
    firstName: 'Amanda',
    lastName: 'Foster',
    email: 'afoster@universityfund.edu',
    phone: '+1 (617) 555-0135',
    lpType: 'institution',
    organization: 'University Endowment Fund',
    title: 'Director of Venture Investments',
    commitment: 10000000,
    capitalCalled: 3000000,
    capitalDistributed: 500000,
    ownershipPercent: 20.0,
    vintage: '2021',
    investmentFocus: 'Diversified Tech Portfolio',
    ticketSize: '10M - 25M',
    geography: 'National',
    status: 'active',
    priority: 'high',
    notes: 'Anchor institutional LP. Annual LP meeting attendance required.',
  },
  {
    firstName: 'James',
    lastName: 'Sullivan',
    email: 'jsullivan@pensionfund.org',
    phone: '+1 (312) 555-0246',
    lpType: 'institution',
    organization: 'State Pension Fund',
    title: 'Senior Portfolio Manager',
    commitment: 15000000,
    capitalCalled: 4500000,
    capitalDistributed: 750000,
    ownershipPercent: 25.0,
    vintage: '2020',
    investmentFocus: 'Large-cap VC, Growth Equity',
    ticketSize: '15M - 50M',
    geography: 'Midwest',
    status: 'active',
    priority: 'high',
    notes: 'Large institutional commitment. Quarterly reporting mandatory.',
  },

  // Fund of Funds
  {
    firstName: 'Emily',
    lastName: 'Zhang',
    email: 'emily.zhang@globalventures.com',
    phone: '+1 (415) 555-0369',
    lpType: 'fund_of_funds',
    organization: 'Global Ventures FoF',
    title: 'Managing Partner',
    commitment: 8000000,
    capitalCalled: 2400000,
    capitalDistributed: 400000,
    ownershipPercent: 16.0,
    vintage: '2022',
    investmentFocus: 'Early-stage VC Funds',
    ticketSize: '5M - 15M',
    geography: 'Global',
    status: 'active',
    priority: 'high',
    notes: 'Invests in emerging VC managers. Strong due diligence process.',
  },
  {
    firstName: 'Thomas',
    lastName: 'Anderson',
    email: 'tanderson@vcfund.com',
    phone: '+1 (206) 555-0482',
    lpType: 'fund_of_funds',
    organization: 'Cascade Fund of Funds',
    title: 'Principal',
    commitment: 6000000,
    capitalCalled: 1800000,
    capitalDistributed: 300000,
    ownershipPercent: 12.0,
    vintage: '2023',
    investmentFocus: 'Seed & Series A Funds',
    ticketSize: '5M - 10M',
    geography: 'West Coast',
    status: 'active',
    priority: 'medium',
    notes: 'Focuses on first-time and emerging managers. Bi-annual meetings.',
  },

  // Prospects
  {
    firstName: 'Rachel',
    lastName: 'Kim',
    email: 'rachel.kim@example.com',
    phone: '+1 (408) 555-0593',
    lpType: 'individual',
    organization: null,
    title: 'VP Engineering',
    commitment: null,
    capitalCalled: 0,
    capitalDistributed: 0,
    ownershipPercent: null,
    vintage: null,
    investmentFocus: 'Developer Tools, Infrastructure',
    ticketSize: '100K - 500K',
    geography: 'Bay Area',
    status: 'interested',
    priority: 'high',
    notes: 'Warm intro from Sarah Chen. Interested in committing 250K-500K.',
  },
  {
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'mjohnson@jhventures.com',
    phone: '+1 (404) 555-0604',
    lpType: 'family_office',
    organization: 'JH Ventures',
    title: 'Investment Manager',
    commitment: null,
    capitalCalled: 0,
    capitalDistributed: 0,
    ownershipPercent: null,
    vintage: null,
    investmentFocus: 'HealthTech, EdTech',
    ticketSize: '1M - 3M',
    geography: 'Southeast',
    status: 'contacted',
    priority: 'high',
    notes: 'Initial call scheduled. Interested in thesis. Follow up in 2 weeks.',
  },
  {
    firstName: 'Patricia',
    lastName: 'White',
    email: 'pwhite@whitecapital.com',
    phone: '+1 (617) 555-0715',
    lpType: 'institution',
    organization: 'White Capital Partners',
    title: 'Managing Director',
    commitment: null,
    capitalCalled: 0,
    capitalDistributed: 0,
    ownershipPercent: null,
    vintage: null,
    investmentFocus: 'Enterprise Software',
    ticketSize: '10M+',
    geography: 'Boston',
    status: 'prospect',
    priority: 'high',
    notes: 'Target anchor LP. Need warm intro. Strong enterprise network.',
  },
]

async function main() {
  console.log('Starting LP data seeding...')

  // Get the first user (create one if none exists)
  let user = await prisma.user.findFirst()

  if (!user) {
    console.log('No users found. Please create a user account first.')
    console.log('Visit /register to create an account.')
    return
  }

  console.log(`Seeding LPs for user: ${user.email}`)

  for (const lpData of sampleLPs) {
    try {
      const lp = await prisma.lP.create({
        data: {
          ...lpData,
          tags: JSON.stringify([lpData.lpType, lpData.status]),
          createdById: user.id,
        },
      })

      // Add some sample interactions for active LPs
      if (lpData.status === 'active') {
        // Initial meeting
        await prisma.interaction.create({
          data: {
            type: 'meeting',
            subject: 'Initial LP Meeting',
            content: `Discussed fund strategy, investment thesis, and commitment terms with ${lpData.firstName}.`,
            outcome: 'positive',
            sentiment: 'positive',
            meetingDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
            duration: 60,
            lpId: lp.id,
            createdById: user.id,
          },
        })

        // Quarterly update
        await prisma.interaction.create({
          data: {
            type: 'email',
            subject: 'Q4 2023 Portfolio Update',
            content: 'Shared quarterly portfolio update including new investments and performance metrics.',
            emailSent: true,
            lpId: lp.id,
            createdById: user.id,
          },
        })

        // Follow-up call
        await prisma.interaction.create({
          data: {
            type: 'call',
            subject: 'Quarterly Check-in',
            content: `Brief call to discuss portfolio performance and answer ${lpData.firstName}'s questions.`,
            outcome: 'positive',
            sentiment: 'positive',
            duration: 30,
            lpId: lp.id,
            createdById: user.id,
          },
        })
      }

      // Add interactions for prospects/interested
      if (lpData.status === 'interested' || lpData.status === 'contacted') {
        await prisma.interaction.create({
          data: {
            type: 'email',
            subject: 'Fund Overview and Investment Thesis',
            content: 'Sent fund deck and investment memorandum.',
            emailSent: true,
            lpId: lp.id,
            createdById: user.id,
          },
        })
      }

      console.log(`✓ Created LP: ${lpData.firstName} ${lpData.lastName}`)
    } catch (error) {
      console.error(`✗ Failed to create LP: ${lpData.firstName} ${lpData.lastName}`, error)
    }
  }

  // Create some activity logs
  await prisma.activity.create({
    data: {
      type: 'data_seeded',
      description: `Seeded ${sampleLPs.length} sample LPs with interactions`,
      userId: user.id,
    },
  })

  console.log('\n✓ Seeding completed!')
  console.log(`Total LPs created: ${sampleLPs.length}`)
  console.log('- 3 Individual LPs (active)')
  console.log('- 3 Family Offices (active)')
  console.log('- 2 Institutional LPs (active)')
  console.log('- 2 Fund of Funds (active)')
  console.log('- 3 Prospects/Interested')
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })