import React from 'react'
import ItemCard from './ItemCard'
import Container from './Container'

const fakeLostData = [{
        itemName: 'Adidas Bag',
        itemDescription: 'A black bag, in good condition, bottle pocket on both side',
        location: 'Mallital, Bhimtal',
        img: ''
},
{
        itemName: 'Keys',
        itemDescription: 'two keys, with keychian with batman log',
        location: 'Mallital, Bhimtal',
        img:''
},
{
        itemName: 'Adidas Bag',
        itemDescription: 'A black bag, in good condition, bottle pocket on both side',
        location: 'Mallital, Bhimtal',
}
]
export default function HomeLost() {
  return (
    <Container>
        {fakeLostData.map((item) => (
          <ItemCard item={item} />
        ))}
    </Container>
  )
}
