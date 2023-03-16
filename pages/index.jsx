import React, { useEffect } from 'react'
import Head from 'next/head'

const Home = () => {
  useEffect(() => {
    window.location.assign('/dashboard')
  }, [])

  return (
    <>
      <Head><title>Pesa24 - Home</title></Head>
      Home
    </>
  )
}

export default Home