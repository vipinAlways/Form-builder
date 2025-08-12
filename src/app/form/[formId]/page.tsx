
import React from 'react'


import Form from '@/components/Form'
 interface Props {
    params:Promise<{formId:string}>
 }
const page = async({params}:Props) => {
    const {formId}  = await params
    
  return (
    <div>
        <Form id={formId}/>
    </div>
  )
}

export default page