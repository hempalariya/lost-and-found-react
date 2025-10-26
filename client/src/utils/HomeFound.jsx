import React from 'react'
import ItemCard from './ItemCard';
import Container from './Container';

const fakeFoundData = [
  {
    itemName: "Water Bottle",
    itemDescription:
      "A milton steel bottle of capecity about a liter",
    location: "ground, campus",
    img: "",
  },
  {
    itemName: "Sunglasses",
    itemDescription: "asdfk asdf asdkfjgps gksgkdj",
    location: "Mallital, Bhimtal",
    img: "",
  },
  {
    itemName: "earbud case",
    itemDescription:
      "A black bag, in good condition, bottle pocket on both side",
    location: "Mallital, Bhimtal",
  },
];


export default function HomeFound() {
  return (
    <Container>
        {fakeFoundData.map((item) => (
          <ItemCard item={item} />
        ))}
    </Container>
  )
}
