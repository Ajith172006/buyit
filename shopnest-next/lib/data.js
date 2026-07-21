// Product data for ShopNest e-commerce application

// ─── Category → accessory/companion categories map ───────────────────────────
// When a user views a product, these linked categories appear in the "Accessories" tab
export const categoryAccessories = {
  'Mobiles':        ['Electronics', 'Mobiles'],        // covers, earbuds, chargers
  'Electronics':    ['Mobiles', 'Electronics'],
  "Men's Fashion":  ["Women's Fashion", 'Fashion', 'Sports'],
  "Women's Fashion":["Men's Fashion", 'Fashion', 'Beauty'],
  'Fashion':        ["Men's Fashion", "Women's Fashion", 'Sports'],
  'Appliances':     ['Electronics', 'Furniture'],
  'Furniture':      ['Appliances', 'Electronics'],
  'Grocery':        ['Beauty', 'Sports'],
  'Beauty':         ["Women's Fashion", 'Grocery'],
  'Toys':           ['Electronics', 'Sports'],
  'Sports':         ['Fashion', 'Electronics'],
};

// ─── Accessory / companion products per category ─────────────────────────────
// These represent the "accessories" tab — real products linked to the clicked item
export const accessoryProducts = {
  'Mobiles': [
    {
      id:'acc-mob-001', name:'Spigen Tempered Glass Screen Protector', brand:'Spigen', category:'Mobiles',
      price:499, mrp:999, rating:4.6, reviews:8234, stock:500, discount:50,
      desc:'9H hardness, crystal clear, case-friendly fit for all smartphones',
      image:'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80',
    },
    {
      id:'acc-mob-002', name:'Ringke Fusion Clear Back Cover', brand:'Ringke', category:'Mobiles',
      price:349, mrp:799, rating:4.4, reviews:5120, stock:350, discount:56,
      desc:'Military-grade drop protection, transparent hard back with TPU bumper',
      image:'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80',
    },
    {
      id:'acc-mob-003', name:'Anker 65W GaN USB-C Fast Charger', brand:'Anker', category:'Electronics',
      price:1999, mrp:3499, rating:4.7, reviews:12450, stock:200, discount:43,
      desc:'Compact 65W GaN charger, charges laptop + phone simultaneously',
      image:'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80',
    },
    {
      id:'acc-mob-004', name:'boAt Rockerz 550 Wireless Headphones', brand:'boAt', category:'Electronics',
      price:1499, mrp:4990, rating:4.2, reviews:34560, stock:180, discount:70,
      desc:'40hr battery, 40mm drivers, foldable design, BT 5.0',
      image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    },
    {
      id:'acc-mob-005', name:'Portronics Mport 6 USB-C Hub', brand:'Portronics', category:'Electronics',
      price:1299, mrp:2499, rating:4.3, reviews:3210, stock:120, discount:48,
      desc:'6-in-1 USB-C hub with 4K HDMI, USB 3.0, SD card reader',
      image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    },
  ],
  'Electronics': [
    {
      id:'acc-ele-001', name:'AmazonBasics HDMI Cable 6ft', brand:'AmazonBasics', category:'Electronics',
      price:399, mrp:799, rating:4.5, reviews:22340, stock:600, discount:50,
      desc:'4K@60Hz, braided cable, gold-plated connectors',
      image:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
    },
    {
      id:'acc-ele-002', name:'MI Portable Bluetooth Speaker', brand:'Xiaomi', category:'Electronics',
      price:1299, mrp:2199, rating:4.3, reviews:15670, stock:240, discount:41,
      desc:'16W output, 13hr playback, IPX7 waterproof',
      image:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
    },
    {
      id:'acc-ele-003', name:'Anker PowerCore 20000mAh Power Bank', brand:'Anker', category:'Electronics',
      price:2499, mrp:3999, rating:4.7, reviews:8940, stock:160, discount:37,
      desc:'20000mAh, dual USB-A + USB-C, PowerIQ fast charge',
      image:'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80',
    },
  ],
  "Men's Fashion": [
    {
      id:'acc-mf-001', name:'Fossil Minimalist Slim Wallet', brand:'Fossil', category:"Men's Fashion",
      price:1499, mrp:2499, rating:4.5, reviews:4320, stock:200, discount:40,
      desc:'Genuine leather, 6 card slots, slim profile',
      image:'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
    },
    {
      id:'acc-mf-002', name:'Woodland Leather Belt', brand:'Woodland', category:"Men's Fashion",
      price:699, mrp:1299, rating:4.3, reviews:2870, stock:300, discount:46,
      desc:'100% genuine leather, reversible pin buckle, width 35mm',
      image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    },
    {
      id:'acc-mf-003', name:'Ray-Ban Aviator Classic Sunglasses', brand:'Ray-Ban', category:"Men's Fashion",
      price:6990, mrp:9990, rating:4.8, reviews:6750, stock:80, discount:30,
      desc:'Polarized UV400 lenses, gold metal frame, iconic aviator shape',
      image:'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
    },
  ],
  "Women's Fashion": [
    {
      id:'acc-wf-001', name:'Accessorize Statement Pearl Earrings', brand:'Accessorize', category:"Women's Fashion",
      price:599, mrp:999, rating:4.4, reviews:3120, stock:400, discount:40,
      desc:'Freshwater pearl drop earrings, gold-plated brass',
      image:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80',
    },
    {
      id:'acc-wf-002', name:'Lavie Structured Tote Bag', brand:'Lavie', category:"Women's Fashion",
      price:1799, mrp:2999, rating:4.5, reviews:5430, stock:120, discount:40,
      desc:'Faux leather tote with zip closure, laptop sleeve inside',
      image:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80',
    },
    {
      id:'acc-wf-003', name:'Lakme Eyeconic Kajal', brand:'Lakmé', category:'Beauty',
      price:249, mrp:399, rating:4.6, reviews:18200, stock:800, discount:37,
      desc:'Waterproof, smudge-proof, 24hr stay with intense black',
      image:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
    },
  ],
  'Sports': [
    {
      id:'acc-sp-001', name:'Decathlon Water Bottle 750ml', brand:'Decathlon', category:'Sports',
      price:299, mrp:499, rating:4.6, reviews:9800, stock:500, discount:40,
      desc:'BPA-free, leak-proof flip lid, wide mouth for ice cubes',
      image:'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&q=80',
    },
    {
      id:'acc-sp-002', name:'Boldfit Resistance Bands Set', brand:'Boldfit', category:'Sports',
      price:449, mrp:999, rating:4.4, reviews:7650, stock:350, discount:55,
      desc:'5 resistance levels, latex-free, door anchor included',
      image:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
    },
    {
      id:'acc-sp-003', name:'Nivia Dominator Football Size 5', brand:'Nivia', category:'Sports',
      price:699, mrp:1299, rating:4.3, reviews:4230, stock:200, discount:46,
      desc:'PU material, machine stitched, 32-panel classic design',
      image:'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
    },
  ],
  'Beauty': [
    {
      id:'acc-be-001', name:'Minimalist 10% Niacinamide Serum', brand:'Minimalist', category:'Beauty',
      price:599, mrp:899, rating:4.7, reviews:23400, stock:400, discount:33,
      desc:'Reduces pores, oil control, brightens skin tone — 30ml',
      image:'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80',
    },
    {
      id:'acc-be-002', name:'Forest Essentials Rose Water Toner', brand:'Forest Essentials', category:'Beauty',
      price:895, mrp:1195, rating:4.5, reviews:6780, stock:250, discount:25,
      desc:'Pure steam-distilled rose water, balances skin pH',
      image:'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&q=80',
    },
  ],
  'Furniture': [
    {
      id:'acc-fu-001', name:'Philips LED Desk Lamp with USB', brand:'Philips', category:'Electronics',
      price:1299, mrp:2199, rating:4.5, reviews:5670, stock:180, discount:41,
      desc:'5 brightness levels, USB charging port, touch control',
      image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    },
    {
      id:'acc-fu-002', name:'Saral Home Waterproof Chair Cushion', brand:'Saral Home', category:'Furniture',
      price:499, mrp:899, rating:4.3, reviews:3240, stock:300, discount:44,
      desc:'Memory foam, anti-slip bottom, removable washable cover',
      image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
    },
  ],
  'Appliances': [
    {
      id:'acc-ap-001', name:'Havells 1.5L Kettle with Auto Cut-off', brand:'Havells', category:'Appliances',
      price:799, mrp:1499, rating:4.5, reviews:8920, stock:200, discount:47,
      desc:'1500W, stainless steel body, concealed element, cordless',
      image:'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80',
    },
    {
      id:'acc-ap-002', name:'Cello OpalWare Dinner Set 33pcs', brand:'Cello', category:'Appliances',
      price:1499, mrp:2999, rating:4.4, reviews:4560, stock:150, discount:50,
      desc:'Opal glass, microwave safe, break-resistant, dishwasher safe',
      image:'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee?w=400&q=80',
    },
  ],
  'Grocery': [
    {
      id:'acc-gr-001', name:'Tupperware Modular Mates Set', brand:'Tupperware', category:'Furniture',
      price:1299, mrp:2199, rating:4.6, reviews:5670, stock:200, discount:41,
      desc:'Airtight seal, fridge & microwave safe, stackable',
      image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    },
    {
      id:'acc-gr-002', name:'Saffola Active Refined Cooking Oil 5L', brand:'Saffola', category:'Grocery',
      price:799, mrp:1099, rating:4.5, reviews:11230, stock:400, discount:27,
      desc:'Blended edible oil, rich in Oryzanol, heart-healthy',
      image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
    },
  ],
  'Toys': [
    {
      id:'acc-toy-001', name:'Funskool Monopoly Classic Board Game', brand:'Funskool', category:'Toys',
      price:699, mrp:1299, rating:4.5, reviews:8760, stock:200, discount:46,
      desc:'Classic property trading game for 2-6 players, age 8+',
      image:'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&q=80',
    },
    {
      id:'acc-toy-002', name:'Duracell AA Batteries 16 Pack', brand:'Duracell', category:'Electronics',
      price:499, mrp:799, rating:4.7, reviews:23400, stock:1000, discount:37,
      desc:'Long-lasting alkaline, Duralock technology, 10yr storage life',
      image:'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80',
    },
  ],
};

