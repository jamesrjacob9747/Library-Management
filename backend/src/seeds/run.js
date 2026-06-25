'use strict';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { sequelize } = require('../config/database');
const Member = require('../models/Member');
const Book = require('../models/Book');
const Issuance = require('../models/Issuance');

// ─── Sample Data ────────────────────────────────────────────────────────────

const memberData = [
  { name: 'Alice Johnson', email: 'alice.johnson@email.com', phone: '555-0101', address: '12 Oak Street, Springfield' },
  { name: 'Bob Martinez', email: 'bob.martinez@email.com', phone: '555-0102', address: '45 Elm Ave, Shelbyville' },
  { name: 'Carol White', email: 'carol.white@email.com', phone: '555-0103', address: '78 Maple Rd, Capital City' },
  { name: 'David Brown', email: 'david.brown@email.com', phone: '555-0104', address: '99 Pine St, Ogdenville' },
  { name: 'Eva Davis', email: 'eva.davis@email.com', phone: '555-0105', address: '33 Cedar Blvd, North Haverbrook' },
  { name: 'Frank Wilson', email: 'frank.wilson@email.com', phone: '555-0106', address: '21 Birch Lane, Springfield' },
  { name: 'Grace Taylor', email: 'grace.taylor@email.com', phone: '555-0107', address: '54 Walnut Ave, Shelbyville' },
  { name: 'Henry Anderson', email: 'henry.anderson@email.com', phone: '555-0108', address: '67 Spruce Rd, Capital City' },
  { name: 'Iris Thomas', email: 'iris.thomas@email.com', phone: '555-0109', address: '88 Poplar St, Ogdenville' },
  { name: 'James Jackson', email: 'james.jackson@email.com', phone: '555-0110', address: '11 Chestnut Way, Springfield' },
  { name: 'Karen Lee', email: 'karen.lee@email.com', phone: '555-0111', address: '23 Ash Dr, Shelbyville' },
  { name: 'Leo Harris', email: 'leo.harris@email.com', phone: '555-0112', address: '36 Hickory Ct, Capital City' },
  { name: 'Mia Clark', email: 'mia.clark@email.com', phone: '555-0113', address: '49 Willow Pass, Ogdenville' },
  { name: 'Noah Lewis', email: 'noah.lewis@email.com', phone: '555-0114', address: '52 Magnolia Loop, Springfield' },
  { name: 'Olivia Robinson', email: 'olivia.robinson@email.com', phone: '555-0115', address: '65 Redwood Path, Shelbyville' },
  { name: 'Paul Walker', email: 'paul.walker@email.com', phone: '555-0116', address: '18 Sequoia Run, Capital City' },
  { name: 'Quinn Hall', email: 'quinn.hall@email.com', phone: '555-0117', address: '81 Cypress Ln, Springfield' },
  { name: 'Rachel Allen', email: 'rachel.allen@email.com', phone: '555-0118', address: '94 Juniper St, Shelbyville' },
  { name: 'Sam Young', email: 'sam.young@email.com', phone: '555-0119', address: '107 Fir Ave, Capital City' },
  { name: 'Tina Hernandez', email: 'tina.hernandez@email.com', phone: '555-0120', address: '120 Palm Dr, Ogdenville' },
  { name: 'Uma King', email: 'uma.king@email.com', phone: '555-0121', address: '133 Bamboo Rd, Springfield' },
  { name: 'Victor Wright', email: 'victor.wright@email.com', phone: '555-0122', address: '146 Lemon St, Shelbyville' },
  { name: 'Wendy Lopez', email: 'wendy.lopez@email.com', phone: '555-0123', address: '159 Orange Ave, Capital City' },
  { name: 'Xander Scott', email: 'xander.scott@email.com', phone: '555-0124', address: '172 Cherry Blvd, Springfield' },
  { name: 'Yara Green', email: 'yara.green@email.com', phone: '555-0125', address: '185 Peach Way, Shelbyville' },
  { name: 'Zoe Adams', email: 'zoe.adams@email.com', phone: '555-0126', address: '198 Grape Ct, Capital City' },
  { name: 'Aaron Baker', email: 'aaron.baker@email.com', phone: '555-0127', address: '211 Berry Pass, Ogdenville' },
  { name: 'Bella Carter', email: 'bella.carter@email.com', phone: '555-0128', address: '224 Plum Loop, Springfield' },
  { name: 'Carlos Mitchell', email: 'carlos.mitchell@email.com', phone: '555-0129', address: '237 Pear Path, Shelbyville' },
  { name: 'Diana Perez', email: 'diana.perez@email.com', phone: '555-0130', address: '250 Apple Run, Capital City' },
  { name: 'Ethan Roberts', email: 'ethan.roberts@email.com', phone: '555-0131', address: '263 Kiwi Ln, Springfield' },
  { name: 'Fiona Turner', email: 'fiona.turner@email.com', phone: '555-0132', address: '276 Mango St, Shelbyville' },
  { name: 'George Phillips', email: 'george.phillips@email.com', phone: '555-0133', address: '289 Coconut Ave, Capital City' },
  { name: 'Hannah Campbell', email: 'hannah.campbell@email.com', phone: '555-0134', address: '302 Fig Dr, Ogdenville' },
  { name: 'Ian Parker', email: 'ian.parker@email.com', phone: '555-0135', address: '315 Date Rd, Springfield' },
  { name: 'Julia Evans', email: 'julia.evans@email.com', phone: '555-0136', address: '328 Lime Blvd, Shelbyville' },
  { name: 'Kevin Edwards', email: 'kevin.edwards@email.com', phone: '555-0137', address: '341 Tangerine Way, Capital City' },
  { name: 'Laura Collins', email: 'laura.collins@email.com', phone: '555-0138', address: '354 Apricot Ct, Ogdenville' },
  { name: 'Mark Stewart', email: 'mark.stewart@email.com', phone: '555-0139', address: '367 Guava Pass, Springfield' },
  { name: 'Nancy Sanchez', email: 'nancy.sanchez@email.com', phone: '555-0140', address: '380 Papaya Loop, Shelbyville' },
  { name: 'Oscar Morris', email: 'oscar.morris@email.com', phone: '555-0141', address: '393 Lychee Path, Capital City' },
  { name: 'Patricia Rogers', email: 'patricia.rogers@email.com', phone: '555-0142', address: '406 Durian Run, Ogdenville' },
  { name: 'Randy Reed', email: 'randy.reed@email.com', phone: '555-0143', address: '419 Jackfruit Ln, Springfield' },
  { name: 'Susan Cook', email: 'susan.cook@email.com', phone: '555-0144', address: '432 Starfruit St, Shelbyville' },
  { name: 'Terry Morgan', email: 'terry.morgan@email.com', phone: '555-0145', address: '445 Dragonfruit Ave, Capital City' },
  { name: 'Ursula Bell', email: 'ursula.bell@email.com', phone: '555-0146', address: '458 Passionfruit Dr, Ogdenville' },
  { name: 'Vincent Murphy', email: 'vincent.murphy@email.com', phone: '555-0147', address: '471 Feijoa Rd, Springfield' },
  { name: 'Wanda Bailey', email: 'wanda.bailey@email.com', phone: '555-0148', address: '484 Persimmon Blvd, Shelbyville' },
  { name: 'Xavier Rivera', email: 'xavier.rivera@email.com', phone: '555-0149', address: '497 Mulberry Way, Capital City' },
  { name: 'Yasmine Cooper', email: 'yasmine.cooper@email.com', phone: '555-0150', address: '510 Elderberry Ct, Springfield' },
];

