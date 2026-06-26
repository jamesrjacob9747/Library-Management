'use strict';

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const prisma = require('../config/prisma');

async function seed() {
  console.log('Starting seed...');

  // ── Collections ──────────────────────────────────────────
  const collections = await Promise.all([
    prisma.collection.upsert({ where: { collection_id: 1 }, update: {}, create: { collection_name: 'Fiction' } }),
    prisma.collection.upsert({ where: { collection_id: 2 }, update: {}, create: { collection_name: 'Non-Fiction' } }),
    prisma.collection.upsert({ where: { collection_id: 3 }, update: {}, create: { collection_name: 'Science & Technology' } }),
    prisma.collection.upsert({ where: { collection_id: 4 }, update: {}, create: { collection_name: 'History & Biography' } }),
    prisma.collection.upsert({ where: { collection_id: 5 }, update: {}, create: { collection_name: 'Self-Help' } }),
  ]);
  console.log(`${collections.length} collections seeded.`);

  // ── Categories ───────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { cat_id: 1 }, update: {}, create: { cat_name: 'Classic Literature', sub_cat_name: 'English' } }),
    prisma.category.upsert({ where: { cat_id: 2 }, update: {}, create: { cat_name: 'Science Fiction', sub_cat_name: 'Dystopian' } }),
    prisma.category.upsert({ where: { cat_id: 3 }, update: {}, create: { cat_name: 'Mystery', sub_cat_name: 'Detective' } }),
    prisma.category.upsert({ where: { cat_id: 4 }, update: {}, create: { cat_name: 'Biography', sub_cat_name: 'Autobiography' } }),
    prisma.category.upsert({ where: { cat_id: 5 }, update: {}, create: { cat_name: 'Self-Help', sub_cat_name: 'Personal Development' } }),
    prisma.category.upsert({ where: { cat_id: 6 }, update: {}, create: { cat_name: 'History', sub_cat_name: 'World History' } }),
    prisma.category.upsert({ where: { cat_id: 7 }, update: {}, create: { cat_name: 'Fantasy', sub_cat_name: 'Epic Fantasy' } }),
    prisma.category.upsert({ where: { cat_id: 8 }, update: {}, create: { cat_name: 'Romance', sub_cat_name: 'Contemporary' } }),
  ]);
  console.log(`${categories.length} categories seeded.`);

  // ── Members (50) ─────────────────────────────────────────
  const memberData = [
    { mem_name: 'Alice Johnson', mem_email: 'alice.johnson@email.com', mem_phone: '555-0101' },
    { mem_name: 'Bob Martinez', mem_email: 'bob.martinez@email.com', mem_phone: '555-0102' },
    { mem_name: 'Carol White', mem_email: 'carol.white@email.com', mem_phone: '555-0103' },
    { mem_name: 'David Brown', mem_email: 'david.brown@email.com', mem_phone: '555-0104' },
    { mem_name: 'Eva Davis', mem_email: 'eva.davis@email.com', mem_phone: '555-0105' },
    { mem_name: 'Frank Wilson', mem_email: 'frank.wilson@email.com', mem_phone: '555-0106' },
    { mem_name: 'Grace Taylor', mem_email: 'grace.taylor@email.com', mem_phone: '555-0107' },
    { mem_name: 'Henry Anderson', mem_email: 'henry.anderson@email.com', mem_phone: '555-0108' },
    { mem_name: 'Iris Thomas', mem_email: 'iris.thomas@email.com', mem_phone: '555-0109' },
    { mem_name: 'James Jackson', mem_email: 'james.jackson@email.com', mem_phone: '555-0110' },
    { mem_name: 'Karen Lee', mem_email: 'karen.lee@email.com', mem_phone: '555-0111' },
    { mem_name: 'Leo Harris', mem_email: 'leo.harris@email.com', mem_phone: '555-0112' },
    { mem_name: 'Mia Clark', mem_email: 'mia.clark@email.com', mem_phone: '555-0113' },
    { mem_name: 'Noah Lewis', mem_email: 'noah.lewis@email.com', mem_phone: '555-0114' },
    { mem_name: 'Olivia Robinson', mem_email: 'olivia.robinson@email.com', mem_phone: '555-0115' },
    { mem_name: 'Paul Walker', mem_email: 'paul.walker@email.com', mem_phone: '555-0116' },
    { mem_name: 'Quinn Hall', mem_email: 'quinn.hall@email.com', mem_phone: '555-0117' },
    { mem_name: 'Rachel Allen', mem_email: 'rachel.allen@email.com', mem_phone: '555-0118' },
    { mem_name: 'Sam Young', mem_email: 'sam.young@email.com', mem_phone: '555-0119' },
    { mem_name: 'Tina Hernandez', mem_email: 'tina.hernandez@email.com', mem_phone: '555-0120' },
    { mem_name: 'Uma King', mem_email: 'uma.king@email.com', mem_phone: '555-0121' },
    { mem_name: 'Victor Wright', mem_email: 'victor.wright@email.com', mem_phone: '555-0122' },
    { mem_name: 'Wendy Lopez', mem_email: 'wendy.lopez@email.com', mem_phone: '555-0123' },
    { mem_name: 'Xander Scott', mem_email: 'xander.scott@email.com', mem_phone: '555-0124' },
    { mem_name: 'Yara Green', mem_email: 'yara.green@email.com', mem_phone: '555-0125' },
    { mem_name: 'Zoe Adams', mem_email: 'zoe.adams@email.com', mem_phone: '555-0126' },
    { mem_name: 'Aaron Baker', mem_email: 'aaron.baker@email.com', mem_phone: '555-0127' },
    { mem_name: 'Bella Carter', mem_email: 'bella.carter@email.com', mem_phone: '555-0128' },
    { mem_name: 'Carlos Mitchell', mem_email: 'carlos.mitchell@email.com', mem_phone: '555-0129' },
    { mem_name: 'Diana Perez', mem_email: 'diana.perez@email.com', mem_phone: '555-0130' },
    { mem_name: 'Ethan Roberts', mem_email: 'ethan.roberts@email.com', mem_phone: '555-0131' },
    { mem_name: 'Fiona Turner', mem_email: 'fiona.turner@email.com', mem_phone: '555-0132' },
    { mem_name: 'George Phillips', mem_email: 'george.phillips@email.com', mem_phone: '555-0133' },
    { mem_name: 'Hannah Campbell', mem_email: 'hannah.campbell@email.com', mem_phone: '555-0134' },
    { mem_name: 'Ian Parker', mem_email: 'ian.parker@email.com', mem_phone: '555-0135' },
    { mem_name: 'Julia Evans', mem_email: 'julia.evans@email.com', mem_phone: '555-0136' },
    { mem_name: 'Kevin Edwards', mem_email: 'kevin.edwards@email.com', mem_phone: '555-0137' },
    { mem_name: 'Laura Collins', mem_email: 'laura.collins@email.com', mem_phone: '555-0138' },
    { mem_name: 'Mark Stewart', mem_email: 'mark.stewart@email.com', mem_phone: '555-0139' },
    { mem_name: 'Nancy Sanchez', mem_email: 'nancy.sanchez@email.com', mem_phone: '555-0140' },
    { mem_name: 'Oscar Morris', mem_email: 'oscar.morris@email.com', mem_phone: '555-0141' },
    { mem_name: 'Patricia Rogers', mem_email: 'patricia.rogers@email.com', mem_phone: '555-0142' },
    { mem_name: 'Randy Reed', mem_email: 'randy.reed@email.com', mem_phone: '555-0143' },
    { mem_name: 'Susan Cook', mem_email: 'susan.cook@email.com', mem_phone: '555-0144' },
    { mem_name: 'Terry Morgan', mem_email: 'terry.morgan@email.com', mem_phone: '555-0145' },
    { mem_name: 'Ursula Bell', mem_email: 'ursula.bell@email.com', mem_phone: '555-0146' },
    { mem_name: 'Vincent Murphy', mem_email: 'vincent.murphy@email.com', mem_phone: '555-0147' },
    { mem_name: 'Wanda Bailey', mem_email: 'wanda.bailey@email.com', mem_phone: '555-0148' },
    { mem_name: 'Xavier Rivera', mem_email: 'xavier.rivera@email.com', mem_phone: '555-0149' },
    { mem_name: 'Yasmine Cooper', mem_email: 'yasmine.cooper@email.com', mem_phone: '555-0150' },
  ];

  const members = [];
  for (const m of memberData) {
    const member = await prisma.member.upsert({
      where: { mem_email: m.mem_email },
      update: {},
      create: m,
    });
    members.push(member);
  }
  console.log(`${members.length} members seeded.`);

  // ── Memberships ──────────────────────────────────────────
  const statuses = ['active', 'active', 'active', 'inactive', 'suspended'];
  for (const member of members) {
    const existing = await prisma.membership.findUnique({ where: { member_id: member.mem_id } });
    if (!existing) {
      await prisma.membership.create({
        data: {
          member_id: member.mem_id,
          status: statuses[Math.floor(Math.random() * statuses.length)],
        },
      });
    }
  }
  console.log(`Memberships seeded.`);

  // ── Books (100) ───────────────────────────────────────────
  const bookData = [
    { book_name: 'To Kill a Mockingbird', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1960-07-11'), book_publisher: 'J.B. Lippincott' },
    { book_name: '1984', book_cat_id: 2, book_collection_id: 1, book_launch_date: new Date('1949-06-08'), book_publisher: 'Secker & Warburg' },
    { book_name: 'Pride and Prejudice', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1813-01-28'), book_publisher: 'T. Egerton' },
    { book_name: 'The Great Gatsby', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1925-04-10'), book_publisher: "Charles Scribner's Sons" },
    { book_name: 'Brave New World', book_cat_id: 2, book_collection_id: 1, book_launch_date: new Date('1932-01-01'), book_publisher: 'Chatto & Windus' },
    { book_name: 'The Catcher in the Rye', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1951-07-16'), book_publisher: 'Little, Brown' },
    { book_name: 'Lord of the Flies', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1954-09-17'), book_publisher: 'Faber & Faber' },
    { book_name: 'Animal Farm', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1945-08-17'), book_publisher: 'Secker & Warburg' },
    { book_name: 'Fahrenheit 451', book_cat_id: 2, book_collection_id: 1, book_launch_date: new Date('1953-10-19'), book_publisher: 'Ballantine Books' },
    { book_name: 'Dune', book_cat_id: 2, book_collection_id: 1, book_launch_date: new Date('1965-08-01'), book_publisher: 'Chilton Books' },
    { book_name: 'The Lord of the Rings', book_cat_id: 7, book_collection_id: 1, book_launch_date: new Date('1954-07-29'), book_publisher: 'Allen & Unwin' },
    { book_name: 'The Hobbit', book_cat_id: 7, book_collection_id: 1, book_launch_date: new Date('1937-09-21'), book_publisher: 'Allen & Unwin' },
    { book_name: 'Harry Potter and the Philosopher\'s Stone', book_cat_id: 7, book_collection_id: 1, book_launch_date: new Date('1997-06-26'), book_publisher: 'Bloomsbury' },
    { book_name: 'The Alchemist', book_cat_id: 5, book_collection_id: 5, book_launch_date: new Date('1988-01-01'), book_publisher: 'HarperCollins' },
    { book_name: 'The Da Vinci Code', book_cat_id: 3, book_collection_id: 1, book_launch_date: new Date('2003-03-18'), book_publisher: 'Doubleday' },
    { book_name: 'Gone Girl', book_cat_id: 3, book_collection_id: 1, book_launch_date: new Date('2012-06-05'), book_publisher: 'Crown Publishing' },
    { book_name: 'The Girl with the Dragon Tattoo', book_cat_id: 3, book_collection_id: 1, book_launch_date: new Date('2005-08-01'), book_publisher: 'Norstedts Förlag' },
    { book_name: 'And Then There Were None', book_cat_id: 3, book_collection_id: 1, book_launch_date: new Date('1939-11-06'), book_publisher: 'Collins Crime Club' },
    { book_name: 'Sherlock Holmes: A Study in Scarlet', book_cat_id: 3, book_collection_id: 1, book_launch_date: new Date('1887-11-01'), book_publisher: 'Ward Lock & Co' },
    { book_name: 'Murder on the Orient Express', book_cat_id: 3, book_collection_id: 1, book_launch_date: new Date('1934-01-01'), book_publisher: 'Collins Crime Club' },
    { book_name: 'Steve Jobs', book_cat_id: 4, book_collection_id: 4, book_launch_date: new Date('2011-10-24'), book_publisher: 'Simon & Schuster' },
    { book_name: 'Elon Musk', book_cat_id: 4, book_collection_id: 4, book_launch_date: new Date('2015-05-19'), book_publisher: 'Ecco' },
    { book_name: 'The Diary of a Young Girl', book_cat_id: 4, book_collection_id: 4, book_launch_date: new Date('1947-06-25'), book_publisher: 'Contact Publishing' },
    { book_name: 'Long Walk to Freedom', book_cat_id: 4, book_collection_id: 4, book_launch_date: new Date('1994-10-01'), book_publisher: 'Little, Brown' },
    { book_name: 'Leonardo da Vinci', book_cat_id: 4, book_collection_id: 4, book_launch_date: new Date('2017-10-17'), book_publisher: 'Simon & Schuster' },
    { book_name: 'Sapiens', book_cat_id: 6, book_collection_id: 2, book_launch_date: new Date('2011-01-01'), book_publisher: 'Dvir Publishing' },
    { book_name: 'Homo Deus', book_cat_id: 6, book_collection_id: 2, book_launch_date: new Date('2015-09-04'), book_publisher: 'Dvir Publishing' },
    { book_name: 'A Brief History of Time', book_cat_id: 6, book_collection_id: 3, book_launch_date: new Date('1988-04-01'), book_publisher: 'Bantam Dell' },
    { book_name: 'The Selfish Gene', book_cat_id: 6, book_collection_id: 3, book_launch_date: new Date('1976-01-01'), book_publisher: 'Oxford University Press' },
    { book_name: 'Thinking, Fast and Slow', book_cat_id: 5, book_collection_id: 2, book_launch_date: new Date('2011-10-25'), book_publisher: 'Farrar, Straus and Giroux' },
    { book_name: 'Atomic Habits', book_cat_id: 5, book_collection_id: 5, book_launch_date: new Date('2018-10-16'), book_publisher: 'Avery' },
    { book_name: 'Deep Work', book_cat_id: 5, book_collection_id: 5, book_launch_date: new Date('2016-01-05'), book_publisher: 'Grand Central Publishing' },
    { book_name: 'The 7 Habits of Highly Effective People', book_cat_id: 5, book_collection_id: 5, book_launch_date: new Date('1989-08-15'), book_publisher: 'Free Press' },
    { book_name: 'How to Win Friends and Influence People', book_cat_id: 5, book_collection_id: 5, book_launch_date: new Date('1936-10-01'), book_publisher: 'Simon & Schuster' },
    { book_name: 'Rich Dad Poor Dad', book_cat_id: 5, book_collection_id: 5, book_launch_date: new Date('1997-04-01'), book_publisher: 'Warner Books' },
    { book_name: 'Outliers', book_cat_id: 5, book_collection_id: 2, book_launch_date: new Date('2008-11-18'), book_publisher: 'Little, Brown' },
    { book_name: 'The Lean Startup', book_cat_id: 5, book_collection_id: 3, book_launch_date: new Date('2011-09-13'), book_publisher: 'Crown Business' },
    { book_name: 'Zero to One', book_cat_id: 5, book_collection_id: 3, book_launch_date: new Date('2014-09-16'), book_publisher: 'Crown Business' },
    { book_name: 'The Power of Now', book_cat_id: 5, book_collection_id: 5, book_launch_date: new Date('1997-01-01'), book_publisher: 'New World Library' },
    { book_name: 'Man\'s Search for Meaning', book_cat_id: 5, book_collection_id: 5, book_launch_date: new Date('1946-01-01'), book_publisher: 'Beacon Press' },
    { book_name: 'The Secret', book_cat_id: 5, book_collection_id: 5, book_launch_date: new Date('2006-11-26'), book_publisher: 'Atria Books' },
    { book_name: 'Meditations', book_cat_id: 6, book_collection_id: 2, book_launch_date: new Date('180-01-01'), book_publisher: 'Ancient' },
    { book_name: 'The Republic', book_cat_id: 6, book_collection_id: 2, book_launch_date: new Date('380-01-01'), book_publisher: 'Ancient' },
    { book_name: 'The Art of War', book_cat_id: 6, book_collection_id: 2, book_launch_date: new Date('500-01-01'), book_publisher: 'Ancient' },
    { book_name: 'Guns, Germs, and Steel', book_cat_id: 6, book_collection_id: 2, book_launch_date: new Date('1997-03-01'), book_publisher: 'W. W. Norton' },
    { book_name: 'The Silk Roads', book_cat_id: 6, book_collection_id: 4, book_launch_date: new Date('2015-09-01'), book_publisher: 'Bloomsbury' },
    { book_name: 'SPQR: A History of Ancient Rome', book_cat_id: 6, book_collection_id: 4, book_launch_date: new Date('2015-10-22'), book_publisher: 'Profile Books' },
    { book_name: 'The Handmaid\'s Tale', book_cat_id: 2, book_collection_id: 1, book_launch_date: new Date('1985-01-01'), book_publisher: 'McClelland & Stewart' },
    { book_name: 'Never Let Me Go', book_cat_id: 2, book_collection_id: 1, book_launch_date: new Date('2005-03-01'), book_publisher: 'Faber & Faber' },
    { book_name: 'The Road', book_cat_id: 2, book_collection_id: 1, book_launch_date: new Date('2006-09-26'), book_publisher: 'Alfred A. Knopf' },
    { book_name: 'Life of Pi', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('2001-09-11'), book_publisher: 'Knopf Canada' },
    { book_name: 'The Kite Runner', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('2003-05-29'), book_publisher: 'Riverhead Books' },
    { book_name: 'A Thousand Splendid Suns', book_cat_id: 8, book_collection_id: 1, book_launch_date: new Date('2007-05-22'), book_publisher: 'Riverhead Books' },
    { book_name: 'The Notebook', book_cat_id: 8, book_collection_id: 1, book_launch_date: new Date('1996-10-01'), book_publisher: 'Warner Books' },
    { book_name: 'Outlander', book_cat_id: 8, book_collection_id: 1, book_launch_date: new Date('1991-06-01'), book_publisher: 'Delacorte Press' },
    { book_name: 'Me Before You', book_cat_id: 8, book_collection_id: 1, book_launch_date: new Date('2012-01-05'), book_publisher: 'Penguin' },
    { book_name: 'The Fault in Our Stars', book_cat_id: 8, book_collection_id: 1, book_launch_date: new Date('2012-01-10'), book_publisher: 'Dutton Books' },
    { book_name: 'Wuthering Heights', book_cat_id: 8, book_collection_id: 1, book_launch_date: new Date('1847-12-01'), book_publisher: 'Thomas Newby' },
    { book_name: 'Jane Eyre', book_cat_id: 8, book_collection_id: 1, book_launch_date: new Date('1847-10-16'), book_publisher: 'Smith, Elder & Co.' },
    { book_name: 'Great Expectations', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1861-01-01'), book_publisher: 'Chapman & Hall' },
    { book_name: 'Oliver Twist', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1837-01-01'), book_publisher: 'Richard Bentley' },
    { book_name: 'Crime and Punishment', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1866-01-01'), book_publisher: 'The Russian Messenger' },
    { book_name: 'Anna Karenina', book_cat_id: 8, book_collection_id: 1, book_launch_date: new Date('1878-01-01'), book_publisher: 'The Russian Messenger' },
    { book_name: 'War and Peace', book_cat_id: 6, book_collection_id: 1, book_launch_date: new Date('1869-01-01'), book_publisher: 'The Russian Messenger' },
    { book_name: 'The Brothers Karamazov', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1880-01-01'), book_publisher: 'The Russian Messenger' },
    { book_name: 'One Hundred Years of Solitude', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1967-05-30'), book_publisher: 'Harper & Row' },
    { book_name: 'Love in the Time of Cholera', book_cat_id: 8, book_collection_id: 1, book_launch_date: new Date('1985-01-01'), book_publisher: 'Editorial Oveja Negra' },
    { book_name: 'The Stranger', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1942-01-01'), book_publisher: 'Gallimard' },
    { book_name: 'Siddhartha', book_cat_id: 5, book_collection_id: 5, book_launch_date: new Date('1922-01-01'), book_publisher: 'S. Fischer Verlag' },
    { book_name: 'Beloved', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1987-09-02'), book_publisher: 'Alfred A. Knopf' },
    { book_name: 'The Color Purple', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1982-06-01'), book_publisher: 'Harcourt Brace Jovanovich' },
    { book_name: 'Their Eyes Were Watching God', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1937-09-18'), book_publisher: 'J. B. Lippincott' },
    { book_name: 'The Bell Jar', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1963-01-14'), book_publisher: 'Heinemann' },
    { book_name: 'Mrs Dalloway', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1925-05-14'), book_publisher: 'Hogarth Press' },
    { book_name: 'To the Lighthouse', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1927-05-05'), book_publisher: 'Hogarth Press' },
    { book_name: 'Catch-22', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1961-11-10'), book_publisher: 'Simon & Schuster' },
    { book_name: 'Slaughterhouse-Five', book_cat_id: 2, book_collection_id: 1, book_launch_date: new Date('1969-03-31'), book_publisher: 'Delacorte' },
    { book_name: 'The Old Man and the Sea', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1952-09-01'), book_publisher: 'Charles Scribner\'s Sons' },
    { book_name: 'Of Mice and Men', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1937-01-01'), book_publisher: 'Covici Friede' },
    { book_name: 'East of Eden', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1952-09-19'), book_publisher: 'Viking Press' },
    { book_name: 'The Grapes of Wrath', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1939-04-14'), book_publisher: 'Viking Press' },
    { book_name: 'Moby-Dick', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1851-10-18'), book_publisher: 'Harper & Brothers' },
    { book_name: 'Dracula', book_cat_id: 3, book_collection_id: 1, book_launch_date: new Date('1897-05-26'), book_publisher: 'Archibald Constable' },
    { book_name: 'Frankenstein', book_cat_id: 2, book_collection_id: 1, book_launch_date: new Date('1818-01-01'), book_publisher: 'Lackington, Hughes, Harding' },
    { book_name: 'The Picture of Dorian Gray', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1890-07-01'), book_publisher: "Ward, Lock and Company" },
    { book_name: 'Les Misérables', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1862-01-01'), book_publisher: "A. Lacroix" },
    { book_name: 'The Count of Monte Cristo', book_cat_id: 3, book_collection_id: 1, book_launch_date: new Date('1844-01-01'), book_publisher: "Pétion" },
    { book_name: 'Don Quixote', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1605-01-16'), book_publisher: "Francisco de Robles" },
    { book_name: 'The Name of the Rose', book_cat_id: 3, book_collection_id: 1, book_launch_date: new Date('1980-01-01'), book_publisher: "Bompiani" },
    { book_name: 'Invisible Cities', book_cat_id: 7, book_collection_id: 1, book_launch_date: new Date('1972-01-01'), book_publisher: "Einaudi" },
    { book_name: 'The Master and Margarita', book_cat_id: 7, book_collection_id: 1, book_launch_date: new Date('1967-01-01'), book_publisher: "YMCA Press" },
    { book_name: 'Midnight\'s Children', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1981-04-01'), book_publisher: "Jonathan Cape" },
    { book_name: 'The God of Small Things', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1997-05-01'), book_publisher: "IndiaInk" },
    { book_name: 'White Teeth', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('2000-01-27'), book_publisher: "Hamish Hamilton" },
    { book_name: 'Atonement', book_cat_id: 8, book_collection_id: 1, book_launch_date: new Date('2001-09-18'), book_publisher: "Jonathan Cape" },
    { book_name: 'Never Let Me Go', book_cat_id: 2, book_collection_id: 1, book_launch_date: new Date('2005-03-01'), book_publisher: "Faber & Faber" },
    { book_name: 'The Remains of the Day', book_cat_id: 1, book_collection_id: 1, book_launch_date: new Date('1989-05-01'), book_publisher: "Faber & Faber" },
    { book_name: 'Blindness', book_cat_id: 2, book_collection_id: 1, book_launch_date: new Date('1995-01-01'), book_publisher: "Editorial Caminho" },
    { book_name: 'The House of the Spirits', book_cat_id: 7, book_collection_id: 1, book_launch_date: new Date('1982-01-01'), book_publisher: "Plaza & Janés" },
  ];

  const books = [];
  for (const b of bookData) {
    const book = await prisma.book.create({ data: b });
    books.push(book);
  }
  console.log(`${books.length} books seeded.`);

  // ── Issuances (200+) ─────────────────────────────────────
  const today = new Date();
  const addDays = (date, days) => { const d = new Date(date); d.setDate(d.getDate() + days); return d; };
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const statList = ['issued', 'returned', 'overdue'];
  const issuers = ['Librarian A', 'Librarian B', 'Librarian C'];

  const issuanceData = [];
  for (let i = 0; i < 200; i++) {
    const member = members[rand(0, members.length - 1)];
    const book = books[rand(0, books.length - 1)];
    const issuedDaysAgo = rand(5, 90);
    const issuanceDate = addDays(today, -issuedDaysAgo);
    const targetReturnDate = addDays(issuanceDate, 14);

    const roll = Math.random();
    let issuance_status;
    if (roll < 0.55) issuance_status = 'returned';
    else if (roll < 0.75) issuance_status = 'issued';
    else issuance_status = 'overdue';

    issuanceData.push({
      book_id: book.book_id,
      issuance_member: member.mem_id,
      issuance_date: issuanceDate,
      target_return_date: targetReturnDate,
      issuance_status,
      issued_by: issuers[rand(0, issuers.length - 1)],
    });
  }

  // Edge case: due tomorrow
  issuanceData.push({
    book_id: books[0].book_id,
    issuance_member: members[0].mem_id,
    issuance_date: today,
    target_return_date: addDays(today, 1),
    issuance_status: 'issued',
    issued_by: 'Librarian A',
  });

  await prisma.issuance.createMany({ data: issuanceData });
  console.log(`${issuanceData.length} issuances seeded.`);

  console.log('\nSeed completed successfully!');
}

seed()
  .catch((e) => {
    console.error('Seed failed:');
    console.error('  message :', e?.message);
    console.error('  code    :', e?.code);
    console.error('  meta    :', JSON.stringify(e?.meta));
    if (e?.stack) console.error(e.stack);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