export const initialProducts = [
  {
    id:'65d1a2b3c4d5e6f7a8b9c001', name:'Apple iPhone 15 Pro Max 256GB', brand:'Apple', category:'Mobiles',
    price:134900, mrp:159900, rating:4.8, reviews:18420, stock:45, discount:16,
    desc:'A17 Pro chip, 48MP camera system, titanium design',
    image:'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c002', name:'Samsung 65" 4K QLED Smart TV', brand:'Samsung', category:'Electronics',
    price:64999, mrp:129900, rating:4.5, reviews:5621, stock:12, discount:50,
    desc:'120Hz refresh rate, Quantum HDR, Tizen OS',
    image:'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c003', name:'Sony WH-1000XM5 Headphones', brand:'Sony', category:'Electronics',
    price:24990, mrp:34990, rating:4.7, reviews:9823, stock:88, discount:29,
    desc:'Industry-leading noise cancellation, 30hr battery',
    image:'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c004', name:'Nike Air Max 270 Running Shoes', brand:'Nike', category:'Fashion',
    price:7495, mrp:12995, rating:4.4, reviews:3412, stock:120, discount:42,
    desc:'Air cushioning, breathable mesh upper',
    image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c005', name:'MacBook Air M3 13-inch 8GB 256GB', brand:'Apple', category:'Electronics',
    price:114900, mrp:129900, rating:4.9, reviews:7234, stock:23, discount:12,
    desc:'Apple M3 chip, 18hr battery life, Liquid Retina display',
    image:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c006', name:'LG 1.5 Ton 5-Star Inverter AC', brand:'LG', category:'Appliances',
    price:37990, mrp:55000, rating:4.3, reviews:2841, stock:8, discount:31,
    desc:'5-star BEE rated, dual inverter, auto clean',
    image:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c007', name:'Fossil Gen 6 Smartwatch', brand:'Fossil', category:'Fashion',
    price:14995, mrp:24995, rating:4.3, reviews:1823, stock:60, discount:40,
    desc:'Wear OS, heart rate, GPS, 1.28" AMOLED display',
    image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c008', name:'Nescafé Gold Blend 200g', brand:'Nestlé', category:'Grocery',
    price:449, mrp:599, rating:4.6, reviews:12934, stock:500, discount:25,
    desc:'Premium coffee blend, smooth & balanced taste',
    image:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c009', name:'Ergonomic Office Chair', brand:'Herman Miller', category:'Furniture',
    price:24999, mrp:34999, rating:4.7, reviews:2134, stock:18, discount:29,
    desc:'Lumbar support, adjustable armrests, breathable mesh back',
    image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c010', name:'OnePlus 12R 5G 256GB', brand:'OnePlus', category:'Mobiles',
    price:39999, mrp:44999, rating:4.5, reviews:8712, stock:67, discount:11,
    desc:'Snapdragon 8 Gen 2, 100W SUPERVOOC, 50MP camera',
    image:'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c011', name:'Maybelline Fit Me Foundation', brand:'Maybelline', category:'Beauty',
    price:399, mrp:549, rating:4.3, reviews:4521, stock:300, discount:27,
    desc:'Natural finish, 40 shades, oil control',
    image:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c012', name:'LEGO Technic McLaren Formula 1', brand:'LEGO', category:'Toys',
    price:12999, mrp:17999, rating:4.8, reviews:1234, stock:25, discount:28,
    desc:'1:8 scale, 1432 pieces, movable parts',
    image:'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c013', name:'Adidas Ultraboost 23 Shoes', brand:'Adidas', category:'Sports',
    price:14999, mrp:19999, rating:4.6, reviews:3201, stock:80, discount:25,
    desc:'BOOST midsole, Primeknit+ upper, Linear Energy Push',
    image:'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c014', name:'Instant Pot Duo 7-in-1 5.7L', brand:'Instant Pot', category:'Appliances',
    price:8499, mrp:14999, rating:4.7, reviews:6734, stock:55, discount:43,
    desc:'Pressure cooker, slow cooker, rice cooker & more',
    image:'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c015', name:'Canon EOS R50 Mirrorless Camera', brand:'Canon', category:'Electronics',
    price:74990, mrp:89990, rating:4.8, reviews:2341, stock:15, discount:17,
    desc:'24.2MP APS-C sensor, 4K video, Dual Pixel AF',
    image:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c016', name:'boAt Airdopes 141 TWS Earbuds', brand:'boAt', category:'Electronics',
    price:999, mrp:2999, rating:4.1, reviews:45231, stock:400, discount:67,
    desc:'42hr total playback, ENx tech, Instacharge',
    image:'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c017', name:'Apple iPhone 15 Pro Max 256GB', brand:'Apple', category:'Mobiles',
    price:134900, mrp:159900, rating:4.8, reviews:18420, stock:45, discount:16,
    desc:'A17 Pro chip, 48MP camera system, titanium design',
    image:'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c018', name:'Samsung Galaxy S24 Ultra 5G', brand:'Samsung', category:'Mobiles',
    price:124999, mrp:139999, rating:4.7, reviews:12560, stock:35, discount:10,
    desc:'Snapdragon 8 Gen 3, 200MP camera, built-in S Pen, AI features',
    image:'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c019', name:'Mens Classic Leather Jacket', brand:'Levis', category:"Men's Fashion",
    price:4999, mrp:6999, rating:4.5, reviews:1823, stock:60, discount:28,
    desc:'Premium real leather jacket with clean biker design and zipper pockets',
    image:'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c020', name:'Mens Slim Fit Casual Chinos', brand:'Zara', category:"Men's Fashion",
    price:1499, mrp:2499, rating:4.3, reviews:3412, stock:120, discount:40,
    desc:'Stretchable cotton slim-fit chinos for smart casual office wear',
    image:'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c021', name:'Womens Floral Summer A-Line Dress', brand:'H&M', category:"Women's Fashion",
    price:2499, mrp:3999, rating:4.4, reviews:2134, stock:80, discount:37,
    desc:'Breathable chiffon fabric summer dress with beautiful floral printing',
    image:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c022', name:'Womens Luxury Leather Handbag', brand:'Michael Kors', category:"Women's Fashion",
    price:3499, mrp:4999, rating:4.6, reviews:923, stock:40, discount:30,
    desc:'Saffiano leather handbag with gold-tone hardware and chain straps',
    image:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80',
  },
  {
    id:'65d1a2b3c4d5e6f7a8b9c023', name:'Organic California Almonds 500g', brand:'Happilo', category:'Grocery',
    price:499, mrp:599, rating:4.6, reviews:12934, stock:500, discount:16,
    desc:'Raw whole raw almonds rich in protein, fiber, and healthy fats',
    image:'https://images.unsplash.com/photo-1508061253366-f7da158b6d96?w=400&q=80',
  },
];

