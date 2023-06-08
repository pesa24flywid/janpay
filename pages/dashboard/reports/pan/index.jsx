import React from 'react'
import { toBlob } from 'html-to-image'

const Index = () => {
  const handleShare = async () => {
    const myFile = await toBlob(pdfRef.current, {quality: 0.95})
    const data = {
      files: [
        new File([myFile], 'receipt.jpeg', {
          type: myFile.type
        })
      ],
      title: 'Receipt',
      text: 'Receipt'
    }
    try {
      await navigator.share(data)
    } catch (error) {
      console.error('Error sharing:', error?.toString());
      Toast({
        status: 'warning',
        description: error?.toString()
      })
    }
  };
  return (
    <>
      
    </>
  )
}

export default Index