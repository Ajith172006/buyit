// Product data for the Flipkart E-commerce application

const products = [
  {id:1,name:'Apple iPhone 15 Pro Max 256GB',brand:'Apple',category:'Mobiles',price:134900,mrp:159900,rating:4.8,reviews:18420,emoji:'📱',stock:45,discount:16,desc:'A17 Pro chip, 48MP camera system, titanium design'},
  {id:2,name:'Samsung 65" 4K QLED Smart TV',brand:'Samsung',category:'Electronics',price:64999,mrp:129900,rating:4.5,reviews:5621,emoji:'📺',stock:12,discount:50,desc:'120Hz refresh rate, Quantum HDR, Tizen OS'},
  {id:3,name:'Sony WH-1000XM5 Headphones',brand:'Sony',category:'Electronics',price:24990,mrp:34990,rating:4.7,reviews:9823,emoji:'🎧',stock:88,discount:29,desc:'Industry-leading noise cancellation, 30hr battery'},
  {id:4,name:'Nike Air Max 270 Running Shoes',brand:'Nike',category:'Fashion',price:7495,mrp:12995,rating:4.4,reviews:3412,emoji:'👟',stock:120,discount:42,desc:'Air cushioning, breathable mesh upper'},
  {id:5,name:'MacBook Air M3 13-inch 8GB 256GB',brand:'Apple',category:'Electronics',price:114900,mrp:129900,rating:4.9,reviews:7234,emoji:'💻',stock:23,discount:12,desc:'Apple M3 chip, 18hr battery life, Liquid Retina display'},
  {id:6,name:'LG 1.5 Ton 5-Star Inverter AC',brand:'LG',category:'Appliances',price:37990,mrp:55000,rating:4.3,reviews:2841,emoji:'❄️',stock:8,discount:31,desc:'5-star BEE rated, dual inverter, auto clean'},
  {id:7,name:'Woodland Analogue Watch Men',brand:'Woodland',category:'Fashion',price:1295,mrp:2995,rating:4.1,reviews:1823,emoji:'⌚',stock:200,discount:57,desc:'Stainless steel, water resistant to 30m'},
  {id:8,name:'Nescafé Gold Blend 200g',brand:'Nestlé',category:'Grocery',price:449,mrp:599,rating:4.6,reviews:12934,emoji:'☕',stock:500,discount:25,desc:'Premium coffee blend, smooth & balanced taste'},
  {id:9,name:'IKEA ALEX Desk Drawer Unit',brand:'IKEA',category:'Furniture',price:8990,mrp:12990,rating:4.2,reviews:2134,emoji:'🪑',stock:35,discount:31,desc:'6 drawers, 70x58cm, white finish'},
  {id:10,name:'OnePlus 12R 5G 256GB',brand:'OnePlus',category:'Mobiles',price:39999,mrp:44999,rating:4.5,reviews:8712,emoji:'📲',stock:67,discount:11,desc:'Snapdragon 8 Gen 2, 100W SUPERVOOC, 50MP camera'},
  {id:11,name:'Lakme 9-to-5 Primer+Matte Lipstick',brand:'Lakmé',category:'Beauty',price:399,mrp:549,rating:4.3,reviews:4521,emoji:'💄',stock:300,discount:27,desc:'Long-lasting matte finish, 14 shades'},
  {id:12,name:'Lego Technic McLaren Formula 1',brand:'LEGO',category:'Toys',price:12999,mrp:17999,rating:4.8,reviews:1234,emoji:'🧩',stock:25,discount:28,desc:'1:8 scale, 1432 pieces, movable parts'},
  {id:13,name:'Adidas Ultraboost 23 Shoes',brand:'Adidas',category:'Sports',price:14999,mrp:19999,rating:4.6,reviews:3201,emoji:'🏃',stock:80,discount:25,desc:'BOOST midsole, Primeknit+ upper, Linear Energy Push'},
  {id:14,name:'Instant Pot Duo 7-in-1 5.7L',brand:'Instant Pot',category:'Appliances',price:8499,mrp:14999,rating:4.7,reviews:6734,emoji:'🍲',stock:55,discount:43,desc:'Pressure cooker, slow cooker, rice cooker & more'},
  {id:15,name:'Philips LED Bulb 9W Pack of 6',brand:'Philips',category:'Electronics',price:349,mrp:599,rating:4.5,reviews:22341,emoji:'💡',stock:1000,discount:42,desc:'Energy efficient, 800 lumens, 2-year warranty'},
  {id:16,name:'Boat Airdopes 141 TWS Earbuds',brand:'boAt',category:'Electronics',price:999,mrp:2999,rating:4.1,reviews:45231,emoji:'🎵',stock:400,discount:67,desc:'42hr total playback, ENx tech, Instacharge'},
];

// Sample customers data
const customers = [
  {name:'Ravi Kumar',email:'ravi@email.com',city:'Chennai',orders:12,spent:'₹48,940',joined:'Jan 2024'},
  {name:'Priya Singh',email:'priya@email.com',city:'Mumbai',orders:8,spent:'₹1,52,890',joined:'Mar 2024'},
  {name:'Amit Patel',email:'amit@email.com',city:'Ahmedabad',orders:5,spent:'₹12,450',joined:'Feb 2025'},
  {name:'Sneha Reddy',email:'sneha@email.com',city:'Hyderabad',orders:23,spent:'₹89,340',joined:'Nov 2023'},
  {name:'Mohan Das',email:'mohan@email.com',city:'Kolkata',orders:3,spent:'₹6,890',joined:'Apr 2025'},
  {name:'Lakshmi Iyer',email:'lakshmi@email.com',city:'Bangalore',orders:17,spent:'₹1,23,000',joined:'Dec 2023'},
];

// Sample orders data
const sampleOrders = [
  {id:'SN1001',customer:'Ravi Kumar',phone:'9876543210',items:2,total:15990,payment:'Online',date:'26/04/2026',status:'delivered'},
  {id:'SN1002',customer:'Priya Singh',phone:'8765432109',items:1,total:134900,payment:'EMI',date:'26/04/2026',status:'shipped'},
  {id:'SN1003',customer:'Amit Patel',phone:'7654321098',items:3,total:8247,payment:'COD',date:'25/04/2026',status:'pending'},
  {id:'SN1004',customer:'Sneha Reddy',phone:'6543210987',items:1,total:24990,payment:'Online',date:'25/04/2026',status:'delivered'},
  {id:'SN1005',customer:'Mohan Das',phone:'9012345678',items:2,total:3294,payment:'COD',date:'24/04/2026',status:'cancelled'},
];

// Analytics data
const analyticsData = {
  categories: ['Electronics','Mobiles','Fashion','Appliances','Furniture','Grocery','Beauty','Toys','Sports'],
  categoryValues: [38,22,15,10,6,4,2,2,1],
  categoryColors: ['#7c3aed','#06b6d4','#10b981','#f59e0b','#8b5cf6','#14b8a6','#ec4899','#f97316','#64748b'],
  months: ['Nov','Dec','Jan','Feb','Mar','Apr'],
  revenue: [8.2,9.4,7.8,10.1,11.3,12.4]
};

// Categories list
const categories = ['Electronics', 'Fashion', 'Mobiles', 'Appliances', 'Furniture', 'Grocery', 'Beauty', 'Toys', 'Sports'];