const bookData = [
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061935466', publication_year: 1960, copies_available: 5 },
  { title: '1984', author: 'George Orwell', isbn: '978-0451524935', publication_year: 1949, copies_available: 4 },
  { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518', publication_year: 1813, copies_available: 3 },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', publication_year: 1925, copies_available: 4 },
  { title: 'Moby-Dick', author: 'Herman Melville', isbn: '978-1503280786', publication_year: 1851, copies_available: 2 },
  { title: 'War and Peace', author: 'Leo Tolstoy', isbn: '978-1400079988', publication_year: 1869, copies_available: 2 },
  { title: 'The Odyssey', author: 'Homer', isbn: '978-0140268867', publication_year: -800, copies_available: 3 },
  { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', isbn: '978-0486415871', publication_year: 1866, copies_available: 3 },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0316769174', publication_year: 1951, copies_available: 4 },
  { title: 'Brave New World', author: 'Aldous Huxley', isbn: '978-0060850524', publication_year: 1932, copies_available: 3 },
  { title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', isbn: '978-0374528379', publication_year: 1880, copies_available: 2 },
  { title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', isbn: '978-0060883287', publication_year: 1967, copies_available: 4 },
  { title: 'Don Quixote', author: 'Miguel de Cervantes', isbn: '978-0060934347', publication_year: 1605, copies_available: 2 },
  { title: 'Hamlet', author: 'William Shakespeare', isbn: '978-0521618748', publication_year: 1603, copies_available: 5 },
  { title: 'The Divine Comedy', author: 'Dante Alighieri', isbn: '978-0451531520', publication_year: 1320, copies_available: 2 },
  { title: 'Anna Karenina', author: 'Leo Tolstoy', isbn: '978-0143035008', publication_year: 1878, copies_available: 3 },
  { title: 'Ulysses', author: 'James Joyce', isbn: '978-0679722021', publication_year: 1922, copies_available: 2 },
  { title: 'The Iliad', author: 'Homer', isbn: '978-0140275360', publication_year: -750, copies_available: 3 },
  { title: 'In Search of Lost Time', author: 'Marcel Proust', isbn: '978-0300059359', publication_year: 1913, copies_available: 2 },
  { title: 'Middlemarch', author: 'George Eliot', isbn: '978-0141439549', publication_year: 1871, copies_available: 3 },
  { title: 'The Sound and the Fury', author: 'William Faulkner', isbn: '978-0679732242', publication_year: 1929, copies_available: 2 },
  { title: 'Wuthering Heights', author: 'Emily Brontë', isbn: '978-0141439556', publication_year: 1847, copies_available: 4 },
  { title: 'Jane Eyre', author: 'Charlotte Brontë', isbn: '978-0141441146', publication_year: 1847, copies_available: 4 },
  { title: 'Great Expectations', author: 'Charles Dickens', isbn: '978-0141439563', publication_year: 1861, copies_available: 3 },
  { title: 'David Copperfield', author: 'Charles Dickens', isbn: '978-0141439501', publication_year: 1850, copies_available: 2 },
  { title: 'The Trial', author: 'Franz Kafka', isbn: '978-0805209990', publication_year: 1925, copies_available: 3 },
  { title: 'Metamorphosis', author: 'Franz Kafka', isbn: '978-0486290300', publication_year: 1915, copies_available: 5 },
  { title: 'Lord of the Flies', author: 'William Golding', isbn: '978-0399501487', publication_year: 1954, copies_available: 4 },
  { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', isbn: '978-0618640157', publication_year: 1954, copies_available: 5 },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '978-0547928227', publication_year: 1937, copies_available: 6 },
  { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', isbn: '978-0590353427', publication_year: 1997, copies_available: 7 },
  { title: 'Animal Farm', author: 'George Orwell', isbn: '978-0451526342', publication_year: 1945, copies_available: 5 },
  { title: 'The Alchemist', author: 'Paulo Coelho', isbn: '978-0062315007', publication_year: 1988, copies_available: 5 },
  { title: 'Dune', author: 'Frank Herbert', isbn: '978-0441013593', publication_year: 1965, copies_available: 4 },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury', isbn: '978-1451673319', publication_year: 1953, copies_available: 4 },
  { title: 'Slaughterhouse-Five', author: 'Kurt Vonnegut', isbn: '978-0440180296', publication_year: 1969, copies_available: 3 },
  { title: 'Catch-22', author: 'Joseph Heller', isbn: '978-1451626650', publication_year: 1961, copies_available: 3 },
  { title: 'The Old Man and the Sea', author: 'Ernest Hemingway', isbn: '978-0684801223', publication_year: 1952, copies_available: 4 },
  { title: 'Of Mice and Men', author: 'John Steinbeck', isbn: '978-0140177398', publication_year: 1937, copies_available: 4 },
  { title: 'The Grapes of Wrath', author: 'John Steinbeck', isbn: '978-0143039433', publication_year: 1939, copies_available: 3 },
  { title: 'East of Eden', author: 'John Steinbeck', isbn: '978-0142004234', publication_year: 1952, copies_available: 3 },
  { title: 'A Tale of Two Cities', author: 'Charles Dickens', isbn: '978-0141439600', publication_year: 1859, copies_available: 3 },
  { title: 'Les Misérables', author: 'Victor Hugo', isbn: '978-0451419439', publication_year: 1862, copies_available: 2 },
  { title: 'The Count of Monte Cristo', author: 'Alexandre Dumas', isbn: '978-0140449266', publication_year: 1844, copies_available: 3 },
  { title: 'Frankenstein', author: 'Mary Shelley', isbn: '978-0486282114', publication_year: 1818, copies_available: 4 },
  { title: 'Dracula', author: 'Bram Stoker', isbn: '978-0486411095', publication_year: 1897, copies_available: 3 },
  { title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', isbn: '978-0141439570', publication_year: 1890, copies_available: 4 },
  { title: 'Heart of Darkness', author: 'Joseph Conrad', isbn: '978-0486264646', publication_year: 1899, copies_available: 3 },
  { title: 'The Sun Also Rises', author: 'Ernest Hemingway', isbn: '978-0743297332', publication_year: 1926, copies_available: 3 },
  { title: 'A Farewell to Arms', author: 'Ernest Hemingway', isbn: '978-0684801469', publication_year: 1929, copies_available: 3 },
  { title: 'For Whom the Bell Tolls', author: 'Ernest Hemingway', isbn: '978-0684803357', publication_year: 1940, copies_available: 2 },
  { title: 'The Stranger', author: 'Albert Camus', isbn: '978-0679720201', publication_year: 1942, copies_available: 4 },
  { title: 'The Plague', author: 'Albert Camus', isbn: '978-0679720218', publication_year: 1947, copies_available: 3 },
  { title: 'Siddhartha', author: 'Hermann Hesse', isbn: '978-0553208849', publication_year: 1922, copies_available: 4 },
  { title: 'Steppenwolf', author: 'Hermann Hesse', isbn: '978-0312278670', publication_year: 1927, copies_available: 3 },
  { title: 'Invisible Man', author: 'Ralph Ellison', isbn: '978-0679732648', publication_year: 1952, copies_available: 3 },
  { title: 'Their Eyes Were Watching God', author: 'Zora Neale Hurston', isbn: '978-0061120060', publication_year: 1937, copies_available: 3 },
  { title: 'Beloved', author: 'Toni Morrison', isbn: '978-1400033416', publication_year: 1987, copies_available: 4 },
  { title: 'Song of Solomon', author: 'Toni Morrison', isbn: '978-1400033423', publication_year: 1977, copies_available: 3 },
  { title: 'The Color Purple', author: 'Alice Walker', isbn: '978-0156028356', publication_year: 1982, copies_available: 4 },
  { title: 'Native Son', author: 'Richard Wright', isbn: '978-0060931548', publication_year: 1940, copies_available: 3 },
  { title: 'Go Set a Watchman', author: 'Harper Lee', isbn: '978-0062409850', publication_year: 2015, copies_available: 4 },
  { title: 'The Bell Jar', author: 'Sylvia Plath', isbn: '978-0060837020', publication_year: 1963, copies_available: 4 },
  { title: 'Mrs Dalloway', author: 'Virginia Woolf', isbn: '978-0156628709', publication_year: 1925, copies_available: 3 },
  { title: 'To the Lighthouse', author: 'Virginia Woolf', isbn: '978-0156907392', publication_year: 1927, copies_available: 3 },
  { title: 'Orlando', author: 'Virginia Woolf', isbn: '978-0156701600', publication_year: 1928, copies_available: 2 },
  { title: 'Lolita', author: 'Vladimir Nabokov', isbn: '978-0679723165', publication_year: 1955, copies_available: 3 },
  { title: 'Ada, or Ardor', author: 'Vladimir Nabokov', isbn: '978-0679723417', publication_year: 1969, copies_available: 2 },
  { title: 'On the Road', author: 'Jack Kerouac', isbn: '978-0140042597', publication_year: 1957, copies_available: 3 },
  { title: 'The Electric Kool-Aid Acid Test', author: 'Tom Wolfe', isbn: '978-0312427597', publication_year: 1968, copies_available: 2 },
  { title: 'Breakfast of Champions', author: 'Kurt Vonnegut', isbn: '978-0385334204', publication_year: 1973, copies_available: 3 },
  { title: 'Cat\'s Cradle', author: 'Kurt Vonnegut', isbn: '978-0385333481', publication_year: 1963, copies_available: 3 },
  { title: 'The Handmaid\'s Tale', author: 'Margaret Atwood', isbn: '978-0385490818', publication_year: 1985, copies_available: 5 },
  { title: 'Alias Grace', author: 'Margaret Atwood', isbn: '978-0385490443', publication_year: 1996, copies_available: 3 },
  { title: 'Never Let Me Go', author: 'Kazuo Ishiguro', isbn: '978-1400078776', publication_year: 2005, copies_available: 4 },
  { title: 'The Remains of the Day', author: 'Kazuo Ishiguro', isbn: '978-0679731726', publication_year: 1989, copies_available: 3 },
  { title: 'Life of Pi', author: 'Yann Martel', isbn: '978-0156027328', publication_year: 2001, copies_available: 5 },
  { title: 'The Kite Runner', author: 'Khaled Hosseini', isbn: '978-1594631931', publication_year: 2003, copies_available: 5 },
  { title: 'A Thousand Splendid Suns', author: 'Khaled Hosseini', isbn: '978-1594489501', publication_year: 2007, copies_available: 4 },
  { title: 'Atonement', author: 'Ian McEwan', isbn: '978-0385721790', publication_year: 2001, copies_available: 3 },
  { title: 'Saturday', author: 'Ian McEwan', isbn: '978-0385662666', publication_year: 2005, copies_available: 3 },
  { title: 'White Teeth', author: 'Zadie Smith', isbn: '978-0375703867', publication_year: 2000, copies_available: 3 },
  { title: 'NW', author: 'Zadie Smith', isbn: '978-0143124368', publication_year: 2012, copies_available: 3 },
  { title: 'Midnight\'s Children', author: 'Salman Rushdie', isbn: '978-0812976533', publication_year: 1981, copies_available: 3 },
  { title: 'The Satanic Verses', author: 'Salman Rushdie', isbn: '978-0812976557', publication_year: 1988, copies_available: 2 },
  { title: 'The God of Small Things', author: 'Arundhati Roy', isbn: '978-0812979657', publication_year: 1997, copies_available: 4 },
  { title: 'Disgrace', author: 'J.M. Coetzee', isbn: '978-0143115281', publication_year: 1999, copies_available: 3 },
  { title: 'Waiting for the Barbarians', author: 'J.M. Coetzee', isbn: '978-0140061543', publication_year: 1980, copies_available: 2 },
  { title: 'Blindness', author: 'José Saramago', isbn: '978-0156007757', publication_year: 1995, copies_available: 3 },
  { title: 'The Name of the Rose', author: 'Umberto Eco', isbn: '978-0151446476', publication_year: 1980, copies_available: 3 },
  { title: 'If on a winter\'s night a traveler', author: 'Italo Calvino', isbn: '978-0156439619', publication_year: 1979, copies_available: 3 },
  { title: 'Invisible Cities', author: 'Italo Calvino', isbn: '978-0156453806', publication_year: 1972, copies_available: 3 },
  { title: 'The Master and Margarita', author: 'Mikhail Bulgakov', isbn: '978-0143108078', publication_year: 1967, copies_available: 3 },
  { title: 'Doctor Zhivago', author: 'Boris Pasternak', isbn: '978-0375706744', publication_year: 1957, copies_available: 2 },
  { title: 'The House of the Spirits', author: 'Isabel Allende', isbn: '978-1501117015', publication_year: 1982, copies_available: 3 },
  { title: 'Love in the Time of Cholera', author: 'Gabriel García Márquez', isbn: '978-0307389732', publication_year: 1985, copies_available: 4 },
  { title: 'Ficciones', author: 'Jorge Luis Borges', isbn: '978-0802130303', publication_year: 1944, copies_available: 3 },
  { title: 'The Tin Drum', author: 'Günter Grass', isbn: '978-0156907644', publication_year: 1959, copies_available: 2 },
];

// ─── Seed Function ───────────────────────────────────────────────────────────

const seed = async () => {
  try {
    console.log('🌱 Starting seed...');

    await sequelize.authenticate();

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('✅ Tables created.');

    // Seed members
    const members = await Member.bulkCreate(memberData, { returning: true });
    console.log(`✅ Inserted ${members.length} members.`);

    // Seed books
    const books = await Book.bulkCreate(bookData, { returning: true });
    console.log(`✅ Inserted ${books.length} books.`);

    // Generate 200 issuances with mixed statuses
    const today = new Date();
    const issuanceData = [];

    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const addDays = (date, days) => {
      const d = new Date(date);
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    for (let i = 0; i < 200; i++) {
      const member = members[randomInt(0, members.length - 1)];
      const book = books[randomInt(0, books.length - 1)];
      const issuedDaysAgo = randomInt(5, 90);
      const issuedDate = addDays(today, -issuedDaysAgo);
      const targetReturnDate = addDays(issuedDate, 14);

      let actualReturnDate = null;

      // 60% returned, 25% active, 15% overdue
      const roll = Math.random();
      if (roll < 0.6) {
        actualReturnDate = addDays(issuedDate, randomInt(3, 13));
      } else if (roll < 0.75) {
        actualReturnDate = null; // active, not yet due
      }
      // else overdue (null actual return, past target)

      issuanceData.push({
        member_id: member.id,
        book_id: book.id,
        issued_date: issuedDate,
        target_return_date: targetReturnDate,
        actual_return_date: actualReturnDate,
      });
    }

    // Add edge case: a book issued today due tomorrow (for dashboard testing)
    issuanceData.push({
      member_id: members[0].id,
      book_id: books[0].id,
      issued_date: today.toISOString().split('T')[0],
      target_return_date: addDays(today, 1),
      actual_return_date: null,
    });

    await Issuance.bulkCreate(issuanceData);
    console.log(`✅ Inserted ${issuanceData.length} issuances.`);

    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
