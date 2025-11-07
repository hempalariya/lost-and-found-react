import React from 'react'
import ItemCard from './ItemCard'
import Container from './Container'


export default function HomeLost({data}) {
  return (
    <Container>
      {data.length === 0 && <h1>No Lost Data is listed</h1>}
        {data.map((item) => (
          <ItemCard item={item}  key = {item._id}/>
        ))}
    </Container>
  )
}
