require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ticket-ease';

async function run() {
  console.log('Using MONGODB_URI:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI, { autoIndex: true });
  console.log('Connected to MongoDB for seeding ->', mongoose.connection. name, mongoose.connection.host);

  console.log('Clearing events collection...');
  const del = await Event.deleteMany({});
  console.log('Deleted documents:', del.deletedCount);

  const events = [
    {
      title: 'Sunset Jazz in the Park',
      subtitle: 'An evening of smooth jazz by the riverside',
      category: 'Live Music',
      location: 'Riverside Park',
      address: '123 River Walk, Downtown',
      date: new Date('2026-06-15T19:30:00Z'),
      description: 'Join us for a magical evening of jazz under the sunset.  Featuring renowned artists from around the world, this outdoor concert promises an unforgettable experience with smooth melodies and stunning views.\n\nBring your blankets and picnic baskets for a perfect summer evening!',
      images: [
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4? w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1600&q=80&auto=format&fit=crop'
      ],
      highlights: [
        'World-class jazz musicians',
        'Stunning riverside venue',
        'Food trucks and refreshments',
        'Family-friendly atmosphere'
      ],
      organizer: 'City Arts Foundation',
      rating: 4.7,
      reviews: 234,
      ticket_types: [
        { 
          name: 'General Admission', 
          description: 'Open lawn seating', 
          price:  25, 
          available:  150, 
          total: 200,
          features: ['Access to main lawn area', 'First-come seating']
        },
        { 
          name: 'VIP Seating', 
          description: 'Reserved premium seats', 
          price: 75, 
          available: 15, 
          total: 50,
          originalPrice: 95,
          features: ['Reserved seating', 'Complimentary drink', 'VIP parking']
        },
        { 
          name:  'Family Pack (4 tickets)', 
          description: 'Perfect for families', 
          price:  80, 
          available: 25, 
          total: 40,
          originalPrice: 100,
          features: ['4 general admission tickets', 'Kids activities access']
        }
      ]
    },
    {
      title: 'Tech Talks: AI & Ethics',
      subtitle: 'Conversations on responsible AI development',
      category: 'Conference',
      location: 'Grand Convention Center',
      address: '500 Convention Ave, Tech District',
      date: new Date('2026-07-03T09:00:00Z'),
      description: 'A full-day conference featuring talks from leading researchers, ethicists, and industry pioneers exploring the intersection of artificial intelligence and ethics.\n\nJoin us for thought-provoking discussions, networking opportunities, and hands-on workshops about building AI responsibly.',
      images: [
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80&auto=format&fit=crop'
      ],
      highlights: [
        'Keynote from AI research leaders',
        'Interactive panel discussions',
        'Networking lunch included',
        'Certificate of attendance',
        'Access to recorded sessions'
      ],
      organizer: 'Tech Ethics Institute',
      rating: 4.9,
      reviews: 567,
      ticket_types: [
        { 
          name:  'Standard Pass', 
          description: 'Full conference access', 
          price:  149, 
          available: 250, 
          total: 400,
          features: ['All sessions access', 'Lunch included', 'Conference materials']
        },
        { 
          name: 'Student Pass', 
          description: 'Special student pricing', 
          price: 49, 
          available: 75, 
          total: 100,
          originalPrice: 149,
          features: ['All sessions access', 'Lunch included', 'Valid student ID required']
        },
        { 
          name: 'Virtual Attendance', 
          description: 'Join remotely', 
          price:  79, 
          available: 500, 
          total: 1000,
          features: ['Live stream access', 'Recorded sessions', 'Digital materials']
        }
      ]
    },
    {
      title: 'Summer Music Festival 2026',
      subtitle: 'Three days of incredible live performances',
      category: 'Music Festival',
      location: 'Meadowlands Festival Grounds',
      address: '789 Festival Way, Meadowlands',
      date: new Date('2026-08-20T12:00:00Z'),
      description: 'The biggest music festival of the summer returns!  Experience three unforgettable days featuring 50+ artists across multiple stages, including headliners from rock, pop, hip-hop, and electronic music.\n\nWith camping options, food vendors, art installations, and non-stop entertainment, this is the ultimate summer experience.',
      images: [
        'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80&auto=format&fit=crop'
      ],
      highlights: [
        '50+ international artists',
        'Multiple stages and genres',
        'Camping and glamping options',
        'Gourmet food trucks',
        'Art installations and workshops',
        'Silent disco after-parties'
      ],
      organizer: 'MegaFest Productions',
      rating: 4.8,
      reviews: 1243,
      ticket_types: [
        { 
          name:  'General Admission - 3 Day Pass', 
          description: 'Access to all stages', 
          price: 299, 
          available: 500, 
          total: 5000,
          features: ['3-day festival access', 'All stages access', 'Free water refill stations']
        },
        { 
          name: 'VIP Experience - 3 Day Pass', 
          description: 'Premium festival experience', 
          price: 699, 
          available: 80, 
          total: 200,
          originalPrice: 799,
          features: ['VIP viewing areas', 'Exclusive lounge access', 'Premium restrooms', 'Express entry', 'Complimentary drinks']
        },
        { 
          name: 'Single Day Pass', 
          description:  'One day access', 
          price: 129, 
          available: 1000, 
          total: 2000,
          features: ['Single day access', 'All stages', 'Food court access']
        },
        { 
          name:  'Camping Add-on', 
          description: 'Camping for 3 nights', 
          price: 150, 
          available: 200, 
          total: 500,
          features: ['Camping plot', 'Shower facilities', 'Security', '3-night accommodation']
        }
      ]
    },
    {
      title: 'Broadway Nights: The Musical Collection',
      subtitle: 'A spectacular evening of Broadway hits',
      category: 'Theater',
      location: 'Royal Theater',
      address: '250 Broadway Street, Theater District',
      date:  new Date('2026-09-12T19:00:00Z'),
      description: 'Experience the magic of Broadway with this stunning musical revue featuring songs from Hamilton, Wicked, The Phantom of the Opera, Les Misérables, and more.\n\nPerformed by a talented ensemble cast with a live orchestra, this show celebrates the greatest moments in musical theater history.',
      images: [
        'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&q=80&auto=format&fit=crop'
      ],
      highlights: [
        'Songs from 15+ beloved musicals',
        'Live orchestra',
        'Professional Broadway performers',
        'Stunning costumes and set design',
        'Two-hour performance with intermission'
      ],
      organizer: 'Royal Theater Company',
      rating: 4.9,
      reviews: 892,
      ticket_types: [
        { 
          name:  'Orchestra Seating', 
          description: 'Best seats in the house', 
          price: 120, 
          available: 30, 
          total: 150,
          features: ['Premium orchestra section', 'Best view', 'Padded seating']
        },
        { 
          name: 'Mezzanine', 
          description: 'Elevated view', 
          price: 85, 
          available: 60, 
          total: 200,
          features: ['Mezzanine level', 'Great sightlines', 'Comfortable seating']
        },
        { 
          name: 'Balcony', 
          description: 'Affordable seating', 
          price: 45, 
          available: 100, 
          total: 150,
          features: ['Upper level seating', 'Full show view']
        }
      ]
    },
    {
      title:  'Startup Founders Summit',
      subtitle: 'Connect, learn, and grow your startup',
      category: 'Business',
      location: 'Innovation Hub',
      address: '1000 Entrepreneur Blvd, Business Park',
      date: new Date('2026-07-25T08:30:00Z'),
      description:  'The premier gathering for startup founders, investors, and innovators.  Learn from successful entrepreneurs, pitch to investors, and network with fellow founders.\n\nThis intensive one-day summit features keynotes, workshops, pitch competitions, and countless networking opportunities.',
      images: [
        'https://images.unsplash.com/photo-1559223607-0c2e69b63493?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1600&q=80&auto=format&fit=crop'
      ],
      highlights: [
        'Pitch competition with $50K prize',
        'Speed networking sessions',
        'Investor meetings',
        'Workshop tracks for all stages',
        'Startup expo floor',
        'Evening networking reception'
      ],
      organizer: 'Startup Accelerator Network',
      rating: 4.6,
      reviews: 421,
      ticket_types: [
        { 
          name:  'Founder Pass', 
          description: 'For startup founders', 
          price: 199, 
          available: 150, 
          total: 300,
          features: ['All sessions', 'Pitch competition entry', 'Networking events', 'Lunch & refreshments']
        },
        { 
          name: 'Investor Pass', 
          description:  'For VCs and angels', 
          price: 499, 
          available: 40, 
          total: 50,
          features: ['VIP lounge access', 'Private meeting rooms', 'Startup database access', 'Premium seating']
        },
        { 
          name: 'Early-Stage Founder', 
          description: 'Pre-revenue startups', 
          price: 99, 
          available: 80, 
          total: 150,
          originalPrice: 199,
          features: ['All sessions', 'Networking events', 'Lunch included']
        }
      ]
    },
    {
      title:  'International Food & Wine Festival',
      subtitle: 'Taste the world in one unforgettable weekend',
      category: 'Food & Drink',
      location: 'Harbor Front Plaza',
      address: '888 Harbor Drive, Waterfront',
      date: new Date('2026-09-05T11:00:00Z'),
      description: 'Embark on a culinary journey around the world without leaving the city!  Sample dishes from 40+ countries, enjoy wine tastings from renowned vineyards, and watch live cooking demonstrations from celebrity chefs.\n\nThis two-day festival celebrates global cuisine with authentic flavors, cultural performances, and incredible atmosphere.',
      images: [
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1600&q=80&auto=format&fit=crop'
      ],
      highlights: [
        '40+ international food vendors',
        'Wine & cocktail tasting pavilions',
        'Celebrity chef demonstrations',
        'Live cultural performances',
        'Cooking workshops',
        'Kids zone with activities'
      ],
      organizer: 'Culinary Events International',
      rating: 4.7,
      reviews: 678,
      ticket_types: [
        { 
          name:  'General Admission', 
          description: 'Entry only', 
          price: 15, 
          available: 500, 
          total: 2000,
          features: ['Festival entry', 'Access to all areas', 'Purchase food with tokens']
        },
        { 
          name: 'Taste Pass', 
          description: 'Includes 20 food tokens', 
          price: 45, 
          available: 300, 
          total: 800,
          originalPrice: 55,
          features: ['Festival entry', '20 food tokens ($40 value)', 'Recipe booklet']
        },
        { 
          name: 'VIP Foodie Experience', 
          description: 'Ultimate culinary adventure', 
          price:  125, 
          available: 50, 
          total: 100,
          features: ['VIP lounge', 'Unlimited tastings', 'Meet celebrity chefs', 'Premium seating at demos', 'Gift bag']
        }
      ]
    },
    {
      title: 'Marathon Challenge 2026',
      subtitle:  'Run for a cause, conquer the course',
      category: 'Sports',
      location: 'City Marathon Route',
      address: 'Starting Point:  City Hall, 100 Main Street',
      date: new Date('2026-10-10T06:00:00Z'),
      description: 'Join thousands of runners in our annual marathon supporting local children\'s hospitals. Choose from full marathon (26.2 mi), half marathon (13.1 mi), 10K, or 5K fun run.\n\nAll participants receive a medal, t-shirt, and post-race celebration with food and entertainment. 100% of proceeds benefit Children\'s Healthcare Foundation.',
      images: [
        'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?w=1600&q=80&auto=format&fit=crop'
      ],
      highlights: [
        'Chip-timed professional race',
        'Scenic city route',
        'Water stations every mile',
        'Finisher medal & t-shirt',
        'Post-race party',
        'Professional photos included',
        'Supporting children\'s healthcare'
      ],
      organizer: 'City Running Club',
      rating: 4.8,
      reviews: 1567,
      ticket_types: [
        { 
          name:  'Full Marathon', 
          description: '26.2 miles', 
          price: 85, 
          available: 200, 
          total: 1000,
          features: ['Chip timing', 'Finisher medal', 'Race t-shirt', 'Photos', 'Post-race meal']
        },
        { 
          name: 'Half Marathon', 
          description: '13.1 miles', 
          price: 65, 
          available: 350, 
          total: 1500,
          features: ['Chip timing', 'Finisher medal', 'Race t-shirt', 'Photos', 'Post-race meal']
        },
        { 
          name: '10K Run', 
          description: '6.2 miles', 
          price: 45, 
          available: 500, 
          total: 2000,
          features: ['Chip timing', 'Finisher medal', 'Race t-shirt', 'Photos']
        },
        { 
          name: '5K Fun Run/Walk', 
          description: 'Family friendly', 
          price: 30, 
          available: 800, 
          total: 3000,
          features: ['Participation medal', 'Race t-shirt', 'Family friendly']
        }
      ]
    },
    {
      title:  'Comedy Night:  Stand-Up Extravaganza',
      subtitle:  'An evening of non-stop laughter',
      category: 'Comedy',
      location: 'The Laugh Factory',
      address:  '456 Comedy Lane, Entertainment District',
      date: new Date('2026-08-07T20:00:00Z'),
      description: 'Get ready for a hilarious night featuring three of the hottest comedians on the circuit! From observational humor to edgy social commentary, this show has something for everyone.\n\nAges 18+ only. Show includes strong language and adult themes.',
      images: [
        'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=1600&q=80&auto=format&fit=crop'
      ],
      highlights: [
        'Three professional comedians',
        'Full bar service',
        'Intimate venue',
        '2-hour show',
        'Adults only (18+)'
      ],
      organizer:  'Laugh Factory Entertainment',
      rating: 4.6,
      reviews: 342,
      ticket_types: [
        { 
          name:  'General Admission', 
          description: 'Standard seating', 
          price: 35, 
          available: 80, 
          total: 150,
          features: ['Show admission', 'First-come seating']
        },
        { 
          name: 'Premium Seating', 
          description: 'Front section', 
          price: 55, 
          available: 25, 
          total: 50,
          features: ['Priority seating', 'Front section', 'One drink included']
        },
        { 
          name: 'VIP Table (4 people)', 
          description:  'Private table', 
          price: 250, 
          available: 5, 
          total: 10,
          originalPrice: 280,
          features: ['Private table', 'Best view', 'Bottle service option', 'Reserved parking']
        }
      ]
    },
    {
      title: 'Digital Art Exhibition:  Future Visions',
      subtitle: 'Immersive NFT and digital art showcase',
      category: 'Art & Culture',
      location: 'Modern Art Museum',
      address: '300 Museum Avenue, Arts District',
      date: new Date('2026-07-15T10:00:00Z'),
      description: 'Step into the future of art with this groundbreaking exhibition featuring digital artists from around the world. Experience interactive installations, virtual reality art, projection mapping, and exclusive NFT collections.\n\nThe exhibition runs for 30 days with special evening events every Friday featuring artist talks and live digital art creation.',
      images: [
        'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1600&q=80&auto=format&fit=crop'
      ],
      highlights: [
        '50+ digital artists',
        'VR art experiences',
        'Interactive installations',
        'NFT showcase',
        'Artist meet & greets (Fridays)',
        'Photography allowed'
      ],
      organizer: 'Modern Art Museum',
      rating: 4.5,
      reviews: 234,
      ticket_types: [
        { 
          name:  'Single Visit Pass', 
          description: 'One-time entry', 
          price:  20, 
          available: 200, 
          total: 500,
          features: ['Exhibition access', 'Audio guide included', 'Valid for one day']
        },
        { 
          name: 'Monthly Pass', 
          description: 'Unlimited visits for 30 days', 
          price: 50, 
          available: 100, 
          total: 200,
          originalPrice: 60,
          features: ['Unlimited visits', 'Priority entry', 'Discount at gift shop']
        },
        { 
          name: 'Family Pack (2 adults + 2 kids)', 
          description: 'Perfect for families', 
          price:  55, 
          available: 80, 
          total: 150,
          features: ['4 tickets', 'Kids activity booklets', 'One-time entry']
        }
      ]
    },
    {
      title: 'Yoga & Wellness Retreat',
      subtitle: 'Find your inner peace in nature',
      category: 'Wellness',
      location: 'Mountain Zen Retreat Center',
      address: '2000 Mountain Road, Peaceful Valley',
      date: new Date('2026-09-20T15:00:00Z'),
      description: 'Escape the chaos of daily life with our 3-day yoga and wellness retreat.  Immerse yourself in daily yoga sessions, meditation workshops, healthy gourmet meals, spa treatments, and nature walks.\n\nAll levels welcome. Accommodation options include shared rooms, private rooms, and luxury cabins.',
      images: [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1545389336-cf090694435e?w=1600&q=80&auto=format&fit=crop'
      ],
      highlights: [
        '3 days, 2 nights',
        'Daily yoga & meditation',
        'Healthy gourmet meals',
        'Spa treatments included',
        'Nature hikes',
        'Wellness workshops',
        'All materials provided'
      ],
      organizer: 'Zen Wellness Collective',
      rating: 4.9,
      reviews: 456,
      ticket_types: [
        { 
          name: 'Shared Room Package', 
          description: '2-4 people per room', 
          price: 450, 
          available: 30, 
          total: 80,
          features: ['Shared accommodation', 'All meals', 'All classes', 'One spa treatment', 'Yoga mat provided']
        },
        { 
          name: 'Private Room Package', 
          description: 'Your own room', 
          price: 650, 
          available: 15, 
          total: 40,
          features: ['Private room', 'All meals', 'All classes', 'Two spa treatments', 'Yoga mat & blocks']
        },
        { 
          name: 'Luxury Cabin Package', 
          description: 'Premium experience', 
          price: 950, 
          available: 5, 
          total: 10,
          originalPrice: 1100,
          features: ['Private luxury cabin', 'All meals', 'All classes', 'Unlimited spa', 'Private yoga session', 'Welcome gift']
        }
      ]
    },
    {
      title: 'Gaming Convention 2026',
      subtitle:  'The ultimate gathering for gamers',
      category:  'Gaming',
      location:  'Mega Convention Center',
      address: '700 Expo Boulevard, Convention District',
      date: new Date('2026-11-15T10:00:00Z'),
      description: 'The biggest gaming event of the year is back!  Experience 3 days of game reveals, esports tournaments, cosplay competitions, developer panels, hands-on demos, and exclusive merchandise.\n\nMeet your favorite streamers, compete in tournaments, and be among the first to play unreleased games.',
      images: [
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1600&q=80&auto=format&fit=crop'
      ],
      highlights: [
        'Exclusive game reveals',
        'Esports tournaments with prizes',
        'Cosplay competition',
        'Meet top streamers & devs',
        'VR gaming zone',
        'Retro arcade',
        'Merch vendors'
      ],
      organizer: 'GameCon Productions',
      rating: 4.8,
      reviews: 2341,
      ticket_types: [
        { 
          name:  '3-Day Pass', 
          description: 'Full event access', 
          price: 120, 
          available: 1000, 
          total: 5000,
          features: ['3-day access', 'All panels', 'Tournament entry', 'Swag bag']
        },
        { 
          name: 'Single Day Pass', 
          description:  'One day access', 
          price: 50, 
          available: 2000, 
          total: 8000,
          features: ['Single day access', 'Panel access', 'Tournament entry']
        },
        { 
          name: 'VIP 3-Day Pass', 
          description: 'Premium experience', 
          price: 350, 
          available: 100, 
          total: 200,
          features: ['3-day access', 'Skip lines', 'VIP lounge', 'Exclusive merch', 'Meet & greets', 'Priority seating']
        }
      ]
    },
    {
      title: 'Classic Car Show & Auction',
      subtitle: 'Celebrating automotive excellence',
      category: 'Automotive',
      location: 'Grand Exhibition Hall',
      address: '999 Collector\'s Drive, Heritage Park',
      date: new Date('2026-08-28T09:00:00Z'),
      description: 'Join enthusiasts and collectors for the region\'s premier classic car event. Admire over 200 vintage and classic automobiles, attend the live auction, and enjoy expert restoration demonstrations.\n\nFrom muscle cars to European classics, this event showcases automotive history at its finest.',
      images: [
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80&auto=format&fit=crop'
      ],
      highlights: [
        '200+ classic cars on display',
        'Live auction event',
        'Restoration demonstrations',
        'Vendor marketplace',
        'Food trucks & refreshments',
        'Kids activities zone'
      ],
      organizer: 'Classic Auto Collectors Society',
      rating: 4.7,
      reviews: 543,
      ticket_types: [
        { 
          name:  'General Admission', 
          description: 'Show access', 
          price: 25, 
          available: 500, 
          total: 2000,
          features: ['Show floor access', 'Vendor area', 'Demonstrations']
        },
        { 
          name: 'Enthusiast Pass', 
          description:  'Show + auction access', 
          price: 50, 
          available: 200, 
          total: 500,
          features: ['Show access', 'Auction viewing', 'Bidder registration', 'Program guide']
        },
        { 
          name: 'Collector VIP', 
          description: 'Premium experience', 
          price: 150, 
          available: 40, 
          total: 75,
          features: ['VIP lounge', 'Reserved auction seating', 'Private vehicle viewing', 'Catered lunch', 'Gift bag']
        }
      ]
    },
    {
      title: 'New Year\'s Eve Gala 2026',
      subtitle: 'Ring in the new year in style',
      category: 'Holiday Event',
      location: 'Grand Ballroom Hotel',
      address: '555 Celebration Avenue, Downtown',
      date: new Date('2026-12-31T21:00:00Z'),
      description: 'Celebrate the arrival of 2027 at the city\'s most elegant New Year\'s Eve party! Enjoy a night of dancing, live entertainment, gourmet dinner, premium open bar, and a spectacular midnight countdown.\n\nBlack tie optional. Must be 21+.',
      images: [
        'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600&q=80&auto=format&fit=crop'
      ],
      highlights: [
        'Live band & DJ',
        'Gourmet 4-course dinner',
        'Premium open bar',
        'Champagne toast at midnight',
        'Party favors & photo booth',
        'Valet parking included',
        'Black tie optional'
      ],
      organizer: 'Grand Ballroom Events',
      rating: 4.9,
      reviews: 678,
      ticket_types: [
        { 
          name:  'Individual Ticket', 
          description:  'Single admission', 
          price: 200, 
          available: 100, 
          total: 300,
          features: ['Dinner & drinks', 'Entertainment', 'Midnight toast', 'Party favors']
        },
        { 
          name: 'Couple\'s Package', 
          description: 'Two tickets', 
          price:  350, 
          available:  80, 
          total: 200,
          originalPrice: 400,
          features: ['2 tickets', 'All amenities', 'Couples photo', 'Champagne bottle']
        },
        { 
          name: 'VIP Table (8 people)', 
          description: 'Premium table', 
          price: 2000, 
          available: 10, 
          total: 20,
          features: ['Reserved table', 'Bottle service', 'Dedicated server', 'Premium location', 'Gift bags']
        }
      ]
    },
    {
      title: 'Photography Workshop: Landscape Mastery',
      subtitle:  'Learn from award-winning photographers',
      category:  'Workshop',
      location: 'Nature Photography Center & Mountain Park',
      address: '1500 Scenic Vista Road, Mountain View',
      date: new Date('2026-10-05T08:00:00Z'),
      description: 'Elevate your landscape photography skills in this intensive 2-day workshop. Learn advanced techniques in composition, lighting, long exposure, and post-processing from award-winning photographers.\n\nIncludes hands-on shooting in stunning locations, personalized feedback, and post-processing sessions.  All skill levels welcome but basic camera knowledge required.',
      images: [
        'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80&auto=format&fit=crop'
      ],
      highlights: [
        '2 full days of instruction',
        'Sunrise & sunset shoots',
        'Professional photographers',
        'Small group size (max 12)',
        'Post-processing workshop',
        'Certificate of completion',
        'Lunch both days included'
      ],
      organizer: 'Pro Photography Academy',
      rating: 4.9,
      reviews: 187,
      ticket_types: [
        { 
          name:  'Standard Workshop', 
          description: 'Full 2-day course', 
          price: 450, 
          available: 8, 
          total: 12,
          features: ['2-day workshop', 'All instruction', 'Lunch included', 'Certificate', 'Course materials']
        },
        { 
          name: 'Premium Workshop', 
          description: 'With 1-on-1 review', 
          price: 650, 
          available: 3, 
          total: 5,
          features: ['Everything in Standard', '1-hour private review', 'Advanced techniques', 'Photo portfolio critique']
        }
      ]
    },
    {
      title: 'Kids Science Fair Extravaganza',
      subtitle:  'Igniting young minds through discovery',
      category: 'Family & Kids',
      location: 'Children\'s Science Museum',
      address: '200 Discovery Lane, Education Quarter',
      date: new Date('2026-07-18T10:00:00Z'),
      description: 'An exciting day of hands-on science experiments, interactive demonstrations, and educational fun for kids ages 5-14!  Watch amazing science shows, participate in experiments, meet scientists, and explore STEM activities.\n\nPerfect for curious minds and families who love learning together! ',
      images: [
        'https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?w=1600&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1600&q=80&auto=format&fit=crop'
      ],
      highlights: [
        'Interactive experiments',
        'Live science shows',
        'Meet real scientists',
        'Build & take home projects',
        'Planetarium show',
        'Robot demonstrations',
        'Safe & supervised'
      ],
      organizer:  'Children\'s Science Museum',
      rating: 4.8,
      reviews: 432,
      ticket_types: [
        { 
          name:  'Child Ticket (Ages 5-14)', 
          description: 'For one child', 
          price: 15, 
          available: 300, 
          total: 500,
          features: ['All activities', 'Materials included', 'Snack provided']
        },
        { 
          name: 'Adult Chaperone', 
          description:  'Required for kids under 8', 
          price: 10, 
          available: 250, 
          total: 400,
          features: ['Museum access', 'Activity observation']
        },
        { 
          name: 'Family Pack (2 adults + 2 kids)', 
          description: 'Best value', 
          price: 45, 
          available: 100, 
          total: 150,
          originalPrice: 55,
          features: ['4 tickets', 'All activities', 'Souvenir photo']
        }
      ]
    }
  ];

  console.log('Inserting events...');
  const inserted = await Event.insertMany(events);
  console.log('✅ Inserted count:', inserted.length);
  console.log('\n📋 Event List:');
  inserted.forEach((doc, idx) => {
    console.log(`${idx + 1}) ${doc._id} | ${doc.category} | ${doc.title}`);
  });

  await mongoose.disconnect();
  console.log('\n✨ Seeding complete!  Database disconnected.');
}

run().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});