export const customers = [
  {name:'Ravi Kumar',email:'ravi@email.com',city:'Chennai',orders:12,spent:'₹48,940',joined:'Jan 2024'},
  {name:'Priya Singh',email:'priya@email.com',city:'Mumbai',orders:8,spent:'₹1,52,890',joined:'Mar 2024'},
  {name:'Amit Patel',email:'amit@email.com',city:'Ahmedabad',orders:5,spent:'₹12,450',joined:'Feb 2025'},
  {name:'Sneha Reddy',email:'sneha@email.com',city:'Hyderabad',orders:23,spent:'₹89,340',joined:'Nov 2023'},
  {name:'Mohan Das',email:'mohan@email.com',city:'Kolkata',orders:3,spent:'₹6,890',joined:'Apr 2025'},
  {name:'Lakshmi Iyer',email:'lakshmi@email.com',city:'Bangalore',orders:17,spent:'₹1,23,000',joined:'Dec 2023'},
];

export const sampleOrders = [
  {id:'SN1001',customer:'Ravi Kumar',phone:'9876543210',items:2,total:15990,payment:'Online',date:'26/04/2026',status:'delivered'},
  {id:'SN1002',customer:'Priya Singh',phone:'8765432109',items:1,total:134900,payment:'EMI',date:'26/04/2026',status:'shipped'},
  {id:'SN1003',customer:'Amit Patel',phone:'7654321098',items:3,total:8247,payment:'COD',date:'25/04/2026',status:'pending'},
  {id:'SN1004',customer:'Sneha Reddy',phone:'6543210987',items:1,total:24990,payment:'Online',date:'25/04/2026',status:'delivered'},
  {id:'SN1005',customer:'Mohan Das',phone:'9012345678',items:2,total:3294,payment:'COD',date:'24/04/2026',status:'cancelled'},
];

export const analyticsData = {
  categories: ['Electronics','Mobiles','Fashion','Appliances','Furniture','Grocery','Beauty','Toys','Sports'],
  categoryValues: [38,22,15,10,6,4,2,2,1],
  categoryColors: ['#1a56db','#e02424','#0891b2','#f59e0b','#7c3aed','#10b981','#ec4899','#f97316','#64748b'],
  months: ['Nov','Dec','Jan','Feb','Mar','Apr'],
  revenue: [8.2,9.4,7.8,10.1,11.3,12.4],
};

export const categories = ['Electronics','Mobiles',"Men's Fashion","Women's Fashion",'Fashion','Appliances','Furniture','Grocery','Beauty','Toys','Sports'];
