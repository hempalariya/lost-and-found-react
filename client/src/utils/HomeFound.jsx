import React from 'react'
import ItemCard from './ItemCard';
import Container from './Container';




export default function HomeFound({data}) {
  return (
    <Container>
      {data.length === 0 && <h1>No Found Data is listed</h1>}
        {data.map((item) => (
          <ItemCard item={item} key = {item._id}/>
        ))}
    </Container>
  )
}
