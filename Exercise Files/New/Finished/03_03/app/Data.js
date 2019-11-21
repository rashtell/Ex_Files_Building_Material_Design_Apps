import faker from 'faker';

const images = [
  require('./images/img1.jpg'),
  require('./images/img2.jpg'),
  require('./images/img3.jpg'),
  require('./images/img4.jpg'),
  require('./images/img5.jpg'),
  require('./images/img6.jpg'),
  require('./images/img7.jpg'),
  require('./images/img8.jpg'),
  require('./images/img9.jpg'),
  require('./images/img10.jpg'),
  require('./images/img11.jpg'),
  require('./images/img12.jpg'),
]

const avatars = [
  require('./images/avatar1.jpg'),
  require('./images/avatar2.jpg'),
  require('./images/avatar3.jpg'),
  require('./images/avatar4.jpg'),
  require('./images/avatar5.jpg'),
];

const formatDate = (date: Date) => `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;

const fakeTitle = 'Rusted Steel Bike';
const fakeDescription = `The most fundamental component for building a UI, View is a container that supports layout with flexbox, style, some touch handling, and accessibility controls. View maps directly to the native view equivalent on whatever platform React Native is running on, whether that is a UIView, <div>, android.view, etc.`
const authorNames = ['Myesha Bowley',
  'Philip Patillo',
  'Johna Geter',
  'Taina Penn',
  'Shara Wease',
]
const authorComments = [
  `This example creates a View in a row with padding.`,
  `For View responder props (e.g., onResponderMove)`,
  `Overrides the text that's read by the screen`,
  `This defines how far. `,
];
const authorTime = [
  '2017-03-05',
  '2017-04-08',
  '2017-06-03',
  '2017-03-05',
  '2017-04-08',
  '2017-06-03',
];

const comments = Array(20).fill(0).map((_, index) => (
    {
      author: authorNames[index % authorNames.length], //faker.name.findName(),
      avatar: avatars[index % avatars.length], //avatars[faker.random.number(4)],
      comment: authorComments[index % authorComments.length], //faker.lorem.sentence(),
      time: authorTime[index % authorTime.length]//formatDate(faker.date.recent()),
    }
  ));

const oneProduct = () => ({
  url: faker.image.animals(500, 500, true),
  image: images[0], //images[faker.random.number(images.length - 1)],
  title: fakeTitle, //faker.commerce.productName(),
  description: fakeDescription, // faker.lorem.paragraph(),
  likes: faker.random.number(100),
  views: faker.random.number(200),
  price: 259, //faker.random.number(100, 500),
  comments,
});

const getProducts = (count = 50) => Array(count).fill(0).map((_, idx) => ({
  url: faker.image.animals(500, 500, true),
  image: images[idx % images.length],
  title: faker.commerce.productName(),
  description: faker.lorem.paragraph(),
  likes: faker.random.number(100),
  views: faker.random.number(200),
  price: (idx * 5) % 200,
  comments,
}));

export default {
  oneProduct,
  getProducts,
}